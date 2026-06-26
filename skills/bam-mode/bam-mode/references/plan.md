# Plan

Produce a reviewed implementation plan grounded in the **Principles** section of `bam-mode`. The
plan is the deliverable. Do not implement.

This reference replaces a separate goal-document workflow for bam-mode. A good plan first stabilizes
intent, boundaries, architecture and data-model assumptions, then turns that understanding into
executable tasks with open questions separated out. When the plan is approved, write it to the plan
location the user requested and stop.

Open a todolist with one item per step below.

## 0. Triage

Skip the plan when the change is one or two files with an obvious approach. Say so and stop.

Plan when the change spans three or more files, introduces architecture, has competing approaches or
unclear scope, needs data-model or API design, or the user asks for a plan, task split, kickoff, or
long-cycle agent run.

If the request contains multiple independent targets, split it into separate planning kickoffs before
writing tasks.

## 1. Re-read principles

Read the **Principles** section of `bam-mode` end to end, and read the leaf `principle-*` skills it
indexes when they apply. The principles govern every plan decision. Name the principles that changed
the route.

## 2. Intent frame

Present this section first and wait for user confirmation before moving on.

Clarify:

- The final state the user wants.
- The artifact that should exist when planning is complete.
- Explicit non-goals and adjacent work to avoid.
- Whether this request is too large and should split into multiple kickoffs.

Ask only for genuinely ambiguous intent. Give concrete options when asking. Do not use questions to
avoid grounding work that the codebase can answer.

## 3. Grounding

After the intent frame is confirmed, read the needed code, docs, tests, and current diff. Produce
grounding notes that another executor can use without rediscovering context.

Separate:

- **Observed facts**: what the code, docs, tests, or diff directly show.
- **Assumptions**: what is inferred but not directly proven.
- **Relevant files**: files and modules likely to change.
- **Terminology**: names and concepts the codebase already uses.
- **Ambiguity**: decisions that are still not closed.

Use subagents for broad codebase exploration when the task is large or unfamiliar, following
`principle-guard-the-context-window`. Prefer `subagent_type: "poteto-agent"` when available; otherwise
use the closest available agent and include bam-mode rules in the prompt. Explorer output should be
file pointers, conventions, dependencies, test infrastructure, and entry points, not inlined dumps.

Wait for user confirmation before moving on.

## 4. Slicing strategy

Present the slicing strategy before listing tasks, then wait for user confirmation.

Explain:

- Why this slice boundary is the right one.
- How each slice creates end-to-end, verifiable value.
- Which tempting horizontal slices are rejected, and why.
- Which unresolved choices must be exposed as open decisions before they can become tasks.

Prefer small vertical phases that each end in a reviewable state. A phase should usually touch two
to three files. Split if a phase has more than five test cases, more than three functions, or more
than one unresolved decision boundary.

Order phases so shared types, schemas, and system boundaries land before callers. For changes
touching existing design, apply `principle-redesign-from-first-principles`: ask what the system would
look like if the new requirement had existed from day one, then deliver that target incrementally.

## 5. Draft plan artifacts in small groups

Draft the same artifacts that will be written to disk. Do not present a temporary task list that has
to be translated later.

Start with the `overview.md` sections. Present one or two sections at a time, then wait for user
confirmation before continuing:

- **Context**: problem, current state, why now, and grounding evidence.
- **Scope**: included work, explicitly excluded work, and intentionally deferred work.
- **Constraints**: technical, platform, dependency, compatibility, convention, and verification
  constraints.
- **Alternatives**: two or three approaches when the design space is not forced, plus choice and
  rationale.
- **Phases**: ordered phase list with the value and proof point for each phase.
- **Global open decisions**: unresolved questions, recommendation, and blocked phases.
- **Verification**: project-level checks and the real surface that must be exercised.
- **Implementation guidance**: bam-mode non-negotiables and skills the executor must invoke.

Then draft the phase files. Present only one phase file, or one to two tasks within a phase file, at
a time. Wait for user confirmation before showing the next group.

Write for engineers. The plan should read like a clear implementation narrative, not a database
record.

Each phase file should explain:

- **Goal**: what this phase accomplishes.
- **Changes**: files, modules, contracts, or artifacts affected, and the change at a high level.
  Explain what and why, not implementation code.
- **Data structures**: key types, schemas, entities, state, or contracts the phase introduces or
  changes.
- **Tasks**: concrete tasks under the phase.
- **Open decisions**: unresolved questions, options, recommendation, and what they block.
- **Verification**: static, runtime, and review checks for the phase.
- **Stop conditions**: when the executor must pause, ask, or revise the plan.

Keep pstack's field names in the persisted plan (`Context`, `Scope`, `Constraints`,
`Alternatives`, `Phases`, `Verification`, `Implementation guidance`, `Goal`, `Changes`, `Data
structures`). Bam-specific additions such as `Open decisions` and `Stop conditions` extend those
fields; they do not replace them.

Do not make `Scope`, `Context`, or `Out of scope` dumping grounds. Write boundaries into the
narrative. File paths are anchors and evidence; they do not replace an explanation of the work.

## 6. Open decisions and todo shape

Do not encode human review as a task type. This workflow already forces user review section by
section, so unresolved choices should be visible as open decisions, not hidden behind labels on
tasks.

Tasks are executable work. Open decisions are questions that must be answered before some work can
start. Keep them separate.

### Todo shape

```md
### T001. Short task title

- Status: pending
- Blocked by: none

Narrative:
In `<file/module>`, change `<specific behavior or artifact>` so that `<target state>` becomes true.
This task includes `<included work>` and deliberately excludes `<adjacent work>`.

Acceptance:
- Mechanically checkable outcome.
- Mechanically checkable outcome.

Verification:
- `command or concrete check`

Execution notes:
- Leave empty during task design. Fill during execution.

Review:
- Leave empty during task design. Fill after verification.
```

If a todo depends on an unresolved decision, use `Blocked by: OD001` and define that decision in the
same phase or in the overview.

### Open decision shape

```md
### OD001. Short decision title

Question:
State the unresolved decision.

Options:
- Option A with tradeoff.
- Option B with tradeoff.

Recommendation:
Recommend an option when the grounding supports it, and explain why.

Blocks:
- T00X or phase name.

Resolution:
- Leave empty during planning. Fill when the user decides.
```

## 7. Verification per phase

Every phase needs proof. Use the real artifact, not a proxy.

Include:

- **Static checks**: type check, lint, unit tests, schema validation, or docs checks that apply.
- **Runtime checks**: drive the touched surface when possible. Browser/Electron/Web UIs need UI
  verification; CLIs and TUIs need command-level verification; APIs need request/response checks.
- **Review checks**: architecture, data model, docs-vs-code, `interrogate`, or `blast-radius` when
  the phase changes shared behavior or contracts.

For bug fixes, the loop is reproduce on the real surface, fix, verify on the same surface. Unit
tests show a branch behaves a certain way; they do not prove the user-facing bug is gone.

If no local verification path exists, say so in the plan and make that a risk or open decision
instead of pretending a weak check is enough.

## 8. Full breakdown review

After the overview sections and phase files have been confirmed in small groups, present the full
plan for final review.

For the overview, show:

- Context in one sentence.
- Scope summary.
- Constraints summary.
- Chosen alternative.
- Phase list.
- Project-level verification.

For each task, show only:

- Id and title.
- Status.
- Blocked by.

Then list open decisions separately with id, question, recommendation, and blocked tasks or phases.

Ask the user to check:

- Is the granularity too coarse or too fine?
- Are dependencies correct?
- Are the overview fields complete enough for an executor to understand the plan without
  reconstructing context?
- Should any tasks be merged or split?
- Are open decisions explicit enough, and are the blocked tasks correct?
- Is there scope creep or a missing requirement?
- Does the narrative read clearly enough for an engineer to execute without reconstructing the
  design from scattered fields?

Wait for confirmation before writing the file.

## 9. Write the plan

The user specifies where the plan lives. If they did not specify a path, propose one and wait for
approval before writing.

Use pstack-style plan artifacts:

```text
NN-slug.md
```

for small plans, and a directory when the plan has three or more phases:

```text
NN-slug/
├── overview.md
├── phase-1-scaffold.md
├── phase-2-...md
└── testing.md
```

Use `tasks/todo.md` only when the user explicitly asks for a todo queue. Do not make it the default
for medium or large work.

### Overview file

The overview should include:

- **Context**: problem, current state, why now, and grounding evidence.
- **Scope**: included work, explicitly excluded work, and intentionally deferred work.
- **Constraints**: technical, platform, dependency, compatibility, convention, architecture, and
  data-model constraints.
- **Alternatives**: two or three approaches when the design space is not forced, plus choice and
  rationale.
- **Applicable skills**: skills the executor should invoke, by name.
- **Phases**: ordered standard Markdown links to phase files, with each phase's value and proof
  point.
- **Global open decisions**: unresolved questions, recommendation, and blocked phases.
- **Verification**: project-level checks and real surfaces to exercise.
- **Implementation guidance**: bam-mode non-negotiables that matter for this plan.
- **Stop conditions**: when execution must pause or the plan must be revised.

### Phase files

Each phase file should include:

- Back-link to `overview.md`.
- **Goal**: what the phase accomplishes.
- **Changes**: files, modules, contracts, or artifacts affected, and the change at a high level.
  Explain what and why, not implementation code.
- **Data structures**: key types, schemas, entities, state, or contracts the phase introduces or
  changes.
- **Scope notes**: phase-specific non-scope or deferred work, only when not obvious from the
  overview.
- **Open decisions**: unresolved questions that block this phase.
- **Tasks**: concrete executable tasks.
- **Verification**: static, runtime, and review checks.
- **Stop conditions**: when the executor must pause or revise the plan.

For every todo, include id, initial status `pending`, blocked by, narrative, acceptance,
verification, and empty `Execution notes` and `Review` sections. Keep todo ids stable across phase
files.

After writing the file, stop. Do not execute the tasks. Do not mark any task `in_progress`. Do not
run implementation-stage verification commands.

Hand back the plan path, phase list, unresolved open decisions, and the exact user phrase required
to start execution, for example: `start execution from <plan path>` or `execute phase 1`.

## 10. Hand back when not persisting

If the user asked for a plan but did not want it written to disk, summarize the phases, scope
boundaries, applicable skills, unresolved open decisions, and verification. Stop. The user decides
when implementation starts.
