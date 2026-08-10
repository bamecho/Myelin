# Think behavior evaluation

Maintenance evidence for changes to `think`. Normal invocations do not load
this file.

## 2026-08-10: independent decision surface

An observed behavior problem motivated the change: independent `think` answers
described downstream skills, Handoff, approval routing, and a current delivery
slice even when the user asked only for a recommendation. The candidate changed
`think` alone. Bam runtime files remained unchanged for the promoted condition.

All candidate runs used isolated `agy --new-project` sessions with Gemini 3.6
Flash (High), high effort, and plan mode. The candidate never saw this rubric.
A fresh isolated run of the same model judged paired outputs under arbitrary
labels. One shell-corrupted batch-grill attempt was discarded and rerun with
the full prompt safely quoted.

| Organic request | Current output tokens | Final output tokens | Material result |
|---|---:|---:|---|
| Direct plugin-system decision | 659 | 473 | Same recommendation and premise; final removed the unrequested Delivery Slice section. |
| Explicit quiet-hours product spec | 768 | 719 | Both retained Target, Scope, Acceptance, premise, and the queued-message blocker. |
| Broad local-first collaboration direction | 1378 | 1049 | Final covered the requested solution without forced slices, downstream skills, or Next Steps. |
| Explicit dashboard-sharing spec and roadmap | 1055 | 691 | Final kept private links current and public links/analytics deferred without routing narration. |
| Keep/kill unused export preset | 324 | 353 | Both returned Kill; final added the premise that would change the verdict. |

The blinded judge scored current 46/50 and final 50/50. The two material current
failures were forced delivery slicing plus downstream skill routing on the broad
direction, and next-stage routing after the requested roadmap. The explicit spec
was a 10/10 tie, so making spec output conditional did not reduce its decision
surface in this run.

The quiet-hours specs were each handed to a fresh `batch-grill-me` run. Both
produced a complete first frontier (7 questions current, 6 final); the final did
not need an embedded Handoff or composition instruction.

A system regression then combined the final independent `think` with the
unchanged Bam Design playbook. It still selected private expiring links as the
current phase and kept public links and analytics deferred. A separate candidate
that also rewrote Bam's Design step emitted Workflow Progress, composed-skill,
and Next Steps narration, so that Bam wording change was rejected.

## Decision

- Promote the independent decision surface in `think`.
- Keep spec output conditional on user request or a durable multi-part decision.
- Keep Handoff, delivery-slice ownership, and downstream routing out of `think`.
- Leave Bam Design and its Handoff contract unchanged; they already own
  composition and retain current-slice behavior.
- Treat output-size changes as supporting data only. The promotion rests on
  request fidelity, preserved spec quality, the batch-grill handoff, and the Bam
  system regression.

These are single runs per condition on one model. Future changes should retain
the five prompts above and broaden model/run coverage when behavior is close.

## 2026-08-10: Wayfinder-inspired solution exploration

We tested whether a minimal spec needs an explicit instruction to identify its
load-bearing decision and explore materially different solution mechanisms.
Three organic prompts covered a multi-mechanism webhook design, an obvious JSON
preference change, and an encrypted collaborative whiteboard with an unresolved
revocation requirement. All runs used isolated `agy --new-project` sessions with
Gemini 3.6 Flash (High), high effort, and plan mode.

The first candidate told the model to explore mechanisms until one dominated or
the deciding tradeoff was clear. A blinded judge scored current 30/30 and the
candidate 21/30. The candidate hedged between inline and worker processing,
repeated a given constraint as a fragile premise, and left the whiteboard
recommendation conditional instead of choosing an honest default.

The second candidate moved comparison into private reasoning and required a
default unless no honest default survived a blocker. It fixed the hedging, but
current still won 30/30 to 26/30. The candidate leaked effort and execution-flow
detail, lost the JSON round-trip premise and useful close alternative on the
simple case, and only tied current on the hard whiteboard decision. Its useful
extra observation--plaintext already rendered on a client cannot be revoked by
cryptography alone--did not justify the cross-case regressions.

### Decision

- Reject both exploration instructions; leave runtime `think` unchanged.
- The current recommendation, close-alternative, and fragile-premise rules
  already explore a minimal spec proportionately on these cases.
- Keep large cross-session decision mapping outside `think`. Revisit runtime
  guidance only after a real run shows premature commitment to the first
  plausible mechanism.
