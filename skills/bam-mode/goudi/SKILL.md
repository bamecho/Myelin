---
name: goudi
description: "Pressure-test an ambitious proposal into a grounded landing judgment: go / shrink / pause / reject / validate-first, with one minimum-viable first move, cut list, verification, and stop rule. User-invoked only (苟帝 / goudi / 落地压力测试)."
disable-model-invocation: true
---

# Goudi

For Chinese readers, see `SKILL.zh_CN.md`. The English `SKILL.md` is the execution source of truth.

**User-invoked only.** Run this skill when the user explicitly calls it. Do not auto-route here from other skills or from vague “be realistic” chat.

## Overview

Use when a proposal has more ambition than executable grounding. Force a survivable first move: verifiable, reversible where possible, useful this week.

This skill is not timid or anti-refactor. It compresses the first step, not the ambition.

## Core Principle

先把路踩实，再谈大胜利。

A useful landing answer must cover:

- What is the smallest move that proves this direction?
- What evidence says the move is working?
- What real constraint can break it?
- What should be deliberately cut from the first attempt?
- Where is the stop rule if the thesis is wrong?

If that cannot produce a concrete first move, it is not a plan yet.

## Workflow

1. Restate the bold direction in one sentence. Do not flatten the ambition. Name its source (user idea, PRD, design review, earlier judgment).

2. Run a reality check. Scan for the five anti-patterns, then name the constraints they expose:
   - **Vision without first step** — sounds right, but nobody knows what to do this afternoon.
   - **Fake migration plan** — clean target, but the path assumes everything changes at once.
   - **Unpriced risk** — “we can refactor” with no cost on data loss, blast radius, missing tests, or hidden callers.
   - **Long-term correct, short-term irresponsible** — the full thing now would starve the current goal.
   - **No stop rule** — the plan can only continue; it cannot fail gracefully.

   Then answer: what real contracts constrain the work? What area carries the most blast radius? What assumptions are unproven? What part is mostly aesthetic, speculative, or premature? Details: `references/anti-patterns.md`.

3. Choose the minimum viable move. One narrow vertical slice, proof point, or decision artifact. Define what it changes and what it refuses to change. Prefer evidence over more planning.

4. Make verification explicit. Success criteria observable; failure signals named; check cheap enough to run before confidence decays. Name the test command or manual check in-line — do not hand off to another skill unless the user already invoked one.

5. Cut scope aggressively. List what the first move should not attempt.

6. Define the stop rule. What evidence kills or pauses the direction? What forces a smaller target? What can be rolled back or isolated? What decision should wait?

## Output

Produce the answer using `references/output-template.md` — load it before drafting. Section order: Landing Judgment / Bold Direction Kept / Reality Check / Minimum Viable Move / Verification / Cut List / Stop Rule / Next Move.

Constraints:

- Lead with the verdict — go / shrink / pause / reject / validate first — not with the analysis.
- Name real constraints separately from anxiety or inertia.
- Preserve the bold target when useful; do not let it replace execution.
- Default is a smaller proof, not paralysis. Do not turn this into “do nothing.”
- Stay self-contained. Do not require or route to other skills (geju, idea judges, TDD skills, plan writers). If a multi-phase execution contract is needed later, say so in Next Move as plain guidance — do not invoke another skill.

## What This Skill Is Not

- Not generic project management. It pressure-tests whether a proposal can land.
- Not auto-discovered process. The user must call it.
- Not anti-refactor. It rejects fantasy migrations, not clean targets.
