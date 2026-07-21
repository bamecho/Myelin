# Ticket tree model

Load when choosing parent/child shape, stages, or whether to fan out.

## Shape by phase

### Seed (`ticket_tree_phase=seed`)

```text
[outcome]  role=outcome
   │
   └─ [blocker-…]   optional only — Open gates with owners
                    NO slice-* children
```

### Fanned (`ticket_tree_phase=fanned`)

```text
[outcome]  role=outcome  (same key as seed)
   │
   ├─ [slice-…]  stage=1  status=todo
   ├─ [slice-…]  stage=2  status=backlog
   ├─ [slice-…]  stage=2  status=backlog   ← same stage = parallel barrier
   └─ [blocker-…]          remaining Open gates
```

- **Outcome** = observable product result. Stable across doc rewrites and across seed→fanout.
- **Slice** = independently mergeable implementation unit with its own Verify. Created only at fanout.
- **Blocker** = Open product/design decision that must close before honest build work. Allowed in both phases.

Multica: children use `--parent <outcome>`. `--stage N` is an ordered barrier group; parent assignee wakes when every issue in a stage finishes. Later stages stay `backlog` until advanced.

## What is never the parent (and never a default node)

| Not a parent / not a default ticket | Why |
|-------------------------------------|-----|
| Spec file | Decision authority; attach as `spec_path` |
| Entity / codebase-design doc | Often skipped; intermediate artifact |
| Plan file | Optional execution delta; may be `none` |
| “Write the design doc” process ticket | Prefer outcome comment + path sync; blocker only if multi-day owned gate |

## How many children

| Upstream signal | Tree |
|-----------------|------|
| Seed only | Outcome ± blockers |
| Single-agent, single-slice, plan `none`/`note` | Outcome only, or outcome + one slice at fanout |
| Plan `full` / multi-owner | Outcome + one child per landable unit; stage = order |
| Several modules, one atomic land | Still one slice |
| Open locked-class gaps | Blockers; withhold slices that need those locks |

## Stage rules (fanout only)

1. Dense integers from 1.
2. Same stage ⇒ parallel (no hard dependency between those children).
3. Stage N+1 may assume stage N Verify green.
4. Any prefix of stages leaves a **usable** system if later stages never ship; else one stage only.
5. No “Stage 0: investigate” — that is pre-tree work or a named blocker with an exit.

## Cutting slices from sources (fanout)

Prefer:

1. Plan phases / explicit units with Verify and Stop.
2. Codebase-design owners that can ship alone behind a stable interface.
3. Spec acceptance clusters that are independently valuable (rare).

Each slice Scope.Out names what siblings own.

## Initiative nesting

If a larger epic `MUL-EPIC` already exists:

- Parent the **outcome** under that epic, **or** adopt the epic as the outcome when Goals match.

Do not create a duplicate outcome for the same Goal. Seed and fanout always reuse one outcome identity (`ticket_tree_id` + `ticket_tree_node=outcome`).
