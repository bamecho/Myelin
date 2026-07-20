### Eval

**You own the experiment design. Plan, blind, run, synthesize.**

For changes to Bam's plan/document lane, load `../evals/plan-behavior.md` as the
maintenance regression set. Normal feature and implementation runs do not load it.
For changes to host, model, loop, transcript, or worker assumptions, load
`../evals/portability-behavior.md`. Normal runs do not load it.

Evals test how a change affects agent behavior before promoting it: a new skill variant, a structural change, a prompt tweak. The failure mode is the observer effect. An agent that knows it's being evaluated behaves differently, so candidates must run blind.

**Non-negotiables for blinding:**

- No `eval`, `test`, `judge`, `experiment`, `rubric`, `score`, `compare`, `benchmark`, `candidate`, or `arena` in any directory, file, or prompt the candidate sees.
- The candidate prompt looks like an organic user request. State the goal, not the meta. "build me a small todo cli" not "show me how you follow the principles chain".
- No chain-eliciting cues. Don't ask the candidate to list which skills, principles, or files they applied; that meta-prompt inflates citation behavior. Ask for design notes generally and grade chain-following from code shape, not self-report.
- Sanitize directory and slug names. Use project-shaped names a user might pick, not labels like `candidate-1` or `agent-a`.
- Don't tell the candidate other candidates exist.
- The judge can know it's judging but sees outputs by sanitized label only, never by executor or model identity.
- Comparing two variants: one judge scores both sets in a single pass on one scale, blind to which set each came from. Two judge runs with different prompts don't compare, the calibration drifts.

**Steps:**

1. **Frame.** State what variant is under test and what behavior counts as success. Write the rubric (3-6 concrete criteria) for the judge only. Hold it back from candidates.
2. **Set up sanitized environments.** Per-candidate working dir with the variant in place. Plant any context an organic task would have: a project skeleton, the skills the candidate would naturally read.
3. **Author one organic prompt.** What a user would type. No leakage of what's being measured.
4. **Run N isolated candidates** per the **arena** skill's Phase B. Use parallel agents or different models when the host provides them; otherwise use separate fresh runs with no shared candidate context. Each works in its own sanitized dir with the same prompt.
5. **Run one blinded judge** per the **arena** skill's Phase C. It must not have produced a candidate or inherit candidate reasoning. Prefer an executor with independent context and different failure modes when available. The judge sees outputs by sanitized label and the rubric, never an executor or model identity. If the host cannot isolate the judge, mark the experiment degraded and do not make a promotion claim from it alone.
6. **Verify the chain from run records, not self-report.** Use transcripts, tool logs, or file-access records explicitly provided by the active host and scoped to the sanitized workspace. Never search global agent-history directories or unrelated workspaces. Look at which files each candidate actually opened. Citing a principle is not reading its leaf skill, and reading it is not applying it. A principle counts as correctly routed only if the selected playbook named it, or the run record shows it as a playbook gap with a proposed playbook-level fix. Grade chain-following from the files it really read plus the shape of the code, never from the candidate's own claims. When the host exposes no trustworthy run record, grade only observable output behavior and state that limitation.
7. **Read every candidate output yourself** end to end. Compare to the judge's verdict. Disagreement means the judge may be biased or the rubric is ambiguous. Synthesize.

**Reply:** variant under test, rubric, per-candidate notes, judge's verdict, your synthesis, and a recommendation for whether to promote the variant.
