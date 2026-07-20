### Agent handoff

**This is a non-owning composition playbook.** The selected playbook keeps task
ownership and composes this contract only when changing context or executor
reduces context load, isolates judgment, or separates writable state. It never
becomes a top-level route.

1. **Decide whether to transfer.** Stay with one owner for a small, tightly
   coupled, or deterministic task. Transfer when the current stage has produced
   a stable artifact and the next stage needs materially different evidence,
   when accumulated exploration would pollute the next decision, when an
   independent judgment is valuable, or when workstreams have independent
   writable state. A skipped transfer needs no ceremony.
2. **Choose context provenance.** Choose `fresh` or `inherited` context by the
   evidence the receiver needs, not by a host default. Fresh is the normal choice
   after decisions have been captured in artifacts and for independent review.
   Inherited context is reserved for a decision that still exists only in the
   live conversation. Record the reason when inherited context is necessary.
3. **Write the Agent job.** Pass conclusions and evidence, never private model
   reasoning or an unbounded transcript. Use named artifacts so the receiver can
   open authoritative sources directly:

   ```md
   ## Agent job
   - Role: <specialist | worker | reviewer>
   - Endpoint: <one observable deliverable>
   - Context: <fresh | inherited, with reason>
   - Authority: <Handoff and named artifact paths>
   - Locked / Open / Non-goals: <references, not copied rationale>
   - Evidence to inspect: <repo paths, diff, external contracts, runtime artifacts>
   - Writable scope: <none | exact shared state or isolated workspace>
   - Proof required: <artifact | checked | verified | independently reviewed>
   - Stop / escalate: <condition that returns ownership>
   - Return: <artifact path or concise structured fields>
   ```
4. **Protect ownership and state.** The receiver owns only the Agent job. It does
   not select another playbook or create a child workflow. Keep one active writer
   per writable state. Parallel writers require genuinely independent state;
   otherwise serialize ownership.
5. **Accept the return.** The owning playbook checks the returned artifact and
   proof against the Agent job. Worker completion is an intermediate handback,
   not task completion. The owner accepts, sends a bounded rework job, escalates
   an Open decision, or advances the playbook.

When the host lacks isolated roles or context control, execute the same jobs as
bounded sequential passes. Missing delegation changes throughput and review
independence; it does not lower the evidence bar or block the owning playbook.
