---
name: entity-model-design
description: >
  Define the incremental entity and field changes required by an approved spec,
  including store/compute/remove choices, constraints, and an ASCII relationship
  graph.
  Use for entity models, data models, field decisions, lifecycle, uniqueness, or
  migration meaning. Skip when the current slice changes no business facts.
---

# Entity Model Design

Agree which business facts change before module or interface design. Treat the
approved spec as target authority and the current schema as naming and migration
evidence.

## Contract

- **Outcome:** every added, modified, or removed entity fact in the current
  slice can be approved without reading unchanged schema.
- **Done when:** each changed field has a domain type, stance, any necessary
  constraint, and one writer or derivation; affected relationships are visible.
- **Output:** one short, diff-focused model with an ASCII relationship graph.

If the current slice has no field, relationship, lifecycle, uniqueness, or
store/compute decision, write `entity-model-design skipped: <reason>`.

## Workflow

1. Read the approved spec/Handoff and the current entities or schema touched by
   the slice.
2. List only entity changes: **add**, **modify**, or **remove**. Mention an
   unchanged entity only as relationship context in the graph.
3. For every changed field, choose `store`, `compute`, `remove`, or `rely on`.
   Name its domain type, necessary constraint, and writer or derivation.
4. Draw the affected relationship topology in a fenced `text` block. Include
   cardinality and relationship names; show a standalone changed entity when no
   relationship exists.
5. Record only invariants that field lines and cardinality cannot express.
   Present and stop for explicit approval.

## Judgment

- Keep one mutable source of truth per fact. A second writer is a model defect.
- Compute when reconstruction is honest. Store accepted input, history, and
  facts required for branching, uniqueness, audit, or queries that cannot be
  rebuilt.
- Use domain types such as `EmailAddress`, `Money`, or `Instant`; use physical DB
  types and indexes only when they change the model or migration contract.
- Keep missing product choices Open until product authority settles them.
- Keep section labels, entity names, field names, and stances in English even
  when the surrounding explanation is Chinese.

## Output Contract

List added, modified, and removed entities or fields. For each changed field,
show Entity, Field, domain Type, Stance, necessary Constraint, and Writer or
Derivation. Follow with one ASCII topology in a fenced `text` block using clear
relationship names and `1`, `0..1`, `1..*`, or `0..*` cardinalities. Add only
invariants and Open choices that the rows and graph cannot express.

Routine IDs, timestamps, physical DB types, and indexes appear only when their
meaning or migration contract changes. Unchanged entities may appear as graph
context; attribute rows remain diff-focused.

After approval, copy approved names, types, stances, cardinality, and invariants
into Handoff Locked so `codebase-design` consumes rather than redesigns them.
