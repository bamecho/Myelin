---
name: bam-mode
description: "Bam's self-contained engineering mode. Use only when the user invokes bam-mode, /bam-mode, or asks to work in Bam's style."
disable-model-invocation: true
---

# Bam mode

`bam-mode` is a self-contained pstack-style mode with Bam's document-and-review lane added. Do not depend on `poteto-mode` at run time. If a rule here overlaps with pstack, that is intentional. This skill carries the copy it needs.

## Routing contract

Start every multi-step task with a todolist whose first item selects one owning
playbook and copies its steps. The owning playbook controls the complete flow,
including any specialist skills, principles, artifacts, and later playbook
handoffs. Do not assemble a second workflow in this file.

Route by the user's requested outcome and current state:

- A rough idea, product/technical judgment, design request, or plan request ->
  **Design**. It owns `think` -> `entity-model-design` -> `codebase-design` -> plan.
- An implementation request -> **Feature**. Feature composes Design first when
  the input is not taskable, then implements the approved handoff.
- A read-only explanation or historical question -> **Investigation**.
- A bug, performance problem, refactor, prototype, visual parity task, or other
  specialized execution shape -> its narrow playbook below.
- "Keep doing X until Y" keeps the narrow playbook for X as owner and composes
  Autonomous run only for its loop contract. Autonomous owns the task only when
  no narrower playbook defines the work being repeated.
- A large cross-cutting run uses **figure-it-out** only when no narrower
  playbook owns the work.

The narrowest playbook that owns the requested endpoint wins. Select one owner;
playbook composition happens inside that owner, never as a top-level skill list.

When the owning playbook is selected, tell the user which one it is (and any
playbook it later composes). One line is enough. Do not dump unselected
candidates.

When a step names another skill, say Load skill X or Use skill X and open that
skill's SKILL.md. Soft paraphrase of the skill's intent is not a substitute.

## Playbooks

Match the task to one playbook below. Open the referenced file in this skill directory and copy its steps verbatim into the todolist before task-specific todos. A skipped step stays in the list with `skip: <reason>`.

- Investigation: read-only question. `playbooks/investigation.md`.
- Design: rough direction through approved entity/codebase decisions and an
  optional execution plan. `playbooks/design.md`.
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
- Opening a PR: invoked at the end of other playbooks. `playbooks/opening-a-pr.md`.

## Principle gaps

Do not run a global skill or principle router. Selection belongs in the owning
playbook step that needs it.

If a task clearly needs a principle skill that the selected playbook did not
name, apply it for the current task only when it changes correctness,
verification, or safety. Patch the owning playbook or add a regression case to
`evals/plan-behavior.md`; do not add a global router here.

## Composition

Design is the single pre-implementation flow. It owns the Handoff contract,
conditional entity and codebase stages, and plan thickness. Feature consumes
that handoff and owns implementation. Other playbooks may call Design when they
discover a real design decision, but they do not duplicate its stages.

Agent handoff is a non-owning composition contract at
`playbooks/agent-handoff.md`. Owning playbooks use it only at real context,
judgment, or writable-state boundaries. Agent roles are host adapters for a
bounded job, not another routing layer. A host may provide isolated agents,
fresh contexts, sequential passes, or no delegation; the owning playbook and
evidence bar stay the same.

Within that composition, Scouts gather bounded read-only evidence, Specialists
produce one design or synthesis artifact, Workers implement as single writers,
and Reviewers judge independently. These responsibilities constrain authority,
not the model's reasoning method.

Opening a PR is the terminal composition step for code-changing playbooks.
Investigation and design-only endpoints stop with their requested artifact.

## Maintenance

Before changing routing or a playbook in response to drift, reproduce the
behavior with `playbooks/eval.md` and add the regression to
`evals/plan-behavior.md`. Prefer deletion or a deterministic check over more
runtime prose. Run `scripts/validate-bam-mode.sh` after editing this skill.

## Output discipline

Write in Chinese when the user works in Chinese.

For medium or large work, hand back:

- The owning playbook and any playbook it composed.
- The produced artifact paths or sections.
- Remaining Open decisions.
- The next executable step.

Keep replies unslopped. Do not dump candidate skills or internal routing
mechanics that did not change the outcome.

## Completion bar

A `bam-mode` run is complete only when the owning playbook and every playbook it
composed reached their endpoint. Feature is incomplete when Design left a
required product, entity, ownership, or execution decision Open.
