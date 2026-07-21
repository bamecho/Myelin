# Edit semantics (create / sync / rewrite / prune)

Load when the user says 覆盖、重写、同步、更新、重建, when a second run hits an existing tree, or when a new design doc should update Multica without fanout.

## Plain-language map

| User says | Phase / mode | Meaning |
|-----------|--------------|---------|
| 立项 / 先挂一张票 / seed | `seed-outcome` + `create` or adopt | One outcome; no slices |
| 先出方案 / 看看树 | `draft` | No Multica writes |
| 文档写好了 / 路径变了 | `seed-outcome` or fanned + **`sync`** | Paths + safe fields; not a new issue per doc |
| 创建 / 落票 | `create` | Unmatched nodes only (respect phase: seed ⇒ no slices in draft) |
| 可以拆子票 / fanout / 开工拆分 | `fanout-slices` + `create`/`sync` | Slice children under existing outcome |
| 同步 / 对齐文档 | `sync` | Create missing **allowed** nodes; refresh meta |
| 覆盖描述 / 重写正文 | `rewrite-descriptions` | Full managed body replace |
| 阶段变了 / 重切 | `restructure` | parent/stage/title; no cancel alone |
| 删掉旧子票 | `prune` (± restructure) | Cancel managed children not in draft |
| 整棵删了重建 | **not default** | Explicit only; history loss |

**覆盖重写 ≠ 删除重建。** Default 覆盖 is in-place description rewrite on managed issues.

**新文档 ≠ 新 issue。** Default is outcome `sync` (metadata + Sources). See `lifecycle.md`.

## Why not delete-and-recreate

Recreate burns stable keys (PR `Closes MUL-…`), comments, agent runs, assignees. Identity is `ticket_tree_id` + `ticket_tree_node`.

## Seed vs fanout on write

| | Seed apply | Fanout apply |
|--|------------|--------------|
| May create | `outcome`, `blocker-*` | `slice-*`, missing `blocker-*`; outcome if absent |
| Must not create | `slice-*`, document-named tickets | second outcome for same Goal |
| Typical mode | `create` then later `sync` | `create` slices + outcome Children rewrite |
| Metadata on outcome | `ticket_tree_phase=seed` | `ticket_tree_phase=fanned` |

If a draft for `seed-outcome` still lists `slice-*`, **strip them** or refuse apply — wrong phase.

## Sync vs rewrite-descriptions

| | `sync` | `rewrite-descriptions` |
|--|--------|------------------------|
| Goal | Paths, titles, light fields; create missing phase-legal nodes | Force managed bodies to template |
| Description | Optional if managed | Always when fp changed or user forces |
| New slices | Only in fanout drafts | no |
| parent/stage | no | no |

Combined apply only when the user approved both in one sentence.

## Path-only sync (design mid-flight)

When only a new artifact path landed:

1. Match outcome.
2. `metadata set` the path key; refresh `ticket_tree_sources_fp`.
3. Optionally rewrite outcome body Sources / Design status.
4. Optionally `comment add` one line on the outcome.
5. Do **not** create a child for the file.

## Protected issues

Re-fetch status and assignee before update/rewrite.

| State | Default |
|-------|---------|
| `backlog`, `todo` | Eligible for sync / rewrite / restructure |
| `in_progress`, `in_review` | Skip body and status; meta-only if user allows |
| `done`, `cancelled` | No reopen/rewrite unless user names key + intent |
| Assignee present | No reassign; no body rewrite while `in_progress` without force |

Force requires explicit user text this turn.

## Adopting pre-existing issues

1. Draft shows **adopt?**
2. On approval: set tree metadata (`ticket_tree_phase=seed` or `fanned` as appropriate).
3. Meta-only or one `rewrite-descriptions`.
4. Until adopted, never full-replace description.

Prefer adopting a user-supplied initiative as **outcome** rather than creating a parallel seed.

## Fingerprints and no-ops

`ticket_tree_sources_fp` tracks cited source set + content.

- Unchanged fp + sync/rewrite → no-op.
- New path only → fp changes → outcome path sync (and body if managed rewrite requested).

## Partial failure

- Parent created, child failed → retry `create` unmatched only; same `ticket_tree_id`.
- Fanout partial → report created slice keys; do not open a second outcome.

## Command shapes (illustrative)

```bash
# seed outcome
multica issue create --title "…" --description-file ./tt-outcome.md --status todo --output json
multica issue metadata set <id> --key ticket_tree_id --value <tree>
multica issue metadata set <id> --key ticket_tree_node --value outcome
multica issue metadata set <id> --key ticket_tree_role --value outcome
multica issue metadata set <id> --key ticket_tree_phase --value seed
multica issue metadata set <id> --key ticket_tree_managed --value true --type bool
multica issue metadata set <id> --key spec_path --value <path>   # when present

# design progress without new tickets
multica issue metadata set <id> --key design_path --value <path>
multica issue comment add <id> --content-file ./tt-note.md

# fanout slice
multica issue create --title "…" --parent <outcome-id> --stage 1 --status todo \
  --description-file ./tt-slice.md --output json
# … tree metadata including ticket_tree_node=slice-…
multica issue metadata set <outcome-id> --key ticket_tree_phase --value fanned

# rewrite / restructure / prune
multica issue update <id> --description-file ./tt-outcome.md --output json
multica issue update <id> --parent <outcome-id> --stage 3 --title "…" --output json
multica issue status <id> cancelled
```

Description files stay under cwd unless the user accepts `--allow-external-file` (MUL-4252). Prefer cwd temp files, delete after apply.
