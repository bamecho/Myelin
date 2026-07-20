#!/usr/bin/env bash
set -euo pipefail

script_dir="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
skill_dir="$(CDPATH= cd -- "$script_dir/.." && pwd)"
skills_root="$(CDPATH= cd -- "$skill_dir/.." && pwd)"
repo_root="$(CDPATH= cd -- "$skill_dir/../../.." && pwd)"
agents_dir="$repo_root/agents"

status=0

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  status=1
}

check_file() {
  local rel="$1"
  if [ ! -f "$skill_dir/$rel" ]; then
    fail "missing referenced file: $rel"
  fi
}

require_pattern() {
  local file="$1"
  local pattern="$2"
  local message="$3"
  if ! grep -Eq "$pattern" "$file"; then
    fail "$message"
  fi
}

reject_pattern() {
  local file="$1"
  local pattern="$2"
  local message="$3"
  if grep -En "$pattern" "$file" >&2; then
    fail "$message"
  fi
}

check_skill() {
  local name="$1"
  case "$name" in
    # Real skills / env shims that may be absent in this package.
    bam-mode|poteto-mode|git-workflow-and-versioning|hai-prd|hai-architecture)
      return 0
      ;;
    # Non-skill tokens often backtick-quoted in SKILL.md (thickness, gates, verbs).
    none|note|full|index|yes|no|pass|revise|split|skip|ready|draft)
      return 0
      ;;
  esac

  if [ ! -f "$skills_root/$name/SKILL.md" ] && [ ! -f "$skill_dir/$name/SKILL.md" ]; then
    fail "missing referenced skill: $name"
  fi
}

for rel in \
  playbooks/design.md \
  playbooks/agent-handoff.md \
  playbooks/investigation.md \
  playbooks/bug-fix.md \
  playbooks/perf-issue.md \
  playbooks/hillclimb.md \
  playbooks/runtime-forensics.md \
  playbooks/trace-forensics.md \
  playbooks/feature.md \
  playbooks/refactoring.md \
  playbooks/prototype.md \
  playbooks/visual-parity.md \
  playbooks/authoring-a-skill.md \
  playbooks/eval.md \
  playbooks/autonomous-run.md \
  playbooks/session-pickup.md \
  playbooks/pause-safely.md \
  playbooks/opening-a-pr.md \
  references/plan.md \
  references/plan.zh_CN.md \
  references/handoff-contract.md \
  evals/agent-topology-behavior.md \
  evals/plan-behavior.md \
  evals/portability-behavior.md; do
  check_file "$rel"
done

for rel in bam-agent.md bam-specialist.md bam-worker.md bam-reviewer.md; do
  if [ ! -f "$agents_dir/$rel" ]; then
    fail "missing BAM agent role: agents/$rel"
  fi
done

for name in $(grep -Eoh '`[a-z][a-z0-9-]+`' "$skill_dir/SKILL.md" "$skill_dir/SKILL.zh_CN.md" | tr -d '`' | sort -u); do
  check_skill "$name"
done

for name in $(grep -Roh --include='*.md' 'principle-[a-z0-9-]*' "$skill_dir" | sort -u); do
  check_skill "$name"
done

runtime_files=(
  "$skill_dir/SKILL.md"
  "$skill_dir/SKILL.zh_CN.md"
  "$skill_dir/playbooks"/*.md
)

if grep -En '(Cursor|composer-2\.5-fast|gpt-5\.5-high-fast|`Task`|/deslop|babysit|create-skill|poteto-agent|control-cli|control-ui|~/\.cursor|multi-phase-plan)' \
  "${runtime_files[@]}" >/tmp/bam-mode-portability.$$.txt; then
  cat /tmp/bam-mode-portability.$$.txt >&2
  rm -f /tmp/bam-mode-portability.$$.txt
  fail "runtime playbooks must not bind to a named editor, model, agent API, private transcript path, or removed playbook"
else
  rm -f /tmp/bam-mode-portability.$$.txt
fi

if [ -e "$skill_dir/playbooks/multi-phase-plan.md" ]; then
  fail "multi-phase planning belongs to Design thickness full"
fi

if grep -n '^## Principles$' "$skill_dir/SKILL.md" "$skill_dir/SKILL.zh_CN.md" >/tmp/bam-mode-principles.$$.txt; then
  cat /tmp/bam-mode-principles.$$.txt >&2
  rm -f /tmp/bam-mode-principles.$$.txt
  fail "top-level Principles section belongs in playbooks, not SKILL.md"
else
  rm -f /tmp/bam-mode-principles.$$.txt
fi

if grep -n 'brainstorming' \
  "$skill_dir/SKILL.md" \
  "$skill_dir/SKILL.zh_CN.md" \
  "$skill_dir/references/plan.md" \
  "$skill_dir/references/plan.zh_CN.md" >/tmp/bam-mode-brainstorming.$$.txt; then
  cat /tmp/bam-mode-brainstorming.$$.txt >&2
  rm -f /tmp/bam-mode-brainstorming.$$.txt
  fail "removed skill still referenced: brainstorming"
else
  rm -f /tmp/bam-mode-brainstorming.$$.txt
fi

require_pattern "$skill_dir/references/plan.md" \
  'explicitly asks? for a plan' \
  'plan contract must distinguish an explicit plan deliverable from optional pre-implementation planning'

require_pattern "$skill_dir/references/plan.md" \
  'actual spec and (approved )?codebase-design' \
  'plan contract must consume the actual spec and codebase-design artifacts'

require_pattern "$skill_dir/references/plan.md" \
  'several (files|modules).*(does not|doesn.t).*full' \
  'module count alone must not turn an atomic change into a full plan'

require_pattern "$skill_dir/references/plan.md" \
  'remove every (line|sentence).*restates.*source' \
  'plan handoff must subtract information already available in its sources'

require_pattern "$skill_dir/references/plan.md" \
  'dependency, removal, new artifact, and stop rule.*source' \
  'full plans must audit coordination claims against upstream sources'

reject_pattern "$skill_dir/SKILL.md" \
  'references/failure-audit\.md' \
  'failure audit is a maintenance asset, not a runtime SKILL reference'

reject_pattern "$skill_dir/SKILL.zh_CN.md" \
  'references/failure-audit\.md' \
  'failure audit is a maintenance asset, not a runtime Chinese SKILL reference'

reject_pattern "$skill_dir/references/plan.md" \
  'failure-audit\.md' \
  'failure audit is a maintenance asset, not a runtime plan reference'

reject_pattern "$skill_dir/references/plan.md" \
  'Do \*\*not\*\* use expanded tasks' \
  'expanded-task guidance must be scoped to measured task classes, not stated as a universal ban'

reject_pattern "$skill_dir/SKILL.md" \
  'references/plan-review\.md' \
  'measured plan-review gate must not remain in the runtime SKILL'

reject_pattern "$skill_dir/references/plan.md" \
  'plan-review\.md|Status: (draft|ready)' \
  'plan runtime must not rely on the failed review/status ceremony'

require_pattern "$skill_dir/playbooks/feature.md" \
  'playbooks/design\.md|\*\*Design\*\* playbook' \
  'Feature must compose the Design playbook when its upstream decisions are not confirmed'

require_pattern "$skill_dir/SKILL.md" \
  'Autonomous owns the task only when' \
  'loop wording must not steal ownership from a narrow playbook'

require_pattern "$skill_dir/playbooks/autonomous-run.md" \
  'skill, command, CLI, or native scheduler' \
  'loop must resolve through a host capability rather than one editor command'

require_pattern "$skill_dir/playbooks/autonomous-run.md" \
  'actual contract before binding invocation syntax, success polarity, or wake semantics' \
  'loop bindings must come from the provider contract instead of invented syntax'

require_pattern "$skill_dir/playbooks/feature.md" \
  'missing delegation support never blocks implementation' \
  'Feature must remain executable without a worker runtime'

require_pattern "$skill_dir/playbooks/feature.md" \
  'Require the handback to name changed files' \
  'Feature handback must name changed files'
require_pattern "$skill_dir/playbooks/feature.md" \
  'commands run with observed results' \
  'Feature handback must record commands and observed results'
require_pattern "$skill_dir/playbooks/feature.md" \
  'verification evidence' \
  'Feature handback must include verification evidence'
require_pattern "$skill_dir/playbooks/feature.md" \
  'anything left undone' \
  'Feature handback must record unfinished work'
require_pattern "$skill_dir/playbooks/feature.md" \
  'residual risks' \
  'Feature handback must record residual risks'

require_pattern "$skill_dir/playbooks/opening-a-pr.md" \
  'actual base branch; never assume its name' \
  'PR flow must not assume main or another fixed base branch'

require_pattern "$skill_dir/playbooks/opening-a-pr.md" \
  'Leave unknown verbs and fields Open instead of inventing' \
  'PR provider commands must come from the actual host contract'

require_pattern "$skill_dir/playbooks/opening-a-pr.md" \
  'do not show illustrative commands with unverified verbs or flags' \
  'PR flow must not turn unknown provider interfaces into plausible examples'

require_pattern "$skill_dir/playbooks/opening-a-pr.md" \
  'Placeholder and example command lines still imply an interface' \
  'placeholder provider commands must not bypass contract verification'

require_pattern "$skill_dir/playbooks/opening-a-pr.md" \
  'do not invent polling flags or status fields' \
  'PR monitoring must bind to the actual loop provider contract'

require_pattern "$skill_dir/playbooks/design.md" \
  'think.*entity-model-design.*codebase-design.*plan|think[[:space:]]*→[[:space:]]*entity-model-design[[:space:]]*→[[:space:]]*codebase-design[[:space:]]*→[[:space:]]*plan' \
  'Design must own the complete think -> entity model -> codebase design -> plan flow'

require_pattern "$skill_dir/playbooks/design.md" \
  'risk-triggered.*not stages|risk-triggered.*not.*checklist' \
  'Design must treat principles as risk-triggered lenses, not workflow stages'

require_pattern "$skill_dir/playbooks/design.md" \
  'does not pull execution principles into the entity step' \
  'entity lifecycle retries must not pull execution principles across the step boundary'

require_pattern "$skill_dir/playbooks/design.md" \
  'For execution steps that may retry, restart, or resume' \
  'idempotence must be triggered by retryable execution steps, not entity lifecycle wording'

for principle in \
  principle-experience-first \
  principle-redesign-from-first-principles \
  principle-exhaust-the-design-space \
  principle-model-the-domain \
  principle-boundary-discipline \
  principle-minimize-reader-load \
  principle-separate-before-serializing-shared-state \
  principle-sequence-verifiable-units \
  principle-make-operations-idempotent \
  principle-outcome-oriented-execution; do
  require_pattern "$skill_dir/playbooks/design.md" \
    "$principle" \
    "Design is missing its conditional principle trigger: $principle"
done

reject_pattern "$skill_dir/playbooks/design.md" \
  'principle-[a-z0-9-]+ skipped|skipped:.*principle-' \
  'principles are conditional lenses and must not appear as skipped workflow stages'

reject_pattern "$skill_dir/SKILL.md" \
  '^## (Bam document lane|Local supplemental skills|Routing order)$' \
  'top-level SKILL must route playbooks, not assemble supplemental stages'

reject_pattern "$skill_dir/SKILL.zh_CN.md" \
  '^## (Bam 文档车道|本地补充技能|路由顺序)$' \
  'Chinese top-level SKILL must route playbooks, not assemble supplemental stages'

require_pattern "$agents_dir/bam-agent.md" \
  'model:[[:space:]]*inherit' \
  'bam-agent must inherit the active host model'

reject_pattern "$agents_dir/bam-agent.md" \
  '^readonly:[[:space:]]*true' \
  'the universal BAM owner must be able to execute the no-delegation fallback'

require_pattern "$agents_dir/bam-agent.md" \
  'supervisor|owning playbook' \
  'bam-agent must own orchestration rather than act as an undifferentiated subagent'

require_pattern "$agents_dir/bam-specialist.md" \
  'readonly:[[:space:]]*true' \
  'bam-specialist must not implement code'

require_pattern "$agents_dir/bam-specialist.md" \
  'one (bounded|assigned) (stage|decision)' \
  'bam-specialist must receive one bounded reasoning responsibility'

require_pattern "$agents_dir/bam-worker.md" \
  'single writer' \
  'bam-worker must remain the one writer for its assigned workspace'

require_pattern "$agents_dir/bam-reviewer.md" \
  'readonly:[[:space:]]*true' \
  'bam-reviewer must be structurally read-only'

require_pattern "$agents_dir/bam-reviewer.md" \
  'fresh' \
  'bam-reviewer must default to independent fresh context'

require_pattern "$agents_dir/bam-reviewer.md" \
  'accept[[:space:]]*\|[[:space:]]*reject[[:space:]]*\|[[:space:]]*needs-evidence' \
  'bam-reviewer must return an adjudicable verdict'

for file in "$agents_dir"/bam-*.md; do
  reject_pattern "$file" \
    '^thinking:' \
    'BAM agent roles must not cap model thinking effort'
  reject_pattern "$file" \
    '(claude|gpt-|gemini|grok|composer-|cursor)' \
    'BAM agent roles must not bind to a named model or host'
done

require_pattern "$skill_dir/playbooks/agent-handoff.md" \
  'non-owning' \
  'Agent handoff must compose under an owning playbook rather than become a router'

require_pattern "$skill_dir/playbooks/agent-handoff.md" \
  'fresh.*inherited|inherited.*fresh' \
  'Agent handoff must make context provenance explicit'

require_pattern "$skill_dir/playbooks/agent-handoff.md" \
  'named artifact' \
  'Agent handoff must pass evidence by named artifacts rather than raw transcript blobs'

require_pattern "$skill_dir/playbooks/agent-handoff.md" \
  'Proof required' \
  'Agent handoff must state the evidence level needed for acceptance'

require_pattern "$skill_dir/playbooks/agent-handoff.md" \
  'Stop / escalate' \
  'Agent handoff must define when ownership returns to the parent'

reject_pattern "$skill_dir/playbooks/agent-handoff.md" \
  'subagent\(|context:[[:space:]]*"(fresh|fork)"|worktree:[[:space:]]*true|intercom' \
  'Agent handoff must describe host-neutral capabilities, not Pi invocation syntax'

require_pattern "$skill_dir/playbooks/design.md" \
  'Agent handoff' \
  'Design must compose the Agent handoff contract at real context boundaries'

require_pattern "$skill_dir/playbooks/design.md" \
  'fresh specialist' \
  'Design must be able to transfer a bounded stage into a clean context'

require_pattern "$skill_dir/playbooks/design.md" \
  'contract review' \
  'Design must define an independent source-fidelity review gate'

require_pattern "$skill_dir/playbooks/feature.md" \
  'single writer' \
  'Feature must prevent concurrent writers in one workspace'

require_pattern "$skill_dir/playbooks/feature.md" \
  'fresh reviewer' \
  'Feature must separate implementation from independent review when risk warrants it'

if [ "$status" -eq 0 ]; then
  printf 'bam-mode validation passed\n'
fi

exit "$status"
