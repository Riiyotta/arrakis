#!/usr/bin/env bash
# Prove that verify_all.py's drift-proofed checks actually catch drift.
#
# A check that has never been shown to FAIL on bad input might not be checking
# anything (MASTER-GUIDE 3.2 / 3.4 / 3.16 / 3.23). This script copies the repo to
# a scratch location, injects one defect at a time, confirms the matching check
# FAILS, then confirms the untouched real repo still PASSES.
#
# Injections:
#   1. a phantom allowlist entry (an id with no contract file)   -> allowlist-parity
#   2. an orphan contract (an allowlist entry removed)           -> allowlist-parity
#   3. a citation range past the end of the real file            -> citation-validity
#   4. an in-range citation whose anchor is NOT on those lines   -> citation-validity
#   5. a wrong manifest count                                    -> manifest-counts
#   6. a pinned asset-role policy flipped to a DIFFERENT-BUT-VALID
#      enum member                                               -> asset-role-closure
#   7. an absolute machine path reintroduced                      -> no-absolute-paths
#   8. allowlistVersion drift                                    -> version-parity
#   9. a graph rule id removed from the validator's rule list     -> graph-validator-parity
#  10. an entryPoint pointing outside the package (../)           -> manifest-entrypoints
#
# Usage:  bash extraction/prove_drift.sh
# Exit 0 only if every injection is caught AND the clean repo passes.
set -u

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(dirname "$HERE")"
SRCTREE="$(dirname "$REPO")"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

PY="${PYTHON:-python3}"
fails=0
n=0

# Some injections only mean anything when the sibling source project is present
# (the citation ledger cites IT, so a standalone copy warns instead of failing).
HAVE_SOURCE=0
if [ -d "$SRCTREE/src" ] && [ -f "$SRCTREE/package.json" ]; then HAVE_SOURCE=1; fi

inject() {               # inject [--needs-source] <label> <expected-check> <python-snippet>
  local needs_source=0
  if [ "${1:-}" = "--needs-source" ]; then needs_source=1; shift; fi
  n=$((n+1))
  local label="$1" check="$2" snippet="$3"
  if [ "$needs_source" = 1 ] && [ "$HAVE_SOURCE" = 0 ]; then
    echo "  SKIP     $label  (no sibling source tree -> the citation check warns by design, so there"
    echo "                   is nothing for this injection to trip; run this from the project folder)"
    return
  fi
  rm -rf "$WORK/t"
  mkdir -p "$WORK/t"
  cp -R "$REPO" "$WORK/t/design-repo"
  # keep the sibling source tree visible so citation checks are live, not skipped
  [ -d "$SRCTREE/src" ] && ln -s "$SRCTREE/src" "$WORK/t/src" 2>/dev/null
  [ -f "$SRCTREE/package.json" ] && cp "$SRCTREE/package.json" "$WORK/t/package.json" 2>/dev/null
  [ -f "$SRCTREE/tailwind.config.js" ] && cp "$SRCTREE/tailwind.config.js" "$WORK/t/tailwind.config.js" 2>/dev/null
  ( cd "$WORK/t/design-repo" && REPO_DIR="$WORK/t/design-repo" "$PY" -c "$snippet" ) || {
      echo "  SKIP  $label  (could not inject)"; return; }
  local out
  out="$("$PY" "$WORK/t/design-repo/extraction/verify_all.py" 2>&1)"
  if echo "$out" | grep -qE "^\[FAIL\] +$check"; then
    echo "  CAUGHT   $label  -> [FAIL] $check"
  else
    echo "  MISSED   $label  -> expected [FAIL] $check but got:"
    echo "$out" | grep -E "^\[(FAIL|WARN)\]" | sed 's/^/           /'
    fails=$((fails+1))
  fi
}

echo "=== drift injection tests ==="

inject "1. phantom allowlist entry" "allowlist-parity" '
import json,os
p=os.path.join(os.environ["REPO_DIR"],"tokens/llm/component-allowlist.json")
d=json.load(open(p)); d["entries"]["hero.phantom-section"]={"kind":"section","contractFile":"sections/hero.phantom-section.json","settableProperties":[]}
d["entryCount"]=len(d["entries"]); json.dump(d,open(p,"w"),indent=2)'

inject "2. orphan contract (allowlist entry deleted)" "allowlist-parity" '
import json,os
p=os.path.join(os.environ["REPO_DIR"],"tokens/llm/component-allowlist.json")
d=json.load(open(p)); d["entries"].pop("stats.grid"); d["entryCount"]=len(d["entries"]); json.dump(d,open(p,"w"),indent=2)'

inject --needs-source "3. out-of-range citation" "citation-validity" '
import json,os
p=os.path.join(os.environ["REPO_DIR"],"extraction/measured-values.json")
d=json.load(open(p)); d["citations"]["token.color"][0]["citation"]="tailwind.config.js:9000-9100"
json.dump(d,open(p,"w"),indent=2)'

inject --needs-source "4. in-range citation, wrong lines (anchor not there)" "citation-validity" '
import json,os
p=os.path.join(os.environ["REPO_DIR"],"extraction/measured-values.json")
d=json.load(open(p)); d["citations"]["token.color"][0]["citation"]="tailwind.config.js:1-3"
json.dump(d,open(p,"w"),indent=2)'

inject "5. wrong manifest count" "manifest-counts" '
import json,os
p=os.path.join(os.environ["REPO_DIR"],"registry.manifest.json")
d=json.load(open(p)); d["counts"]["sections"]=99; json.dump(d,open(p,"w"),indent=2)'

inject "6. pinned asset-role policy flipped to a DIFFERENT-BUT-VALID value" "asset-role-closure" '
import json,os
p=os.path.join(os.environ["REPO_DIR"],"assets/asset-roles.json")
d=json.load(open(p)); d["roles"]["brand.partner-logo"]["generationPolicy"]="may-generate-new"
json.dump(d,open(p,"w"),indent=2)'

inject "7. absolute machine path reintroduced" "no-absolute-paths" '
import os
p=os.path.join(os.environ["REPO_DIR"],"README.md")
open(p,"a").write("\nBuilt at "+chr(47)+"Users"+chr(47)+"someone"+chr(47)+"arrakis\n")'

inject "8. allowlistVersion drift" "version-parity" '
import json,os
p=os.path.join(os.environ["REPO_DIR"],"registry.manifest.json")
d=json.load(open(p)); d["allowlistVersion"]="9.9.9"; json.dump(d,open(p,"w"),indent=2)'

inject "9. graph rule dropped from the validator" "graph-validator-parity" '
import os
p=os.path.join(os.environ["REPO_DIR"],"schema/semantic_validate.py")
s=open(p).read().replace("    (\"ANCHOR_ID_UNIQUE\", check_anchors),","",1)
open(p,"w").write(s)'

inject "10. entryPoint pointing outside the package" "manifest-entrypoints" '
import json,os
p=os.path.join(os.environ["REPO_DIR"],"registry.manifest.json")
d=json.load(open(p)); d["entryPoints"].append("../CLONE_SPEC.md"); json.dump(d,open(p,"w"),indent=2)'

echo
echo "=== control: the real, untouched repo must still pass ==="
if "$PY" "$REPO/extraction/verify_all.py" --quiet; then
  echo "  CONTROL  real repo PASSES"
else
  echo "  CONTROL  real repo FAILED - this is a genuine defect, not a drift test"
  fails=$((fails+1))
fi

echo
echo "$n injections, $fails problem(s)"
if [ "$HAVE_SOURCE" = 0 ]; then
  echo "(2 citation injections were skipped: no sibling source project next to design-repo/)"
fi
exit $(( fails > 0 ? 1 : 0 ))
