# Goal Document: Codebase design as a human architecture contract

## Go / No-Go

- **Judgment**: Go
- **Reason**: The user approved the target model: review modules, semantic
  interfaces, and interaction before implementation, while leaving file-level
  diff control to implementation review and `show-me-your-work`.

## Target Outcome

`codebase-design` compresses a large future implementation into a small set of
architecture decisions a human can understand and correct before code exists.
The artifact explains module responsibility, what each module hides, dependency
and interaction direction, interface semantics, caller knowledge, and genuine
design choices. It does not prescribe file diffs or local implementation.

## Goal Definition

- **Type**: quality
- **Boundary**: Revise and evaluate `codebase-design/SKILL.md`; change optional
  deepeners only when a test proves they block the target output.
- **Non-goals**:
  - Predict files, line counts, implementation slices, or code-review workflow.
  - Add reviewers, audit stages, fallback layers, or implementation gates.
  - Turn the artifact into type scaffolding or a detailed plan.
- **Deferred work**:
  - Trigger-description optimization.
  - Changes to `show-me-your-work` or plan execution.
- **Verification rule**: Compare the current skill and an isolated candidate on
  realistic repositories with stale context, then use each artifact to drive a
  fresh implementation or architecture correction.
- **Evidence source**: Generated design artifacts, downstream code structure,
  executable tests, dependency/interface checks, and human reviewability.
- **Pass criteria**: The candidate must preserve source fidelity, expose the
  important architecture choice, make module interaction and interface semantics
  easier to correct, avoid full function bodies, and produce downstream code that
  follows the approved architecture. No high-severity regression may appear.
- **Confidence note**: Executable tests prove behavior; diff inspection and
  dependency checks prove architecture facts. Human review remains the authority
  on whether the artifact makes disagreement visible.
- **Judgment owner**: User for artifact quality; tests and repository inspection
  for downstream behavior and architecture conformance.

## Current State

- The current skill reliably grounds designs in real paths, preserves public
  contracts, and resists explicitly stale architecture notes.
- Its outputs often include complete function bodies and organize around files,
  diagrams, and static module roles.
- Existing evaluation proved that a design artifact can prevent CLI concerns
  from leaking into core logic even when both implementations pass tests.
- The current artifact does not consistently explain what a module hides, what
  callers stop knowing, or the semantics of module interaction.

## Priority Rationale

- Change the output model before changing deepening theory. The user's problem is
  architecture comprehension, not missing architecture rules.
- Test correction and downstream conformance before promoting prose changes.

## Assumptions and Open Decisions

| Item | Status | Impact | Owner / Next step |
|---|---|---|---|
| Module means a logical responsibility, not necessarily one file | confirmed | Prevents file maps from replacing architecture | Candidate wording |
| Interface detail stops at semantic contract and useful signatures | confirmed | Leaves local implementation freedom | Candidate wording |
| Current optional deepeners remain unless they fail an eval | confirmed | Avoids unproven runtime churn | Evaluation |

## Phases

### Phase 1: Candidate output contract

- **Purpose**: Reframe the artifact around modules, interfaces, and interaction.
- **Entry condition**: Approved target and existing behavior evidence are available.
- **Phase rules**:
  - Work in an isolated candidate first.
  - Preserve repository grounding, public-contract protection, and skip behavior.
  - Do not add a file map, LOC budget, full implementation, or mandatory ceremony.
- **Todos**:
  - [ ] Draft the candidate runtime instruction.
    - **Surface**: `codebase-design/SKILL.md` candidate copy
    - **Proof**: Focused diff against current runtime
    - **Depends on**: none
- **Exit proof**: Candidate is smaller or comparably sized and expresses the
  approved architecture-review questions without prescribing implementation.
- **Stop condition**: The candidate needs new review stages or duplicates plan.

### Phase 2: Behavioral comparison

- **Purpose**: Test whether the new contract produces a more correctable design.
- **Entry condition**: Candidate exists only in the experiment workspace.
- **Phase rules**:
  - Use `Gemini 3.5 Flash (High)` through `agy`.
  - Isolate each current/candidate run and discard malformed fixtures.
  - Score architecture content and downstream behavior, not document size alone.
- **Todos**:
  - [ ] Run current and candidate on a shared-core/CLI boundary task.
    - **Proof**: Artifacts expose ownership, interaction, interface semantics,
      caller knowledge, and no full function implementations.
  - [ ] Run current and candidate on a code-evidenced public-contract task.
    - **Proof**: Artifacts infer current consumers and reject stale architecture.
  - [ ] Apply an architecture correction and drive a fresh implementation.
    - **Proof**: The implementation follows the corrected interaction model and
      passes executable tests.
- **Exit proof**: Candidate wins the architecture contract without losing source
  fidelity or downstream correctness.
- **Stop condition**: Any candidate creates a high-severity interface, ownership,
  or dependency regression.

### Phase 3: Promotion and cleanup

- **Purpose**: Promote only measured improvement and leave no experiment debris.
- **Entry condition**: Phase 2 passes.
- **Phase rules**:
  - Apply the exact tested candidate to the formal skill.
  - Record results under non-runtime `evals/`.
  - Preserve the existing index and unrelated working-tree changes.
- **Todos**:
  - [ ] Apply the passing runtime diff and evidence record.
    - **Proof**: Formal diff matches the tested candidate.
  - [ ] Run validation and clean temporary processes and directories.
    - **Proof**: Validation and `git diff --check` pass; no experiment remains.
- **Exit proof**: Formal runtime matches the winning candidate and the workspace
  contains only intended evidence and runtime changes.
- **Stop condition**: No candidate passes all evidence gates; record the result
  and keep current runtime.

## Dry-Run Findings

- Existing fixtures cover source fidelity and downstream dependency direction,
  but the new objective needs one test where a human architecture correction
  changes module interaction before implementation.
- Output word count is supporting evidence only. A short artifact that hides the
  architecture choice fails.

## Final Validation

- Run the repository's Bam validation script.
- Run `git diff --check`.
- Inspect the formal runtime diff against the evaluated candidate.
- Confirm no `agy`, Gemini, or experiment directories remain.

## First Execution Step

Create an isolated candidate that replaces file-oriented output guidance with a
human-approvable module, interface, and interaction contract.
