### Bug fix

**You own this task. Plan, review, verify.** Keep one owner for the causal model and final proof; use independent workers only where their scope is separable.

Be scientific. Every shipped line traces to runtime evidence. Belt-and-suspenders that "might help" is a hypothesis, not a fix; it does not ship. When evidence refutes a hypothesis, revert what it motivated. The smallest change the evidence justifies ships, nothing more. Same discipline for Perf, where the evidence is the trace.

1. Reproduce it yourself on the matching surface with whatever runtime-control capability the host provides. Don't hand the repro to the user. A debug or instrumentation protocol that says to ask the user does not override this; you drive the instrumented runtime. Ask the user only with a stated, specific reason the available controls cannot reach the target, and only after driving them as far as they go. Won't reproduce directly, force it: synthesize the trigger, tighten conditions, or instrument until it fires.
2. Binary-search the cause. Form the candidate hypotheses, then rule them out until one survives. Seed them with `how` over the affected subsystem and the **why** skill for regression history. Each pass, take the split that cuts the most remaining problem space, get runtime evidence, eliminate. When program state is unclear, add instrumentation or logging and read it as the code runs. Don't guess. For a long or stubborn hunt, invoke the available `loop` capability as a skill, command, CLI, or host primitive with the surviving-hypothesis check as its iteration gate. Confirm the surviving *mechanism* with runtime evidence before the step-3 architect/interrogate work.
3. Plan the fix. If it changes module interaction, ownership, public interfaces, seams, or caller migration, run `codebase-design` first. Use `architect` only when the chosen fix needs concrete type/signature/module sketches. Choose the executor from the active host. A bounded worker may implement the fix for independent review; otherwise the current agent implements it and performs a separate review pass. The playbook does not select a model.
4. Verify on the same surface; the original repro now passes. "Inconclusive" or wrong-surface is not a pass; flag it. Unit tests show branch behavior, not bug absence.
5. Stage the commits so the failing repro lands before the fix in git history; the diff tells the story. See the **tdd** skill for the failing-test-first cadence when the bug has a cheap local test path; skip it when the test would be expensive, integration-heavy, or unclear.
   This is the canonical **principle-sequence-verifiable-units** skill, the failing test first and the fix on top.
6. Run **Opening a PR**.

Investigation may run `how` + `why` in parallel when independent workers are available; otherwise run both passes sequentially and preserve the same evidence boundary.

**Reply:** what was broken, root cause, fix, how you verified. Paste failing-then-passing repro output verbatim.
