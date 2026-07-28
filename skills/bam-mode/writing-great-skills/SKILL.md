---
name: writing-great-skills
description: "Reference for writing and editing skills well: concise, contextual guidance that preserves model judgment and produces predictable process."
disable-model-invocation: true
---

# Writing Great Skills

A skill should make the process predictable without scripting every answer.
Assume a judgment-capable model unless the target runtime explicitly says
otherwise. Spend instructions only where context changes a decision.

Bold domain terms are defined in [GLOSSARY.md](GLOSSARY.md).

## Authoring Workflow

1. Identify the behavior gap from a real task, run, or repeated failure.
2. State the outcome, relevant context, authority boundary, and completion
   evidence before prescribing actions.
3. Write the smallest instruction set that changes behavior.
4. Run the truth and misread audit below on every sentence.
5. Remove duplicated meaning, speculative branches, examples, and instructions
   already supplied by the host or model defaults.
6. Validate structure and compare behavior on the regression that motivated the
   change. Promote only the smallest measured improvement.

The work is done when every remaining sentence changes a decision and survives
the truth audit.

## Context Before Control

Give the model the goal, evidence, constraints, ownership, and consequences it
needs to exercise judgment. Prefer a positive target and the reason it matters.

Use a hard constraint only when the statement is invariant across every valid
invocation, or when violating it creates an unacceptable safety or ownership
failure. Put situational guidance behind its triggering context. When judgment
is genuinely sufficient, ask for judgment rather than encoding a brittle rule.

## The 100% Truth Audit

For every sentence, ask:

- Is this true for every invocation that will load it?
- What legitimate user instruction or low-risk case is the exception?
- How could a competent, cooperative agent follow it literally and still
  produce the wrong result?
- Can context, ownership, or a completion condition replace the command?

When an exception exists, narrow the trigger, soften the instruction into a
default, or delete it. Shared runtime prose must be accurate every time it is
loaded, not merely common-case correct.

## Examples And Output Shapes

Default to zero few-shot examples. A capable model can find a better local shape
from the task and repository; examples consume context and can anchor it to an
inferior solution.

Keep a schema, grammar, or declaration only when an exact machine protocol or
fragile output contract requires low freedom. Describe required fields and
invariants directly. Avoid illustrative implementations and filled sample
outputs in judgment-heavy design skills.

## Capability Boundary

Shared skills should target the judgment level they are designed for. When a
smaller model needs more scaffolding, put that detail in a model-specific
adapter or prompt rather than weakening the shared skill for every model.

For difficult tasks, compare total execution cost rather than model price or
tokens in isolation. A stronger model may finish with fewer retries, less
prompting, and lower total context use.

## Agent-Written Delegation

Let the owning model compose a bounded subagent prompt from the current goal,
authority, evidence, writable scope, completion proof, and return contract.
Static few-shot prompts should not substitute for task-local context.

The owner retains product decisions and synthesis. Delegation changes the
evidence or execution boundary, not decision authority.

## Evaluation Discipline

Treat evaluations as the durable memory of failures. Add the smallest real
regression case when a run causes an incident or exposes repeatable drift, then
change runtime guidance only when the candidate improves that case without
regressing existing ones.

Behavior evidence outranks prompt aesthetics. Shorter prose, newer wording, or
a more elaborate review gate is not an improvement unless the measured process
is better.

## Invocation

A model-invoked skill keeps a concise description because the agent or another
skill must discover it. A user-invoked skill uses `disable-model-invocation:
true` when only the human should activate it. Each additional discoverable skill
spends context; each hidden skill spends human recall.

Descriptions state what the skill does and one trigger per real branch. Put
workflow details in the body.

## Information Hierarchy

Keep ordered actions and their completion criteria in `SKILL.md`. Move
branch-specific reference behind a precise context pointer. Keep concepts
co-located and each meaning in one source of truth.

Split by invocation only when a distinct capability needs independent reach.
Split by sequence when later steps cause premature completion of the current
step. Otherwise preserve a smaller surface.

## Pruning

Remove:

- prose the model already follows without the skill;
- repeated meaning;
- stale behavior from old models or workflows;
- speculative edge cases without evidence;
- output ceremony that does not change a decision;
- negated behavior that is clearer as a positive target.

Use [GLOSSARY.md](GLOSSARY.md) when diagnosing context load, cognitive load,
premature completion, duplication, sediment, sprawl, or no-op instructions.
