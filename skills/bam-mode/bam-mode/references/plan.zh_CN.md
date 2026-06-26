# Plan 中文版

本文件是中文审阅版，方便直接分析新的 bam-mode plan 协议。执行事实源仍以
`references/plan.md` 为准。

产出一份基于 `bam-mode` **Principles** 的、经过审阅的 implementation plan。plan 本身就是交付物。
不要实现。

这份 reference 取代 bam-mode 中独立的 goal-document 工作流。好的 plan 先稳定意图、边界、架构和
数据模型假设，再把这些理解转成可执行任务，并把未决问题单独暴露出来。plan 审批后，写到用户指定的 plan 位置，然后停止。

先开 todolist，每一步对应下面一个条目。

## 0. Triage

如果变更只涉及一两个文件，做法也明显，就跳过 plan。说明原因，然后停止。

以下情况需要 plan：变更跨三个以上文件，引入架构，存在竞争方案或范围不清，需要数据模型或 API 设计，或者用户要求计划、任务拆分、kickoff、长周期 agent 运行。

如果一个请求包含多个独立目标，先拆成多个 planning kickoff，再写任务。

## 1. 重读原则

完整阅读 `bam-mode` 的 **Principles** section。适用时，也要阅读它索引到的 leaf `principle-*` skills。
这些原则决定每个 plan 决策。最后要点名哪些原则实际改变了路线。

## 2. Intent frame

先展示这一节，并等待用户确认，再进入下一节。

澄清：

- 用户想要的最终状态。
- 计划完成时应该存在什么产物。
- 明确的非目标，以及要避免的相邻工作。
- 这个请求是否过大，是否应该拆成多个 kickoff。

只在意图真的不清时提问。提问时给出具体选项。不要用提问逃避可以通过代码库 grounding 解决的问题。

## 3. Grounding

Intent frame 确认后，读取需要的代码、文档、测试和当前 diff。产出 grounding notes，让另一个执行者不必重新发现同一批上下文。

分开记录：

- **Observed facts**：代码、文档、测试或 diff 直接显示了什么。
- **Assumptions**：哪些是推断，但没有直接证明。
- **Relevant files**：可能修改的文件和模块。
- **Terminology**：代码库已经使用的名字和概念。
- **Ambiguity**：还没关闭的决策。

任务很大或区域不熟时，按 `principle-guard-the-context-window` 使用 subagent 做代码库探索。可用时优先
`subagent_type: "poteto-agent"`；否则用最接近的 agent，并把 bam-mode 规则写进 prompt。探索结果应该是文件指针、约定、依赖、测试设施和入口点，不要内联大段 dump。

等待用户确认后再继续。

## 4. Slicing strategy

先展示切分策略，再列任务。展示后等待用户确认。

说明：

- 为什么这个切分边界是对的。
- 每个 slice 如何产生端到端、可验证的价值。
- 哪些看似诱人的横切切法被拒绝，为什么。
- 哪些未决选择必须作为 open decisions 暴露出来，不能藏进任务里。

优先使用小的 vertical phases，每个 phase 都结束在一个可审阅状态。一个 phase 通常只应触及两三个文件。
如果一个 phase 超过五个测试用例、三个函数，或包含一个以上未决决策边界，就继续拆。

排序时让共享类型、schema 和系统边界先于调用方落地。触碰既有设计时，应用
`principle-redesign-from-first-principles`：如果新需求从第一天就存在，系统会长什么样？然后把目标设计增量交付。

## 5. 小批量起草 plan artifact

起草时直接使用最终会写入磁盘的 artifact 结构。不要先展示一份临时任务清单，再在最后翻译成 plan。

先起草 `overview.md`。一次展示一到两个 section，等待用户确认后再继续：

- **Context**：问题、当前状态、为什么现在做，以及 grounding evidence。
- **Scope**：包含的工作、明确排除的工作、刻意延后的工作。
- **Constraints**：技术、平台、依赖、兼容性、约定和验证约束。
- **Alternatives**：当设计空间不是被约束唯一决定时，给出两三个方案、选择和理由。
- **Phases**：有序 phase list，每个 phase 的价值和 proof point。
- **Global open decisions**：未决问题、建议，以及阻塞哪些 phase。
- **Verification**：项目级检查，以及必须驱动的真实界面或入口。
- **Implementation guidance**：bam-mode non-negotiables 和执行者必须调用的 skills。

然后起草 phase files。一次只展示一个 phase file，或一个 phase file 内的一到两个 task。用户确认后再展示下一组。

写给工程师看。plan 应该像清晰的实现叙事，不像数据库记录。

每个 phase file 应说明：

- **Goal**：这个 phase 完成什么。
- **Changes**：受影响的文件、模块、契约或 artifact，以及高层变化。说明 what 和 why，不写实现代码。
- **Data structures**：这个 phase 引入或修改的关键类型、schema、entity、state 或 contract。
- **Tasks**：phase 下的具体任务。
- **Open decisions**：未解决问题、选项、建议，以及阻塞什么。
- **Verification**：这个 phase 的 static、runtime 和 review checks。
- **Stop conditions**：执行者什么时候必须暂停、询问或修订 plan。

持久化的 plan 保留 pstack 字段名：`Context`、`Scope`、`Constraints`、`Alternatives`、`Phases`、`Verification`、`Implementation guidance`、`Goal`、`Changes`、`Data structures`。Bam 增量如 `Open decisions` 和 `Stop conditions` 是扩展，不替代这些字段。

不要把 `Scope`、`Context`、`Out of scope` 做成垃圾桶。把边界写进叙事里。文件路径是证据和锚点，不能代替对工作的解释。

## 6. Open decisions 和 todo 形状

不要把人工审阅编码成 task type。这个工作流本身已经强制用户逐节审阅，所以未决选择应该直接作为 open decisions 出现，不要藏在任务标签里。

任务代表可执行工作。Open decisions 代表必须先回答的问题。两者分开写。

### Todo 形状

```md
### T001. Short task title

- Status: pending
- Blocked by: none

Narrative:
In `<file/module>`, change `<specific behavior or artifact>` so that `<target state>` becomes true.
This task includes `<included work>` and deliberately excludes `<adjacent work>`.

Acceptance:
- Mechanically checkable outcome.
- Mechanically checkable outcome.

Verification:
- `command or concrete check`

Execution notes:
- Leave empty during task design. Fill during execution.

Review:
- Leave empty during task design. Fill after verification.
```

如果某个 todo 依赖未决问题，用 `Blocked by: OD001`，并在同一个 phase 或 overview 中定义该 open decision。

### Open decision 形状

```md
### OD001. Short decision title

Question:
State the unresolved decision.

Options:
- Option A with tradeoff.
- Option B with tradeoff.

Recommendation:
Recommend an option when the grounding supports it, and explain why.

Blocks:
- T00X or phase name.

Resolution:
- Leave empty during planning. Fill when the user decides.
```

## 7. 每个 phase 的验证

每个 phase 都需要 proof。验证真实产物，不用替代物糊弄。

包括：

- **Static checks**：适用的 type check、lint、unit tests、schema validation 或 docs checks。
- **Runtime checks**：尽量驱动被触碰的真实界面。Browser/Electron/Web UI 需要 UI 验证；CLI 和 TUI 需要命令级验证；API 需要 request/response 检查。
- **Review checks**：当 phase 改变共享行为或契约时，加入 architecture、data model、docs-vs-code、`interrogate` 或 `blast-radius`。

Bug fix 的循环是：在真实界面复现，在同一界面修复并验证。单元测试只能说明某个分支行为正确，不能证明用户看到的 bug 已消失。

如果没有本地验证路径，要在 plan 里明说，并把它列成风险或 open decision，不要假装弱检查足够。

## 8. Full breakdown review

overview sections 和 phase files 都小批量确认后，展示完整 plan 做最终 review。

overview 只展示：

- 一句话 Context。
- Scope summary。
- Constraints summary。
- Chosen alternative。
- Phase list。
- Project-level verification。

每个任务只展示：

- Id 和标题。
- Status。
- Blocked by。

然后单独列出 open decisions，包含 id、question、recommendation，以及阻塞的任务或 phase。

让用户检查：

- 粒度太粗还是太细？
- 依赖是否正确？
- overview 字段是否足够完整，执行者能否不用重新拼上下文就理解 plan？
- 是否应该合并或拆分任务？
- Open decisions 是否足够明确，阻塞关系是否正确？
- 是否有 scope creep 或遗漏需求？
- 叙事是否足够清楚，让工程师不用从零拼上下文就能执行？

写文件前等待确认。

## 9. Write the plan

用户指定 plan 放在哪里。如果用户没有指定路径，先提出一个路径并等待确认，再写入。

使用 pstack 风格的 plan artifact：

```text
NN-slug.md
```

用于小计划。三阶段以上使用目录：

```text
NN-slug/
├── overview.md
├── phase-1-scaffold.md
├── phase-2-...md
└── testing.md
```

只有当用户明确要求 todo queue 时，才使用 `tasks/todo.md`。不要把它作为中大型工作的默认载体。

### Overview file

overview 应包含：

- **Context**：问题、当前状态、为什么现在做，以及 grounding evidence。
- **Scope**：包含的工作、明确排除的工作、刻意延后的工作。
- **Constraints**：技术、平台、依赖、兼容性、约定、架构和数据模型约束。
- **Alternatives**：当设计空间不是被约束唯一决定时，给出两三个方案、选择和理由。
- **Applicable skills**：执行者应该调用的 skills，按名称列出。
- **Phases**：指向 phase files 的有序标准 Markdown 链接，并写清每个 phase 的价值和 proof point。
- **Global open decisions**：未决问题、建议，以及阻塞哪些 phase。
- **Verification**：项目级检查和要驱动的真实界面或入口。
- **Implementation guidance**：本 plan 中重要的 bam-mode non-negotiables。
- **Stop conditions**：什么时候执行必须暂停，或 plan 必须修订。

### Phase files

每个 phase file 应包含：

- 回链到 `overview.md`。
- **Goal**：这个 phase 完成什么。
- **Changes**：受影响的文件、模块、契约或 artifact，以及高层变化。说明 what 和 why，不写实现代码。
- **Data structures**：这个 phase 引入或修改的关键类型、schema、entity、state 或 contract。
- **Scope notes**：仅在 overview 不明显时，补充本 phase 的 non-scope 或 deferred work。
- **Open decisions**：阻塞本 phase 的未决问题。
- **Tasks**：具体可执行任务。
- **Verification**：static、runtime 和 review checks。
- **Stop conditions**：执行者什么时候必须暂停或修订 plan。

每个 todo 都要包含 id、初始 status `pending`、blocked by、narrative、acceptance、verification，以及空的 `Execution notes` 和 `Review` section。todo id 在 phase files 之间保持稳定。

写完文件后停止。不要执行任务。不要把任何 task 标成 `in_progress`。不要运行 implementation-stage verification commands。

交还 plan path、phase list、未解决的 open decisions，以及启动执行所需的精确用户话术，例如：
`start execution from <plan path>` 或 `execute phase 1`。

## 10. 不写入磁盘时的交还

如果用户只要计划内容、不想写入磁盘，就总结 phases、scope boundaries、applicable skills、未解决的 open decisions 和 verification。停止。由用户决定何时开始实现。
