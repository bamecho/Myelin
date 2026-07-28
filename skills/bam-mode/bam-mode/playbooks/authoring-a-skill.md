### Authoring or modifying a skill

**You own the skill's voice.** Agent-facing prose has a higher bar than human prose; unhelpful sentences become instructions.

1. Use skill `writing-great-skills` for the authoring bar. Let the active host
   provide any scaffolding tools it needs; the playbook does not depend on one
   editor or agent runtime.
2. Start from the observed behavior gap. Supply outcome, context, authority, and
   completion evidence; default to zero few-shot examples and preserve model
   judgment.
3. Audit every instruction for 100% truth and cooperative misreading. Narrow,
   soften, or delete any sentence with a legitimate exception. Keep hard rules
   for invariant safety or ownership boundaries.
4. Keep shared guidance tuned for a judgment-capable model. Put extra scaffolding
   for smaller models in a model-specific adapter. Let the owner generate
   subagent prompts from current evidence rather than storing static examples.
5. Validate frontmatter, references, and cross-skill links. Add a regression for
   a real structural failure; subjective preference alone does not require one.
6. Run **Opening a PR**.

When in doubt, delete; prose earns its keep by changing a decision. Match tone
to scope. Point at structural sources (types, READMEs, config); hardcoded details
go stale (Use skill `principle-encode-lessons-in-structure`). Delegate to other
skills by path. A repeated uncaptured workflow can justify a new skill.

**Reply:** summary of the skill, key design decisions, validation notes.
