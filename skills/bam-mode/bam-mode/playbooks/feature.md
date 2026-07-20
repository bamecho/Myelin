### Feature

**You own implementation.** Execute approved decisions, review the diff, and
prove the behavior. Design work has one owner: the **Design** playbook at
`playbooks/design.md`.

1. Establish whether the request is taskable. If goal, product decisions, data
   meaning, module ownership, interfaces, or execution constraints are still
   open, run the Design playbook through its Feature handoff before writing
   code. If the request and current repository already settle them, record
   `design skipped: taskable input` and draft the thin Handoff contract directly.
   A design-only or plan-only endpoint stops in Design and never enters Feature.
2. Read the approved artifacts and Handoff Locked/Open/Skip. Name the data shape
   and system boundary before tasking. If implementation exposes a missing
   entity or ownership decision, return to Design instead of deciding it inside
   the diff. For external input, framework adapters, API contracts, persistence,
   or validation, apply the **principle-boundary-discipline** and
   **principle-type-system-discipline** skills: parse at boundaries, keep
   business logic typed, and do not lie to the compiler.
3. Write the throughput checkpoint as four todo items. A dimension that genuinely does not apply (single file, no fan-out) keeps its item with `n/a: <reason>` rather than being dropped:
   - **Blocking first steps.** Gates run before fan-out.
   - **Independent workstreams.** Disjoint files, services, or layers parallelize. Shared writes serialize.
   - **Shared mutable state.** Default to splitting the target (the **principle-separate-before-serializing-shared-state** skill). Serialize only for real invariants.
   - **Smallest safe decomposition.** If one worker is best, name why.
4. Choose the execution topology from the checkpoint. One owner is the default,
   and one writable state has one active **single writer**. Fan out only disjoint
   workstreams with named file and behavior boundaries plus independent writable
   state. When a fresh worker would keep design exploration out of implementation
   context, compose **Agent handoff** from `agent-handoff.md`. Give it the approved
   Handoff, named artifacts, current workspace state, exact writable scope,
   verification target, and stop conditions. Require the handback to name changed files,
   commands run with observed results, verification evidence, anything left undone,
   and residual risks. Its completion returns ownership to Feature and is
   not final completion. When several valid implementation shapes
   would materially change the result, use the **arena** skill or an equivalent
   isolated candidate-and-review pass. The host may map these roles to agents,
   models, or sequential passes. The rule is that missing delegation support never blocks implementation.
   Comments per **Comments**. Make surgical edits, re-ground
   against the source for upstream-derived files, port shared-primitive
   improvements to all consumers, and verify each. Commit liberally.
5. Verify on the matching surface. "Inconclusive" or wrong-surface is not a pass; flag it.
6. Review before completion. For a delegated implementation, a medium or large
   change, or risk involving persisted data, public contracts, concurrency,
   security, or irreversible effects, use a fresh reviewer. It receives the
   request, Handoff and approved artifacts, repository instructions, actual diff,
   and verification evidence. It does not inherit the worker's reasoning. Select
   review angles from the change rather than a fixed checklist. The Feature owner
   adjudicates findings, rejects scope expansion, and chooses fixes. A fix pass
   returns to one single writer with a bounded Agent job; rerun matching
   verification and review only after material changes. Small deterministic work
   or a host without isolated contexts uses a separate sequential review pass in
   the owner context. Missing review infrastructure does not block the task or
   lower its proof bar.
7. Rebase into small, ordered commits; stack follow-ups.
   Use the **principle-sequence-verifiable-units** skill, building, verifying, and committing each small unit before the next.
8. If the implementation contradicts an approved design, return to Design. If
   the implementation is contested within that design, `interrogate` before
   shipping.
9. Run **Opening a PR**.

Code-coupled work (one feature, one migration) goes to a single owner with the checkpoint inline; that owner may fan out after the blocking phase. Parent-level fan-out is for slices that produce independent artifacts (audits, cross-subsystem investigations, competing experiments). Rewrite the checkpoint at phase boundaries. When the host supports isolated workers, assign a fresh owner context rather than chaining unrelated work through one worker. Parallel agents sharing one dirty worktree are not independent writers.

**Reply:** what you built, the approved sources executed, verification evidence,
and any decision that had to return to Design.
