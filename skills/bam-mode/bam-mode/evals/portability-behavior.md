# Portability behavior regression set

Maintenance asset for changes to host, model, loop, transcript, or worker
assumptions. Normal BAM runs do not load this file.

## Promotion rule

Run the same organic prompt against isolated old and candidate skill trees.
Promote only when the candidate preserves the owning playbook and verification
bar while removing dependence on a named editor, model, agent API, transcript
layout, or PR provider.

## E013. Multi-phase plan stays inside Design

Prompt: "Write a five-PR migration plan for replacing REST auth tokens with
signed sessions. The product, entity, and module decisions are approved. Do not
implement."

Pass when:

- Design owns the request and selects plan thickness `full`.
- No separate multi-phase-plan playbook is required.
- The plan keeps slices, dependencies, checks, and stop rules without selecting
  an editor, model, or worker runtime.

## E014. Single-agent Feature remains executable

Prompt: "Implement a small one-file parser from an approved handoff. The active
host has no subagent runtime."

Pass when:

- Feature remains the owner and does not block on delegation.
- One owner may implement and run a separate review pass.
- No model name or unavailable worker type is prescribed.

## E015. Loop resolves through the active host

Prompt: "Keep investigating an intermittent test hang until one runtime-backed
root cause survives. The host exposes a repeat-until command, but no `/loop`
command and no worker agents."

Pass when:

- Bug fix or Runtime forensics keeps the narrow causal owner and uses the
  available loop capability. Autonomous contributes only its loop contract.
- The loop receives an iteration gate, verification, checkpoint, and stop rule.
- Unknown invocation syntax and exit polarity remain Open until the host
  contract supplies them.
- Missing Cursor or worker capabilities do not stop the investigation.

## E016. PR monitoring is provider-neutral

Prompt: "Open the prepared change as a PR and monitor required CI and blocking
review feedback. The host exposes a provider CLI and a watch-run skill, but no
GitHub CLI or Cursor built-ins."

Pass when:

- Opening a PR uses the available provider interface and loop capability.
- It applies `unslop` without requiring `/deslop`.
- It does not require `Task`, `babysit`, `gh`, Cursor, or a fixed base-branch
  name.
- It leaves provider verbs and fields Open when their contract is unavailable.
- It shows no placeholder or illustrative provider/watch command with unverified
  verbs or flags.

## Result record

Keep the prompt, output, assertion score, model, duration when available, and
the exact old/candidate trees. Discard a run if the candidate can read this
regression file or another artifact that reveals the comparison.

## Results: host and executor portability, 2026-07-20

`agy` with `Gemini 3.5 Flash (High)` and `grok` with `grok-4.5` ran E013-E016
against isolated old and candidate skill trees. Agy used `--new-project` in plan
mode. Grok used no memory, subagents, or web search. Both received the same
read-only prompt for each pair. The controlled candidate tree was created before
this regression file, so neither model could read the rubric.

| Case | Old | Final | Observed change |
|---|---:|---:|---|
| E013 | 0/2 | 2/2 | Both models moved multi-PR planning from the deleted playbook into Design with thickness `full`. |
| E014 | 1/2 | 2/2 | Both final runs used one owner and continued without a worker runtime or model selection. |
| E015 | 1/2 | 2/2 | The narrow diagnostic owner retained the root-cause predicate; Autonomous contributed only the loop contract, and unknown command polarity stayed Open. |
| E016 | 0/2 | 2/2 | Both final runs resolved the real base branch and left provider/watch syntax Open without placeholder commands. |
| **Total** | **2/8** | **8/8** | |

The first candidate run exposed two repeatable gaps. Flash let Autonomous steal
ownership from Bug fix and stopped at artifact capture, then invented provider
and watch command shapes after saying their contracts were unknown. The final
instructions fix those observed failures. Two agy invocations hit a temporary
individual-quota window and produced no response; they were excluded and rerun
after the reported reset.

Artifacts: `/tmp/bam-portability-nmQRNp/results/`. Baseline tree:
`/tmp/bam-portability-nmQRNp/harbor/`. Final controlled tree:
`/tmp/bam-portability-nmQRNp/meadow/`.
