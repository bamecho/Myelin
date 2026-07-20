# Approved spec: sync preview

- Add `--dry-run` to the existing `sync-sessions` command.
- Preview and execution derive from the same active records ordered by `id`.
- Preview prints `operation:id` and never calls the remote client.
- Preserve the public exports `run`, `createClient`, and `syncSessions`.
- Keep JavaScript and the existing command name.

Non-goals: plugin system, config file, TypeScript migration, command rename,
production rollout, or transport redesign.
