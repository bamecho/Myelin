---
name: entity-model-design
description: >
  Design which facts exist and how they are stored (store / compute / remove)
  from a confirmed spec before module shape or code. Use for "实体模型",
  "字段该不该存", "数据模型", "store or compute". Skip when no field decisions.
---

# Entity Model Design

Before modules and implementation, agree **which business facts exist**, whether
each is **stored, computed, removed, or already owned elsewhere**, and which
non-field rules (relationship, uniqueness, lifecycle) the data must obey.

Existing code is migration and naming evidence. It does **not** define the
target model. This skill is not a schema dump, not a PRD-vs-DB audit table
(`entity-model-auditor`), and not a module map (`codebase-design`).

If nothing in the change needs a field or store/compute decision, skip — write
`entity-model-design skipped: <reason>`.

## How this skill works

1. Read the confirmed spec / handoff (Locked + real Open gaps) and any current
   schema or models you were given.
2. Propose the smallest model that still carries product behavior: entities,
   field lines with store/compute stance, and only the rules that field lines
   cannot express.
3. Present and stop for approval. Do not hand off to `codebase-design` on a
   spoken “看起来行” — only on an explicit accept of the shown model.

## Judgment (data, not another skill’s outline)

- **Spec sets the target; code constrains cost.** Lift real column/type names
  when they already exist. Do not copy a legacy table and call it design.
- **Every business field must answer:** what breaks without it; store | compute
  | remove | rely on; who writes it or how it is derived.
- **One mutable source of truth per fact.** Dual writers are a model break.
- **Compute when reconstruction is honest.** Store history, accepted inputs, and
  facts needed for query, uniqueness, or branching that cannot be rebuilt.
- **Show the cast first.** Overview is a **compact tree of entity → fields**
  (names only, or name + store/compute tag). Full “why / from” lines come in
  Entities below. Skip overview tables that hide fields behind one-liners.
- **Open only real product/data choices.** One or two lines with impact + your
  default. Do not invent an Open grid for symmetry, and do not invent Locked
  names to look complete.
- **Language of the model doc:** Chinese-primary prose when the human works in
  Chinese; keep **section labels, entity/field names, and stances in English**
  (`Entities`, `store`, `shortId`). Skill body stays English.

## When to run / skip

- **Run** — new/changed entities, business fields, store-vs-compute, lifecycle,
  uniqueness, or migration that locks data shape.
- **Skip** — Handoff `entity-model: yes`, or no field/store decision in play.
- **Stop** — a locked-class product choice is missing and no honest default
  exists; name it under Open and wait.

Do not add module ownership, public interfaces, adapters, or plan thickness.

## Deliverable

One short document (path the user gives, or a clear title in chat).

**No mandatory outline.** Use whatever makes the data agreement obvious. A
useful default:

```md
# Entity model: <主题>

## Overview
```text
Foo (new)
  fieldA          store
  fieldB          compute
Bar (keep)
  id              rely on
  shortId copy    remove   # do not add

A 1 ── 0..1 Foo
```

## Entities

### `Foo`
- `fieldA` — **store**; why; from …
- `fieldB` — **compute**; why; from …

## Rules
- only what field lines cannot carry (relationship, uniqueness, lifecycle, …)

## Open
（仅阻塞时；一两句：选择 / 影响 / 默认）
```

**Overview** = every entity with its field names (and stance tag if useful) so
the whole model is scannable in one block. **Entities** expands necessity and
source — do not repeat a long essay in both places.

Field lines stay short. Omit routine `id`/timestamps unless meaning or migration
matters. Do not invent DB types or indexes unless the spec or existing schema
makes them a model decision. Prefer `remove` for anti-patterns (e.g. a second
copy of the same public id).

Worth flagging when they change the model: dual SSOT; stored values that drift
from their derivation; missing history for audit/terminal state; queries the
model cannot answer; uniqueness without durable constraint; delete/migrate that
drops required facts.

Stop when the human can accept or reject each field and rule without re-deriving
the product.

After approval: put approved field names and store/compute into Handoff Locked
so `codebase-design` does not redesign data.

## Failure modes

- Cloning think / codebase-design section sets (Outcome Contract, Diagram,
  Modules, revision machinery) into a data model note
- Legacy schema as “target” with no necessity reasoning
- Field inflation for implementation convenience
- Wide audit tables, or an Overview that only lists entity one-liners with no
  fields (hides the model at a glance)
- Module maps, task lists, or type scaffolds posing as the model
- Silent invention of Locked field names
- Running this skill when no field decision exists (should Skip)

## Relationships

After confirmed spec / handoff; before `codebase-design` when data is unclear.
Does not replace a short Goal (target / boundary / proof).
