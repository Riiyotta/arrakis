#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Semantic validator for Arrakis design-repo PageSpecs.

Enforces everything JSON Schema structurally cannot express. Every check below
implements a rule declared in compatibility/graph.json, and the two MUST agree:
each check names its rule id, and extraction/verify_all.py asserts that the set
of rule ids in the graph and the set implemented here are identical, so they
cannot silently diverge (MASTER-GUIDE 3.8).

The headline check is check_template_node_sequence: a PageSpec's nodes[] are
validated AGAINST THE NODE LIST OF THE TEMPLATE IT DECLARES, not in isolation.

Path portability: the repo root is derived from this file's own location. There
is no absolute path anywhere in this repo.

Usage:
    python3 semantic_validate.py <pagespec.json> [<pagespec.json> ...]
    python3 semantic_validate.py            # defaults to example.pagespec.json

Exit code 0 if no error-severity findings, 1 otherwise. warn-severity findings
are printed and do not affect the exit code.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)


def load(*parts):
    with open(os.path.join(REPO, *parts), encoding="utf-8") as fh:
        return json.load(fh)


def load_sections():
    d = os.path.join(REPO, "sections")
    out = {}
    for name in sorted(os.listdir(d)):
        if not name.endswith(".json"):
            continue
        with open(os.path.join(d, name), encoding="utf-8") as fh:
            c = json.load(fh)
        out[c["id"]] = c
    return out


TEMPLATES = load("templates", "templates.json")
GRAPH = load("compatibility", "graph.json")
ASSET_ROLES = load("assets", "asset-roles.json")
SECTIONS = load_sections()

RULES = {r["id"]: r for r in GRAPH["rules"]}


def sev(rule_id):
    return RULES[rule_id]["severity"]


# Derived, single-sourced from the graph so prose and code cannot drift.
NO_HERO_TEMPLATES = set(RULES["ONE_HERO_PER_PAGE"]["noHeroTemplates"])
HERO_SECTIONS = set(RULES["ONE_HERO_PER_PAGE"]["heroSections"])
ADJ_EXEMPT = set(RULES["NO_ADJACENT_SAME_CATEGORY"]["exemptTemplates"])
SCROLL_STAGE = set(RULES["NO_CONSECUTIVE_SCROLL_STAGES"]["scrollStagePatterns"])
AUTOPLAY = set(RULES["MOTION_BUDGET_AUTOPLAY"]["autoplayPatterns"])
AUTOPLAY_BUDGET = 3
FORBIDDEN_SECTIONS = set(RULES["DELIBERATELY_UNBUILT_NOT_RECREATED"]["forbiddenSectionIds"])
FORBIDDEN_ROUTES = set(RULES["DELIBERATELY_UNBUILT_NOT_RECREATED"]["forbiddenRoutes"])
PROVENANCE_BANNED_POLICIES = {
    "must-not-fabricate-real-brand",
    "must-not-fabricate-compliance-claim",
    "must-reuse-exact",
}


class Findings(object):
    def __init__(self):
        self.items = []

    def add(self, rule_id, where, msg):
        self.items.append((sev(rule_id), rule_id, where, msg))

    @property
    def errors(self):
        return [i for i in self.items if i[0] == "error"]

    @property
    def warns(self):
        return [i for i in self.items if i[0] == "warn"]


def body_nodes(nodes):
    return [n for n in nodes if not n["section"].startswith("chrome.")]


def words(text):
    return len([w for w in re.split(r"\s+", str(text).strip()) if w])


# ──────────────────────────── checks ────────────────────────────

def check_template_node_sequence(spec, f):
    """TEMPLATE_NODE_SEQUENCE_MATCH — the headline cross-reference.

    nodes[] is checked against the node list of the template named in the
    spec's OWN `template` field, never in isolation.
    """
    rid = "TEMPLATE_NODE_SEQUENCE_MATCH"
    tid = spec.get("template")
    tpl = TEMPLATES["templates"].get(tid)
    if tpl is None:
        f.add(rid, "template", "unknown template %r" % tid)
        return
    declared = tpl["nodes"]
    declared_ids = [n["section"] for n in declared]
    by_id = {n["section"]: n for n in declared}
    spec_ids = [n["section"] for n in spec.get("nodes", [])]

    # 1. no node the template does not declare
    for i, sid in enumerate(spec_ids):
        if sid not in by_id:
            f.add(rid, "nodes[%d]" % i,
                  "section %r is not declared by template %r (declared: %s)"
                  % (sid, tid, ", ".join(declared_ids)))

    # 2. every required node present
    for n in declared:
        if n.get("required") and n["section"] not in spec_ids:
            f.add(rid, "nodes", "template %r requires %r but it is absent"
                  % (tid, n["section"]))

    # 3. non-repeatable nodes at most once
    for sid in set(spec_ids):
        if sid in by_id and not by_id[sid].get("repeatable") and spec_ids.count(sid) > 1:
            f.add(rid, "nodes", "section %r is repeatable:false in template %r but appears %d times"
                  % (sid, tid, spec_ids.count(sid)))

    # 4. order must be a subsequence of the declared order
    pos = -1
    for i, sid in enumerate(spec_ids):
        if sid not in by_id:
            continue
        nxt = declared_ids.index(sid, pos + 1) if sid in declared_ids[pos + 1:] else -1
        if nxt == -1:
            f.add(rid, "nodes[%d]" % i,
                  "section %r is out of template order for %r (expected order: %s)"
                  % (sid, tid, " > ".join(declared_ids)))
            return
        pos = nxt

    # 5. the declared variant must be one the template names, when it names one
    for i, n in enumerate(spec.get("nodes", [])):
        d = by_id.get(n["section"])
        if d and "variant" in d and n.get("variant") != d["variant"]:
            f.add(rid, "nodes[%d]" % i,
                  "template %r pins %r to variant %r, got %r"
                  % (tid, n["section"], d["variant"], n.get("variant")))

    # 6. the route must be one the template owns
    if spec.get("route") not in tpl["routes"]:
        f.add(rid, "route", "route %r is not owned by template %r (owns: %s)"
              % (spec.get("route"), tid, ", ".join(tpl["routes"])))


def check_one_hero(spec, f):
    rid = "ONE_HERO_PER_PAGE"
    heroes = [n["section"] for n in spec.get("nodes", []) if n["section"] in HERO_SECTIONS]
    if len(heroes) > 1:
        f.add(rid, "nodes", "%d hero sections on one page: %s" % (len(heroes), heroes))
    # Deliberately asymmetric: the rule caps heroes at one, it never REQUIRES one.
    # Four real templates are legitimately hero-less; NO_HERO_TEMPLATES is read
    # straight out of the graph so prose and code cannot diverge.
    if not heroes and spec.get("template") not in NO_HERO_TEMPLATES:
        f.add(rid, "nodes", "template %r has no hero and is not a declared hero-less template %s"
              % (spec.get("template"), sorted(NO_HERO_TEMPLATES)))


def check_chrome_position(spec, f):
    rid = "CHROME_POSITION"
    ids = [n["section"] for n in spec.get("nodes", [])]
    if not ids:
        return
    if ids[0] != "chrome.header":
        f.add(rid, "nodes[0]", "first node must be chrome.header, got %r" % ids[0])
    if ids[-2:] != ["chrome.footer", "chrome.cookie-notice"]:
        f.add(rid, "nodes[-2:]",
              "last two nodes must be chrome.footer then chrome.cookie-notice, got %s" % ids[-2:])


def check_position_flags(spec, f):
    rid = "BODY_POSITION_FLAGS"
    body = body_nodes(spec.get("nodes", []))
    for i, n in enumerate(body):
        c = SECTIONS.get(n["section"], {}).get("constraints", {})
        if c.get("mustBeFirst") and i != 0:
            f.add(rid, "nodes", "%r declares mustBeFirst but is body index %d" % (n["section"], i))
        if c.get("mustBeLast") and i != len(body) - 1:
            f.add(rid, "nodes", "%r declares mustBeLast but is body index %d of %d"
                  % (n["section"], i, len(body) - 1))
        if c.get("mustPrecedeFooter") and i != len(body) - 1:
            f.add(rid, "nodes", "%r declares mustPrecedeFooter but is body index %d of %d"
                  % (n["section"], i, len(body) - 1))


def check_per_page_caps(spec, f):
    """ONE_PER_PAGE_BY_SECTION_AND_VARIANT — keyed on (section, variant)."""
    rid = "ONE_PER_PAGE_BY_SECTION_AND_VARIANT"
    counts = {}
    for n in spec.get("nodes", []):
        key = (n["section"], n.get("variant"))
        counts[key] = counts.get(key, 0) + 1
    for (sid, variant), k in sorted(counts.items(), key=lambda x: (x[0][0], str(x[0][1]))):
        c = SECTIONS.get(sid, {}).get("constraints", {})
        cap = 1 if c.get("onePerPage") else c.get("maxPerPage")
        if cap is not None and k > cap:
            f.add(rid, "nodes", "(section=%r, variant=%r) appears %d times, cap is %d"
                  % (sid, variant, k, cap))


def check_route_restrictions(spec, f):
    route = spec.get("route")
    for i, n in enumerate(spec.get("nodes", [])):
        c = SECTIONS.get(n["section"], {}).get("constraints", {})
        allow = c.get("routeAllowlist")
        if allow and route not in allow:
            rid = ("INDUSTRY_OPTIONAL_SLOTS_SHIPPING_ONLY"
                   if n["section"] in ("industry.text-card-asset", "industry.feature-detail")
                   else "ROUTE_ALLOWLIST")
            f.add(rid, "nodes[%d]" % i,
                  "%r is restricted to %s but the spec route is %r"
                  % (n["section"], allow, route))
        if c.get("homeRouteOnly") and route != "/":
            f.add("ROUTE_ALLOWLIST", "nodes[%d]" % i,
                  "%r is homeRouteOnly but the spec route is %r" % (n["section"], route))


def check_variant_routes(spec, f):
    """VARIANT_ROUTE_ALLOWLIST — keyed on (section, variant), not the bare id."""
    rid = "VARIANT_ROUTE_ALLOWLIST"
    route = spec.get("route")
    for i, n in enumerate(spec.get("nodes", [])):
        c = SECTIONS.get(n["section"], {}).get("constraints", {})
        m = c.get("variantRouteAllowlist")
        if not m or "variant" not in n:
            continue
        allow = m.get(n["variant"])
        if allow is None:
            f.add(rid, "nodes[%d]" % i,
                  "%r declares no route allowlist for variant %r" % (n["section"], n["variant"]))
        elif route not in allow:
            f.add(rid, "nodes[%d]" % i,
                  "%r variant %r is pinned to %s but the spec route is %r"
                  % (n["section"], n["variant"], allow, route))


def check_adjacent_category(spec, f):
    rid = "NO_ADJACENT_SAME_CATEGORY"
    if spec.get("template") in ADJ_EXEMPT:
        return
    body = body_nodes(spec.get("nodes", []))
    for i in range(len(body) - 1):
        a = SECTIONS.get(body[i]["section"], {}).get("category")
        b = SECTIONS.get(body[i + 1]["section"], {}).get("category")
        if a and a == b:
            f.add(rid, "nodes", "adjacent %r sections: %r then %r"
                  % (a, body[i]["section"], body[i + 1]["section"]))


def check_scroll_stages(spec, f):
    rid = "NO_CONSECUTIVE_SCROLL_STAGES"
    body = body_nodes(spec.get("nodes", []))
    for i in range(len(body) - 1):
        a = body[i].get("motion", {}).get("pattern")
        b = body[i + 1].get("motion", {}).get("pattern")
        if a in SCROLL_STAGE and b in SCROLL_STAGE:
            f.add(rid, "nodes", "consecutive scroll stages: %r then %r"
                  % (body[i]["section"], body[i + 1]["section"]))


def check_motion_budget(spec, f):
    rid = "MOTION_BUDGET_AUTOPLAY"
    n = sum(1 for x in body_nodes(spec.get("nodes", []))
            if x.get("motion", {}).get("pattern") in AUTOPLAY)
    if n > AUTOPLAY_BUDGET:
        f.add(rid, "nodes", "%d autoplaying sections, budget is %d" % (n, AUTOPLAY_BUDGET))


def check_reduced_motion(spec, f):
    rid = "REDUCED_MOTION_FALLBACK_REQUIRED"
    for i, n in enumerate(spec.get("nodes", [])):
        m = n.get("motion") or {}
        fb = m.get("reducedMotionFallback")
        if not fb:
            f.add(rid, "nodes[%d]" % i, "%r has no reducedMotionFallback" % n["section"])
            continue
        want = SECTIONS.get(n["section"], {}).get("motion", {}).get("reducedMotionFallback")
        if want is not None and fb != want:
            f.add(rid, "nodes[%d]" % i,
                  "%r declares reducedMotionFallback %r; its contract allows only %r"
                  % (n["section"], fb, want))
        want_p = SECTIONS.get(n["section"], {}).get("motion", {}).get("pattern")
        if want_p is not None and m.get("pattern") != want_p:
            f.add(rid, "nodes[%d]" % i,
                  "%r declares motion pattern %r; its contract allows only %r"
                  % (n["section"], m.get("pattern"), want_p))


def check_anchors(spec, f):
    rid = "ANCHOR_ID_UNIQUE"
    seen = {}
    for i, n in enumerate(spec.get("nodes", [])):
        a = n.get("anchorId")
        if not a:
            continue
        if a in seen:
            f.add(rid, "nodes[%d]" % i, "duplicate anchorId %r (also on nodes[%d])" % (a, seen[a]))
        seen[a] = i


def _walk_media(obj, path, out):
    if isinstance(obj, dict):
        if "assetRole" in obj and "provenance" in obj:
            out.append((path, obj))
        for k, v in obj.items():
            _walk_media(v, "%s.%s" % (path, k), out)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            _walk_media(v, "%s[%d]" % (path, i), out)


def check_asset_provenance(spec, f):
    """ASSET_PROVENANCE_POLICY + ASSET_ROLE_CLOSED."""
    roles = ASSET_ROLES["roles"]
    enum = set(ASSET_ROLES["roleEnum"])
    found = []
    _walk_media(spec.get("nodes", []), "nodes", found)
    for path, m in found:
        role = m.get("assetRole")
        if role not in enum:
            f.add("ASSET_ROLE_CLOSED", path, "assetRole %r is not in assets/asset-roles.json#roleEnum" % role)
            continue
        policy = roles[role]["generationPolicy"]
        if m.get("provenance") == "generated" and policy in PROVENANCE_BANNED_POLICIES:
            f.add("ASSET_PROVENANCE_POLICY", path,
                  "assetRole %r has generationPolicy %r; provenance 'generated' is forbidden"
                  % (role, policy))


def check_legal_gate(spec, f):
    rid = "LEGAL_TEXT_GATE"
    for i, n in enumerate(spec.get("nodes", [])):
        if n["section"] != "legal.prose-blocks":
            continue
        if n.get("content", {}).get("requiresOperatorSuppliedText") is not True:
            f.add(rid, "nodes[%d]" % i,
                  "legal.prose-blocks must set content.requiresOperatorSuppliedText: true")


def check_forbidden(spec, f):
    rid = "DELIBERATELY_UNBUILT_NOT_RECREATED"
    if spec.get("route") in FORBIDDEN_ROUTES:
        f.add(rid, "route", "route %r is deliberately absent from the real site (it 404s on the "
                            "original) and must not be specified" % spec.get("route"))
    for i, n in enumerate(spec.get("nodes", [])):
        if n["section"] in FORBIDDEN_SECTIONS:
            f.add(rid, "nodes[%d]" % i,
                  "%r is a deliberately unbuilt CMS section (hideSection:true on the original) "
                  "and must not be recreated" % n["section"])


def _check_words(contract, value, path, f):
    """Recursive maxWords enforcement against a section contract fragment."""
    rid = "MAX_WORDS"
    if not isinstance(contract, dict):
        return
    if "maxWords" in contract and isinstance(value, str):
        n = words(value)
        if n > contract["maxWords"]:
            f.add(rid, path, "%d words exceeds maxWords %d" % (n, contract["maxWords"]))
        return
    props = contract.get("properties")
    if isinstance(props, dict) and isinstance(value, dict):
        for k, sub in props.items():
            if k in value:
                _check_words(sub, value[k], "%s.%s" % (path, k), f)
    items = contract.get("items")
    if items is not None and isinstance(value, list):
        for i, v in enumerate(value):
            _check_words(items, v, "%s[%d]" % (path, i), f)


def check_max_words(spec, f):
    for i, n in enumerate(spec.get("nodes", [])):
        c = SECTIONS.get(n["section"])
        if not c:
            continue
        _check_words(c["content"], n.get("content", {}), "nodes[%d](%s).content" % (i, n["section"]), f)


CHECKS = [
    ("TEMPLATE_NODE_SEQUENCE_MATCH", check_template_node_sequence),
    ("ONE_HERO_PER_PAGE", check_one_hero),
    ("CHROME_POSITION", check_chrome_position),
    ("BODY_POSITION_FLAGS", check_position_flags),
    ("ONE_PER_PAGE_BY_SECTION_AND_VARIANT", check_per_page_caps),
    ("ROUTE_ALLOWLIST", check_route_restrictions),
    ("INDUSTRY_OPTIONAL_SLOTS_SHIPPING_ONLY", check_route_restrictions),
    ("VARIANT_ROUTE_ALLOWLIST", check_variant_routes),
    ("NO_ADJACENT_SAME_CATEGORY", check_adjacent_category),
    ("NO_CONSECUTIVE_SCROLL_STAGES", check_scroll_stages),
    ("MOTION_BUDGET_AUTOPLAY", check_motion_budget),
    ("REDUCED_MOTION_FALLBACK_REQUIRED", check_reduced_motion),
    ("MOTION_FIELDS_CLOSED", None),          # enforced by pagespec.schema.json
    ("ANCHOR_ID_UNIQUE", check_anchors),
    ("ASSET_PROVENANCE_POLICY", check_asset_provenance),
    ("ASSET_ROLE_CLOSED", check_asset_provenance),
    ("LEGAL_TEXT_GATE", check_legal_gate),
    ("MAX_WORDS", check_max_words),
    ("DELIBERATELY_UNBUILT_NOT_RECREATED", check_forbidden),
]

IMPLEMENTED_RULE_IDS = sorted(set(rid for rid, _ in CHECKS))
SCHEMA_ENFORCED_RULE_IDS = sorted(rid for rid, fn in CHECKS if fn is None)


def validate(spec):
    f = Findings()
    ran = set()
    for rid, fn in CHECKS:
        if fn is None or fn in ran:
            continue
        ran.add(fn)
        fn(spec, f)
    return f


def main(argv):
    paths = argv[1:] or [os.path.join(HERE, "example.pagespec.json")]
    total_err = 0
    for p in paths:
        with open(p, encoding="utf-8") as fh:
            spec = json.load(fh)
        f = validate(spec)
        rel = os.path.relpath(p, REPO) if p.startswith(REPO) else p
        print("%s  route=%s template=%s  nodes=%d"
              % (rel, spec.get("route"), spec.get("template"), len(spec.get("nodes", []))))
        for s, rid, where, msg in f.items:
            print("  [%s] %s  %s: %s" % (s.upper(), rid, where, msg))
        print("  -> %d error, %d warn" % (len(f.errors), len(f.warns)))
        total_err += len(f.errors)
    print("TOTAL ERRORS: %d" % total_err)
    return 1 if total_err else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
