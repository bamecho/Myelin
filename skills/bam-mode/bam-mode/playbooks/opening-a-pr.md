### Opening a PR

Invoked at the end of every other playbook.

**Workspace.** Use an isolated branch or worktree when the change must not mix with unrelated edits. Independent workers get independent writable state. When the current tree is dirty, preserve unrelated work and move the scoped change through a patch or fresh worktree; do not erase work to manufacture a clean branch.

**Commits.** Commit liberally; rebase into small, ordered commits before opening PRs. Each commit is a future PR: landable, ordered to tell the story. Amend when the fix belongs in a just-made commit; new commit when separable.

**PRs.** Use skill `unslop` on the diff review, PR description, and commit bodies. Resolve the repository's actual base branch; never assume its name. Small PRs, 5 narrow over 1 fat; stack follow-ups, branch off that base only for genuinely independent work. For stacked PRs, use whatever stacking tool the team uses; keep the ordered slices visible to reviewers. Read the provider's actual CLI or API contract before binding commands, then read live PR status through it before referencing status. Leave unknown verbs and fields Open instead of inventing a provider-shaped syntax; do not show illustrative commands with unverified verbs or flags. Placeholder and example command lines still imply an interface and count as invented syntax. No `## Summary` / `## Test plan` boilerplate on small PRs; commit bodies don't restate the subject. When the endpoint includes monitoring, give the available `loop` capability an exit predicate covering required CI and blocking review feedback. Bind its invocation only from the actual provider contract; otherwise leave it Open and do not invent polling flags or status fields. Push back when feedback drifts from intent.

An isolated worker that opens a PR runs Use skill `interrogate` and Use skill `unslop`, returns the URL and observed status, then returns ownership. Continuous monitoring stays with the playbook owner.
