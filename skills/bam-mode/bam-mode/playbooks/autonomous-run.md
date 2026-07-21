### Autonomous run

**You own the exit condition. Define done, then drive to it without stopping.** For "going to bed" / "run until done" / "keep iterating until X".

When another playbook defines the work being repeated, that narrower playbook
keeps ownership. This playbook contributes only the exit, iteration, wake, and
checkpoint contract.

1. State the exit condition as a checkable predicate before the first iteration (tests green, repro fixed, all N PRs merged, pixel-diff zero).
2. Make the loop idempotent before choosing the wake mechanism. Use skill
   `principle-make-operations-idempotent`: rerunning an iteration after a crash,
   timeout, or duplicate wake should converge to the same state, not duplicate
   commits, comments, files, or external actions.
3. Resolve the available `loop` capability. The host may expose it as a skill, command, CLI, or native scheduler. Give it the exit predicate, one-iteration action, verification, checkpoint, and wake policy. Read the provider's actual contract before binding invocation syntax, success polarity, or wake semantics; when that contract is unavailable, leave the binding Open instead of inventing it. An event to watch (CI, a merge, a ref advancing) gets an event watcher when the host supports one, with a long time-based heartbeat as fallback. Without an event, use a fixed interval sized to when the result is worth re-checking. If no loop provider exists, run the same protocol directly for as long as the session can continue and leave a resumable checkpoint.
4. Each iteration makes the smallest change the evidence justifies, verifies it against the predicate, commits if it advanced, discards changes that didn't help. Belt-and-suspenders that "might help" gets reverted, not left to ride.
   Sequence the work with Use skill `principle-sequence-verifiable-units`,
   verifying each unit before the next instead of batching checks at the end.
5. Checkpoint every iteration with Use skill `show-me-your-work`, a row for
   what changed and whether the predicate moved.
6. Stop when the predicate is met. A plateau is not a stop, so keep going and pivot your approach to push past it. Surface a genuine dead end rather than spinning, and never relax the predicate to declare victory.

**Reply:** the exit condition, iterations run, what landed, what was discarded, final predicate state.
