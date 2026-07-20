# Bam mode 中文版

本文件是中文阅读版，方便直接审阅和分析。执行事实源仍以 `SKILL.md` 为准。

`bam-mode` 是一套自足的 pstack 风格工程模式，并加入 Bam 偏好的文档和审阅车道。运行时不要依赖 `poteto-mode`。如果这里和 pstack 内容重复，这是有意复制。这个 skill 自己携带需要的规则。

## 路由契约

多步骤任务先开 todolist，第一项选择一个 owning playbook 并复制它的步骤。
完整流程由 owning playbook 负责，包括 specialist skills、principles、产物和后续
playbook handoff。本文件不再临场拼第二套流程。

按用户要的结果和当前状态路由：

- 粗想法、产品/技术判断、设计请求或 plan 请求 -> **Design**。它拥有
  `think` -> `entity-model-design` -> `codebase-design` -> plan。
- 实现请求 -> **Feature**。输入还不可执行时，Feature 先组合 Design，再实现已批准 handoff。
- 只读解释或历史原因 -> **Investigation**。
- Bug、性能、重构、prototype、visual parity 等执行形状 -> 下面对应的窄 playbook。
- “持续做 X 直到 Y”仍由负责 X 的窄 playbook 做 owner，只组合 Autonomous run 的
  loop contract。只有没有更窄 playbook 定义被重复的工作时，Autonomous 才拥有任务。
- 只有没有更窄 playbook 能负责的大型横向工作才使用 **figure-it-out**。

能完整负责目标结果的最窄 playbook 胜出。只选一个 owner；playbook 组合只发生在
owner 内部，不在顶层列 skill 清单。

## Playbooks

先匹配下面的 playbook。打开本 skill 目录下对应文件，把步骤原样复制进 todolist，再加入任务特定 todo。跳过的步骤也留在列表里，并写 `skip: <reason>`。

- Investigation：只读问题。`playbooks/investigation.md`。
- Design：从粗方向到已批准 entity/codebase 决策和可选 execution plan。
  `playbooks/design.md`。
- Bug fix：复现、根因、修复、验证。`playbooks/bug-fix.md`。
- Perf issue：基于 baseline 的性能问题。`playbooks/perf-issue.md`。
- Hillclimb：围绕指标的持续改进循环。`playbooks/hillclimb.md`。
- Runtime forensics：诊断实时运行症状。`playbooks/runtime-forensics.md`。
- Trace forensics：诊断已捕获的 profiling artifact。`playbooks/trace-forensics.md`。
- Feature：从命名数据形状出发的新行为或行为变化。`playbooks/feature.md`。
- Refactoring：保持行为不变的结构调整。`playbooks/refactoring.md`。
- Prototype：用于决策的一次性草图。`playbooks/prototype.md`。
- Visual parity：像素级 UI 等价。`playbooks/visual-parity.md`。
- Authoring or modifying a skill：`playbooks/authoring-a-skill.md`。
- Eval：测试 skill、结构或 prompt 变更如何影响行为。`playbooks/eval.md`。
- Autonomous run：长任务跑到完成。`playbooks/autonomous-run.md`。
- Session pickup：接手已有工作。`playbooks/session-pickup.md`。
- Pause safely：安全暂停，方便恢复。`playbooks/pause-safely.md`。
- Opening a PR：其他 playbook 结束时调用。`playbooks/opening-a-pr.md`。

## Principle 缺口

不要运行全局 skill 或 principle router。选择属于 owning playbook，写在真正需要它的步骤里。

如果某个任务明显需要一个 principle skill，但选中的 playbook 没有点名，只有当它会
改变正确性、验证或安全性时，才为当前任务临时应用它。随后修 owning playbook，或把
回归补到 `evals/plan-behavior.md`。不要把全局 router 加回本文件。

## 组合

Design 是唯一的实现前流程。它负责 Handoff contract、条件式 entity/codebase 阶段和
plan thickness。Feature 消费 handoff 并负责实现。其他 playbook 发现真实设计决策时
可以调用 Design，但不能复制它的阶段。

Agent handoff 是 `playbooks/agent-handoff.md` 中的非 owning 组合契约。Owning
playbook 只在真实的上下文、独立判断或可写状态边界使用它。Agent 角色只适配宿主并
执行一个有界任务，不构成第二套路由。宿主可以提供隔离 agent、fresh context、顺序
pass，或完全不支持委派；owning playbook 和证据标准保持不变。

代码变更 playbook 以 Opening a PR 为最终组合步骤。Investigation 和 design-only
请求在交付用户要的产物后停止。

## 维护

因路由或 playbook 偏移而修改前，先用 `playbooks/eval.md` 复现，并把回归补到
`evals/plan-behavior.md`。优先删除规则或增加确定性检查，不继续堆运行时文字。
修改后运行 `scripts/validate-bam-mode.sh`。

## 输出纪律

用户用中文工作时，用中文输出。

中型或大型任务交付时说明：

- Owning playbook，以及它组合了哪个 playbook。
- 产物路径或产物段落在哪里。
- 剩余 Open 决策。
- 下一步可执行动作是什么。

按 `unslop` 要求写回复。不要倾倒候选 skills，也不要输出未改变结果的内部路由过程。

## 完成标准

`bam-mode` 只有在 owning playbook 和它组合的每个 playbook 都到达目标 endpoint 时才
完成。Design 仍有必需的产品、entity、ownership 或 execution 决策处于 Open 时，
Feature 不算完成。
