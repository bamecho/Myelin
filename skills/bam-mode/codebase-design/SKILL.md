---
name: codebase-design
description: >
  Design or audit codebase shape through minimal module boundaries and exact
  typed interface contracts. Use Definition mode before implementation when
  ownership or interfaces change; use Audit mode to review a repository for
  over-abstraction, coupling, leaky boundaries, or stale design. Skip Definition
  when one owner and interaction are already obvious.
---

# Codebase Design

Use code-shaped contracts as the architecture spec. Optimize for a one-minute
human review: exact interfaces first, then only the notes needed to understand
state, failure, and effects. Function bodies and execution steps remain outside
this skill.

Select one mode from the request:

- **Definition Mode** is the default for an approved current slice.
- **Audit Mode** applies when the user asks to review, simplify, or improve the
  current repository architecture.

## Shared Grounding

Read the approved spec/Handoff, approved entity diff when present, and the real
exports, callers, tests, and dependency boundaries in scope. Preserve public
contracts unless Handoff explicitly changes them. Use the repository's language
and declaration idioms; do not default to TypeScript. Draw any module,
dependency, sequence, or state view as compact ASCII in a fenced `text` block.

## Definition Mode

### Contract

- **Outcome:** the smallest module shape and exact interface surface that can
  contain implementation errors inside one boundary.
- **Done when:** ownership, allowed dependencies, caller-facing types, failures,
  and effects are visible without function bodies.
- **Output:** declaration-only contracts with adjacent 2-3 line Tech Notes.

### Workflow

1. Identify the decisions implementation would otherwise make silently:
   ownership, dependency direction, public surface, and caller knowledge.
2. Draw the fewest logical modules that hide coherent policy. A module is a
   responsibility boundary, not necessarily a file or entity.
3. Write exact, repository-native type and interface declarations. Prefer
   compile-checkable declarations when the language supports them; otherwise use
   its conventional signature/protocol notation. Declarations end at the typed
   surface; implementation owns executable bodies.
4. Place a **Tech Note** beside each contract only when needed. Limit it to 2-3
   short lines covering state-machine constraints, side effects, transactions,
   concurrency, external calls, or error semantics.
5. Trace each current caller to one contract and name what it no longer needs to
   know. Present and stop for approval.

When one owner, dependency direction, and interaction are already obvious,
write `codebase-design skipped: <reason>`.

### Output Contract

Lead with a compact ASCII module/dependency shape. Follow with the exact
repository-native declarations and adjacent Tech Notes for non-obvious state,
effects, failure, transaction, concurrency, or external-call semantics. End
with caller knowledge removed by the boundary and real architecture blockers.
State each fact once at the surface that owns it.

## Audit Mode

### Contract

- **Outcome:** a repository-wide or explicitly scoped diagnosis of boundaries
  that create unnecessary review and change cost.
- **Done when:** each material finding cites code evidence, explains the current
  coupling, and shows the smaller target contract or deletion.
- **Output:** ordered findings and a compact target boundary map. Plan owns any
  later rollout sequence.

### Workflow

1. Scan the full repository unless the user names a narrower scope. Map public
   exports, dependency direction, shared mutable state, adapters, and callers.
2. Find over-abstraction, pass-through layers, duplicated policy, leaky provider
   types, cyclic ownership, oversized interfaces, dual writers, and legacy APIs
   with no live caller.
3. Rank only material findings by review/change cost and blast radius. Cite paths
   and symbols, not impressions.
4. For each finding, show the target as an exact contract diff: add, change,
   split, merge, or delete. Add a 2-3 line Tech Note only for hidden state,
   effects, failure, transaction, or concurrency semantics.
5. End with the resulting module/dependency shape. Leave migration ordering and
   tickets to plan.

### Output Contract

For each material finding, give severity, path/symbol evidence, review or change
cost, target action, and the exact smaller contract or deletion. Use Tech Notes
only for semantics the contract cannot express. End with the target ASCII
dependency shape. The audit is complete when every finding has live repository
evidence and an approvable target surface.

## Relationships

Consume approved data locks from `entity-model-design`. Plan orders approved
contracts without redesigning them; `show-me-your-work` owns implementation and
diff evidence.
