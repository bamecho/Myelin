# Draft template

Emit this before any Multica write. Keep it scannable; link paths instead of pasting specs.

```markdown
# Ticket tree draft

## Intent
- ticket_tree_id: <id>
- lifecycle phase: seed-outcome | fanout-slices | maintain
- write mode: draft | create | sync | rewrite-descriptions | restructure | prune | restructure+prune
- workspace / project: <ids or —>
- outcome seed: <new | MUL-xxx adopt | match metadata>

## Sources (present now)
| Path | Role | Fingerprint |
|------|------|-------------|
| <path> | spec | <hash or mtime+size> |
| … | handoff / entity / design / plan | … |

## Live Multica (if any)
- matched outcome: <MUL-xxx or none>
- ticket_tree_phase on outcome: seed | fanned | —
- children seen: <keys + role + status + assignee>
- protected (skip body/status): <keys + reason>

## Nodes
| node | title | role | stage | status | parent | match | actions |
|------|-------|------|-------|--------|--------|-------|---------|
| outcome | … | outcome | — | todo | — | new | create + phase=seed |
| blocker-open-store | … | blocker | — | todo | outcome | new | create (seed ok) |
| slice-… | … | slice | 1 | todo | outcome | new | create **only if fanout** |

## Phase guard
- [ ] seed-outcome draft contains **zero** slice-* rows (or justified same-day collapse)
- [ ] fanout-slices reuses one outcome (no second Goal ticket)
- [ ] no document-mirror titles (Spec/Entity/Design/Plan file tickets)

## Per-node cards
### outcome
- Goal: …
- Design status / Open / Next: …
- Verify: …
- Stop if: …
- Sources: …
- Children index: <fanout pending | list>

### blocker-… / slice-…
- Goal: …
- In / Out: …
- Verify: …
- Stop if: …
- Sources: …

## Risks
- [ ] prune would cancel: <keys>
- [ ] rewrite touches non-idle: <keys>
- [ ] assignee present: <keys>
- [ ] Open still blocking fanout: <list>
- [ ] same-day seed+fanout collapse: yes/no

## Apply plan
- Phase: <phase>
- Mode: <mode>
- Commands (in order):
  1. `multica issue create …` / `update …` / `metadata set …` / `comment add …` / `status …`
  2. …
- Idle: no commands (draft only)

## Approval needed
- [ ] phase + mode
- [ ] create N / update M / cancel K
- [ ] adopt unmanaged: <keys or none>
- [ ] allow body rewrite on live issues: <keys or none>
```

After apply, replace **Apply plan** with an **Apply report**: phase set on outcome, created / updated / skipped / cancelled, final children summary, next step (`continue Design + path sync` | `assign stage 1` | `leave backlog` | `return to Design`).
