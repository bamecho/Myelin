# Lifecycle: seed-outcome → fanout-slices

Load when choosing phase, wiring Design steps to Multica, or deciding what happens when a new artifact file appears.

## Why two phases

| If you only fan out at the end | If you ticket every document |
|--------------------------------|------------------------------|
| Multica is blank during long design | Board fills with process noise |
| Hard to hang discussion / Open | Structure drifts as docs rewrite and skip |

**Seed early** for a stable hang point. **Fan out late** so children are landable work, not file names.

## Phase entry criteria

### seed-outcome — enter when

- User or `think` locked a one-sentence Goal / Building, **or**
- User asks to 立项 / 挂 Multica / track this design, **or**
- Design will span sessions or people and needs a key for comments and links.

**Minimum inputs:** Goal text. Spec/handoff paths optional (attach as they appear).

**Outputs:** one managed outcome; `ticket_tree_phase=seed`; optional `blocker-*` only.

### fanout-slices — enter when

- At least one of: plan with units, codebase-design with separable owners, or explicit single-slice implementation intent, **and**
- User wants implementation tracking / agent assignable work packages, **and**
- Open locked-class gaps either closed or isolated as blockers that do not pretend to be build slices.

**Minimum inputs:** existing outcome (or seed in same apply) + enough authority to write per-slice Verify.

**Outputs:** `slice-*` children; outcome `ticket_tree_phase=fanned`; Children index rewritten.

## Design playbook hooks (non-binding triggers)

These are **when Multica may be touched**, not a mandatory pipeline. Endpoint still wins (recommendation-only → often no Multica at all).

| Design moment | ticket-tree action |
|---------------|-------------------|
| Goal / Handoff first draft approved | **seed-outcome** (`create` or adopt) |
| Spec file written or path stable | **sync** outcome `spec_path` + Sources; comment “spec landed” if useful |
| entity-model-design approved **or** skipped | **sync** `entity_path` or omit; never a ticket for skip |
| codebase-design approved **or** skipped | **sync** `design_path`; still no slice unless cuts are clear and user wants fanout |
| plan `note`/`full` approved, or implementation requested with taskable design | **fanout-slices** |
| Risky contract review fails → back to stage | comment on outcome; add/update **blocker**; do not fan out new slices on failed gates |
| Feature starts implementing | assign stage-1 slices; do not re-seed |

User can collapse seed+fanout into one apply when all inputs already exist.

## When a new document appears

| Event | Do | Do not |
|-------|----|--------|
| New/updated spec.md | Match outcome by `ticket_tree_id`; `sync` path + optional rewrite Sources | Create `MUL-… Spec` |
| New entity / design / plan file | Same: path metadata on **outcome** (and later on slices at fanout) | One issue per file |
| Doc deleted or path moved | `sync` paths; rewrite managed body if needed | Leave stale paths |
| Doc work is multi-day with its own owner **and** user asks to track that gate | One **blocker** (role=blocker), Goal = “lock entity fields…”, not the filename | Treat blocker as implementation slice |

## Progress without new tickets

Prefer on the **outcome**:

1. `issue comment add` — “entity approved → path …”, “Open: store vs compute still user”
2. `metadata set` — path keys + `ticket_tree_sources_fp`
3. `rewrite-descriptions` or managed `sync` body — refresh Sources / Design status / Open

Use status on outcome sparingly during design (`todo` / `blocked`). Avoid assigning coding agents until fanout.

## Phase transitions

```text
(no tree) --seed create--> seed
seed --sync paths/comments--> seed
seed --fanout create slices--> fanned
fanned --sync/rewrite/restructure/prune--> fanned
fanned --user kills initiative--> cancel children + outcome (explicit)
```

There is no automatic return from `fanned` to `seed`. If design reopens after fanout:

- add/update **blockers** and stop rules on slices;
- `restructure`/`prune` slices that are no longer valid;
- keep the same outcome key.

## Solo same-day exception

If Goal through plan (or taskable design) complete in one sitting:

- One draft may list outcome + slices.
- One apply may `create` both.
- Still zero document-mirror tickets.
- Record `ticket_tree_phase=fanned` at end (seed was instantaneous).

## Anti-patterns

- Creating tickets for skipped stages “for completeness”
- Renaming a design doc and creating a second issue instead of path `sync`
- Fanout with TBD Verify or invented field names
- Enqueueing agents on outcome during pure design seed
- Second outcome for the same Goal because fanout “felt like a new project”
