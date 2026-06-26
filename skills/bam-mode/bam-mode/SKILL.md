---
name: bam-mode
description: "Bam's self-contained engineering mode. Use only when the user invokes bam-mode, /bam-mode, or asks to work in Bam's style."
disable-model-invocation: true
---

# Bam mode

`bam-mode` is a self-contained pstack-style mode with Bam's document-and-review lane added. Do not depend on `poteto-mode` at run time. If a rule here overlaps with pstack, that is intentional. This skill carries the copy it needs.

## Non-negotiables

Start every multi-step task with a todolist whose first item is to read the Principles section below in full. The principles ground the route. In the final reply, name the principles that changed an actual decision.

Remaining triggers:

- Nontrivial change, architecture decision, or "are we sure?" -> use `how`.
- Any code -> name the data shape first.
- Code crossing a function boundary -> use `architect`.
- Contested design -> use `interrogate` before shipping.
- Long, autonomous, or multi-phase work, or work the user reviews after stepping away -> use `show-me-your-work`.
- Large or cross-cutting work with no narrower playbook -> use `figure-it-out`.
- Bug with a cheap local test path -> use `tdd`.
- TypeScript reading or editing -> use `typescript-best-practices`.
- Any prose surface -> use `unslop`.

Use `subagent_type: "poteto-agent"` inside playbook steps when that subagent is available. If it is not available, use the closest available agent and keep this skill's rules in the prompt.

## Principles

Read the leaf skill in full when a principle applies.

**Core**

- `principle-laziness-protocol`. Refactoring, sizing a diff, or tempted to add abstractions. Bias to deletion and the smallest change that solves the problem.
- `principle-foundational-thinking`. Before writing logic, choose core types, data structures, and shared-state ownership.
- `principle-redesign-from-first-principles`. Integrating a new requirement. Treat it as foundational, not bolted on.
- `principle-subtract-before-you-add`. Remove dead weight before adding structure.
- `principle-minimize-reader-load`. Collapse unnecessary layers and shrink hidden state.
- `principle-outcome-oriented-execution`. In planned rewrites, converge on the target architecture instead of preserving throwaway states.
- `principle-experience-first`. Product or UX tradeoffs should favor user value over implementation convenience.
- `principle-exhaust-the-design-space`. Novel UI or architecture decisions need competing prototypes or candidates before commitment.
- `principle-build-the-lever`. Nontrivial work should build the tool, script, codemod, or check that proves it.

**Architecture**

- `principle-boundary-discipline`. Put guards at system boundaries and keep business logic pure.
- `principle-type-system-discipline`. Make illegal states unrepresentable and parse external data at boundaries.
- `principle-make-operations-idempotent`. Commands and loops should converge under retry.
- `principle-migrate-callers-then-delete-legacy-apis`. Migrate callers and delete old APIs in the same wave.
- `principle-separate-before-serializing-shared-state`. Avoid concurrent writers before trying to serialize them.

**Verification**

- `principle-prove-it-works`. Verify against the real artifact.
- `principle-fix-root-causes`. Reproduce and trace symptoms to root cause.
- `principle-sequence-verifiable-units`. Break multi-step work into units that each end in a check.

**Delegation**

- `principle-guard-the-context-window`. Route bulk reading, repeated scans, and fan-out work to subagents.
- `principle-never-block-on-the-human`. Proceed on reversible work and reserve questions for real product or preference decisions.

**Meta**

- `principle-encode-lessons-in-structure`. Turn repeated corrections into checks, metadata, scripts, or skill edits.

## Playbooks

Match the task to one playbook below. Open the referenced file in this skill directory and copy its steps verbatim into the todolist before task-specific todos. A skipped step stays in the list with `skip: <reason>`.

- Investigation: read-only question. `playbooks/investigation.md`.
- Bug fix: reproduce, root-cause, fix, verify. `playbooks/bug-fix.md`.
- Perf issue: measured slowness against a baseline. `playbooks/perf-issue.md`.
- Hillclimb: sustained metric improvement loop. `playbooks/hillclimb.md`.
- Runtime forensics: diagnose live runtime symptom. `playbooks/runtime-forensics.md`.
- Trace forensics: diagnose captured profiling artifact. `playbooks/trace-forensics.md`.
- Feature: new or changed behavior from a named data shape. `playbooks/feature.md`.
- Refactoring: behavior-preserving structural change. `playbooks/refactoring.md`.
- Prototype: throwaway sketch to decide a design or empirical fork. `playbooks/prototype.md`.
- Visual parity: pixel-exact UI equivalence. `playbooks/visual-parity.md`.
- Authoring or modifying a skill: `playbooks/authoring-a-skill.md`.
- Eval: test how a skill, structure, or prompt change affects behavior. `playbooks/eval.md`.
- Autonomous run: long task to completion. `playbooks/autonomous-run.md`.
- Session pickup: resume prior work. `playbooks/session-pickup.md`.
- Pause safely: suspend work so it can resume. `playbooks/pause-safely.md`.
- Multi-phase or multi-PR plan: `playbooks/multi-phase-plan.md`.
- Opening a PR: invoked at the end of other playbooks. `playbooks/opening-a-pr.md`.

Some copied playbooks mention Cursor built-ins or other plugin skills such as `create-skill`, `babysit`, `deslop`, `control-cli`, and `control-ui`. Use them only if the active environment provides them. If not, keep the step's intent, state the missing tool, and continue with the closest local verification or review gate.

## Bam document lane

Bam's addition is a document-and-review lane before long execution. Use it when the work has unclear requirements, architecture risk, data model risk, cross-module scope, or long autonomous execution.

For small tasks, keep the matched playbook and add only a short target, boundary, and proof note when the task could drift.

For medium and large tasks, add explicit artifacts before implementation:

| Scale | Base execution | Bam addition |
|---|---|---|
| Small | Matched playbook, principles, verification | Short target, boundary, proof note when useful |
| Medium | Feature, refactoring, prototype, bug-fix, or investigation playbook | Design artifact, architecture/model section, reviewed plan |
| Large | `figure-it-out`, `show-me-your-work`, multi-phase or autonomous playbook | Requirements or design doc, architecture doc, data model audit when relevant, pstack-style plan, review gates, decision trail |

If the task is small and the matched playbook already constrains it, do not add document weight.

## Local supplemental skills

All dependencies used by this mode must live in `skills/bam-mode`. Do not reference `.agents/skills` at run time.

Use these supplemental skills only for gaps:

| Need | Supplemental skill | Gate added |
|---|---|---|
| Collaborative design before implementation | `brainstorming` | Approved design artifact before tasking |
| Product requirements or spec boundary | `hai-prd` | PRD-specific artifact gate |
| High-level direction judgment | `geju` | Opens the design frame before local patching |
| Landing pressure test | `goudi` | Minimum viable first move and stop rule |
| Razor pass over requirements, fields, states, modules, or steps | `hai-razor` | Deletes fake concepts before tasking |
| APoSD-style architecture review | `hai-architecture` | Evidence-grounded architecture critique artifact |
| Entity and field design | `entity-model-auditor` | Field-by-field store/compute/remove decisions |
| Documentation drift against code | `hai-audit-docs-against-code` | Docs and implementation consistency check |

Do not include `git-workflow-and-versioning`. The copied long-cycle playbooks and `show-me-your-work` cover the needed execution discipline.

If a supplemental skill only adds a report format but no new decision gate, skip it.

## Routing order

1. Classify the work and choose the playbook.
2. Create the todolist from this skill's principles and the copied playbook.
3. Decide whether Bam's document lane applies.
4. Insert only the needed supplemental gate.
5. Review the artifact before implementation or long execution.
6. Return to the playbook and execute in verifiable units.

## Review gates

Review is a phase boundary, not a final polish pass.

- Requirements review checks target, non-goals, acceptance, and unresolved decisions.
- Architecture review checks ownership, dependency direction, data model, and what callers no longer need to know.
- Task review checks that another agent can execute the list without hidden context.
- Code review uses `interrogate`, `blast-radius`, `tdd`, and the matched playbook.
- Long-run review checks `show-me-your-work` evidence and whether the run stayed inside the approved artifacts.

Do not turn every review into a new document. The review should be just heavy enough to prevent the next phase from drifting.

## Output discipline

Write in Chinese when the user works in Chinese.

For medium or large work, hand back:

- The playbook chosen.
- The Bam supplemental gates inserted, if any.
- The produced artifact paths or sections.
- The review status for each gate.
- The next executable step.

Keep replies unslopped. Do not dump every candidate skill. Name the few skills that changed the route.

## Completion bar

A `bam-mode` run is complete only when the matched playbook is satisfied and any Bam-added artifacts passed their review gates. Code alone is not enough when the mode required a requirements, architecture, data model, or tasking artifact.
