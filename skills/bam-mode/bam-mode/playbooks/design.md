### Design

**You own the pre-implementation decisions.** Turn a rough direction into the
smallest approved artifact that can safely control what happens next. Do not
write implementation code.

The complete flow is `think` -> `entity-model-design` -> `codebase-design` -> plan.
The middle stages are conditional, and plan may be `none`; one skipped
stage never licenses another stage to make its decisions silently.

Principles are risk-triggered lenses, not stages or a checklist. Use a principle
skill only when the current step exposes its named risk, and use it to change a
decision or check in that step. A principle cannot widen the step's
responsibility. Do not record skipped principles or list unused candidates.

The playbook owner and the agent context are different concerns. Keep one owner
for user authority, Handoff, and stage acceptance. Compose **Agent handoff** from
`agent-handoff.md` when a stable artifact lets the next bounded stage start from
cleaner evidence. Use a fresh specialist when the next stage needs a materially
different evidence set or the current context carries broad searches, long
files, or stale notes. Give it one selected skill, Handoff, and named artifacts,
not the producer's reasoning transcript. Small designs may stay with the owner.

Use this playbook for a rough feature idea, product or technical direction,
architecture/design work, feasibility or value judgment that may continue into
implementation, and explicit plan requests whose upstream decisions are not
already complete. Pure explanations stay in Investigation. An implementation
request returns to Feature after this playbook produces a taskable handoff.

1. **Set the endpoint.** Name what the user asked to receive: a recommendation,
   an approved design, a plan, or implementation after design. Stop at that
   endpoint. Do not produce later artifacts merely to complete this flow.
2. **Think and ground.** Read the current repository, governing instructions,
   prior decisions, and live external contracts that bear on the choice.
   Use skill `think` to establish the goal, success evidence, constraints,
   non-goals, and open decisions. Explore materially different alternatives when
   the choice is open. The reasoning method and presentation are adaptive; only
   the decision, evidence, uncertainty, and falsifier must survive. Draft or
   refresh the Handoff contract from `../references/handoff-contract.md`.
   - When product experience or feature scope is the choice, Use skill
     `principle-experience-first` to judge the target from the consumer's seat.
   - When a foundational new requirement enters an existing design, Use skill
     `principle-redesign-from-first-principles` so the target is not a bolt-on.
   - When a novel interaction or architecture choice has no repository precedent
     and several viable shapes remain, Use skill
     `principle-exhaust-the-design-space` to compare concrete candidates. Keep
     Design code-free; hand empirical prototypes to the Prototype playbook.
   Keep interactive intent and user authority with the owner. Broad independent
   evidence gathering may use bounded fresh Scouts, but the owner synthesizes
   their cited findings into Handoff Locked/Open before the next stage. Scouts
   gather facts; they do not choose the product, entity, or codebase design.
3. **Resolve the entity model when it changes.** Use skill `entity-model-design`
   when the work adds or changes business facts, fields, store/compute/remove
   choices, lifecycle, uniqueness, schema ownership, or migration meaning. It
   consumes only Handoff Locked decisions and leaves unresolved product choices
   Open. Record `entity-model-design skipped: <reason>` when no such decision
   exists. Approved data decisions become Locked before module design begins.
   When lifecycle variants, synchronized flags, or repeated shape assumptions
   could admit contradictory states, Use skill `principle-model-the-domain` for
   the entity model only. Treat retry here as a lifecycle identity/invariant;
   retry language alone does not pull execution principles into the entity step.
   This does not authorize types, modules, or implementation.
   When entity work requires a broad schema and lifecycle read, use bounded
   Scouts first when that reading would pollute the design context, then hand
   the cited evidence and locked product inputs to a fresh specialist. Accept
   the returned entity artifact before codebase design; do not pass Scout or
   specialist working transcripts forward.
4. **Resolve the codebase design when it changes.** Use skill `codebase-design`
   after the entity stage when the work changes module ownership, interactions,
   public interfaces, seam placement, or caller knowledge. It consumes the
   approved entity model when present. Record
   `codebase-design skipped: <reason>` for an obvious one-owner change. Use
   skill `architect` only when the approved module model still needs exact types,
   signatures, or module scaffolding before execution.
   - When raw external input, validation, adapters, or error ownership cross the
     boundary, Use skill `principle-boundary-discipline` to place parsing and
     guards.
   - When a proposed layer or hidden state makes callers harder to trace, Use
     skill `principle-minimize-reader-load` and require the boundary to remove at
     least as much indirection as it adds.
   - When concurrent actors could write the same state, Use skill
     `principle-separate-before-serializing-shared-state` before accepting a
     shared writer.
   Prefer a fresh specialist when this stage needs a different decision context
   than the entity stage. When callers, contracts, and module boundaries require
   broad source discovery, give bounded slices to Scouts first. The specialist
   receives their cited findings, authoritative paths, approved Handoff, and
   entity artifact, then returns one reviewable codebase design without
   reopening product or data decisions.
5. **Choose the execution artifact.** Follow `../references/plan.md`. An explicit
   plan request produces `note` or `full`. An implementation request uses `none`
   when the approved decisions already make one single-agent slice taskable,
   `note` when Goal/Verify/Stop adds missing execution information, and `full`
   only for coordination, meaningful intermediate states, migrations, or heavy
   stop rules. A recommendation or design-only request stops without a plan.
   - For multi-step sweeps or migrations, Use skill
     `principle-sequence-verifiable-units`; every unit must end in a real check.
   - For execution steps that may retry, restart, or resume after a partial run,
     Use skill `principle-make-operations-idempotent` and include the
     convergence check.
   - For planned rewrites or migrations with explicit phase boundaries, Use
     skill `principle-outcome-oriented-execution` to preserve the approved
     target and name where temporary breakage is allowed and verified.
   A `full` coordination plan may use a fresh specialist when it needs a clean
   owner/dependency view. `none` and `note` normally stay with the owner; do not
   create a planning agent merely to complete the sequence.
6. **Review risky contracts independently.** Run a contract review before the
   Feature handoff when approved work changes persisted meaning, public
   interfaces, concurrent ownership, trust or security boundaries, irreversible
   external effects, or another decision whose drift would be expensive. A fresh
   reviewer receives the primary request/spec, Handoff, approved entity and
   codebase artifacts, and the current repository evidence. It does not receive
   the producer's reasoning transcript. The owner adjudicates findings and
   returns only a real contradiction or missing decision to its owning stage.
   The failed mandatory plan-review experiment in `plan.md` rejects review
   status ceremony; it does not waive this risk-triggered source-fidelity check.
7. **Hand off without re-deciding.** Refresh Handoff Locked/Open/Skip from the
   approved artifacts. If the endpoint was recommendation, design, or plan,
   return that artifact and stop. If the endpoint includes implementation,
   return to Feature with the Handoff and artifact paths; Feature executes the
   decisions and does not reopen them.

Product choices that require user authority may pause the flow under Open.
Reversible local implementation choices stay with the eventual executor. Do
not turn every uncertainty into a question or every phase into a fixed report
section.

**Reply:** the requested artifact, its source evidence, remaining Open decisions,
and either the next approval needed or the Feature handoff. Do not dump skipped
candidate skills or internal routing narration.
