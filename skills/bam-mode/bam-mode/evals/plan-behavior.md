# Plan behavior regression set

Maintenance asset for changes to Bam's document lane. Normal feature,
implementation, and planning runs do not load this file.

## Promotion rule

Change runtime instructions only after a real run exposes a repeatable behavior
problem. Compare the candidate instruction with the current version on the same
frozen spec, design, repository state, prompt, and verification. Promote the
smallest change that improves execution without moving product or architecture
decisions into the plan.

Record failures as one of: routing miss, invented upstream decision, copied
upstream content, missing execution dependency, unverifiable acceptance,
unnecessary prescription, or ineffective review gate.

## E001. Explicit plan request produces a deliverable

Prompt: "Given this approved spec and codebase design, write the implementation
plan. Do not implement yet."

Pass when:

- The result is `note` or `full`, never `none`.
- It names the actual source artifacts.
- It preserves product tokens, ownership, interfaces, and non-goals.
- It adds an executable change/order, verification, and a real stop condition.
- It does not copy upstream field tables or design rationale.

## E002. Taskable implementation does not require a plan

Prompt: "Implement this approved single-slice design and leave the named tests
green."

Pass when:

- The route may choose plan thickness `none`.
- Omitting a plan does not weaken upstream product locks or verification.
- No plan file is created merely to complete a document pipeline.

Evidence: `insight-pilot/.audit/plan-leverage/results/score.md`. On the frozen
session-operator-tags fixture, no plan, a short note, and an expanded plan all
scored 12/12. The expanded package took about 40 seconds longer and added about
79 insertions without changing architecture or correctness.

## E003. Full plan earns its detail

Prompt: "Write the plan for this approved migration. Two owners work in
parallel, the intermediate schema must remain readable for one release, and the
run must stop if old/new counts diverge. Do not implement."

Pass when:

- Thickness is `full`.
- Slices expose ownership, dependencies, the intentional intermediate state,
  verification, and the count-divergence stop rule.
- Extra detail serves coordination or a stop decision rather than prescribing
  local implementation choices.
- The output is scored directly against its sources; review status is not used
  as a proxy for source fidelity.

## E004. Handoff keeps undecided product rules open

Prompt: "Design labels for sessions at extract that also show up on signals.
Keep it simple."

Pass when:

- Undecided field names, CLI shape, regex, ordering, warning codes, and
  store/compute choices remain Open instead of becoming settled plan facts.
- Entity, design, and plan consume the same Locked decisions.
- No unsolicited query map or other product surface appears.

Evidence: `insight-pilot/.audit/skill-lane-baseline/results-ambiguous/score.md`.
The measured settled-decision drift fell from at least four items before the
Handoff contract to zero after it.

## E005. Resumed-session noise does not override approved sources

Prompt shape: resume a migration-planning session with stale notes that propose
serial owners, a mismatch tolerance, legacy cleanup, a renamed command, and a
repair CLI. Then provide an approved spec and codebase design that explicitly
reject those choices.

Pass when:

- Owner A and Owner B remain independent and parallel.
- Comparison telemetry includes old count, new count, and event offset.
- Rollout stops on any count difference, with no tolerance.
- Legacy cleanup, command renaming, repair commands, feature flags, production
  rollout steps, and unapproved test paths are not invented.
- The candidate reads the actual plan contract instead of planning from the
  handoff summary alone.

Measure both source fidelity and context cost: runtime files read, output
tokens, and total wall time. A shorter handoff is not an improvement when the
model compensates with a longer plan or skips a source.

## E006. Rough implementation request has one owning flow

Prompt: "Build a shareable dashboard snapshot feature. The idea is still rough:
filters should survive a link, access must stay private, and I have not decided
whether a snapshot is stored or computed."

Pass when:

- Feature is the single owning playbook and composes Design before code.
- Design owns the complete `think` -> entity model -> codebase design -> plan
  sequence; the top-level skill does not assemble supplemental gates.
- Store/compute and lifecycle decisions happen before module ownership and
  interfaces.
- Missing product choices remain Open. No implementation begins from invented
  defaults.
- Plan is `none`, `note`, or `full` because it changes execution, not because a
  document pipeline requires it.

## E007. Design-only request stops at its requested artifact

Prompt: "Help me decide the target model and module boundaries for expiring
share links. Do not plan or implement it yet."

Pass when:

- Design owns the request and stops after the approved design artifact.
- Entity and codebase stages run or skip from their actual decision triggers.
- No plan and no Feature execution appears merely because they are later in the
  playbook.
- The reasoning may use any useful method; only evidence, decisions,
  uncertainty, and the Handoff contract are required.

## E008. Taskable implementation keeps the thin Feature path

Prompt: "Implement this approved single-owner design and leave the named tests
green. All product, entity, and interface decisions are locked in the attached
handoff."

Pass when:

- Feature records `design skipped: taskable input` and implements directly.
- It does not rerun thinking, entity modeling, or codebase design.
- Plan may remain `none`; the approved Handoff stays authoritative.
- A newly discovered product/entity/ownership gap returns to Design instead of
  being decided inside the diff.

## E009. Product tradeoff loads only the relevant lens

Prompt: "Design the first-run experience for a developer CLI. We can either ship
five setup options now or make one core path polished. Give me a recommendation,
not an implementation plan."

Pass when:

- Design uses `principle-experience-first` because product experience and scope
  are the actual choice.
- Entity, codebase, and plan stages stop or skip from their own triggers.
- It does not load unrelated data, migration, concurrency, or execution
  principles as a completeness checklist.

## E010. Stateful lifecycle loads domain modeling without type scaffolding

Prompt: "Design the entity model for an upload that can be pending, processing,
complete, failed, or cancelled. Retries must not create contradictory states.
Stop after the entity model."

Pass when:

- The entity stage uses `principle-model-the-domain` to prevent scattered flags
  or invalid lifecycle combinations.
- The result stays at business facts, lifecycle, and invariants. It does not
  invent module boundaries, exact language types, or an implementation plan.
- No unrelated principle list or skipped-principle narration appears.

## E011. Boundary design loads architecture lenses from observable risk

Prompt: "Design the module boundary for webhook ingestion. Raw provider payloads
need validation, but internal handlers should not repeat guards. The current
wrapper chain is hard to trace. Stop after codebase design."

Pass when:

- Codebase design uses `principle-boundary-discipline` for parse/validation and
  error ownership, and `principle-minimize-reader-load` for the wrapper chain.
- It does not use type-system or implementation principles merely because code
  will eventually be typed.
- The design stops without a plan or code.

## E012. Retryable migration plan loads execution-risk principles

Prompt: "Write the full plan for migrating queued jobs to a new store. Workers
may crash and retry, each phase needs a check, and the run must converge after a
partial attempt. The target entity and module design are approved. Do not code."

Pass when:

- Plan uses `principle-sequence-verifiable-units` and
  `principle-make-operations-idempotent` because the prompt names their risks.
- It uses `principle-outcome-oriented-execution` only to preserve the approved
  target and explicit intermediate states, not to excuse unverified breakage.
- It does not reopen approved entity or module decisions or dump unused
  principles.

## Result record

For each run, keep the prompt package, candidate output or diff, verification
command and output, time/tokens when available, and a short score against the
case above. Store bulky artifacts with the experiment, not in runtime references.

## Results: risk-triggered principle routing, 2026-07-20

`agy` with `Gemini 3.5 Flash (High)` and `grok` with `grok-4.5` ran
E009-E012 against isolated skill trees. The final control trees differed in one
runtime file only: `bam-mode/playbooks/design.md`. Agy used `--new-project`;
grok used no memory, subagents, or web search. Both models received the same
fixture repository and prompt for each pair.

An earlier 16-run batch was discarded because the candidate tree also contained
E009-E012 in `evals/plan-behavior.md`. Grok reported reading eval material, so
that batch could not isolate the runtime instruction. One later agy invocation
terminated with a CLI error and was rerun; the failed invocation produced no
candidate response and is not scored.

| Case | Old Design | Final Design |
|---|---|---|
| E009 product experience | Flash also loaded `subtract-before-you-add`; Grok used only `experience-first` | Both used only `experience-first` |
| E010 entity lifecycle | Flash added idempotence and foundational thinking; Grok added idempotence | The first candidate still added idempotence in both models. After narrowing retry ownership to the entity vs execution step, both used only `model-the-domain` |
| E011 webhook boundary | Both added `type-system-discipline` to the two boundary risks | Both used only `boundary-discipline` and `minimize-reader-load` |
| E012 retryable migration | Flash loaded five principles; Grok substituted `prove-it-works` for the plan's outcome lens | Both used only `sequence-verifiable-units`, `make-operations-idempotent`, and `outcome-oriented-execution` |

Exact risk-to-step principle selection improved from 1/8 old responses to 8/8
final responses. All 16 old/final responses still stopped at the requested
recommendation, entity, codebase-design, or plan endpoint. The gain is selection
precision, not a fixed reasoning template: the two final E010 responses chose
different entity shapes while respecting the same domain boundary.

The final response word count was not stable enough to support a context-cost
claim. Grok fell about 2% across its four pairs, while Flash rose about 54%
because it sometimes returned the full artifact in chat and sometimes linked
it. Mean wall time fell from 77.5s to 50.4s across the eight pairs, but one run
per model/case is too small for a performance claim. No runtime rule was added
from either metric.

## Results: owning-playbook router, 2026-07-20

`agy` with `Gemini 3.5 Flash (High)` and `grok` with `grok-4.5` ran E006-E008
against isolated old and revised skill trees. The two trees differed only in
`bam-mode`; the fixture repository and other skills were identical. Agy used
`--new-project`; grok used no memory or subagents.

| Case | Flash High old -> revised | Grok old -> revised |
|---|---|---|
| Rough feature + explicit plan | Feature assembled top-level gates -> Design owned the run and preserved the Open decisions | Feature assembled top-level gates -> Design ran entity before codebase before a `note` plan |
| Design-only endpoint | Investigation -> Design, plan `none`, no implementation | Feature -> Design, plan `none`, no implementation |
| Taskable implementation | Both implemented directly and left 2/2 tests green; revised recorded `design skipped: taskable input` | Both implemented directly and left 2/2 tests green; revised replaced top-level entity/codebase skips with one Design skip |

The revised tree satisfied the owning-playbook and composition expectation in
all six runs. The old tree satisfied none because routing was split between the
top-level skill and Feature or Investigation. Both versions could reach correct
endpoints; the measured gain is stable ownership and stopping behavior, not a
claim that one template improves the model's reasoning.

| Model / case | Old | Revised |
|---|---:|---:|
| Flash High / rough plan | 48s | 47s |
| Flash High / design only | 64s | 48s |
| Flash High / taskable feature | 19s | 29s |
| Grok / rough plan | 91s | 115s |
| Grok / design only | 160s | 117s |
| Grok / taskable feature | 59s | 57s |

Mean wall time fell from 73.5s to 68.8s, but six samples are too few for a
performance claim. Response length was also not comparable in the design-only
case because agy wrote the design body to a separate artifact. No runtime rule
was added from either metric.

An earlier agy batch was discarded because it reused an existing Antigravity
project and read unrelated repositories. Absolute source paths exposed the
contamination. The recorded batch reran every agy case with `--new-project`.

## Results: plan-runtime redesign, 2026-07-17

Gemini CLI ran frozen old/current instructions against the same source files.

| Case | Old | Revised | Result |
|---|---|---|---|
| Explicit single-slice plan | about 716 output tokens; 6-task index; copied scope | about 447 output tokens; one atomic slice; source paths, verify, and stop preserved | revised wins |
| Two-owner migration plan | about 1198 output tokens | about 712 output tokens | both failed source fidelity |

The revised single-slice plan stopped inventing a new integration-test file and
did not route the multi-module change to `full`. This supports the explicit
plan/implementation distinction and the subtraction rule.

The migration plan still serialized Owner B behind Owner A, proposed cleanup
excluded by the spec, and weakened an "any difference" stop rule. A dedicated
reviewer was tried four times. It repeatedly focused on `draft`/`ready` or
template completeness, variably caught owner/threshold drift, and still marked
the explicitly listed removals as `pass`. Therefore the formal plan-review gate
and status transition were removed. Keep `full` as a coordination representation,
but do not promote it as proven protection for autonomous migration execution.

## Results: resumed-session context noise, 2026-07-17

Gemini CLI ran a frozen migration fixture whose stale session notes contradicted
the approved spec and design. Candidate outputs were returned in chat; no
implementation files were changed.

| Route | Runs | Runtime reads | Output tokens | Result |
|---|---:|---:|---:|---|
| Plan contract only, with stale notes | 2 | 4 each | 546, 506 | Both preserved parallelism and the zero-tolerance stop, but both omitted the required event offset. |
| Current Bam full route, with stale notes | 2 | 7 each | 1163, 1207 | Both preserved the tested source decisions. Output repeated route status, handoff decisions, and plan content. |
| Pointer-only handoff candidate | 2 | 7, 5 | 1168, 1158 | No output reduction. One run invented a feature flag, test paths, production rollout, and dashboards; the other skipped the plan contract read. |

The current full route costs more but was the most stable condition in this
fixture. Do not replace the expanded handoff with source pointers. The main
`SKILL.md` remains the largest runtime document, but this experiment did not
isolate a safe reduction to it. Any reduction there needs the same noisy-source
test plus downstream implementation, not a prose-only size argument.

## Results: main-router context subtraction, 2026-07-17

Gemini CLI compared the current runtime with progressively smaller main routers
on the stale migration, a single-slice plan, and a real one-file implementation.
Temporary candidates ran from isolated paths and were not promoted.

| Candidate | Runtime reduction | Measured result | Decision |
|---|---:|---|---|
| Router-only main skill | 59% of main `SKILL.md` words | Single-slice planning skipped the plan contract; full planning lost an A+B dependency; implementation used `.trim()` and violated the ASCII-space-only spec outside the original tests. | Reject |
| Remove scale, supplemental catalog, review list, and output checklist | 26% of main `SKILL.md` words | Single-slice output fell from 468 to 131 words and improved empty-vs-absent fidelity. In three migration runs, two omitted `eventOffset` or assigned the rollout gate to the wrong owner; the third expanded to 103 lines and invented test paths. | Reject |
| Remove only the output checklist | 3% of main `SKILL.md` words | The isolated migration run skipped the plan contract and assigned the rollout gate to Owner B. | Reject |
| Move plan experiment history out of runtime | 11% of `plan.md` words | Two forced-contract reads preserved telemetry and zero tolerance, but one incorrectly made rollout verification parallel with Owner A and B instead of depending on both. | Reject |

The implementation fixture was strengthened after a false green: it now checks
leading and trailing tab and non-breaking-space behavior, not only internal
tabs. With that check present, current and conservative routers both produced a
one-file implementation and passed all tests. That proves the fixture, not the
router subtraction. No runtime change earned promotion from this experiment.
