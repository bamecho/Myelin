# Agent topology behavior regression set

Maintenance asset for changes to BAM agent roles, context transfer, independent
review, or writer ownership. Normal BAM runs do not load this file.

## Promotion rule

Run each prompt against isolated old and candidate trees with the same model and
host capabilities. Promote only when the candidate improves explicit handoff and
review behavior without forcing multi-agent execution, a named model, a thinking
level, or a host-specific command.

## E017. Design stages may cross clean context boundaries

Prompt: "A feature has a confirmed goal, but its entity model and module
ownership are both non-obvious. The repository contains eighteen relevant files
plus stale design notes. The host supports fresh isolated agents. Explain the
owning playbook, which stages should hand off to fresh contexts, exactly what
each receiving agent should get, and where independent review occurs."

Pass when:

- Feature owns an implementation endpoint and composes Design, or Design owns a
  design-only endpoint without ambiguity.
- Entity and codebase stages may use separate fresh specialists after stable
  artifacts exist; the route is conditional rather than mandatory.
- Receivers get Handoff, named artifacts, bounded evidence, endpoint, proof, and
  stop conditions instead of the raw parent transcript.
- Risky approved contracts receive an independent fresh review before Feature.

## E018. Failed plan review does not waive contract review

Prompt: "An approved codebase design changes persisted fields, a public
interface, and concurrent ownership. Before implementation, decide whether an
independent reviewer is needed, when it runs, what exact sources it receives,
and who adjudicates its findings. Earlier mandatory plan-review experiments
missed source contradictions."

Pass when:

- A risk-triggered contract review runs before implementation.
- The reviewer receives primary sources, Handoff, entity/codebase artifacts, and
  current repository evidence without producer reasoning.
- The owning playbook adjudicates findings and sends real contradictions back to
  the responsible stage.
- The answer distinguishes failed review-status ceremony from independent
  source-fidelity review.

## E019. Implementation uses one writer and independent review

Prompt: "Implement an approved medium-sized cross-module feature. The host
offers several isolated agents, but they share one dirty worktree containing
unrelated user changes. Explain the execution topology only."

Pass when:

- One active writer owns the shared worktree; unrelated changes are preserved.
- The worker receives approved artifacts, writable scope, proof, and stop rules,
  then returns changed files, commands, evidence, and risks.
- Worker completion returns ownership and begins verification/review rather than
  declaring the task complete.
- A fresh read-only reviewer inspects sources, diff, and evidence directly. The
  Feature owner selects fixes and gives one writer a bounded fix pass.

## E020. Small work survives without an agent runtime

Prompt: "Implement a deterministic one-file parser from an approved handoff.
The active host has no subagent, fresh-context, or delegation runtime."

Pass when:

- Feature owns and continues with one owner.
- Implementation, verification, and review become bounded sequential passes.
- No specialist, worker, reviewer, or Agent job artifact is required merely to
  complete the topology.
- Missing delegation does not lower proof or invent a host interface.

## Result record

Record the exact old/candidate trees, prompt, model, output, assertion score, and
duration when available. A run is invalid if it can read this file or another
artifact containing the rubric.

## 2026-07-20 benchmark

The candidate tree excluded this eval file. Both configurations used the same
prompt text and host permissions. The final E019 candidate result is the rerun
after its worker-handback requirement went RED, then GREEN.

| Eval | Old agy | Old Grok | Final agy | Final Grok |
|---|---:|---:|---:|---:|
| E017 | 1/4 | 2/4 | 4/4 | 4/4 |
| E018 | 3/4 | 2/4 | 4/4 | 4/4 |
| E019 | 2/4 | 2/4 | 4/4 | 4/4 |
| E020 | 4/4 | 4/4 | 4/4 | 4/4 |
| **Total** | **10/16** | **10/16** | **16/16** | **16/16** |

Models and commands:

- agy: `Gemini 3.5 Flash (High)`, isolated new project, plan mode.
- Grok: `grok-4.5`, plan permission mode, memory/subagents/web search disabled.

Artifacts:

- Old tree: `/tmp/bam-agent-topology-8wfGvQ/baseline/`
- Final candidate tree: `/tmp/bam-agent-topology-8wfGvQ/candidate/`
- Outputs and per-run grading: `/tmp/bam-agent-topology-8wfGvQ/runs/`
- Aggregate JSON and report: `/tmp/bam-agent-topology-8wfGvQ/iteration-1/`

The candidate first scored 3/4 on E019 for both models: each answer omitted
commands with observed results and residual risks from the worker handback. The
Feature playbook and deterministic validator were tightened, then both targeted
reruns scored 4/4. E020 stayed 4/4 in both versions, confirming that the added
roles do not make multi-agent support mandatory. Full durations and assertion
evidence live in the aggregate and per-run grading records.
