---
name: think
description: >
  Turn a rough idea into an evidence-grounded product or technical decision.
  Use for planning direction, scope judgment, roadmaps, architecture choices,
  feasibility, value judgment, or deciding whether work is worth doing before
  implementation. Use Evaluation or Triage branches for keep/kill and bundled
  requests. Not for routine bug fixes or small edits.
---

# Think: Reach a Decision

Prefix your first line with 🥷 inline, not as its own paragraph.

Take a position. State the evidence and the premise that would change it.
`think` owns the recommendation: what problem is worth solving, which approach
best fits the evidence, and where its meaningful boundary lies.

## Contract

- **Outcome:** one evidence-grounded solution to the product or technical
  decision the user actually faces.
- **Done when:** the chosen direction, decisive evidence, meaningful boundary,
  and fragile premise are explicit enough for the user to judge whether to
  adopt the solution. When a spec is warranted, its Acceptance, non-goals, and
  real Open blockers are explicit too.
- **Evidence:** current repository state, governing project docs, live external
  contracts when relevant, prior decisions, and user constraints.
- **Output:** the shortest useful answer in chat. Write a Minimal Spec only when
  the user requests one or the decision needs a durable multi-part contract.

Decision-complete means the user can choose a direction, not that every feature
has been designed. Every included detail must change the recommendation, its
acceptance, or a real blocker.

## Default Workflow

1. Confirm the real repository path. Read governing instructions, matching
   prior decisions, current behavior, callers, and configuration values that
   bear on the decision. When durable project context exists, use
   [references/durable-context.md](references/durable-context.md) for its read
   order and re-verification rules.
2. Frame the smallest decision that preserves the observable target. For a
   broad idea, recommend the coherent solution shape and defer feature mechanics
   that do not change that direction. Treat scope as the boundary of the
   recommendation; add sequencing only when requested or when it changes the
   choice.
3. Recommend one approach with rationale, effort, risk, and the most fragile
   premise. Mention one alternative only when its tradeoff is genuinely close.
4. When a spec is warranted, lock only decisions supported by the user or
   evidence. Put missing choices that block the spec under Open with impact,
   default if honest, and owner.
5. Present the recommendation in chat. One sentence is enough when it carries
   the decision, boundary, and fragile premise. Make the approval boundary
   explicit only when further work depends on acceptance.

Return the recommendation itself. Omit skill, workflow, and routing narration.

Use official framework or service solutions before custom design. Query current
official documentation when an external contract affects the choice. For a hard
or repeatedly failed problem, study proven implementations and name the
mechanism adopted.

### Output Surface

Reply in chat by default. Adapt the shape to the decision: a one-line answer,
short bullets, or a compact review surface. File creation activates only when
the user explicitly asks to export/write or provides an output path; “输出到文件”
is sufficient authority.

## Lightweight Fix Branch

Use when the problem is already defined and only the repair method is open.
Give one recommended fix in 2-3 sentences: what changes, where, and why. Name
the brute-force option first; list involved files, flag more than five, and
state one risk. Wait for approval before implementation. Upgrade to Minimal
Spec only when multiple approaches create a real product or architecture choice.

## Evaluation Branch

Use when the user asks whether something should exist, be kept, exposed,
commercialized, or removed. Read the actual feature, callers, dependents, and
project intent before judging.

Return **Kill**, **Keep**, or **Pivot** on line one, then reasons grounded in the
user's constraints. For Pivot, give concrete directions. For Kill or major
rework, state impact scope and migration cost. Keep this branch at judgment;
build planning begins only when requested.

For commercial readiness, judge delivery/update path, first-run activation,
payment/license boundary, privacy promises, headline reliability, support
burden, competitor wedge, and maintenance cost before implementation scope.

## Triage Branch

Use for three or more independently accept/rejectable requests. Classify each
before proposing work:

| Bucket | Action |
|---|---|
| Bug with evidence | Fix |
| Already works | Point to the existing affordance |
| Accepted improvement | Include in the next spec |
| Cosmetic / preference | Hold for maintainer choice |
| Out of scope | Decline with one reason |

Inspect the repository before calling something missing. Present the table and
wait for the user to confirm the accepted subset.

## Review Surface

When a spec is warranted, use only the fields needed to review the decision:
Target, In/Out scope, observable Acceptance, Recommendation, fragile premise,
and real Open blockers. Reference upstream facts by path and omit empty sections.

## Gates

- A contradiction with `AGENTS.md`, `CLAUDE.md`, project rules, or an approved
  decision is named and resolved before approval.
- External dependencies, credentials, migrations, concurrency, or irreversible
  effects that shape Scope or Acceptance are explicit.
- More than three interacting components get one small ASCII dependency/sequence
  diagram; otherwise prose and contracts are cheaper.
- A blocking ambiguity stays Open. Reversible implementation choices remain for
  the executor.

## Ownership Boundary

- A spec locks only concrete decisions supported by the user or evidence;
  unresolved blockers remain Open with impact and owner.
- Implementation details stay out unless they materially change the choice.
- Unsupported product tokens remain Open rather than becoming settled facts.
- A capability the user defers stays outside current Scope; express validation
  as observable evidence without silently adding that capability.
- Investigation resolves uncertainty before recommendation.
