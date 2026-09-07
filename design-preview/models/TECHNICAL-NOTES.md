# RMQ 模型页：架构依据与后训练方法

核对日期：2026-09-07。本文服务于本地模型页的文案讨论及后续训练方案设计，不是训练完成报告。

本次确认：RMQ4 保留 QSA、Gated Residual 与 N-gram 嵌入。社区后训练方法目前计划采用；预览页按目标完成后的状态组织文案，未据此推定已有训练记录、部署验证或效果指标。正式使用这些产品表述前，仍需与实际模型版本核对。

## 页面表达

最后一节改为“从架构到训练，构建专业能力。”上文引擎部分解释运行时与硬件执行；本节解释记忆、检索、计算和训练机制。保留技术名词，先说明作用，再展开机制与工程重点。

页面不展示基座参数量，不引用社区模型的拒答率、能力分数或特定设备上的加速倍数。下列基座名称仅用于内部溯源。

## 架构依据

| 页面内容 | 核对结论 | 直接依据 |
| --- | --- | --- |
| Gated DeltaNet | 遗忘门控与 Delta 更新互补；固定规模的递归状态属于 GDN 层。模型中的注意力层仍有自己的上下文存储与计算。 | [Gated Delta Networks 原论文](https://arxiv.org/abs/2412.06464)、[Qwen3.8-27B 模型卡](https://huggingface.co/Qwen/Qwen3.8-27B) |
| RMQ3x 的全局注意力与稠密前馈 | 对应基座采用三个 GDN 层配一个 Gated Attention 层的重复结构，前馈部分为稠密计算；注意力输出门控与 GDN 的状态门控是不同机制。 | [官方模型配置](https://huggingface.co/Qwen/Qwen3.8-27B/blob/main/config.json)、[官方模型卡](https://huggingface.co/Qwen/Qwen3.8-27B) |
| QSA | 索引器先压缩历史键、按微块评分，再把选中块展开为原始 token 位置，主注意力读取原始内容；未满的尾部块保留。 | [Flash-Next 技术报告，第 2.1.2 节](https://github.com/QwenLM/Qwen3.8-Flash-Next/blob/main/tech_report.pdf) |
| 稀疏专家与 Fused MoE | 路由专家与共享专家共同构成前馈计算。Fused MoE 涉及分组、重排、专家计算和加权归并，并非把所有专家权重合成一个专家，也不一定只有一次 kernel 调用。 | [Flash-Next 模型卡](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)、[vLLM Fused MoE 设计](https://docs.vllm.ai/en/stable/design/fused_moe_modular_kernel/) |
| Gated Residual | 多分支独立归一化；读门控按分支和通道生成，写门控为每分支一个标量。它控制跨层信息流，不是注意力稀疏选择。 | [Flash-Next 技术报告，第 2.2 节](https://github.com/QwenLM/Qwen3.8-Flash-Next/blob/main/tech_report.pdf) |
| N-gram 嵌入 | 局部 token 组合提供确定的查表地址；查得的向量补充模型表征。它是训练得到的参数记忆，不是外部文档检索，也不是推理过程中自动学习新知识。 | [Flash-Next 技术报告，第 2.3 节](https://github.com/QwenLM/Qwen3.8-Flash-Next/blob/main/tech_report.pdf)、[vLLM 官方适配说明](https://recipes.vllm.ai/Qwen/Qwen3.8-Flash-Next) |
| 算子融合 | 可按执行路径合并残差相加、归一化、激活等相邻运算；具体组合依赖后端、精度与硬件，不把某个通用框架的融合开关当作 RMQ 的实测收益。 | [vLLM 融合设计](https://docs.vllm.ai/en/stable/design/fusions/) |

QSA 缩短索引候选序列、减少主注意力计算，但不能据此宣称整个模型为线性复杂度或不需要 KV 缓存。稀疏激活降低每个 token 的计算量，也不等于只需存储被激活部分的权重。

Flash-Next 官方技术报告与框架说明中的特定性能数字随测试配置和版本不同而变化；本次只采用机制解释，没有将这些数字移植为 RMQ 的表现。

## 社区方法及可借鉴重点

以下是本次查到、与两类模型相关且有方法说明的主要路线。它们构成实验候选，不能理解为全部串行叠加后必然有效。

| 方法或来源 | 可借鉴的技术重点 | 使用时要回答的问题 |
| --- | --- | --- |
| 单方向 Abliteration | 从对照样本的残差激活提取方向，对写入残差流的权重作定向编辑。它改变响应行为，本身不增加领域知识。 | 方向是否由主题、语言、格式或长度差异混淆？干预是否迁移到真实任务？ |
| Heretic | 对层位置、方向和干预强度进行参数搜索，把拒答表现与原模型输出分布的 KL 差异共同纳入目标。 | KL 是否按相同输入与生成设置计算？低 KL 是否同时对应任务能力保持？ |
| Projected / Norm-Preserving Biprojected Abliteration | 对估计方向作投影修正，并控制编辑后的权重尺度；目的在于减少附带扰动。 | 保范数约束是否真的改善本模型的任务表现？不能从几何性质直接推导能力无损。 |
| OBLITERATUS 的 Qwen3.8 稠密模型实验 | 多方向 SVD、LEACE 路线、互补权重混合，以及围绕残余回避行为构造专门语料、迭代测量。 | 子空间维度与混合比例是否经过独立验证？迭代是否累积能力损失？ |
| huihui-ai 的 Qwen3.8 稠密模型实验 | 通过选择干预层范围控制影响；模型卡明确记录部分浅层、视觉组件和 MTP 的保留策略。 | 保留范围适合该版本，不能把相同层号直接当作另一模型的规则。 |
| windowsxp811203 的两类架构适配 | 分开识别稠密输出投影、GDN 输出、融合专家张量、共享专家及嵌入注入路径；逐架构重新测量方向和强度。 | 哪些张量写入残差，哪些只生成门控？专家维度和分支维度是否处理正确？ |
| SFT、DPO 与可验证任务强化学习 | 用完整任务轨迹进行监督，用候选结果表达偏好，用代码测试、计算结果或工具执行反馈训练策略。LoRA 与全参更新是参数更新方式。 | 领域数据、任务反馈和评估集是否匹配目标用途？是否能从单轮回答迁移到多轮执行？ |

方法的一手出处：

- [Arditi 等：Refusal in Language Models Is Mediated by a Single Direction](https://arxiv.org/abs/2406.11717)。这是机制研究；不能把单方向实验结论扩展成“所有价值观与安全行为都只有一个方向”。
- [Heretic 仓库与方法说明](https://github.com/p-e-w/heretic)。它是权重编辑和参数搜索工具，不能仅因使用了 LoRA 形式便称为完成了监督微调。
- Jim Lai 的 [Projected Abliteration](https://huggingface.co/blog/grimjim/projected-abliteration) 与 [Norm-Preserving Biprojected Abliteration](https://huggingface.co/blog/grimjim/norm-preserving-biprojected-abliteration)。论文式论证和社区实验可作为候选依据，仍需在 RMQ 的基座和任务集上验证。
- [OBLITERATUS Qwen3.8-27B 模型卡](https://huggingface.co/OBLITERATUS/Qwen3.8-27B-OBLITERATED)。其中各版本采用不同干预、混合与评测设置，未移植其性能结论。LEACE 的准确技术含义见[原论文](https://arxiv.org/abs/2306.03819)：在给定条件下消除概念的线性可预测性，并约束表征改动；不能笼统写成移除全部相关信息。
- [huihui-ai Qwen3.8-27B 模型卡](https://huggingface.co/huihui-ai/Huihui-Qwen3.8-27B-abliterated)及其引用的 [HF Transformers 实现](https://github.com/Sumandora/remove-refusals-with-transformers)。
- windowsxp811203 的 [Qwen3.8-27B 模型卡](https://huggingface.co/windowsxp811203/Qwen3.8-27B-Abliterated)与 [Flash-Next 模型卡](https://huggingface.co/windowsxp811203/Qwen3.8-Flash-Next-Abliterated)。这些适配细节来自作者的公开说明，本次没有下载模型权重或复现实验。
- [ModelScope 对 Qwen3.8-27B 训练支持的说明](https://huggingface.co/Qwen/Qwen3.8-27B/discussions/72)、[ms-swift 仓库](https://github.com/modelscope/ms-swift)和 [Flash-Next 的训练示例](https://github.com/modelscope/ms-swift/blob/main/examples/models/qwen4_exp/megatron_sft.sh)。后者证明存在该架构的适配示例，不代表所有训练算法、精度和并行组合都已验证。
- 可参考的任务数据组织：[Qwen3.8 多轮 Agent 轨迹](https://huggingface.co/datasets/ukisai/Qwen3.8-27B-multi-turn-agent-sft)、[DrSparse 的验证后筛选与 SFT 记录](https://huggingface.co/DiogenesChen122/Qwen3.8-27B-Lora-20260826)。借鉴轨迹与反馈组织方式，不能把生成来源或训练损失当成领域效果证明。

## 两类架构的实现差异

稠密版本需区分全局注意力输出、GDN 输出和前馈输出。Flash-Next 的公开适配记录还指出：融合专家可能以多维参数张量存在，仅遍历线性层会遗漏；多分支残差的内部表示与最终输出维度不同；N-gram 模块中值投影和门控投影的角色不同。由此推导的工程要求是先核对实际计算图和张量轴，再选择干预位置，不能仅按相似的名字或形状套用。

这些是架构适配问题，不适合堆入官网段落。页面只保留其结论：按架构定位干预路径，并将行为调整与领域任务训练衔接。

## 后续形成可核验结果

建议分别保留原始基座、行为干预、领域训练及部署量化后的版本，便于定位变化来自哪个阶段。使用相同提示模板、推理模式、生成预算和评估输入作对照；把直接拒答、迂回回避、事实正确性、推理、工具成功率及长任务完成情况分开记录。优化用样本与最终保留集分开，中英文和推理开关分别覆盖。

拒答降低、KL 较小、训练损失下降均不能单独证明专业能力提升。权重编辑、领域训练、量化与 MTP 兼容性也需要分别核验。本文没有新增训练执行、模型下载或对外发布。
