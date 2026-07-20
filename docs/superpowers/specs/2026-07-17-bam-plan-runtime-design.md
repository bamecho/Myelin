# Bam plan runtime redesign

## Goal

Keep `bam-mode` planning driven by the actual spec and codebase-design artifacts
without scripting the model's implementation reasoning. Preserve only controls
that have measured value.

## Decision

- An implementation request may use plan thickness `none` when a locked spec and
  taskable design already exist.
- An explicit request for a plan always produces a plan deliverable. Use `note`
  for a single-agent, single-slice plan and `full` for coordination, migration,
  or stop-rule work.
- A plan adds ordering, ownership, verification, and stop conditions. It does not
  repeat product decisions or architecture already owned upstream.
- The handoff contract remains because an existing ambiguous-task test reduced
  settled product-rule drift from at least four cases to zero.
- Full-plan review was removed after repeated migration-fixture reviews missed
  source contradictions and focused on status/template ceremony.
- Failure taxonomy, eval cases, and experiment history are maintenance assets,
  not runtime instructions. Keep them under `evals/` and load them only while
  changing the skill.

## Context budget

The explicit full-plan route currently loads about 2,650 words of Bam runtime
instruction before the task's spec and design: the main skill, the short
multi-phase playbook, the handoff contract, and the plan contract. This is a
real cost, but document size alone is not evidence that a deletion is safe.

A resumed-session noise test compared the current route with a plan-only route
and a pointer-only handoff. The current route preserved all tested source
decisions in two runs. The plan-only route omitted required telemetry data in
both runs. The pointer handoff produced no net output reduction and either
invented implementation details or skipped the plan contract read.

Keep the expanded handoff for now. Do not add a summarizer, another reviewer, or
more runtime warnings. Future context reductions must improve total loaded
runtime plus generated output while preserving source fidelity in this fixture
and downstream implementation behavior.

A follow-up main-router subtraction tried 59%, 26%, 3%, and plan-history-only
reductions. Each plan candidate introduced a repeatable or high-severity source
fidelity failure even when it improved output length. None was promoted. The
current main skill remains large, but the measured alternative is worse than
the known context cost.

## Alternatives rejected

- Keep the current documents unchanged: explicit plan requests can incorrectly
  route to `none`, and stale audit cases conflict with the current thickness model.
- Delete the plan and review roles: existing tests cover only single-agent,
  single-slice execution, so this would exceed the evidence.

## Verification

1. Static validation protects the routing contract and rejects runtime
   `failure-audit` references.
2. Existing blind implementation fixtures remain green for no-plan, note, and
   complex-plan packages.
3. A small model A/B checks explicit plan delivery, upstream fidelity, useful
   execution information, and unnecessary prescription.
4. A stale-context run checks that historical notes do not override approved
   source decisions and records the runtime files actually read.
