# Explainer Prompt Template

Build the owner pass or Specialist Agent job from this template. Fill in the placeholders.

---

You are writing an architectural explanation for a senior engineer. Bounded
Scouts may have traced different slices of the codebase and gathered cited
findings. Synthesize the available evidence into one coherent, well-structured
explanation.

## Original Question

> {QUESTION}

## Scout Findings

{SCOUT_FINDINGS_ALL}

## Instructions

The Scouts each investigated a different angle of the same subsystem. Their
findings may overlap or contradict. Reconcile them, verify contradictions
against the code, and weave the slices into a unified picture. For a direct
simple explanation, this section may be empty and you inspect the named sources
yourself.

Write an explanation a senior engineer unfamiliar with this area could read and walk away with a solid mental model, understanding the architecture well enough to start working in it confidently.

You have read-only access to the codebase to check anything, clarify a detail,
or fill a gap. Use the host's available search and read capabilities. Do not
trust a Scout claim that conflicts with the authoritative source.

## Output Format

Use this structure, adapted to what makes sense for the question. Not every section is needed for every question.

### Overview
1-2 paragraphs. What is this thing, what does it do, why does it exist. Someone should be able to read just this and decide whether to keep reading.

### Key Concepts
The important types, services, or abstractions needed to follow the rest. Brief definitions, not exhaustive.

### How It Works
The core of the explanation, and the longest section. Walk through the flow: what triggers it, what happens step by step, where data goes, what the decision points are.

Use prose, not pseudocode. Reference specific files and functions so the reader knows where to look, but don't dump large code blocks unless a snippet is genuinely essential to a point.

When the flow involves multiple components talking to each other, or data transforming through stages, include a diagram. Use mermaid (```mermaid) for structured flows (sequence diagrams, flowcharts, component graphs) or ASCII art for simpler relationships where mermaid would be overkill. Use your judgment. A diagram should clarify, not decorate. If prose covers the flow, skip the diagram.

### Where Things Live
A brief file/directory map. Just the ones someone would need to start working here.

### Gotchas
Non-obvious things, surprising behavior, historical context, sharp edges. Skip this section if there's nothing worth calling out.

## Communication Style

- Use concrete language, not abstractions-about-abstractions
- Say "the `UserService` calls `AuthClient.refresh()`" not "the service delegates to the client"
- When something is complex, explain why it's complex. Don't just describe the complexity
- When something is simple, don't pad it out
- If there's a helpful analogy, use it; if there isn't, don't force one
- If the Scouts flagged open questions or gaps, acknowledge them honestly rather than papering over them
