# Codebase-design behavior evaluation

## Goal

Measure whether the runtime guidance improves architecture decisions without
crowding out repository evidence or implementation judgment. A shorter document
is not an improvement unless source fidelity and downstream boundaries survive.

## Model and method

- Model: `Gemini 3.5 Flash (High)` through `agy`.
- Each design run used an isolated copy of the skill and fixture.
- Fixtures included approved requirements, current source and tests, and an
  explicitly stale architecture proposal.
- Downstream runs gave a fresh model the generated design plus the approved
  spec, then ran executable Node tests and inspected the resulting diff.

## Results: shared dry-run plan

The fixture added a dry-run CLI path that must share an ordered operation list
with normal execution while avoiding the remote client.

| Input | Design size | Downstream result |
|---|---:|---|
| Current skill | 361 words | 3/3 tests passed; `cli.js` owned dry-run I/O and `sync.js` stayed pure. |
| Route-word candidate | 231 words | 3/3 tests passed; same clean boundary. |
| No-skill design | 417 words | 3/3 tests passed; same clean boundary. |
| No design artifact | none | 3/3 tests passed, but `syncSessions` gained `dryRun` and `stdout` options, coupling core sync to CLI output policy. |

The first fixture initially encoded the Handoff Skip boolean incorrectly. Its
artifact and implementation results remain useful because the user explicitly
requested a design, but its routing result was discarded. A corrected routing
fixture confirmed that `codebase-design: yes` means skip and
`codebase-design: no` means run. The current skill routed correctly. Reversing
that line made the candidate return `SKIP` for a real multi-module design when
it read only the skill and Handoff, so the candidate was rejected.

The design artifact had practical value even though all executable tests passed:
it prevented a dependency-direction regression that the behavior tests did not
express. This is the useful role of this skill. It agrees ownership and allowed
dependencies before implementation; it is not merely a longer implementation
prompt.

## Results: stale deepening proposal

The second fixture contained an old proposal to merge public modules, delete
their focused tests, add Stripe ports and adapters, and migrate to TypeScript.

When the approved spec explicitly preserved those contracts:

| Input | Output size | Source fidelity |
|---|---:|---|
| Current `DEEPENING.md` | 378 words | Passed |
| Evidence-worded deepening candidate | 720 words | Passed |
| No skill | 548 words | Passed |

When the spec only required backward compatibility and the model had to infer
public contracts from `package.json` exports, source imports, and tests:

| Input | Output size | Repository fidelity |
|---|---:|---|
| Current `DEEPENING.md` | 300 words | Passed; preserved subpath exports and focused tests. |
| Evidence-worded deepening candidate | 481 words | Passed, with more explanation. |
| No skill | 412 words | Passed. |

The current deepener's absolute statements remain worth challenging in future
fixtures, but they did not cause a measured failure here. Rewriting them made
both outputs longer and did not improve a decision, so that candidate was not
promoted.

## Results: remove the deliverable template

Replacing the default outline with five lines of prose reduced the main skill
from 666 to 633 words.

| Fixture | Current output | Lean output | Result |
|---|---:|---:|---|
| Shared dry-run plan | 361 words | 283 words | Both preserved the intended boundary. |
| Implicit public contracts | 300 words | 301 words | Lean output lost the explicit test-boundary account and still included full function bodies. |

The runtime reduction was about 5% and the output reduction did not repeat.
The candidate was rejected.

## Results: human architecture contract

The new evaluation reframed the deliverable around logical modules, semantic
interfaces, caller knowledge, and control/data/error interaction. It added a
human correction test and kept the earlier stale-context fixtures.

| Case | Old output | Final output | Material result |
|---|---:|---:|---|
| Shared sync preview | 333 words | 371 words | Both chose shared policy; the final output used declarations instead of three complete implementations. |
| Billing preview | 292 words | 517 words | Final output preserved JavaScript contracts and documented validation, plan shape, and gateway interaction; old output used TypeScript signatures. |
| Human correction | 378 words | 397 words | Both accepted independent `SyncPlanner`; final output kept exact `plan(records)` and omitted complete implementations and rejected alternatives. |

Formal grading across 18 assertions improved from 83.3% to 88.9%. The final
sync and correction artifacts still implied rather than named the complete
`run` / `createClient` / `syncSessions` export set; this remains a low-severity
review gap. The generated review page records that failure instead of hiding it.

## Results: context isolation

`DEEPENING.md` and `DESIGN-IT-TWICE.md` added 726 words when the model loaded
them. Removing only their links did not work: the model discovered both files
and the old evaluation history, then proposed a fake preview client from stale
notes. A soft instruction was also inconsistent across runs. Removing the two
runtime deepeners stopped the extra reads in the final sync, billing, and
correction runs without losing the target architecture.

The final corrected design then drove a fresh implementation. Executable tests
changed from 0/2 to 2/2 passing. Inspection confirmed that both CLI and executor
call an independent `plan(records)`, the planner contains no client or stdout
dependency, and `src/index.js` remains byte-for-byte unchanged.

## Decision

- Promote the tested architecture-contract skill and remove both runtime
  deepeners; their measured context cost did not buy a better decision and once
  caused a stale adapter regression.
- Keep skipping codebase design when one owner and interaction are obvious.
- Keep the output free of predicted diffs and full implementations. The human
  approves responsibility, semantic interfaces, and interaction; implementation
  retains local freedom.
- Keep evaluation history out of runtime context. It remains under `evals/` as
  evidence and is loaded only when the user asks to evaluate the skill.
- Do not add reviewers, audit stages, fallback layers, or mandatory sections.
