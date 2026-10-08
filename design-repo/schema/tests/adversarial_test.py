#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Adversarial suite: every rule must actually REJECT a bad instance, and every
real template must still be ACCEPTED.

Two halves, both mandatory:

  CONTROLS   - the bundled example, plus one GENERICALLY SYNTHESISED minimal
               PageSpec per template, built by iterating templates.values() and
               reading each template's own node list. Because the controls are
               synthesised rather than hand-written, adding or splitting a
               template needs ZERO new control code -- the loop auto-covers it
               (MASTER-GUIDE 3.22's reusable technique).
  MUTATIONS  - one per rule, each a deliberate corruption that must fail.

Exit 0 only if every control passes AND every mutation is rejected. A validator
that rejects everything is as broken as one that rejects nothing, so both
directions are asserted.
"""
import copy
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SCHEMA_DIR = os.path.dirname(HERE)
REPO = os.path.dirname(SCHEMA_DIR)
sys.path.insert(0, SCHEMA_DIR)

import semantic_validate as SV   # noqa: E402

try:
    from jsonschema import Draft7Validator
    HAVE_JS = True
except ImportError:
    HAVE_JS = False

SCHEMA = json.load(open(os.path.join(SCHEMA_DIR, "pagespec.schema.json"), encoding="utf-8"))
EXAMPLE = json.load(open(os.path.join(SCHEMA_DIR, "example.pagespec.json"), encoding="utf-8"))
TEMPLATES = SV.TEMPLATES
SECTIONS = SV.SECTIONS

passed = []
failed = []


def schema_errors(spec):
    if not HAVE_JS:
        return []
    return list(Draft7Validator(SCHEMA).iter_errors(spec))


def findings(spec):
    return SV.validate(spec)


def minimal_content(contract, route):
    """Build the smallest content object that satisfies a contract's `required`."""
    def build(c):
        t = c.get("type")
        if "const" in c:
            return c["const"]
        if "enum" in c:
            return c["enum"][0]
        if t == "object" or "properties" in c:
            out = {}
            for k in c.get("required", []):
                sub = c.get("properties", {}).get(k, {"type": "string"})
                out[k] = build(sub)
            return out
        if t == "array":
            n = c.get("minItems", 1)
            return [build(c.get("items", {"type": "string"})) for _ in range(n)]
        if "pattern" in c:
            # honour a real regex constraint (e.g. the 02-digit index fields)
            import re as _re
            for cand in ("01", "text", "a"):
                if _re.match(c["pattern"], cand):
                    return cand
            return "01"
        if t == "integer":
            return 1
        if t == "number":
            return 1
        if t == "boolean":
            return True
        if "maxWords" in c:
            return " ".join(["word"] * min(2, c["maxWords"]))
        return "text"
    out = build(contract["content"])
    # the one field that is a hard gate rather than mere structure
    if contract["id"] == "legal.prose-blocks":
        out["requiresOperatorSuppliedText"] = True
    return out


def synthesise(tid, tpl):
    """Generic per-template control. No per-template code."""
    route = tpl["routes"][0]
    nodes = []
    for nd in tpl["nodes"]:
        if not nd.get("required"):
            continue
        c = SECTIONS[nd["section"]]
        node = {
            "section": nd["section"],
            "motion": {"pattern": c["motion"]["pattern"],
                       "reducedMotionFallback": c["motion"]["reducedMotionFallback"]},
            "content": minimal_content(c, route),
        }
        if "variant" in nd:
            node["variant"] = nd["variant"]
        elif c.get("variants"):
            # honour variantRouteAllowlist so the control is a REAL composition
            vra = c["constraints"].get("variantRouteAllowlist") or {}
            ok = [v for v, rs in sorted(vra.items()) if route in rs]
            node["variant"] = ok[0] if ok else sorted(c["variants"])[0]
        if c.get("anchorId"):
            node["anchorId"] = c["anchorId"]
        nodes.append(node)
    return {"pageSpecVersion": "1.0.0", "route": route, "template": tid,
            "theme": "dark-surface" if tpl["surface"].startswith("dark") else "light-surface",
            "nodes": nodes}


def control(name, spec):
    se = schema_errors(spec)
    f = findings(spec)
    if se or f.errors:
        failed.append(("CONTROL", name,
                       "expected 0 errors, got %d schema + %d semantic: %s"
                       % (len(se), len(f.errors),
                          [e.message[:90] for e in se[:2]] + [x[3][:90] for x in f.errors[:3]])))
    else:
        passed.append(("CONTROL", name, "0 schema errors, 0 semantic errors, %d warn" % len(f.warns)))


def mutation(rule_id, name, spec, expect_layer="any"):
    """A mutation passes the test only if it is REJECTED."""
    se = schema_errors(spec)
    f = findings(spec)
    rejected_by = []
    if se:
        rejected_by.append("schema(%d)" % len(se))
    if f.errors:
        rejected_by.append("semantic:" + ",".join(sorted(set(x[1] for x in f.errors))))
    if not rejected_by:
        failed.append(("MUTATION", "%s / %s" % (rule_id, name), "NOT REJECTED - rule is not enforced"))
        return
    if expect_layer == "semantic" and not f.errors:
        failed.append(("MUTATION", "%s / %s" % (rule_id, name),
                       "rejected only by the schema layer; the semantic rule did not fire"))
        return
    if expect_layer == "semantic" and rule_id not in set(x[1] for x in f.errors):
        failed.append(("MUTATION", "%s / %s" % (rule_id, name),
                       "rejected, but by %s rather than %s" % (rejected_by, rule_id)))
        return
    passed.append(("MUTATION", "%s / %s" % (rule_id, name), "rejected by " + " + ".join(rejected_by)))


def warn_case(rule_id, name, spec):
    """A warn-severity rule must produce a WARNING, not an error."""
    f = findings(spec)
    warns = set(x[1] for x in f.warns)
    if rule_id in warns and not any(x[1] == rule_id for x in f.errors):
        passed.append(("WARN-CASE", "%s / %s" % (rule_id, name),
                       "warned (severity respected, exit code unaffected)"))
    else:
        failed.append(("WARN-CASE", "%s / %s" % (rule_id, name),
                       "expected a WARN from %s; got warns=%s errors=%s"
                       % (rule_id, sorted(warns), sorted(set(x[1] for x in f.errors)))))


def M(**kw):
    s = copy.deepcopy(EXAMPLE)
    for k, v in kw.items():
        s[k] = v
    return s


def idx(spec, section):
    for i, n in enumerate(spec["nodes"]):
        if n["section"] == section:
            return i
    raise AssertionError(section)


# ════════════════════════════ CONTROLS ════════════════════════════
control("bundled example (/shipping, industry-page, 9 nodes)", EXAMPLE)
for tid, tpl in sorted(TEMPLATES["templates"].items()):
    control("synthesised minimal control: template %r (route %s)" % (tid, tpl["routes"][0]),
            synthesise(tid, tpl))

# the five NON-shipping industry routes must pass WITHOUT the two optional nodes
for route in ["/aerospace-and-defense", "/chemicals", "/energy-commodities",
              "/engineering-construction", "/telecommunications"]:
    s = copy.deepcopy(EXAMPLE)
    s["route"] = route
    s["nodes"] = [n for n in s["nodes"]
                  if n["section"] not in ("industry.text-card-asset", "industry.feature-detail")]
    h = idx(s, "industry.nav-masthead")
    s["nodes"][h]["variant"] = "hero-static"
    s["nodes"][h]["content"]["hero"] = {
        "assetRole": "illustration.industry-masthead",
        "alt": "Industry Masthead", "provenance": "source-original",
        "intrinsicWidth": 517, "intrinsicHeight": 345}
    i = idx(s, "industry.icon-slider")
    if route == "/chemicals":
        s["nodes"][i]["variant"] = "bg-dust-to-white"
        s["nodes"][i]["content"]["background"] = "dustToWhite"
    else:
        s["nodes"][i]["variant"] = "bg-white"
    control("real 4-section industry composition on %s" % route, s)

# and /shipping's real 6-section composition must pass (the other direction of
# INDUSTRY_OPTIONAL_SLOTS_SHIPPING_ONLY)
control("real 6-section industry composition on /shipping (both-directions check)", EXAMPLE)

# ════════════════════════════ MUTATIONS ════════════════════════════

# ── schema layer ──
mutation("SCHEMA_TEMPLATE_ENUM", "invented template name", M(template="industry-page-shipping"))
mutation("SCHEMA_ROUTE_ENUM", "invented route", M(route="/industries"))
mutation("SCHEMA_THEME_ENUM", "invented theme", M(theme="midnight-surface"))

s = copy.deepcopy(EXAMPLE)
del s["theme"]
mutation("SCHEMA_REQUIRED", "missing required top-level field (theme)", s)

s = copy.deepcopy(EXAMPLE)
s["nodes"][1]["section"] = "industry.hero"          # type alias that does not exist
mutation("SCHEMA_SECTION_ENUM", "invented section id / type alias", s)

s = copy.deepcopy(EXAMPLE)
s["inventedTopLevelField"] = True
mutation("SCHEMA_ADDITIONAL_PROPS", "invented top-level property", s)

s = copy.deepcopy(EXAMPLE)
s["nodes"][1]["inventedNodeField"] = True
mutation("SCHEMA_NODE_CLOSED", "invented node property", s)

s = copy.deepcopy(EXAMPLE)
del s["nodes"][1]["motion"]["reducedMotionFallback"]
mutation("SCHEMA_MOTION_REQUIRED", "missing reducedMotionFallback", s)

s = copy.deepcopy(EXAMPLE)
s["nodes"][1]["motion"]["inventedAnimation"] = "parallax-zoom"
mutation("MOTION_FIELDS_CLOSED", "smuggle an invented motion field", s)

s = copy.deepcopy(EXAMPLE)
i = idx(s, "industry.icon-slider")
s["nodes"][i]["content"]["inventedContentField"] = "x"
mutation("SCHEMA_CONTENT_CLOSED", "invented content field", s)

s = copy.deepcopy(EXAMPLE)
i = idx(s, "industry.logo-showcase")
s["nodes"][i]["content"]["tabs"][0]["logos"][0]["assetRole"] = "image"
mutation("ASSET_ROLE_CLOSED", "bare generic 'image' assetRole", s)

s = copy.deepcopy(EXAMPLE)
i = idx(s, "industry.nav-masthead")
del s["nodes"][i]["content"]["hero"]["provenance"]
mutation("SCHEMA_MEDIA_PROVENANCE", "media field with no provenance", s)

# ── structural / semantic layer ──
s = copy.deepcopy(EXAMPLE)
i = idx(s, "industry.icon-slider")
s["nodes"].insert(i + 1, copy.deepcopy(s["nodes"][i]))
mutation("ONE_PER_PAGE_BY_SECTION_AND_VARIANT", "duplicate a onePerPage section with the SAME variant",
         s, "semantic")

s = copy.deepcopy(EXAMPLE)
s["nodes"] = [n for n in s["nodes"] if n["section"] != "industry.feature-accordion"]
mutation("TEMPLATE_NODE_SEQUENCE_MATCH", "remove a mandatory section", s, "semantic")

s = copy.deepcopy(EXAMPLE)
a, b = idx(s, "industry.icon-slider"), idx(s, "industry.logo-showcase")
s["nodes"][a], s["nodes"][b] = s["nodes"][b], s["nodes"][a]
mutation("TEMPLATE_NODE_SEQUENCE_MATCH", "reorder two fixed-position sections", s, "semantic")

s = copy.deepcopy(EXAMPLE)
s["template"] = "platform"
mutation("TEMPLATE_NODE_SEQUENCE_MATCH",
         "template/node-sequence mismatch: industry nodes declaring template 'platform' "
         "(the single most repeated bug class - a validator that checks nodes[] in isolation "
         "lets this pass)", s, "semantic")

s = copy.deepcopy(EXAMPLE)
s["route"] = "/platform"
mutation("TEMPLATE_NODE_SEQUENCE_MATCH", "route not owned by the declared template", s, "semantic")

s = copy.deepcopy(EXAMPLE)
s["nodes"] = s["nodes"][1:]
mutation("CHROME_POSITION", "drop chrome.header", s, "semantic")

s = copy.deepcopy(EXAMPLE)
s["nodes"] = s["nodes"][:-2] + [s["nodes"][-1], s["nodes"][-2]]
mutation("CHROME_POSITION", "swap footer and cookie-notice order", s, "semantic")

# /chemicals claiming /shipping's optional slot -- the headline risk of modelling
# the industry family as ONE template with optional nodes
s = copy.deepcopy(EXAMPLE)
s["route"] = "/chemicals"
i = idx(s, "industry.icon-slider")
s["nodes"][i]["variant"] = "bg-dust-to-white"
s["nodes"][i]["content"]["background"] = "dustToWhite"
s["nodes"] = [n for n in s["nodes"] if n["section"] != "industry.text-card-asset"]
mutation("INDUSTRY_OPTIONAL_SLOTS_SHIPPING_ONLY",
         "/chemicals claiming industry.feature-detail", s, "semantic")

s = copy.deepcopy(EXAMPLE)
s["route"] = "/telecommunications"
s["nodes"] = [n for n in s["nodes"] if n["section"] != "industry.feature-detail"]
mutation("INDUSTRY_OPTIONAL_SLOTS_SHIPPING_ONLY",
         "/telecommunications claiming industry.text-card-asset", s, "semantic")

# hero cap, on the template that has one
s = copy.deepcopy(EXAMPLE)
s["nodes"].insert(2, copy.deepcopy(s["nodes"][idx(s, "industry.nav-masthead")]))
mutation("ONE_HERO_PER_PAGE", "two heroes on one page", s, "semantic")

# ONE_HERO must NOT require a hero on a hero-less template: the `about` and
# `security` controls above already prove that direction.

s = synthesise("about", TEMPLATES["templates"]["about"])
s["nodes"][1]["anchorId"] = "dup"
s["nodes"][2]["anchorId"] = "dup"
mutation("ANCHOR_ID_UNIQUE", "duplicate anchorId", s, "semantic")

s = synthesise("legal", TEMPLATES["templates"]["legal"])
s["nodes"][1]["content"]["requiresOperatorSuppliedText"] = False
mutation("LEGAL_TEXT_GATE", "legal page without the operator-supplied-text gate", s)

s = copy.deepcopy(EXAMPLE)
i = idx(s, "industry.logo-showcase")
s["nodes"][i]["content"]["tabs"][0]["logos"][0]["provenance"] = "generated"
mutation("ASSET_PROVENANCE_POLICY",
         "claim a real third-party trademark (brand.partner-logo) as 'generated'", s, "semantic")

s = copy.deepcopy(EXAMPLE)
i = idx(s, "industry.text-card-asset")
s["nodes"][i]["content"]["asset"]["provenance"] = "generated"
mutation("ASSET_PROVENANCE_POLICY",
         "fabricate a product screenshot (must-reuse-exact)", s, "semantic")

s = copy.deepcopy(EXAMPLE)
i = idx(s, "industry.nav-masthead")
s["nodes"][i]["content"]["hero"]["provenance"] = "generated"
mutation("ASSET_PROVENANCE_POLICY", "fabricate a Rive scene (must-reuse-exact)", s, "semantic")

s = copy.deepcopy(EXAMPLE)
i = idx(s, "industry.feature-accordion")
s["nodes"][i]["content"]["items"][0]["content"] = " ".join(["overflow"] * 60)
mutation("MAX_WORDS", "maxWords overflow on a real field", s, "semantic")

s = copy.deepcopy(EXAMPLE)
i = idx(s, "industry.icon-slider")
s["nodes"][i]["motion"]["reducedMotionFallback"] = "none"
mutation("REDUCED_MOTION_FALLBACK_REQUIRED",
         "swap a reducedMotionFallback for one the contract does not allow", s)

s = copy.deepcopy(EXAMPLE)
i = idx(s, "industry.icon-slider")
s["nodes"][i]["motion"]["pattern"] = "auto-advance-accordion"
mutation("REDUCED_MOTION_FALLBACK_REQUIRED",
         "borrow another section's motion pattern", s)

s = copy.deepcopy(EXAMPLE)
i = idx(s, "industry.icon-slider")
s["nodes"][i]["variant"] = "bg-dust-to-white"
mutation("VARIANT_ROUTE_ALLOWLIST",
         "use the /chemicals-only bg-dust-to-white icon-slider variant on /shipping", s, "semantic")

s = copy.deepcopy(EXAMPLE)
s["route"] = "/telecommunications"
s["nodes"] = [n for n in s["nodes"]
              if n["section"] not in ("industry.text-card-asset", "industry.feature-detail")]
s["nodes"][idx(s, "industry.nav-masthead")]["variant"] = "hero-rive"
mutation("VARIANT_ROUTE_ALLOWLIST",
         "claim /shipping's Rive hero variant on /telecommunications", s, "semantic")

s = synthesise("about", TEMPLATES["templates"]["about"])
s["nodes"][idx(s, "shared.icon-grid")]["variant"] = "theme-light"
mutation("VARIANT_ROUTE_ALLOWLIST",
         "use /security's theme-light icon-grid variant on /about", s, "semantic")

s = copy.deepcopy(EXAMPLE)
s["nodes"].insert(2, {"section": "cms.content-slider",
                      "motion": {"pattern": "none", "reducedMotionFallback": "none"},
                      "content": {}})
mutation("DELIBERATELY_UNBUILT_NOT_RECREATED",
         "recreate a deliberately-unbuilt hideSection:true CMS section", s)

# ── warn-severity rules must WARN, not error ──
s = synthesise("home", TEMPLATES["templates"]["home"])
i = idx(s, "feature.text-card-dashboard")
dup = copy.deepcopy(s["nodes"][i])
dup["section"] = "feature.asset-swap-pinned"
dup["motion"] = {"pattern": SECTIONS["feature.asset-swap-pinned"]["motion"]["pattern"],
                 "reducedMotionFallback":
                     SECTIONS["feature.asset-swap-pinned"]["motion"]["reducedMotionFallback"]}
dup["content"] = minimal_content(SECTIONS["feature.asset-swap-pinned"], "/")
s["nodes"] = [n for n in s["nodes"] if n["section"] != "feature.asset-swap-pinned"]
s["nodes"].insert(i + 1, dup)
warn_case("NO_ADJACENT_SAME_CATEGORY", "two adjacent 'feature' sections on a NON-exempt template", s)

# the real industry template runs four consecutive 'feature' sections and must
# NOT be flagged -- the named exception has to actually work
f = findings(EXAMPLE)
if any(x[1] == "NO_ADJACENT_SAME_CATEGORY" for x in f.items):
    failed.append(("EXCEPTION", "NO_ADJACENT_SAME_CATEGORY exempts industry-page",
                   "the real /shipping spec was flagged; the named exception is not working"))
else:
    passed.append(("EXCEPTION", "NO_ADJACENT_SAME_CATEGORY exempts industry-page",
                   "the real 4-consecutive-'feature' sequence is NOT flagged"))

s = copy.deepcopy(EXAMPLE)
extra = copy.deepcopy(s["nodes"][idx(s, "industry.logo-showcase")])
s["nodes"].insert(idx(s, "industry.logo-showcase"), extra)
f = findings(s)
if any(x[1] == "MOTION_BUDGET_AUTOPLAY" for x in f.warns):
    passed.append(("WARN-CASE", "MOTION_BUDGET_AUTOPLAY / 4 autoplaying sections",
                   "warned (budget is calibrated to the real ceiling of 3)"))
else:
    failed.append(("WARN-CASE", "MOTION_BUDGET_AUTOPLAY / 4 autoplaying sections",
                   "expected a warn; got %s" % sorted(set(x[1] for x in f.items))))

# ──────────────────────────── report ────────────────────────────
for kind, name, detail in passed:
    print("  ok   [%-9s] %-100s %s" % (kind, name[:100], detail[:90]))
for kind, name, detail in failed:
    print("  FAIL [%-9s] %-100s %s" % (kind, name[:100], detail[:200]))

nc = sum(1 for k, _, _ in passed if k == "CONTROL")
nm = sum(1 for k, _, _ in passed if k == "MUTATION")
print("\n%d passed (%d controls, %d mutations rejected, %d severity/exception cases), %d FAILED"
      % (len(passed), nc, nm, len(passed) - nc - nm, len(failed)))
if not HAVE_JS:
    print("NOTE: jsonschema is not installed, so schema-layer mutations were judged by the "
          "semantic layer alone. Install jsonschema for full coverage.")
sys.exit(1 if failed else 0)
