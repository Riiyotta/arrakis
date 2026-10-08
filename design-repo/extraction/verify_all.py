#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""One-shot verification for the Arrakis design-repo.

Runs, in order:

  1.  STRUCTURE            every declared folder/file exists
  2.  MANIFEST ENTRYPOINTS every entryPoint is inside design-repo/ and exists
  3.  NO ABSOLUTE PATHS    no absolute home-directory path anywhere in the tree
  4.  VERSION PARITY       manifest.allowlistVersion == allowlist.version  [MACHINE-CHECKED]
  5.  ALLOWLIST PARITY     allowlist <-> contract files, both directions     [DRIFT-PROOFED]
  6.  MANIFEST COUNTS      every counts[] value recomputed from disk         [DRIFT-PROOFED]
  7.  CITATION VALIDITY    every citation resolves in range, and its recorded
                           `anchor` string is really on the cited line       [DRIFT-PROOFED]
                           -> degrades to a WARNING when no sibling source tree is present
  8.  ASSET ROLE CLOSURE   roleEnum <-> roles, schema mirror, and PINNED-VALUE
                           checks for the 8 compliance-critical roles
  9.  GRAPH <-> VALIDATOR  the rule ids in compatibility/graph.json and the rule
                           ids implemented in schema/semantic_validate.py are
                           identical sets (MASTER-GUIDE 3.8)
 10.  ROUTE COVERAGE       every route maps to exactly one template, no gaps,
                           no double-assignment; forbidden routes absent
 11.  TEMPLATE NODE REFS   every template node names a real section contract,
                           and every section is referenced by >= 1 template
 12.  MOTION CLOSURE       the PageSpec motion object is additionalProperties:false
 13.  SCHEMA               Draft7Validator against example.pagespec.json
 14.  SEMANTIC             schema/semantic_validate.py against the example
 15.  ADVERSARIAL          schema/tests/adversarial_test.py

Every check that guards a hand-maintained number or list is proven to actually
catch drift by extraction/prove_drift.sh, which copies the repo to a scratch
location, injects a phantom allowlist entry / an out-of-range citation / a wrong
manifest count / a pinned-policy flip, confirms each one FAILS, then confirms the
real repo still passes. That script exists and is runnable -- it is not a
documented promise with nothing behind it (MASTER-GUIDE 3.23).

Path portability: the repo root is derived from this file's own location.

Usage:  python3 verify_all.py          # full run
        python3 verify_all.py --quiet  # findings only
Exit 0 if every check passes, 1 otherwise.
"""
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
SOURCE_TREE = os.path.dirname(REPO)          # the sibling project, if present

OK, FAIL, WARN = "PASS", "FAIL", "WARN"
results = []
QUIET = "--quiet" in sys.argv


def record(name, status, detail=""):
    results.append((name, status, detail))
    if QUIET and status == OK:
        return
    print("[%-4s] %-22s %s" % (status, name, detail))


def jload(*parts):
    with open(os.path.join(REPO, *parts), encoding="utf-8") as fh:
        return json.load(fh)


def walk_files():
    for dirpath, dirnames, filenames in os.walk(REPO):
        dirnames[:] = [d for d in dirnames if d not in ("__pycache__", ".git")]
        for n in filenames:
            if n.endswith(".pyc") or n == ".DS_Store":
                continue
            yield os.path.join(dirpath, n)


# ───────────────────────────── 1. structure ─────────────────────────────
REQUIRED = [
    "README.md", "CHANGELOG.md", "registry.manifest.json",
    "tokens/00-foundation/color.json", "tokens/00-foundation/typography.json",
    "tokens/00-foundation/radius.json", "tokens/00-foundation/spacing.json",
    "tokens/00-foundation/breakpoint.json", "tokens/00-foundation/motion.json",
    "tokens/00-foundation/elevation.json", "tokens/00-foundation/icon-size.json",
    "tokens/10-semantic/semantic.json", "tokens/20-component/component.json",
    "tokens/30-layout/layout.json",
    "tokens/themes/light-surface.json", "tokens/themes/dark-surface.json",
    "tokens/llm/component-allowlist.json",
    "templates/templates.json", "compatibility/graph.json",
    "assets/asset-roles.json", "motion/motion-spec.json",
    "schema/pagespec.schema.json", "schema/example.pagespec.json",
    "schema/semantic_validate.py", "schema/tests/adversarial_test.py",
    "extraction/measured-values.json", "extraction/verify_all.py",
    "extraction/prove_drift.sh",
]
missing = [p for p in REQUIRED if not os.path.exists(os.path.join(REPO, p))]
record("structure", FAIL if missing else OK,
       "missing: %s" % missing if missing else "%d required paths present" % len(REQUIRED))

MANIFEST = jload("registry.manifest.json")
ALLOWLIST = jload("tokens", "llm", "component-allowlist.json")
TEMPLATES = jload("templates", "templates.json")
GRAPH = jload("compatibility", "graph.json")
ASSETS = jload("assets", "asset-roles.json")
MEASURED = jload("extraction", "measured-values.json")
SCHEMA = jload("schema", "pagespec.schema.json")

SECTION_IDS = sorted(
    json.load(open(os.path.join(REPO, "sections", n), encoding="utf-8"))["id"]
    for n in os.listdir(os.path.join(REPO, "sections")) if n.endswith(".json"))

# ─────────────────────── 2. manifest entryPoints ───────────────────────
bad = []
for ep in MANIFEST.get("entryPoints", []):
    if ep.startswith("..") or ep.startswith("/") or ":" in ep:
        bad.append("%s (points outside the package)" % ep)
    elif not os.path.exists(os.path.join(REPO, ep)):
        bad.append("%s (does not exist)" % ep)
record("manifest-entrypoints", FAIL if bad else OK,
       "; ".join(bad) if bad else "%d entry points, all inside design-repo/ and present"
       % len(MANIFEST.get("entryPoints", [])))

# ───────────────────── 3. no absolute machine paths ─────────────────────
# Built from parts on purpose: the pattern must not itself contain the literal
# it forbids, or this check would flag its own source file.
_U = chr(47) + "Users" + chr(47)
_H = chr(47) + "home" + chr(47)
ABS = re.compile("|".join([re.escape(_U), r"[A-Za-z]:\\\\Users\\\\", re.escape(_H) + "[a-z]"]))
hits = []
for p in walk_files():
    try:
        with open(p, encoding="utf-8", errors="strict") as fh:
            for i, line in enumerate(fh, 1):
                if ABS.search(line):
                    hits.append("%s:%d" % (os.path.relpath(p, REPO), i))
    except (UnicodeDecodeError, IsADirectoryError):
        continue
record("no-absolute-paths", FAIL if hits else OK,
       "found: %s" % hits[:5] if hits
       else "0 absolute home-directory paths across the whole tree")

# ───────────────────────── 4. version parity ─────────────────────────
a, b = MANIFEST.get("allowlistVersion"), ALLOWLIST.get("version")
record("version-parity", OK if a == b and a else FAIL,
       "allowlistVersion=%r allowlist.version=%r (machine-checked)" % (a, b))

# ──────────────────────── 5. allowlist parity ────────────────────────
entries = ALLOWLIST["entries"]
real = {}
for sub in ("sections", "primitives", "components"):
    for n in sorted(os.listdir(os.path.join(REPO, sub))):
        if not n.endswith(".json"):
            continue
        c = json.load(open(os.path.join(REPO, sub, n), encoding="utf-8"))
        real[c["id"]] = "%s/%s" % (sub, n)
phantom = sorted(set(entries) - set(real))
orphan = sorted(set(real) - set(entries))
wrongfile = sorted(k for k in set(entries) & set(real)
                   if entries[k].get("contractFile") != real[k])
prob = []
if phantom:
    prob.append("phantom allowlist entries (no contract file): %s" % phantom)
if orphan:
    prob.append("orphan contracts (no allowlist entry): %s" % orphan)
if wrongfile:
    prob.append("contractFile mismatch: %s" % wrongfile)
record("allowlist-parity", FAIL if prob else OK,
       "; ".join(prob) if prob else "%d entries <-> %d contract files, both directions"
       % (len(entries), len(real)))
if entries.get("entryCount") is None and ALLOWLIST.get("entryCount") != len(entries):
    record("allowlist-entrycount", FAIL,
           "allowlist.entryCount=%s but %d entries" % (ALLOWLIST.get("entryCount"), len(entries)))
else:
    record("allowlist-entrycount", OK, "entryCount=%d matches" % len(entries))

# ──────────────── 6. manifest counts, recomputed from disk ────────────────
def count_tokens():
    n = 0
    n += len(jload("tokens", "00-foundation", "color.json")["tokens"])
    n += jload("tokens", "00-foundation", "typography.json")["roleCount"]
    n += len(jload("tokens", "00-foundation", "radius.json")["tokens"])
    n += jload("tokens", "00-foundation", "spacing.json")["stepCount"]
    n += jload("tokens", "00-foundation", "breakpoint.json")["bespokeCount"]
    n += len(jload("tokens", "00-foundation", "elevation.json")["tokens"])
    m = jload("tokens", "00-foundation", "motion.json")
    n += len(m["duration"]) + len(m["easing"]) + len(m["springs"])
    return n

computed = {
    "colors": len(jload("tokens", "00-foundation", "color.json")["tokens"]),
    "typeRoles": jload("tokens", "00-foundation", "typography.json")["roleCount"],
    "radii": len(jload("tokens", "00-foundation", "radius.json")["tokens"]),
    "bespokeSpacingSteps": jload("tokens", "00-foundation", "spacing.json")["stepCount"],
    "bespokeBreakpoints": jload("tokens", "00-foundation", "breakpoint.json")["bespokeCount"],
    "foundationTokensTotal": count_tokens(),
    "semanticRoles": len(jload("tokens", "10-semantic", "semantic.json")["roles"]),
    "themes": len([n for n in os.listdir(os.path.join(REPO, "tokens", "themes"))
                   if n.endswith(".json")]),
    "primitives": len([n for n in os.listdir(os.path.join(REPO, "primitives"))
                       if n.endswith(".json")]),
    "components": len([n for n in os.listdir(os.path.join(REPO, "components"))
                       if n.endswith(".json")]),
    "sections": len(SECTION_IDS),
    "templates": len(TEMPLATES["templates"]),
    "routes": len(TEMPLATES["routeToTemplate"]),
    "compatibilityRules": len(GRAPH["rules"]),
    "assetRoles": len(ASSETS["roleEnum"]),
    "allowlistEntries": len(entries),
    "motionPatterns": len(jload("motion", "motion-spec.json")["byPattern"]),
    "citationClaims": sum(len(v) for v in MEASURED["citations"].values()),
}
declared = MANIFEST.get("counts", {})
drift = []
for k, v in sorted(computed.items()):
    if k not in declared:
        drift.append("%s: missing from manifest (real=%s)" % (k, v))
    elif declared[k] != v:
        drift.append("%s: manifest says %s, disk says %s" % (k, declared[k], v))
for k in sorted(set(declared) - set(computed)):
    drift.append("%s: in manifest but nothing recomputes it" % k)
record("manifest-counts", FAIL if drift else OK,
       "; ".join(drift) if drift else "%d counts all recomputed from disk and matching"
       % len(computed))

# ──────────────────── 7. citation range + anchor validity ────────────────────
CITE = re.compile(r"^([^:]+):(\d+)(?:-(\d+))?$")
have_source = os.path.exists(os.path.join(SOURCE_TREE, "package.json")) and \
    os.path.isdir(os.path.join(SOURCE_TREE, "src"))
if not have_source:
    record("citation-validity", WARN,
           "no sibling source tree next to design-repo/ -> citation ranges not checked "
           "(by design: this ledger cites the SOURCE PROJECT, so a standalone copy warns "
           "rather than failing)")
else:
    lens = {}
    probs = []
    checked = 0
    anchors_checked = 0

    def check_one(c, anchor, where):
        global checked, anchors_checked
        m = CITE.match(c)
        if not m:
            probs.append("%s: malformed citation %r" % (where, c))
            return
        path, a = m.group(1), int(m.group(2))
        b = int(m.group(3)) if m.group(3) else a
        full = os.path.join(SOURCE_TREE, path)
        if not os.path.exists(full):
            probs.append("%s: %s does not exist" % (where, path))
            return
        if path not in lens:
            with open(full, encoding="utf-8", errors="replace") as fh:
                lens[path] = fh.readlines()
        n = len(lens[path])
        checked += 1
        if a < 1 or b > n or a > b:
            probs.append("%s: %s:%d-%d out of range (file has %d lines)" % (where, path, a, b, n))
            return
        if anchor:
            anchors_checked += 1
            window = "".join(lens[path][a - 1:b])
            if anchor not in window:
                probs.append("%s: %s:%d-%d is in range but the recorded anchor %r is NOT on "
                             "those lines (the dangerous half a bounds check misses)"
                             % (where, path, a, b, anchor))

    for key, rows in sorted(MEASURED["citations"].items()):
        for i, row in enumerate(rows):
            c = row.get("citation")
            if c is None:
                continue
            anchor = row.get("anchor")
            for cc in (c if isinstance(c, list) else [c]):
                check_one(cc, anchor, "%s[%d]" % (key, i))
    record("citation-validity", FAIL if probs else OK,
           "; ".join(probs[:4]) if probs else
           "%d citations resolved in range; %d of them also anchor-verified against the real "
           "quoted content" % (checked, anchors_checked))

# ─────────────────── 8. asset-role closure + pinned values ───────────────────
probs = []
if sorted(ASSETS["roleEnum"]) != sorted(ASSETS["roles"]):
    probs.append("roleEnum and roles keys disagree: %s"
                 % sorted(set(ASSETS["roleEnum"]) ^ set(ASSETS["roles"])))
if sorted(SCHEMA["definitions"]["assetRoleEnum"]["enum"]) != sorted(ASSETS["roleEnum"]):
    probs.append("schema definitions.assetRoleEnum has drifted from assets/asset-roles.json#roleEnum")
closed = set(ASSETS["generationPolicyEnum"])
for role, body in sorted(ASSETS["roles"].items()):
    if body["generationPolicy"] not in closed:
        probs.append("%s: generationPolicy %r is not in the closed enum"
                     % (role, body["generationPolicy"]))
    if not body.get("aiGuidance"):
        probs.append("%s: no aiGuidance" % role)
# PINNED-VALUE checks: membership in a closed set is a weaker claim than
# "this specific role is pinned to this specific value" (MASTER-GUIDE 3.23).
pinned = {k: v for k, v in ASSETS["pinnedPolicies"].items() if not k.startswith("_")}
for role, want in sorted(pinned.items()):
    if role not in ASSETS["roles"]:
        probs.append("pinnedPolicies names unknown role %r" % role)
    elif ASSETS["roles"][role]["generationPolicy"] != want:
        probs.append("PINNED ROLE %r must be %r, found %r"
                     % (role, want, ASSETS["roles"][role]["generationPolicy"]))
record("asset-role-closure", FAIL if probs else OK,
       "; ".join(probs[:4]) if probs else
       "%d roles closed + documented; %d compliance-critical roles pinned to an exact policy value"
       % (len(ASSETS["roles"]), len(pinned)))

# ──────────────── 9. graph rules <-> validator implementation ────────────────
sys.path.insert(0, os.path.join(REPO, "schema"))
try:
    import semantic_validate as SV
    graph_ids = sorted(r["id"] for r in GRAPH["rules"])
    impl_ids = sorted(SV.IMPLEMENTED_RULE_IDS)
    only_graph = sorted(set(graph_ids) - set(impl_ids))
    only_impl = sorted(set(impl_ids) - set(graph_ids))
    probs = []
    if only_graph:
        probs.append("declared in graph but NOT implemented: %s" % only_graph)
    if only_impl:
        probs.append("implemented but NOT declared in graph: %s" % only_impl)
    # the ONE_HERO exception prose and the validator's own exempt set must agree
    if set(GRAPH["rules"][1]["noHeroTemplates"]) != SV.NO_HERO_TEMPLATES:
        probs.append("ONE_HERO_PER_PAGE noHeroTemplates has drifted from the validator's set")
    record("graph-validator-parity", FAIL if probs else OK,
           "; ".join(probs) if probs else
           "%d rule ids identical in graph prose and validator code; %d schema-enforced"
           % (len(graph_ids), len(SV.SCHEMA_ENFORCED_RULE_IDS)))
except Exception as exc:                                     # noqa: BLE001
    record("graph-validator-parity", FAIL, "could not import semantic_validate: %r" % exc)

# ───────────────────────── 10. route coverage ─────────────────────────
probs = []
seen = {}
for tid, t in TEMPLATES["templates"].items():
    for r in t["routes"]:
        if r in seen:
            probs.append("route %r assigned to both %r and %r" % (r, seen[r], tid))
        seen[r] = tid
if seen != TEMPLATES["routeToTemplate"]:
    probs.append("routeToTemplate does not match the per-template routes arrays")
if sorted(seen) != sorted(SCHEMA["properties"]["route"]["enum"]):
    probs.append("schema route enum has drifted from templates.json")
if sorted(TEMPLATES["templates"]) != sorted(SCHEMA["properties"]["template"]["enum"]):
    probs.append("schema template enum has drifted from templates.json")
for r in GRAPH["rules"][-1]["forbiddenRoutes"]:
    if r in seen:
        probs.append("forbidden route %r is mapped to a template" % r)
record("route-coverage", FAIL if probs else OK,
       "; ".join(probs) if probs else
       "%d routes -> %d templates, 1:1, no gaps, no double-assignment"
       % (len(seen), len(TEMPLATES["templates"])))

# ──────────────────── 11. template node <-> section refs ────────────────────
probs = []
referenced = set()
for tid, t in TEMPLATES["templates"].items():
    for nd in t["nodes"]:
        if nd["section"] not in SECTION_IDS:
            probs.append("template %r node %r has no section contract" % (tid, nd["section"]))
        referenced.add(nd["section"])
        for k in ("required", "repeatable", "scope"):
            if k not in nd:
                probs.append("template %r node %r is missing %r (nodes must be structured "
                             "objects, not bare strings)" % (tid, nd["section"], k))
unref = sorted(set(SECTION_IDS) - referenced)
if unref:
    probs.append("section contracts referenced by no template: %s" % unref)
node_variants = SCHEMA["properties"]["nodes"]["items"]["oneOf"]
if len(node_variants) != len(SECTION_IDS):
    probs.append("schema has %d node variants but there are %d sections"
                 % (len(node_variants), len(SECTION_IDS)))
record("template-node-refs", FAIL if probs else OK,
       "; ".join(probs[:4]) if probs else
       "%d sections, all referenced; %d structured nodes across %d templates"
       % (len(SECTION_IDS), sum(len(t["nodes"]) for t in TEMPLATES["templates"].values()),
          len(TEMPLATES["templates"])))

# ───────────────────────── 12. motion closure ─────────────────────────
probs = []
for v in node_variants:
    m = v["properties"]["motion"]
    if m.get("additionalProperties") is not False:
        probs.append("%s: motion is not additionalProperties:false" % v["title"])
    if sorted(m["properties"]) != ["pattern", "reducedMotionFallback"]:
        probs.append("%s: motion fields are %s" % (v["title"], sorted(m["properties"])))
    if "const" not in m["properties"]["reducedMotionFallback"]:
        probs.append("%s: reducedMotionFallback is not const-locked" % v["title"])
    if v.get("additionalProperties") is not False:
        probs.append("%s: node is not additionalProperties:false" % v["title"])
record("motion-closure", FAIL if probs else OK,
       "; ".join(probs[:4]) if probs else
       "all %d node variants: motion closed to 2 const-locked fields, node additionalProperties:false"
       % len(node_variants))

# ──────────────────────────── 13. schema ────────────────────────────
try:
    from jsonschema import Draft7Validator
    Draft7Validator.check_schema(SCHEMA)
    ex = jload("schema", "example.pagespec.json")
    errs = sorted(Draft7Validator(SCHEMA).iter_errors(ex), key=lambda e: list(e.path))
    record("schema-draft07", FAIL if errs else OK,
           "%d errors: %s" % (len(errs), [list(e.path) for e in errs[:3]]) if errs
           else "schema is valid draft-07; example validates with 0 errors")
except ImportError:
    record("schema-draft07", WARN, "jsonschema not installed; install it to run this check "
                                   "(pip install jsonschema)")

# ─────────────────────── 14 & 15. validator + adversarial ───────────────────────
def run(label, path, *args):
    p = subprocess.run([sys.executable, os.path.join(REPO, path)] + list(args),
                       capture_output=True, text=True)
    tail = (p.stdout + p.stderr).strip().split("\n")[-1] if (p.stdout or p.stderr) else ""
    record(label, OK if p.returncode == 0 else FAIL, tail[:160])
    return p

run("semantic-validator", "schema/semantic_validate.py")
run("adversarial-suite", "schema/tests/adversarial_test.py")

# ──────────────────────────── summary ────────────────────────────
nf = sum(1 for _, s, _ in results if s == FAIL)
nw = sum(1 for _, s, _ in results if s == WARN)
print("\n%d checks: %d pass, %d warn, %d FAIL"
      % (len(results), len(results) - nf - nw, nw, nf))
sys.exit(1 if nf else 0)
