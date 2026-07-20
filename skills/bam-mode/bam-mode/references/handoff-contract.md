# Handoff contract

The Design playbook's single control surface across `think`,
`entity-model-design`, `codebase-design`, and plan. Feature consumes it rather
than reconstructing upstream decisions. Downstream stages refine unlocked items
only; they do not silently invent locked-class product decisions.

## When required

Emit or refresh this contract whenever work will hand off to another skill,
another agent, or implementation. Skip only for pure investigation with no
design or implementation handoff.

## Shape

Keep it short. Prefer bullets over prose. Target ≤40 lines.

Keep execution topology out of this decision contract. When an agent or context
changes, `playbooks/agent-handoff.md` creates a short Agent job that references
this Handoff; it does not copy or replace it.

```md
## Handoff contract

### Locked decisions
- <field names, CLI flags, warning codes, store/compute/remove, token/regex/order
  rules, non-goals, ownership already decided by user or approved upstream>

### Open decisions
- <only real blockers: Impact; Default if any; Owner: user | implementer | later>

### Skip
- entity-model: `yes` | `no` — <one-line reason>
- codebase-design: `yes` | `no` — <one-line reason>
- plan thickness: `none` | `note` | `full` — <one-line reason from `plan.md`>
```

## Locked-class items

These may appear under **Locked** or **Open**. They must not appear as settled
facts in entity, design, or plan unless already Locked or explicitly Open with a
default awaiting approval:

- field / CLI / config / event / warning-code names
- store vs compute vs remove vs rely-on
- token, regex, ordering, dedupe, or snapshot rules
- cardinality, lifecycle, uniqueness, retention, migration that changes meaning
- non-goals that remove a product path

Module ownership and seams belong to codebase-design after product locks exist.
Task order is not a product token. `plan.md` decides whether planning is an
optional implementation aid or the requested deliverable.

## Consume rules

| Stage | May do | Must not do |
|---|---|---|
| Design / `think` | Lock decided tokens; list Open blockers; set Skip | Fill locked-class gaps silently |
| `entity-model-design` | Model only Locked data decisions; gaps stay Open | Invent fields, regex, order, extra entities |
| `codebase-design` | Place Locked behavior behind owners/interfaces | Reopen product tokens; invent product fields |
| plan | Add ordering, ownership, verification, and stop conditions using Locked names | Redesign modules/fields; invent product rules; copy upstream artifacts |

If a downstream stage needs a locked-class choice that is neither Locked nor
Open, stop and add it under Open (or ask the user).

## Skip defaults

- **entity-model: yes** when no new/changed field, store/compute/remove, schema
  ownership, or migration shape.
- **codebase-design: yes** when ownership, public interface, seam, and caller
  migration are obvious (single owner, no new seam).
- Choose plan thickness from `plan.md`. An explicit plan request is `note` or
  `full`, never `none`.

Write skips as `entity-model-design skipped: <reason>` (same pattern for
codebase-design) in the playbook trail when bam-mode runs.

## Thin path

When entity and design are both skipped, an implementation request can go from
spec directly to implementation. When only one specialist gate is needed, run
only that gate. Do not add a plan merely to complete a pipeline.
