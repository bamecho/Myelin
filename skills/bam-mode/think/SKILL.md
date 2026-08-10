---
name: think
description: >
  Turn a rough idea into the smallest approved product/technical spec and
  current delivery slice needed for design. Use for planning direction, scope
  slicing, roadmaps, architecture choices, feasibility, value judgment, or
  deciding whether work is worth doing before implementation. Use Evaluation
  or Triage branches for keep/kill and bundled requests. Not for routine bug
  fixes or small edits.
---

# Think: Minimal Spec Before Design

Prefix your first line with 🥷 inline, not as its own paragraph.

Take a position. State the evidence and the premise that would change it.
`think` owns product direction and scope; downstream skills own data, interface,
and execution detail.

## Contract

- **Outcome:** the smallest approved spec that fixes the next product or
  technical decision and, when work continues to design, bounds the current
  delivery slice.
- **Done when:** Target, outcome Scope, Acceptance, non-goals, Locked
  decisions, and real Open blockers are explicit.
- **Evidence:** current repository state, governing project docs, live external
  contracts when relevant, prior decisions, and user constraints.
- **Output:** the shortest useful answer in chat. Expand to a Minimal Spec and
  Handoff only when the next stage needs them. An implementation plan is a
  downstream artifact.

Decision-complete means complete enough to begin the current slice, not
exhaustive for the eventual product. Every extra future detail increases review
and sync cost.

## Default Workflow

1. Confirm the real repository path. Read governing instructions, matching
   prior decisions, current behavior, callers, and configuration values that
   bear on the decision. When durable project context exists, use
   [references/durable-context.md](references/durable-context.md) for its read
   order and re-verification rules.
2. Select the smallest independently useful current delivery slice for the
   observable target. Describe later outcomes only to the depth needed to explain
   sequencing; defer their entity and interface design until they become current.
3. Recommend one approach with rationale, effort, risk, and the most fragile
   premise. Mention one alternative only when its tradeoff is genuinely close.
4. Lock only decisions supported by the user or evidence. Put missing product
   tokens under Open with impact, default if honest, and owner.
5. Present the recommendation in chat and stop for explicit approval. One
   sentence is enough when it carries the decision, boundary, and next step.

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

Use only the fields needed to review the decision: Target, In/Out scope,
observable Acceptance, Recommendation, fragile premise, and real Open blockers.
When another stage will continue, add the Handoff Locked/Open/Skip fields from
`bam-mode/references/handoff-contract.md`. Reference upstream facts by path and
omit empty sections.

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

- Approval covers concrete decisions; unresolved blockers remain Open with
  impact and owner.
- Entity facts, typed interfaces, module shape, and task ordering enter their
  downstream stages.
- Unsupported product tokens remain Open rather than becoming settled facts.
- Each delivered slice leaves a usable product if later horizons are abandoned.
- Investigation resolves uncertainty before slicing.

After approval, report the accepted spec and the next single stage:
`entity-model-design`, `codebase-design`, plan, or implementation.
