### Perf issue

**You own the measurement story. Plan, review, verify the numbers.** Tie every fix to a measurement, don't read source instead of measuring.

1. Capture a baseline trace with the host's available runtime-control or profiling capability.
2. Use skill `how` to ground hypotheses; don't claim a perf ceiling without
   running it first.
3. Plan the fix from the trace. If it changes module interaction, ownership,
   public interfaces, seams, or caller migration, Use skill `codebase-design`
   first. Use skill `architect` only when the chosen fix needs concrete
   type/signature/module sketches. Choose the executor from the active host. Use
   a bounded worker when it adds independent review value; otherwise implement
   directly and run a separate review pass. Capture a post-fix trace.
   Use skill `principle-sequence-verifiable-units`, verifying each attempt
   before trying the next.
4. Parse and compare the artifacts (JSON to sqlite, diff). "Inconclusive" or wrong-surface is not a pass; flag it.
5. Cite the measurement in the PR.
6. Run **Opening a PR**.

For sustained improvement against a metric rather than a one-off fix, use the Hillclimb playbook (`playbooks/hillclimb.md`).

**Reply:** baseline number, post-fix number, delta, artifact path.
