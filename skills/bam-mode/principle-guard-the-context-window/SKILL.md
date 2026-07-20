---
name: principle-guard-the-context-window
description: "Apply when context is filling up: large outputs, long files, repeated reads, or fan-out evidence gathering. Route bounded read-only evidence to Scouts when useful; keep summaries in the main thread, not raw payloads."
disable-model-invocation: true
---

# Guard the Context Window

The context window is finite and non-renewable within a session. Every token that enters should earn its place.

**Why:** Context overflow degrades reasoning quality, creates compression artifacts, and halts progress. Unlike compute or time, context spent inside a session cannot be reclaimed.

**Pattern:**
- **Isolate large payloads.** Route bounded read-only searches, screenshots,
  large documents, artifacts, and transcripts to Scouts when the host supports
  isolated roles and the context saving justifies it. Use the appropriate
  Specialist, Worker, or Reviewer for work that goes beyond evidence gathering.
  Without isolated roles, use bounded sequential passes. The main context gets
  cited findings and source pointers, not raw data.
- **Don't read what you won't use.** Read selectively based on relevance. If a file isn't needed for the current task, skip it.
- **Keep frequently used content inline.** Templates and references used on every invocation belong in the skill file, not in separate files that cost a read each time.
- **Size phases and cap scope.** Limit files per phase, set turn budgets, account for mechanism costs.
