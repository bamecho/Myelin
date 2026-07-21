---
name: how
description: "Use for \"how does X work\", code walkthroughs before changing something, and placement / ownership / layering questions (\"where should this live\", \"which package owns this\", \"is this the right layer\"). Explains subsystem architecture, runtime flow, onboarding mental models. Can critique architecture. Use why for motivation."
---

# How

Explore the codebase to answer "how does X work?" questions. Produce clear architectural explanations at the level of a senior engineer onboarding onto a subsystem. Enough to build a working mental model, not annotated source code.

Two modes:

1. **Explain** (default). Explore the codebase and produce a clear explanation
2. **Critique.** Explain first, then use independent review to identify architectural issues

## Explain Mode

### Step 1. Understand the Question and Assess Complexity

Parse what the user is asking about:

- "How does the rate limiter work?", a subsystem
- "How do we handle billing for on-demand usage?", a feature flow
- "How is the auth service structured?", an architectural overview
- "Walk me through what happens when a user submits a form", a runtime trace

Identify the scope. If ambiguous, state your best-guess interpretation before exploring. Don't ask. Let the user redirect if you're off.

**Assess complexity to decide the approach:**

- **Simple** (a single module, a small utility, a narrow question like "how does function X work"): explore and explain directly. Go to Step 2b.
- **Complex** (a subsystem spanning multiple files/services, a cross-cutting feature, a full architectural overview): gather bounded evidence through Scouts before synthesis when isolated roles are available and useful. Go to Step 2a.

When in doubt, lean simple. A Scout is a context boundary for evidence, not a
mandatory ceremony.

### Step 2a. Scout (complex questions only)

Decompose the question into a few independent evidence angles, each a distinct
slice of the subsystem so searches do not duplicate work. Example split for
"how does the rate limiter work?":

- Scout 1: data model and state management
- Scout 2: request path and enforcement
- Scout 3: configuration and metrics infrastructure

When the host supports isolated roles and the separation saves context, compose
a bounded Agent job for each fresh Scout. Give it the original question, one
angle, authoritative repository roots, proof and stop conditions, and the base
prompt from `references/scout-prompt.md`. Do not select a fixed model, thinking
level, agent API, or host invocation syntax. Each Scout should:
- Start broad with the host's available file discovery and text search capabilities
- Follow the thread: from an entry point, trace the call chain (callers, callees, data flow, type definitions)
- Read the actual code, don't guess from file names
- Stop when it can describe the full path from input to output (or trigger to effect) without hand-waving any step
- Note things that are surprising, non-obvious, or that a newcomer would get wrong

Each Scout returns cited components, flow, files read, boundaries, unknowns, and
confidence. The Scout gathers facts and does not decide the architecture or
write the final explanation. When isolated roles are unavailable, run the same
bounded angles sequentially and preserve the same evidence boundary.

Then proceed to Step 3.

### Step 2b. Direct Explain (simple questions)

The owning agent explores and explains in one bounded pass. Read
`references/explainer-prompt.md` for the communication style and output format;
omit Scout findings because the sources are inspected directly.

Proceed to Step 4.

### Step 3. Synthesize (complex questions only)

Once the Scout findings return, the owner synthesizes them or hands one bounded
explanation job to a fresh Specialist when a clean decision context materially
improves the result. Give the synthesizer the original question, cited Scout
findings, authoritative paths, endpoint, and stop conditions, not Scout working
transcripts. Read `references/explainer-prompt.md` for the full prompt template.
The synthesizer reconciles overlap, checks contradictions against source, and
weaves the slices into one explanation.

### Step 4. Present

Present the explainer's output to the user. You may lightly edit for clarity or add context from the conversation, but don't substantially rewrite. The explainer's communication is the product.

### Output Format

Follow this structure, adapted to the question. Not every section is needed for every question.

**Overview.** 1-2 paragraphs. What it is, what it does, why it exists. Enough to decide whether to keep reading.

**Key Concepts.** The important types, services, or abstractions. Brief definition of each. Not exhaustive, just the ones needed to understand the rest.

**How It Works.** The core of the explanation. Walk through the flow: what triggers it, what happens step by step, where data goes, the decision points. Prose, not pseudocode. Reference specific files and functions so the reader can go look, but don't dump code blocks unless a snippet is genuinely necessary.

**Where Things Live.** A brief map of the relevant files/directories. Not every file, just the ones needed to start working in this area.

**Gotchas.** Non-obvious or surprising things that would trip someone up. Historical context that explains why something looks weird. Known sharp edges.

## Critique Mode

Triggered when the user asks for architectural issues, problems, or improvements, not just understanding.

### Step 1. Explain First

Run the full explain flow above (Steps 1-4). You must understand the architecture before critiquing it.

### Step 2. Review Independently

After the explanation is complete, use one or more fresh Reviewers only when
independent critique is worth the added context and the host supports it;
otherwise run separate bounded review passes. Do not prescribe a model family,
thinking level, or host invocation. Read `references/critic-prompt.md` for the
prompt template. Each Reviewer gets:
1. The explanation from Step 1 (so they don't re-explore)
2. The relevant file paths (so they can read the actual code)
3. The architectural critique rubric from `references/critique-rubric.md`

### Step 3. Lead Judgment

Same framework as Use skill `interrogate`. You're a pragmatic lead, not an
aggregator.

Categorize findings:
- **Act on.** Architectural problems worth fixing now
- **Consider.** Real concerns, but the cost/benefit is unclear
- **Noted.** Valid observations, low priority
- **Dismissed.** Wrong, missing context, or style preference

Present the explanation first (from Step 1), then the critique verdict below it. The explanation should stand on its own; someone who just wants to understand the system shouldn't wade through critique.
