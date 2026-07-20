# Scout routing behavior regression set

Maintenance asset for changes to read-only evidence gathering, explorer or
investigator roles, long-input reduction, and decision-frontier fact lookup.
Normal BAM runs do not load this file.

## Promotion rule

Run each prompt against isolated baseline and candidate trees with the same
model and host capabilities. Promote only when the candidate routes bounded
fact gathering to Scout without moving design, review, or implementation
authority into that role, and without requiring an agent runtime.

## E021. Read-only evidence uses Scout before design

Prompt: "We are taking over a complex engineering task. Before design, three
read-only jobs are needed: trace a request through more than twenty files;
search git, PRs, issues, and design documents for historical evidence; and
reduce a long handoff record into confirmed decisions. A different context will
then do entity and codebase design. The host sometimes supports isolated agents
and sometimes has no delegation. From the repository's BAM instructions,
explain the roles, their boundaries and returns, when to parallelize, and the
no-agent-runtime path. Do not modify files."

Pass when:

- Bounded code, history, external-source, and long-record fact gathering route
  to Scout rather than being aliases for Specialist or Worker.
- Scout returns cited findings, sources and queries, dependencies or
  constraints, unknowns, and confidence or caveats.
- Scout does not design or synthesize the whole task; Specialist owns bounded
  design or synthesis, Reviewer judges independently, and Worker writes.
- Parallel Scout jobs are conditional on independent evidence slices, host
  support, and useful context isolation; sequential passes preserve the same
  evidence bar without delegation.
- The topology does not prescribe a model, thinking level, editor, or agent API.

## E022. Batch frontier facts use conditional Scouts

Prompt: "Thinking has produced an initial proposal. Six questions are currently
visible: four independent user decisions and two facts that require codebase
inspection. One later decision depends on the facts, and two later decisions
depend on the user's first-round choices. We want to use batch-grill-me to
converge. From the repository instructions, explain the first round, who handles
environment facts, how to recompute the frontier, what happens without isolated
agents, and when the session ends. Do not implement the proposal."

Pass when:

- The first round asks the four unblocked user decisions together and starts the
  two fact investigations without exposing dependent decisions early.
- Environment facts use bounded read-only Scouts when isolated roles are
  available and useful, with cited findings, sources and queries, unknowns, and
  confidence in the return.
- Without isolated roles, the current agent investigates directly; unrelated
  frontier questions continue and the evidence bar does not fall.
- Each round recomputes prerequisites, and work stops only when the frontier is
  empty and the user confirms shared understanding; no implementation starts.

## 2026-07-20 benchmark

Both configurations received the same organic prompts. The baseline was clean
`HEAD` at `45a96fc`; the candidate was the Scout routing worktree before this
eval file was added. Outputs were graded only against the assertions above.

| Eval | Baseline agy | Baseline Grok | Candidate agy | Candidate Grok |
|---|---:|---:|---:|---:|
| E021 | 2/5 | 2/5 | 5/5 | 5/5 |
| E022 | 3/4 | 3/4 | 4/4 | 4/4 |
| **Total** | **5/9** | **5/9** | **9/9** | **9/9** |

Models and isolation:

- agy: `Gemini 3.5 Flash (High)`, new project per run, plan mode.
- Grok: `grok-4.5`, plan permission mode, memory, subagents, and web search
  disabled.

Observed baseline failure: both models mapped explorer, historical investigator,
and long-record reduction work onto `bam-specialist`; E022 named only an
anonymous sub-agent. This blurred fact gathering with design and provided no
stable Scout return contract. Both baselines retained a sequential fallback.

Observed candidate behavior: both models routed the three E021 evidence jobs and
E022 environment facts to bounded read-only Scouts, reproduced the complete
return contract, kept design with Specialist and judgment with Reviewer, and
continued through bounded sequential passes when delegation was unavailable.
