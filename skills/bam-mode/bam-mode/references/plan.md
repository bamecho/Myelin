# Plan

A plan is an execution deliverable for the approved current slice, derived from
upstream decisions. It is optional when the user asks for implementation, but
required when the user explicitly asks for a plan. It orders and verifies the
slice currently being handed to implementation; later product outcomes remain
outside its scope.

Read the actual spec and approved codebase-design artifacts before drafting.
Treat their product decisions, module ownership, interfaces, non-goals, and
acceptance criteria as fixed. The plan adds only information that helps
execution: ordering, dependencies, ownership, verification, and stop conditions.
It does not redesign the product or restate the upstream documents.

## 1. Decide whether a plan is the deliverable

- If the user explicitly asks for a plan, produce one. Use `note` for
  single-agent, single-slice work and `full` when coordination or staged state
  matters.
- If the user asks for implementation, use `none` when the spec is locked, the
  entity decision is skipped or approved, the design is taskable, and the work
  is single-agent and single-slice.
- Use `note` when a short written execution/verification contract adds useful
  information that is absent upstream.
- Use `full` for multi-phase or multi-agent work, migrations with meaningful
  intermediate states, or autonomous work whose stop rules carry real risk.

A change that touches several modules does not by itself need a `full` plan. If
one agent can land and verify it atomically, it is still one slice.

Evidence from E-plan-leverage (2026-07-16): on one locked, single-agent,
single-slice feature, `none`, a short note, and an expanded plan all scored
12/12. The expanded plan took about 40 seconds longer and added code/tests
without changing architecture or correctness. This supports the thin default
for that task class, not a universal ban on planning detail.

## 2. Consume the current slice

Read the current slice approved in the spec. Leave later product outcomes
unplanned. Give the current slice a stable identity when the plan or ticket tree
needs to reference it across sections:

```md
Slice: `S1` <name>
Outcome: <observable value>
```

For a `full` plan, each independently mergeable execution unit gets a stable
`slice-<slug>` key with `Goal`, `Depends on`, `Verify`, and `Stop if`. A unit
that cannot land or verify independently is not a separate slice; keep it in
the same unit.

## 3. Choose the location

Use the user's path when supplied. Otherwise return a `note` in chat or follow
an established repository plan convention. A `full` plan may use a directory
when separate phase files make ownership or verification clearer.

## 4. Write only the execution delta

A useful `note` usually contains:

```md
# <title>

Sources: <spec path>; <approved design path>

Slice: `S1` <name>

## Goal
<The observable final state.>

## Execution
<The change or short ordered sequence not already obvious from the sources.>

## Verify
- <Command or real-artifact check.>

## Stop if
- <Condition that requires a product/design decision or plan revision.>
```

A `full` plan keeps the same source authority, goal, verification, and stop
rules, then expresses only the coordination the `note` cannot carry: independent
owners, dependencies between their outputs, intentional intermediate states, or
phase-specific acceptance. Choose the representation that makes those relations
easy to review; use ASCII when a dependency or sequence diagram is needed. Do
not fill a fixed task template.

Omit anything that does not change execution. Reference upstream tables and
rationale by path instead of copying them.

Before handoff, remove every sentence that restates a source. If the approved
spec and design already contain the whole implementation path, the Execution
section may simply say: "Implement the approved design as one atomic slice."

Then audit every dependency, removal, new artifact, and stop rule against its source.
Preserve the source's owner graph and non-goals exactly. If a claim is
not supported upstream, delete it or keep it Open; do not fill gaps with a
plausible implementation convention.

For single-agent, single-slice work, do not expand slices into implementation
microsteps or path-by-path instructions by default; the measured fixture found
no benefit. For `full`, include the detail needed to coordinate owners, preserve
an intermediate state, or make a stop decision. Leave local implementation
choices to the executor when the spec and design do not constrain them.

## 5. Preserve upstream authority

- Do not invent product tokens such as fields, CLI flags, regexes, ordering, or
  warning codes. Missing locked-class decisions stay Open in the Handoff contract.
- Do not change module ownership or interfaces in the plan. Return to
  codebase-design if the execution sequence exposes a design problem.
- Acceptance states an observable result. Verify names the check that proves it.
- Do not execute while drafting the requested plan.

## 6. Prepare ticket mapping when requested

Use a hybrid parent/child mapping:

- Create or reuse one **outcome** ticket for the approved product outcome.
  Documents are Sources on that ticket, never sibling spec/entity/design/plan
  tickets.
- Create one child ticket per independently mergeable execution slice, using its
  stable key and its own Verify/Stop. Children share the outcome context and
  stage order.
- Keep a single outcome ticket when the work is atomic or the supposed slices
  cannot land independently. Do not aggregate genuinely independent slices into
  one giant implementation ticket, and do not create tickets for microsteps.

Emit this mapping only when the user asks for tickets or a `ticket-tree`
handoff. The plan does not write to the tracker. Apply the tree only after its
draft is approved.

## 7. Handoff

Do not add `draft` / `ready` status ceremony or a mandatory separate reviewer.
Existing reviewer tests repeatedly missed source contradictions. `full` remains
useful for expressing coordination, but multi-agent and migration execution are
not yet evidence-backed enough to treat review status as a safety signal.

Hand back the plan or path, its thickness, unresolved decisions, and the next
executable step.

Run `scripts/validate-bam-mode.sh` after editing this contract.
