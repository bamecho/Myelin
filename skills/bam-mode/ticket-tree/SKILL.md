---
name: ticket-tree
description: "Seed an early Multica outcome ticket when design direction locks, then fan out staged implementation slices once artifacts support cuts. Use for ticket schemes, Multica issue trees, seed-outcome, fanout-slices, or sync/rewrite from spec, handoff, entity, codebase-design, or plan."
---

# Ticket Tree

Track design and delivery as **one Multica scheme** with two lifetimes:

1. **`seed-outcome`** — as soon as the result (Goal / Building) is clear, create or adopt **one outcome** ticket. Documents attach as Sources + metadata, not as sibling tickets.
2. **`fanout-slices`** — only when implementation units are cuttable, add staged **slice** children under that outcome.

Documents stay authority; tickets stay work. **Never default to one issue per document.**

Compose **`multica-cli`** for every Multica read/write. Prefer `--output json` and `--description-file`.

**Writes are side-effecting.** Default is a reviewable **draft**. Apply only after the user approves the draft **and** a named write mode (or a lifecycle phase that implies modes).

Load `references/lifecycle.md` when choosing phase, Design handoff points, or whether a new artifact should touch Multica.

## Outcome Contract

- **Outcome:** Multica state matches the current lifecycle phase — either a live outcome seed with current source paths, or a full outcome + slice tree ready to execute.
- **Done when (seed):** outcome exists (or is drafted), `ticket_tree_id` set, Goal + known Sources/paths recorded, Open/blockers named; no fake implementation children.
- **Done when (fanout):** every slice has identity, stage, Goal/Sources/Verify/Stop; write plan applied or drafted; Open that still blocks slices is explicit.
- **Evidence:** design artifacts present so far, live Multica tree/metadata, user maps.
- **Output:** draft + apply report. Not product design and not implementation code.

## When To Use

| Trigger | Phase |
|---------|--------|
| Goal/Building just approved; long or multi-person design; want a Multica hang point | **`seed-outcome`** |
| Spec/handoff path appeared or changed during design | **`seed-outcome`** with mode `sync` (paths + optional body) |
| Open product decision blocks progress and needs a tracked owner | **`seed-outcome`** + optional **blocker** child only |
| Plan / design makes landable units clear; user wants implementation tickets | **`fanout-slices`** |
| Sources or phase graph drifted after fanout | `sync` / `rewrite-descriptions` / `restructure` / `prune` on the existing tree |
| User asks for “the whole ticket scheme” with artifacts already complete | Infer: seed if no outcome; else fanout if slices missing; else sync |

Not for: inventing scope, replacing Design, think Triage, or ad-hoc comments (`multica-cli` alone).

**Short solo path:** if design finishes the same session and implementation is immediate, skip a separate seed apply — one apply may create outcome (+ slices) together. Still **do not** mint document tickets.

## Authority

| Rank | Artifact | Feeds |
|------|----------|--------|
| 1 | Goal / Building + Handoff Locked / non-goals | Outcome title and Goal (enough to **seed**) |
| 2 | Spec path (as it appears) | Outcome Sources; still not a separate ticket |
| 3 | Entity model (if present) | Constraints; seed metadata only until fanout |
| 4 | Codebase design (if present) | Slice cuts at fanout |
| 5 | Plan (`note` / `full` / implicit single slice) | Stage order, Verify, Stop at fanout |
| 6 | Live Multica tree | Identity match; protect in-flight work |

Missing locked-class decisions stay **Open**. At seed: record them on the outcome (and optional blocker children). At fanout: **do not** invent implementation slices that require undecided product tokens.

**Parent is the outcome, never a document type.**

## Lifecycle (core model)

```text
Direction locks (think / user)
        │
        ▼
 seed-outcome ──► 1× outcome ticket
        │            metadata paths grow as docs appear
        │            optional blocker children only
        │            NO entity/design/plan tickets
        │            NO implementation slices yet
        ▼
 Design continues (local artifacts + outcome comments/sync)
        │
        ▼
 Cuts are honest (plan/design/single-slice clear)
        │
        ▼
 fanout-slices ──► staged slice children under same outcome
        │
        ▼
 sync / rewrite / restructure / prune as sources move
```

| Phase | Creates | Must not create |
|-------|---------|-----------------|
| **seed-outcome** | outcome; optional `blocker-*` for real Open gates | `slice-*`; tickets named after spec/entity/design/plan files |
| **fanout-slices** | `slice-*` under existing outcome; outcome if somehow missing | second outcome for the same Goal; document-mirror tickets |

Phase details, Design playbook hooks, and “new doc appeared” rules: `references/lifecycle.md`.

## Stable Identity

Every managed issue carries metadata (string values unless noted):

| Key | Meaning |
|-----|---------|
| `ticket_tree_id` | Scheme id (user or slug from outcome + project). Shared by all nodes. |
| `ticket_tree_node` | `outcome`, `slice-<slug>`, or `blocker-<slug>` |
| `ticket_tree_role` | `outcome` \| `slice` \| `blocker` |
| `ticket_tree_phase` | On **outcome** only: `seed` \| `fanned` — last applied lifecycle phase |
| `ticket_tree_stage` | Stage ordinal string for staged children |
| `spec_path` / `handoff_path` / `entity_path` / `design_path` / `plan_path` | Repo-relative paths when present |
| `ticket_tree_managed` | `true` — body is skill-owned |
| `ticket_tree_sources_fp` | Fingerprint of cited sources at last apply |

Match order: (1) user map `node → key`, (2) `ticket_tree_id` + `ticket_tree_node`, (3) children of known outcome + managed metadata + exact title, (4) unmatched → create or ask — never update a random search hit.

## Write Modes

Name the mode in the draft. Lifecycle phases **select defaults**; modes still govern field writes.

When the user says 覆盖、重写、同步、更新、重建, or a second run hits an existing tree, load `references/edit-semantics.md`.

| Mode | Creates | Updates matched | Cancels | Typical use |
|------|---------|-----------------|---------|-------------|
| **`draft`** | no | no | no | Default. Scheme only. |
| **`create`** | unmatched only | no | no | First materialization of drafted nodes |
| **`sync`** | unmatched (within phase rules) | safe fields + paths | no | New doc path, light source drift |
| **`rewrite-descriptions`** | no | managed bodies + fp | no | Bodies behind sources |
| **`restructure`** | unmatched slices | parent/stage/title | only with **`prune`** | Slice graph changed |
| **`prune`** | no | no | managed children absent from draft | Drop retired slices/blockers |

**Phase → default mode**

| User / situation | Phase | Default mode |
|------------------|-------|--------------|
| 立项 / seed / 挂上 Multica | `seed-outcome` | `create` if no outcome; else `sync` |
| 文档路径更新、不拆实现 | `seed-outcome` | `sync` (+ `rewrite-descriptions` if body must match) |
| 可以开工 / fanout / 拆子票 | `fanout-slices` | `create` for new slices; `sync` outcome index |
| 重切阶段 | `fanout-slices` | `restructure` (± `prune`) |

### Field policy

| Field | `create` | `sync` | `rewrite-descriptions` | `restructure` |
|-------|----------|--------|------------------------|---------------|
| title | set | if draft differs | no | if draft differs |
| description | managed template | only if managed; prefer rewrite when body is the point | **full replace** via file | same as sync |
| parent | set | no | no | set |
| stage | set | no | no | set |
| priority | if drafted | if drafted | no | if drafted |
| project | if drafted | ask to move | no | ask |
| status | phase defaults below | do not clobber `in_progress` / `in_review` / `done` / `cancelled` | no | idle only (`backlog`/`todo`); no silent reopen |
| assignee | only if user named one | never steal | no | no |
| tree metadata + paths + fp | set | refresh | refresh paths + fp | refresh |
| comments / PRs / non-tree labels | no | no | no | no |

**覆盖重写 ≠ 删树重建。** Prefer in-place update. Recreate only when the user accepts new keys and lost history.

### Status defaults on create

| Node | Seed phase | Fanout phase |
|------|------------|--------------|
| Outcome | `todo` (or user choice); do **not** assign implementers by default | leave live status; do not reset |
| Blocker | `todo` or `blocked`; no implementer until Open closes | same |
| Slice stage 1 | — (not created) | `todo` |
| Slice stage 2+ | — | `backlog` |

### Description ownership

- New managed nodes use the templates below; set `ticket_tree_managed=true`.
- Unmanaged matches: adopt only with explicit consent before body replace.
- Managed rewrite is **full description replace**. Human notes live in **comments**.
- During seed, progress narrative (which design step finished) → **comment on outcome**, not a new ticket per doc.

## Workflow

### 1. Ground

1. Auth/workspace: `multica auth status`, `multica config show` (or user profile/workspace).
2. Infer **phase** from user wording + artifacts (see When To Use). If ambiguous, ask once: seed vs fanout.
3. Collect paths that exist (user paths win). Seed minimum: **one-sentence Goal**. Fanout minimum: Goal + enough plan/design/spec to cut honest Verify units.
4. Load live tree: given key → `issue get` / `children` / `metadata`; or `issue list --metadata ticket_tree_id=…`.
5. Fingerprint cited sources for the draft.

### 2. Build the scheme

**Always** define the outcome node (create, adopt, or match).

**If `seed-outcome`:**

1. Title + Goal from Building / user.
2. Sources = whatever paths exist now (missing paths omitted, not invented).
3. List Open decisions; add **blocker** children only when a gate needs its own owner/deadline.
4. Set planned children index to “fanout pending” or empty — **zero `slice-*` nodes**.
5. Set draft `ticket_tree_phase: seed`.

**If `fanout-slices`:**

1. Require matched outcome (or seed it in the same apply if missing, still one outcome).
2. Cut slices (load `references/tree-model.md`):
   - plan phases/units first;
   - else codebase-design owners with real Verify;
   - else single implementation slice (or outcome-only if truly atomic).
3. Blockers for remaining Open that still block slices.
4. Phase independence: any prefix of stages must leave a usable system.
5. Set draft `ticket_tree_phase: fanned`.

### 3. Draft (mandatory before write)

Use `references/draft-template.md`. Include phase, mode, node table, risks, commands.

**Stop for approval** unless the user already approved “apply phase X / mode Y” and the draft has no prune, status reopen, or live-body rewrite risks.

### 4. Apply

1. Re-fetch matched issues (status/assignee may have moved).
2. Abort body/status clobber on non-idle issues without explicit force this turn.
3. Outcome before children. Metadata immediately after each create.
4. Slices: `--parent <outcome-id> --stage N` with status defaults.
5. On successful fanout, set outcome metadata `ticket_tree_phase=fanned`. On seed, `ticket_tree_phase=seed`.
6. `prune`: cancel only managed children whose `ticket_tree_node` left the approved draft; comment on outcome listing keys.
7. Apply report: keys, phase, `issue children`, next step (continue Design / assign stage 1 / leave backlog).

### 5. Idempotency

- Same `ticket_tree_id` + `create` → unmatched only; no `--allow-duplicate` unless user accepts.
- Unchanged `ticket_tree_sources_fp` + sync/rewrite → no-op report.
- Seed re-run after docs appear → `sync` paths on outcome, not a second outcome.
- Fanout re-run → create only new `slice-*` / blockers; do not duplicate.

## Description Templates

### Outcome (seed and fanned)

```markdown
## Goal
<observable result>

## Sources
- Spec: `<path or —>`
- Handoff: `<path or —>`
- Entity: `<path or —>`
- Design: `<path or —>`
- Plan: `<path or —>`

## Scope
- In: <outcome-level in>
- Out: <non-goals>

## Design status
- Phase: seed | fanned
- Open: <blockers or none>
- Next: <e.g. finish codebase-design | fanout slices | implement stage 1>

## Verify
- <outcome-level acceptance when delivery is done; during seed may be “design gates + later slice Verifies”>

## Stop if
- <return to Design / kill criteria>

## Children
- <fanout pending | list node id — title — stage>

## Tree
- ticket_tree_id: `<id>`
- node: outcome
- role: outcome
- phase: seed | fanned
```

Refresh **Sources**, **Design status**, and **Children** on seed sync and after fanout rewrite.

### Slice / blocker

```markdown
## Goal
<observable result for this node>

## Sources
- Spec: `<path>` <optional #anchor>
- Handoff: `<path>` (if any)
- Entity: `<path>` (if any)
- Design: `<path>` (if any)
- Plan: `<path>` <optional #anchor>

## Scope
- In: <this node only>
- Out: <siblings own …>

## Verify
- <command or real artifact check>

## Stop if
- <condition that returns work to Design or blocks the parent>

## Tree
- ticket_tree_id: `<id>`
- node: `<ticket_tree_node>`
- role: slice | blocker
- stage: `<n or —>`
```

## Hard Rules

1. **Seed early, fan out late** — outcome when Goal is clear; slices when cuts are honest.
2. **No document-mirror tickets** by default (no spec/entity/design/plan issue per file).
3. **Draft before write** unless pre-approved and non-destructive.
4. **Update-in-place over recreate.**
5. **Managed descriptions are fully replaced**, never half-merged.
6. **Do not invent product tokens** not Locked upstream.
7. **Protect live work** — no silent status/assignee/body writes on non-idle issues.
8. **Compose `multica-cli`**; ask before writes the user did not clearly request.

## Gotchas

| Situation | Action |
|-----------|--------|
| User wants “每写完文档建一张票” | Refuse document tickets; seed/sync outcome + comment; fanout only for work units |
| New spec path mid-design | `seed-outcome` + `sync` metadata/Sources; not a new issue |
| Entity/design skipped | Omit path; do not create cancelled placeholder tickets |
| Plan bloated | Cut by Verify units at fanout; do not paste plan into tickets |
| Fanout before Locked decisions | Blockers or refuse slices that need those locks |
| “覆盖全部” | `rewrite-descriptions` and/or `restructure`+`prune`; still draft |
| Design-only endpoint | Seed outcome (optional); never fake build slices |
| Solo same-day ship | One apply: outcome + slices; still no doc tickets |

## What This Skill Is Not

- Not Design: does not choose product, entity, or module ownership.
- Not a document registry: Multica is not a mirror of the docs folder.
- Not think Triage.
- Not the Multica CLI manual (`multica-cli`).
