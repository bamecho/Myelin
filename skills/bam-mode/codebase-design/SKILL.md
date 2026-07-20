---
name: codebase-design
description: >
  Agree a short, human-approvable code architecture (logical modules, semantic
  interfaces, interactions, and caller knowledge) from a confirmed spec and the
  current codebase before large diffs. Use for "设计架构", "架构图", "代码长什么样",
  "模块怎么交互", "接口怎么设计", or "根据方案写架构". Skip when one owner and
  interaction are already obvious.
---

# Codebase Design

Treat this file as complete runtime guidance. Do not load adjacent deepeners or
evaluation history unless the user explicitly asks for them.

Before a large change, compress the future implementation into the architecture
decisions a human needs to approve: the logical modules, what each owns and
hides, how they interact, and what their interfaces mean. A module is a
responsibility boundary, not necessarily a file. Paths and symbols ground the
current model; they are not the subject of a predicted diff.

This is architecture shape, not a plan, data model, file map, or type scaffold.
Local implementation stays free after responsibilities, interface semantics,
and interaction direction are approved. If one owner and interaction are
already obvious, write `codebase-design skipped: <reason>`.

## How this skill works

1. Read the confirmed direction (spec / Handoff Locked + non-goals), current
   callers, public contracts, and the real code around the boundary.
2. Identify the architecture choice implementation would otherwise make
   silently. Do not narrate the whole repository.
3. Choose the smallest view that exposes that choice. It may be module
   responsibility, runtime interaction, interface semantics, caller knowledge,
   or a combination when one view cannot explain the model.
4. Compare alternatives only when the choice remains open and the models differ
   in interaction or ownership. When revising after a human correction, replace
   the contradicted model instead of defending it. Keep named modules,
   interfaces, and signatures exactly as corrected; show the revised model and
   its direct consequences without alternatives, retroactive rationale, or
   behavior the correction leaves unspecified.
5. Present and stop for approval.

## Judgment

- Ground the current architecture in paths, symbols, exports, and callers you
  opened. A clean greenfield story that ignores the repo is wrong.
- Draw boundaries around owned decisions and hidden complexity, not entities or
  files. Prefer a small interface that hides coherent policy, while keeping
  independent public contracts separate.
- State only the interface semantics relevant to this boundary: caller
  assumptions, ownership of validation and ordering, failure, state, and timing.
  Derive them from caller-visible language behavior and current contracts, not
  from statement order inside an implementation; omit facts you cannot verify.
- Choose at most one primary dependency, sequence, or state sketch. Add another
  only when it resolves a different architecture ambiguity.
- Preserve CLI names, package exports, CI entrypoints, and other public contracts
  unless Handoff changes them. When flows share a decision but perform different
  effects, expose the decision as data from a pure policy interface. Adding
  modes or output callbacks to an executor keeps shell behavior in the core and
  hides the boundary the human needs to review.
- Expose the decision a human could reject. Leave helper names, file placement,
  and function bodies to implementation. Open only architecture blockers.

## When to run / skip

- **Run** - module ownership, interaction, interface semantics, public contract,
  or caller knowledge is non-obvious before a large change.
- **Skip** - Handoff `codebase-design: yes`, or one owner and interaction are
  already obvious.
- **Stop** - a missing product decision would change the architecture model.
  Name it and wait rather than inventing behavior.

## Deliverable

One short file (`NN-slug.design.md` or the path the user gives). There is no
mandatory outline. Start with the chosen architecture model in one sentence,
then use only the evidence needed to make that model reviewable:

- Use a responsibility view when ownership or hidden knowledge is the choice.
- Use an interaction view when control, data, errors, timing, or lifecycle is
  the choice.
- Use interface contracts when caller assumptions are the choice. Write
  declaration signatures without `{}` bodies.
- State caller knowledge only when it reveals what the abstraction removes.
- For an initial design, end with the reason for the choice and only genuine
  alternatives or blockers. After a correction, stop with the revised model and
  its effects because the user has already closed the choice.

Do not repeat the same fact in a diagram, table, interface section, and prose.
Stop when the human can point to the chosen responsibility, interaction, or
interface and say why it is wrong. If the artifact only proves that the model
read the files, it has failed.

## Failure modes

- File inventory, predicted diff, task list, or rollout plan
- Interface signatures with no semantics, or bodies that pre-implement them
- Diagrams or alternatives added only to fill a template
- Skipping callers and public exports, or running for an obvious one-owner change

## Relationships

Consume approved data locks from `entity-model-design`. `architect` may add exact
types after this model is approved. Plan orders work without reopening it;
`show-me-your-work` owns implementation progress and diff evidence.
