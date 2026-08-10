---
name: codebase-design
description: >
  Design or audit codebase shape through caller scenarios, responsibility and
  state ownership, dependency direction, and exact load-bearing contracts. Use
  Definition mode before implementation when ownership or interfaces change;
  use Audit mode to review a repository for over-abstraction, coupling, leaky
  boundaries, or stale design. Skip Definition when one owner and interaction
  are already obvious.
---

# Codebase Design

Use traced caller scenarios and code-shaped contracts as the architecture spec.
Establish the whole system shape before local declarations: who calls, which
module owns each decision, state, and effect, and how critical interactions cross
the boundaries. Then define only the load-bearing contracts implementation must
not silently redesign. Function bodies and rollout steps remain outside this
skill. Optimize the artifact for a one-minute architecture review; evidence earns
space, ceremony does not.

Select one mode from the request:

- **Definition Mode** is the default for an approved current slice.
- **Audit Mode** applies when the user asks to review, simplify, or improve the
  current repository architecture.

## Shared Grounding

Read the approved spec/Handoff, approved entity diff when present, and the real
exports, callers, tests, and dependency boundaries in scope. Preserve public
contracts unless Handoff explicitly changes them. Use the repository's language
and declaration idioms; do not default to TypeScript. Draw any module,
dependency, sequence, or state view as compact ASCII in a fenced `text` block.
Trace current behavior across the boundaries changed by the slice; a package or
file inventory is not a runtime model.

## Definition Mode

### Contract

- **Outcome:** the smallest coherent system shape that lets callers complete the
  approved scenarios while hiding coordination and policy behind deep boundaries.
- **Done when:** critical caller paths, ownership of policy, state, and effects,
  allowed dependencies, load-bearing types, failure behavior, and recovery are
  visible without function bodies.
- **Output:** a compact caller/interaction model followed by declaration-only
  load-bearing contracts with adjacent 2-3 line Tech Notes.

### Workflow

1. Trace the fewest current and target caller scenarios that exercise materially
   different paths. Name the observable result, durable state, and failure
   recovery that changes the architecture; derive the shape from this usage.
2. Identify the decisions implementation would otherwise make silently:
   ownership of policy, state, and effects; dependency direction; public surface;
   and caller knowledge. A deep contract hides representation and coordination
   while naming the domain capability; it does not make an adapter infer a domain
   transition or invent policy. When one atomic write includes a domain effect
   consumed later, such as an event, outbox item, or notification, the domain
   owner constructs an explicit intent including its stable identity and semantic
   fields. Infrastructure only translates and persists it; a semantic method name
   alone does not authorize the adapter to derive the effect. When callers share
   a decision but perform different effects, expose the shared decision as domain
   data and keep each effect at its caller boundary; mode flags, options, or
   callbacks must not make one capability own unrelated interactions.
   When one path previews or inspects the exact decisions another path executes,
   expose that plan as data: the preview caller owns presentation and the executor
   owns effects. Use a single multi-mode capability only when the Handoff locks it
   as the public contract.
3. Draw the fewest logical modules that hide coherent domain knowledge, their
   allowed dependencies, and the critical interactions between them. Prefer one
   view annotated with the load-bearing data, state, effects, and recovery paths.
   A module is a responsibility boundary, not necessarily a file, layer, entity,
   or execution stage.
4. When locked constraints and repository precedent leave a consequential
   ownership or dependency choice genuinely open, compare structurally distinct
   viable shapes in reasoning. Stale proposals and a human-corrected shape are
   evidence, not alternatives. Screen a non-obvious new shape against
   [`references/shape-review.md`](references/shape-review.md) as a private review
   lens, then revise the boundary before presenting it.
5. Write exact, repository-native declarations only for new or changed
   load-bearing boundaries: contracts whose change would alter dependency
   direction, caller knowledge, state ownership, or failure semantics. Cite
   preserved contracts by symbol and compatibility requirement. Contract blocks
   stop at type/interface declarations and function or method signatures;
   executable bodies and internal helpers stay in the source and implementation.
   Use language-native declaration syntax when it supports bodyless declarations;
   otherwise put conventional signatures in a `text` fence. Placeholder bodies
   are implementation-shaped rather than contracts.
6. Place a **Tech Note** beside a contract only for evidence-backed semantics
   needed to approve state, effects, transactions, concurrency, external calls,
   or failures. Leave unrelated implementation policy open. Trace each caller to
   one public capability and name what it no longer needs to coordinate or know.
   Architecture blockers are unresolved decisions that prevent approval, not
   adapter requirements. Do not invent concurrency, locking, isolation, batching,
   or retry policy absent approved evidence. Reconcile every interaction label
   with the preserved and proposed declarations; a flow cannot return, accept, or
   observe a value its contract does not provide. Present and stop for approval.

When one owner, dependency direction, and interaction are already obvious,
write `codebase-design skipped: <reason>`.

### Output Contract

Lead with a compact caller/system view that shows the critical interactions,
ownership, and allowed dependencies. Add a separate sequence or state view only
when the first view cannot make a load-bearing failure or transition clear.
Follow with exact repository-native declarations only at load-bearing boundaries
and adjacent Tech Notes for semantics the declarations cannot express. End with
caller knowledge removed and real architecture blockers; include a tradeoff only
when human approval depends on it. Report concrete decisions rather than rubric
compliance. State each fact once. Preserved contracts are cited by path and symbol,
not reprinted in code blocks. The artifact contains no executable, placeholder,
pseudocode, or copied function bodies. End at architecture blockers; plan owns
implementation steps. Do not add an alternatives or red-flag compliance section
unless the Handoff explicitly asks the human to choose among named viable shapes.

## Audit Mode

### Contract

- **Outcome:** a repository-wide or explicitly scoped diagnosis of boundaries
  that create unnecessary review and change cost.
- **Done when:** each material finding cites code evidence, explains the current
  coupling, and shows the smaller target contract or deletion.
- **Output:** ordered findings and a compact target boundary map. Plan owns any
  later rollout sequence.

### Workflow

1. Scan the full repository unless the user names a narrower scope. Map public
   exports, dependency direction, shared mutable state, adapters, and callers.
2. Find over-abstraction, pass-through layers, duplicated policy, leaky provider
   types, cyclic ownership, oversized interfaces, dual writers, and legacy APIs
   with no live caller.
3. Rank only material findings by review/change cost and blast radius. Cite paths
   and symbols, not impressions.
4. For each finding, show the target as an exact contract diff: add, change,
   split, merge, or delete. Add a 2-3 line Tech Note only for hidden state,
   effects, failure, transaction, or concurrency semantics.
5. End with the resulting module/dependency shape. Leave migration ordering and
   tickets to plan.

### Output Contract

For each material finding, give severity, path/symbol evidence, review or change
cost, target action, and the exact smaller contract or deletion. Use Tech Notes
only for semantics the contract cannot express. End with the target ASCII
dependency shape. The audit is complete when every finding has live repository
evidence and an approvable target surface.

## Stage Boundary

Consume approved data locks from the Handoff. Later planning may order the
approved contracts but does not redesign them; implementation owns executable
bodies and diff evidence.
