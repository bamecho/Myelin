# Plan

本文件是 `plan.md` 的中文对照版。若两者冲突，以英文执行事实源为准。

Plan 是从上游决策派生出来的**当前 slice 执行交付物**。用户要求实现时，它可以省略；
用户明确要求 plan 时，它就是交付物，不能返回 `none`。本合同只安排和验证当前交给
实现的 slice，后续产品 outcome 不进入执行计划。

起草前读取实际 spec 和已批准的 codebase-design 文档。产品决策、模块 ownership、
interface、non-goal 和 acceptance 都以上游为准。Plan 只补充真正影响执行的信息：顺序、
依赖、owner、验证和停止条件，不重做产品或架构设计，也不复述上游文档。

## 1. 判断 plan 是否为交付物

- 用户明确要求 plan：必须生成。单 agent、单 slice 用 `note`；存在协调或阶段状态时用 `full`。
- 用户要求实现：spec 已锁、entity 已 skip 或批准、design 已可执行、工作为单 agent 单
  slice 时可用 `none`。
- 上游没有覆盖的执行或验证合同确实有帮助时用 `note`。
- 多阶段、多 agent、有重要中间状态的迁移，或依赖 stop rule 的自治工作用 `full`。

改动涉及多个 module，并不自动需要 `full`。一个 agent 能原子完成并验证时，它仍是一个 slice。

E-plan-leverage（2026-07-16）只证明：在一个 locked、单 agent、单 slice fixture 上，
`none`、短 note、expanded plan 都是 12/12，而 expanded plan 多花约 40 秒。它支持该类
任务默认薄化，不支持对所有复杂任务禁止细节。

## 2. 消费当前 slice

读取 spec 中已批准的当前 slice，后续产品 outcome 暂不规划。只有 plan 或 ticket tree
需要跨段引用时，才给当前 slice 一个稳定 identity：

```md
Slice: `S1` <name>
Outcome: <可观察结果>
```

`full` plan 中，每个可独立合并和验证的执行单元有稳定的 `slice-<slug>` key，并包含
`Goal`、`Depends on`、`Verify`、`Stop if`。不能独立落地或验证的内容不是单独 slice，
留在同一单元。

接受一个 slice 前执行两个 gate：

- **Context gate：** 一个 agent 能在 fresh working context 中，仅根据 named sources
  完成它，不需要重建大范围 design 历史。无关 outcome、未决 ownership，或必须依赖后续
  slice 才能证明的工作都要拆分。
- **Oracle gate：** verification 直接观察已批准 outcome，并能把它与 material 且可信的
  错误结果区分开。一个没有做出这种区分、只是退出码为零的命令不够。

任一 gate 无法直接从已批准 source 判断时，使用 skill `design-verifiable-slices`。它根据
真实 failure model 选择 checks，不把所有测试类型都塞进 plan。

## 3. 位置

用户给路径就使用该路径。否则把 `note` 返回在对话中，或遵循仓库既有 plan 惯例。
`full` 只有在独立 phase 文件能让 ownership 或验证更清楚时才用目录。

## 4. 只写 execution delta

`note` 的常用形状：

```md
# <title>

Sources: <spec path>; <approved design path>

Slice: `S1` <name>

## Goal
<可观察的最终状态。>

## Execution
<上游文档尚未直接给出的改动或短顺序。>

## Verify
- <能把已批准 outcome 与 material failure 区分开的直接检查。>

## Stop if
- <需要产品/设计决策或重写 plan 的条件。>
```

`full` 保留同样的 source authority、goal、verification 和 stop rules，只补 `note` 无法表达
的协调信息：独立 owner、产物依赖、有意保留的中间状态或 phase-specific acceptance。选择最
容易审阅这些关系的表达方式；需要 dependency 或 sequence 图时只用 ASCII，不填写固定 task 模板。

不会改变执行的内容直接省略；上游表格和 rationale 通过路径引用，不复制。

交付前，删除每句只是在复述 source 的话。如果已批准的 spec 和 design 已包含完整实现路径，
Execution 可以只写：“按已批准 design 作为一个原子 slice 实现。”

随后逐项核对 dependency、removal、新 artifact 和 stop rule 是否有 source 支持，严格保持
上游 owner graph 和 non-goal。没有来源的内容删除或留在 Open，不用“看起来合理”的实现惯例补空。

对单 agent、单 slice 任务，默认不要把 slice 展开成实现微步骤或逐路径指令，现有 fixture
没有测出收益。对 `full`，只写协调 owner、维持中间状态或做 stop 决策所需的细节。Spec 和
design 没有限定的局部实现选择留给 executor。

## 5. 保持上游权威

- 不发明字段、CLI flag、regex、顺序或 warning code。缺失的 locked-class 决策留在
  Handoff contract 的 Open 中。
- Plan 不修改模块 ownership 或 interface。执行顺序暴露 design 问题时返回 codebase-design。
- Acceptance 写可观察结果；Verify 写证明结果的检查。
- Build、type、lint、snapshot 和 coverage 结果只能证明它们直接观察到的性质，不能代替
  通用的行为证据。
- 用户要求的是 plan 时，起草期间不执行实现。

## 6. 在需要时准备 Slice-Ticket 映射

使用父子混合模式：

- 一个已批准的产品 outcome 对应一个 **outcome** 父票。文档作为 Sources 挂在父票上，
  不为 spec/entity/design/plan 建文档票。
- 每个可独立合并的 execution slice 对应一个子票，复用稳定 key，并带自己的 Verify/Stop。
  子票共享 outcome 上下文和 stage 顺序。
- 原子工作，或所谓 slices 无法独立落地时，只保留一个 outcome 票。不要把真正独立的
  slices 聚合成巨型实现票，也不要为微步骤建票。

只在用户要求 tickets 或需要 handoff 给 `ticket-tree` 时输出该映射。Plan 不会直接写
tracker；先审批 draft，再 apply tree。

## 7. Handoff

不要增加 `draft` / `ready` 状态仪式或强制独立 reviewer。现有 reviewer 实测多次漏掉 source
contradiction。`full` 仍用于表达协调，但多 agent 和 migration execution 还没有足够证据，
不能把 review status 当成安全信号。

交付 plan 或路径、thickness、未决事项和下一步执行动作。修改本合同后运行
`scripts/validate-bam-mode.sh`。
