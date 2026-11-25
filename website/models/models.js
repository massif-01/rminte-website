    (() => {
      'use strict';
      // Add the actual RMQ model URLs when supplied; never link to the base models.
      const modelLinks = { RMQ3x: '', RMQ4: '' };
      const cases = [
  {
    "icon": "scale",
    "zh": {
      "name": "司法与法律服务",
      "task": "推进案件研判\n夯实诉讼准备",
      "outputs": [
        "合同修订稿",
        "庭审提纲"
      ],
      "stages": [
        "卷宗、合同、法律数据库与相关判例。",
        "精准检索法条与判例，锚定证据与法律要件的对应关系，起草文书并逐条核验引注。",
        "附依据的法律意见、合同修订稿与庭审提纲。"
      ]
    },
    "en": {
      "name": "Justice & legal services",
      "task": "Deepen case analysis\nand trial preparation",
      "outputs": [
        "Contract revisions",
        "Trial outlines"
      ],
      "stages": [
        "Case files, contracts, legal databases, and relevant precedents.",
        "Retrieve statutes and precedents with precision, anchor evidence to legal elements, draft filings, and verify every citation.",
        "Legal opinions with supporting authorities, contract revisions, and trial outlines."
      ]
    }
  },
  {
    "icon": "fingerprint",
    "zh": {
      "name": "刑事调查与数字取证",
      "task": "深挖隐秘线索\n还原事件全貌",
      "outputs": [
        "事件时间线",
        "取证核查任务"
      ],
      "stages": [
        "通信记录、设备数据与调查资料。",
        "交叉比对人物、实体与时序，逐一推敲竞争性假设，生成取证查询语句与后续核查清单。",
        "可追溯的事件时间线、关联线索与核查计划。"
      ]
    },
    "en": {
      "name": "Criminal investigation & digital forensics",
      "task": "Uncover hidden leads\nand reconstruct events",
      "outputs": [
        "Event timelines",
        "Forensic verification tasks"
      ],
      "stages": [
        "Communication records, device data, and investigation records.",
        "Cross-reference people, entities, and timelines, test competing hypotheses one by one, and generate forensic queries alongside follow-up verification checklists.",
        "Traceable event timelines, related leads, and verification plans."
      ]
    }
  },
  {
    "icon": "shield",
    "zh": {
      "name": "网络安全防御",
      "task": "洞悉潜伏威胁\n闭环响应处置",
      "outputs": [
        "检测查询",
        "修复方案"
      ],
      "stages": [
        "安全日志、威胁情报与检测工具。",
        "快速分诊海量告警，溯源完整攻击链，实时编写检测规则与自动化处置脚本。",
        "事件调查记录、修复方案与处置验证结果。"
      ]
    },
    "en": {
      "name": "Cyber defense",
      "task": "Spot hidden threats\nand close the response loop",
      "outputs": [
        "Detection queries",
        "Remediation plans"
      ],
      "stages": [
        "Security logs, threat intelligence, and detection tools.",
        "Rapidly triage high-volume alerts, trace full attack chains, and write detection rules and automated remediation scripts in real time.",
        "Investigation records, remediation plans, and response validation results."
      ]
    }
  },
  {
    "icon": "list-filter",
    "zh": {
      "name": "平台内容治理",
      "task": "精准裁量规则\n化解复杂争议",
      "outputs": [
        "审核任务分派",
        "申诉复核意见"
      ],
      "stages": [
        "用户内容、平台规则、举报与申诉。",
        "穿透语境与隐蔽行为关联，完成多维风险定级，援引历史判例输出清晰的复核依据。",
        "审核任务分派、复核意见与规则缺口清单。"
      ]
    },
    "en": {
      "name": "Platform content governance",
      "task": "Apply policies accurately\nand resolve complex disputes",
      "outputs": [
        "Review assignments",
        "Appeal assessments"
      ],
      "stages": [
        "User content, platform policies, reports, and appeals.",
        "Look past surface phrasing to uncover context and linked behaviors, classify risk across dimensions, and cite precedent cases to produce clear review rationales.",
        "Review assignments, review recommendations, and a list of policy gaps."
      ]
    }
  },
  {
    "icon": "network",
    "zh": {
      "name": "企业调查与反舞弊",
      "task": "穿透隐蔽关联\n锁定舞弊疑点",
      "outputs": [
        "异常关系线索",
        "调查报告"
      ],
      "stages": [
        "合同、资金流水、内部通信与工商信息。",
        "核验异常资金流向与隐性股权关系，拟定调查路径与针对性访谈提纲。",
        "附证据索引的调查报告与待核实事项。"
      ]
    },
    "en": {
      "name": "Corporate investigations & anti-fraud",
      "task": "Pierce hidden links\nand pinpoint fraud anomalies",
      "outputs": [
        "Unusual connections",
        "Investigation reports"
      ],
      "stages": [
        "Contracts, transaction records, internal communications, and company registration records.",
        "Verify unusual fund flows and hidden ownership ties, map investigation paths, and draft targeted interview outlines.",
        "Investigation reports with evidence indexes and items requiring verification."
      ]
    }
  },
  {
    "icon": "scan-line",
    "zh": {
      "name": "法医、毒理与事故调查",
      "task": "还原致因机制\n规划鉴别验证",
      "outputs": [
        "机制假设",
        "补充检验方案"
      ],
      "stages": [
        "检验结果、现场记录与专业文献。",
        "平行构建多种致因假设，推演完整因果链条，锁定足以辨明真伪的关键鉴别证据。",
        "机制假设、鉴别问题与补充检验方案。"
      ]
    },
    "en": {
      "name": "Forensic medicine, toxicology & accident investigation",
      "task": "Reconstruct causal mechanisms\nand plan differential tests",
      "outputs": [
        "Mechanistic hypotheses",
        "Follow-up testing plans"
      ],
      "stages": [
        "Examination results, scene records, and specialist literature.",
        "Build parallel causal hypotheses, trace complete causal chains, and pinpoint the decisive evidence that separates one mechanism from another.",
        "Mechanistic hypotheses, questions that distinguish competing explanations, and follow-up testing plans."
      ]
    }
  },
  {
    "icon": "layers",
    "zh": {
      "name": "材料与工业化学研究",
      "task": "探索配方工艺\n加速研发迭代",
      "outputs": [
        "实验矩阵",
        "仿真脚本"
      ],
      "stages": [
        "研究文献、材料数据库、实验与仿真工具。",
        "提出配方构想与反应机理假设，编写仿真脚本、规划实验矩阵，并依据实测数据持续迭代方案。",
        "候选方案、实验矩阵与可复现的数据处理脚本。"
      ]
    },
    "en": {
      "name": "Materials & industrial chemistry research",
      "task": "Explore formulations\nand accelerate R&D iteration",
      "outputs": [
        "Experimental matrices",
        "Simulation scripts"
      ],
      "stages": [
        "Research literature, materials databases, and experimental and simulation tools.",
        "Propose formulation concepts and reaction mechanism hypotheses, write simulation scripts, design experimental matrices, and iterate continuously on lab results.",
        "Candidate approaches, experimental matrices, and reproducible data-processing scripts."
      ]
    }
  },
  {
    "icon": "dna",
    "zh": {
      "name": "生命科学与生物医学研究",
      "task": "凝练科学假设\n推进实验求证",
      "outputs": [
        "实验设计",
        "研究脚本"
      ],
      "stages": [
        "文献、生物数据库与实验数据。",
        "梳理作用机制假设与研究优先级，搭建实验设计与数据分析流程，随实验反馈持续演进。",
        "实验设计、可复现脚本与研究方案。"
      ]
    },
    "en": {
      "name": "Life sciences & biomedical research",
      "task": "Sharpen scientific hypotheses\nand advance experimental proof",
      "outputs": [
        "Experimental designs",
        "Research scripts"
      ],
      "stages": [
        "Literature, biological databases, and experimental data.",
        "Structure mechanistic hypotheses and research priorities, build experimental designs and data analysis pipelines, and evolve them with experimental feedback.",
        "Experimental designs, reproducible scripts, and research plans."
      ]
    }
  },
  {
    "icon": "messages-square",
    "zh": {
      "name": "社会学、犯罪学与伦理研究",
      "task": "夯实研究设计\n检验制度效用",
      "outputs": [
        "研究设计",
        "理论检验报告"
      ],
      "stages": [
        "访谈、案例、统计数据与理论文献。",
        "拟定严谨抽样方案，完成质性编码与统计建模，验证理论解释并推演制度的长远影响。",
        "研究设计、模型结果与有证据支撑的论证。"
      ]
    },
    "en": {
      "name": "Sociology, criminology & ethics",
      "task": "Strengthen study design\nand test institutional impact",
      "outputs": [
        "Study designs",
        "Theory-testing reports"
      ],
      "stages": [
        "Interviews, cases, statistical data, and theoretical literature.",
        "Design rigorous sampling plans, execute qualitative coding and statistical modeling, test theoretical explanations, and trace long-term institutional effects.",
        "Study designs, model results, and arguments supported by evidence."
      ]
    }
  }
];
      const optimizationItems = [
        {
          model:'RMQ3x · RMQ4', zh:'Gated DeltaNet 递归记忆', en:'Gated DeltaNet recurrent memory',
          benefitZh:'以固定规模的递归状态沉淀历史记忆，大幅压低缓存占用，并借分块并行加速输入处理。',
          benefitEn:'Distill history into fixed-size recurrent state to slash cache overhead, while chunked parallelism speeds up input processing.',
          detailZh:[
            'Gated DeltaNet 将遗忘门控与 Delta 更新规则融为一体：门控调节旧记忆的留存比例，Delta 规则则以新信息即时修正当前状态的预测误差。每个 GDN 层只需维护固定规模的状态，即可承接历史脉络，免去逐 token 累积庞大 KV Cache 的负担。',
            '两款模型均以「三个 GDN 层搭配一个注意力层」交替排布。GDN 在预填充阶段支持分块并行、在解码阶段执行高效递归更新，注意力层则保留直达上下文细节的精准检索路径——状态记忆与注意力检索优势互补，从容驾驭长文档与多轮复杂任务。',
            '引擎以 WY 分块计算组织预填充，复用块内状态与输入，消除了逐 token 更新带来的重复访存。递归状态以 BF16 存储、在 FP32 中完成更新与累加，兼顾数值精度，同时显著压低状态读写与高并发下的内存占用。'
          ],
          detailEn:[
            'Gated DeltaNet unites a forget gate with the delta update rule: the gate governs how much prior memory to retain, while the delta rule uses incoming information to correct the state’s prediction error on the fly. Each GDN layer maintains a fixed-size state to carry context forward—eliminating the burden of growing a full KV Cache token by token.',
            'Both models interleave three GDN layers with one attention layer. GDN delivers chunk-parallel prefill and fast recurrent updates during decode, while attention preserves direct, pinpoint retrieval across context details—state memory and attention retrieval complement each other to handle long documents and complex multi-turn tasks with ease.',
            'The engine organizes prefill with WY chunked computation, reusing state and inputs within each chunk to eliminate redundant memory traffic from token-by-token updates. Recurrent state is stored in BF16 and updated and accumulated in FP32—preserving numerical precision while sharply reducing state I/O and memory footprint under concurrency.'
          ]
        },
        {
          model:'RMQ3x', zh:'全局注意力与稠密计算', en:'Global attention & dense computation',
          benefitZh:'全局检索精准回溯上下文细节，规整的稠密前馈路径更利于持续吞吐与深度算子融合。',
          benefitEn:'Global retrieval recalls fine context details accurately, while a clean dense feed-forward path enables sustained throughput and deep operator fusion.',
          detailZh:[
            'RMQ3x 在 GDN 层之间保留了 Gated Attention 层，对因果范围内的全部上下文执行全局注意力，再由输出门控精细调节检索信息的权重。每个 token 均完整流经稠密前馈网络，计算路径规整纯粹，无需专家路由与重排开销。',
            '引擎将 Q、K、V 投影合并为单次矩阵运算，并将 QK 归一化与 RoPE 位置编码融合执行。在单 token 解码阶段，输入 RMSNorm 与投影计算直接共用片上数据；SwiGLU、输出投影与残差相加沿执行路径深度融合，大幅削减中间张量的写回、读取与算子启动开销。'
          ],
          detailEn:[
            'RMQ3x keeps Gated Attention layers between GDN blocks, attending across the full causal context while an output gate finely weights the retrieved signal. Every token flows cleanly through the dense feed-forward network—no expert routing or token reordering overhead.',
            'The engine merges Q, K, and V projections into a single matrix operation and fuses QK normalization with RoPE positional encoding. During single-token decoding, input RMSNorm and projection share on-chip data directly; SwiGLU, output projection, and residual addition are deeply fused along the execution path, sharply cutting intermediate tensor reads, writes, and kernel launches.'
          ]
        },
        {
          model:'RMQ4', zh:'QSA 块级稀疏注意力', en:'QSA block-sparse attention',
          benefitZh:'先以块级索引锁定关键片段，再回读原始 token，让宝贵的注意力算力尽数聚焦核心内容。',
          benefitEn:'Locate key segments with block-level indexing before attending to original tokens—focusing precious attention compute squarely on what matters.',
          detailZh:[
            'QSA（Qwen Sparse Attention）借助轻量索引器，将历史键向量压缩为微块表示并评估相关性。被选中的微块随即展开为原始 token 位置，与尚未填满的当前尾部块一同交由主注意力模块计算——块级索引大幅收窄候选范围，细粒度注意力则完整保留对原文细节的精准读取。',
            'RMQ4 以 QSA 承接 GDN 之外的长程上下文检索。工程优化贯穿块级索引、Top-k 筛选、稀疏键值访存与注意力计算全链路，严控索引与访存成本，让超长上下文中的每一次检索都直击要害。'
          ],
          detailEn:[
            'QSA (Qwen Sparse Attention) uses a lightweight indexer to compress past key vectors into micro-block representations and score relevance. Selected micro-blocks expand back to their original token positions and join the active tail block in the main attention module—block indexing narrows the candidate pool dramatically, while token-level attention preserves exact access to original details.',
            'In RMQ4, QSA handles long-range retrieval alongside GDN. End-to-end engineering spans block indexing, Top-k selection, sparse key-value memory access, and attention math—keeping indexing and bandwidth costs tight so every retrieval across ultra-long contexts hits the mark.'
          ]
        },
        {
          model:'RMQ4', zh:'稀疏专家与 Fused MoE', en:'Sparse experts & Fused MoE',
          benefitZh:'每个 token 仅激活部分路由专家与共享专家，将模型知识容量与单步计算开销彻底解耦。',
          benefitEn:'Each token activates only selected routed experts plus a shared expert—cleanly decoupling model knowledge capacity from per-step compute cost.',
          detailZh:[
            'RMQ4 的路由器依据每个 token 的表征动态挑选对应专家，由选中专家与共享专家共同完成前馈计算，再加权汇聚输出。稀疏激活让模型得以容纳庞大的专家池，同时把单 token 计算量牢牢锁在低位；而完整权重的高效存储与调度，则交由底层运行时精准承接。',
            'Fused MoE 按专家归组并重排 token，将命中同一专家的输入合并计算，充分复用专家权重。引擎依据专家负载动态择优 GEMV 或 GEMM，并将门控激活与加权归并融合执行，在严守路由语义与计算精度的前提下，大幅消除零散小算子与中间数据搬运。',
            '量化后的专家权重在加载阶段即直接写入预分配的打包缓冲区，省去逐张量分配与二次搬运。专家的 Gate 与 Up 投影共享统一内存布局，使模型加载与推理计算无缝沿用同一套数据组织，既缩短冷启动时间，又压低常驻内存开销。'
          ],
          detailEn:[
            'RMQ4’s router dynamically assigns experts from each token’s representation; the selected experts and a shared expert run feed-forward math and merge results via weighted aggregation. Sparse activation unlocks a vast expert pool while keeping per-token compute low, with the runtime engineered to store and schedule the full weight set efficiently.',
            'Fused MoE groups and reorders tokens by expert, batching inputs routed to the same expert to maximize weight reuse. The engine chooses GEMV or GEMM dynamically by workload and fuses gated activation with weighted reduction—eliminating fragmented small ops and intermediate transfers while strictly preserving routing and numerical semantics.',
            'Quantized expert weights stream straight into preallocated packed buffers at load time, eliminating per-tensor allocations and redundant copies. Gate and Up projections share a unified memory layout so loading and inference operate on the exact same structure—shortening cold starts and trimming resident memory.'
          ]
        },
        {
          model:'RMQ4', zh:'Gated Residual 门控残差', en:'Gated Residual',
          benefitZh:'以多分支残差配合动态读写门控，精细调控每一层吸收与沉淀的信息流。',
          benefitEn:'Multi-branch residuals paired with dynamic read–write gates finely regulate what each layer absorbs and retains.',
          detailZh:[
            'Gated Residual 将单一残差流拓展为多条并行分支。读取时，各分支独立归一化并按当前输入生成逐通道门控，再聚合为模块输入；写入时，为每条分支赋予动态标量权重，精准控制模块输出汇入各分支的比例。',
            '这种机制将跨层信息筛选细化到分支与通道维度，显著增强深层网络的信息保真度与传递效率。读门控与归一化共用同一计算路径，并省去额外的残差混合矩阵，避免了宽残差流的反复读取。'
          ],
          detailEn:[
            'Gated Residual expands a single residual stream into multiple parallel branches. On read, each branch is normalized independently, modulated by input-dependent channel gates, and aggregated into the block input; on write, dynamic scalar weights control exactly how much block output merges into each branch.',
            'Bringing cross-layer selection down to branches and channels strengthens signal fidelity across deep networks. Read gating shares a compute path with normalization and drops extra residual-mixing matrices, avoiding repeated reads of the widened stream.'
          ]
        },
        {
          model:'RMQ4', zh:'N-gram 条件记忆', en:'N-gram conditional memory',
          benefitZh:'以局部 token 组合直接查表检索，用极小的额外算力换取模型表达容量的跃升。',
          benefitEn:'Look up local token combinations directly in an embedding table—expanding representational capacity at minimal compute cost.',
          detailZh:[
            'N-gram 嵌入将当前 token 与相邻前文组合成短序列，生成确定的查表索引；取出的向量经投影与门控注入模型表征，让输入同时兼具单 token 语义与局部搭配特征。嵌入表中的海量知识沉淀于训练阶段，推理时只需按索引直接读取。',
            '这种容量扩展几乎只带来轻量的查表与投影开销，无需每次都调用完整专家网络；确定性的索引更便于将嵌入预取与前序层计算并行重叠。工程上重点攻坚查表带宽、内存布局与存储调度，把大容量嵌入表的访问代价压至最低。'
          ],
          detailEn:[
            'N-gram embeddings pair the current token with nearby preceding tokens to form short sequences and deterministic lookup indices. Retrieved vectors are projected and gated into the model representation, enriching single-token semantics with local phrase features—knowledge learned during training and read directly by index at inference.',
            'This capacity boost adds only lightweight lookup and projection work without invoking a full expert network, and deterministic indices let embedding prefetch overlap with earlier layers. Engineering focuses on lookup bandwidth, memory layout, and storage scheduling to keep large-table access costs minimal.'
          ]
        },
        {
          model:'RMQ3x · RMQ4',
          zh:'面向硬件的计算路径',
          en:'Hardware-specific computation paths',
          benefitZh:'依矩阵规模动态编排算子与数据布局，令 GPU 算力、内存带宽与多级缓存默契共振。',
          benefitEn:'Orchestrate kernels and data layouts by matrix scale so GPU compute, memory bandwidth, and caches work in lockstep.',
          detailZh:[
            '面对单 token 解码、小批量验证与大批量预填充等迥异负载，引擎分别启用专属计算路径——依矩阵规模动态切换定制 GEMV、cuBLAS 或 CUTLASS GEMM，配合精细的线程排布、向量化访存与缓存复用，丝丝入扣地贴合 RM-01 的 GPU 与内存架构。小批量场景更善用 L2 缓存复用输入，避免共享内存占用拖累并行度。',
            'NVFP4（W4A16）以 4 位紧凑格式存放权重，搭配 16 位高精度激活参与计算；专用算子融合查表解码、向量化加载与投影合并，大幅降低权重访存代价。加载阶段则根据可用内存与分片尺寸灵活匹配内存映射与预读策略，将精度、容量与访存效率纳入同一盘棋统筹设计。'
          ],
          detailEn:[
            'Single-token decode, small-batch verification, and large prefill batches each follow a dedicated path—switching dynamically between custom GEMV, cuBLAS, and CUTLASS GEMM by matrix scale, with thread layouts, vectorized loads, and cache reuse tuned tightly to RM-01’s GPU and memory architecture. Small batches reuse inputs via L2 cache so shared-memory pressure never stalls parallelism.',
            'NVFP4 (W4A16) packs weights in compact 4-bit format paired with 16-bit activations; custom kernels fuse lookup-table decoding, vectorized loads, and merged projections to slash weight-access costs. During loading, memory-mapping and prefetch strategies adapt to available memory and shard size—balancing precision, capacity, and bandwidth in one unified design.'
          ]
        },
        {
          model:'RMQ3x · RMQ4',
          zh:'多 token 预测与验证',
          en:'Multi-token prediction & verification',
          benefitZh:'单次前向并行校验多个候选 token，大幅压缩生成阶段的重复计算与同步等待。',
          benefitEn:'Validate multiple candidate tokens in a single forward pass, sharply cutting redundant compute and sync stalls during generation.',
          detailZh:[
            'MTP 直接在 GPU 侧连续生成候选 token，草稿链环环相扣，省去频繁的 CPU–GPU 同步等待。随后由主模型批量校验草稿，整段采纳命中的连续前缀，并顺势输出修正或追加的 token；小批量校验更借助多行 GEMV 共享权重读取，将验证开销压到极低。',
            '针对 GDN 等有状态架构，引擎会在验证沿途为递归状态与卷积状态留存检查点；一旦草稿仅部分命中，便瞬时回溯至对应位置的状态继续生成。单路请求自动启用推测解码，多路并发无缝切换至批量解码，让预测、校验与权重复用始终贴合当下负载。'
          ],
          detailEn:[
            'MTP drafts candidate tokens directly on the GPU in a continuous chain, eliminating frequent CPU–GPU sync stalls. The main model verifies the draft batch in one pass, accepts the matching prefix, and emits a corrected or bonus token—while multi-row GEMV shares weight reads during small-batch verification to keep overhead negligible.',
            'For stateful layers such as GDN, the engine checkpoints recurrent and convolution states along the verification path; if a draft is only partially accepted, it rolls back instantly to the exact checkpoint and keeps generating. Single requests run speculative decoding while concurrent loads switch seamlessly to batched decoding—keeping prediction, verification, and weight reuse matched to live demand.'
          ]
        },
        {
          model:'RMQ3x · RMQ4',
          zh:'上下文与并发调度',
          en:'Context & concurrency scheduling',
          benefitZh:'复用前序计算、合并并发请求，令有限的内存与带宽从容托起高并发长文任务。',
          benefitEn:'Reuse prior computation and batch concurrent requests so finite memory and bandwidth handle demanding multi-user workloads.',
          detailZh:[
            '分页 KV Cache 与递归状态管理分别留存各路请求的计算进度，前缀缓存高效复用重复输入。面对超长上下文，引擎采用分块预填充并以内存与 SSD 分层存储承接历史状态；流式注意力分批从 SSD 读取键值块并实时归并结果，大幅拓宽上下文容量边界。',
            '等长短输入自动合并为单次批量 prefill，多路请求的输出投影亦可合批计算，双管齐下压低权重重复读取与首字延迟。生成阶段借助连续批处理充分复用算力，各路请求依然保有独立上下文与状态，让长文档研读、多轮交互与高并发任务稳稳共用同一套推理服务。'
          ],
          detailEn:[
            'Paged KV Cache and recurrent-state management preserve each request’s progress while prefix caching reuses shared input. Ultra-long contexts rely on chunked prefill and memory–SSD tiering for historical state, with streaming attention reading key-value blocks from SSD in batches and merging partial results to stretch context boundaries.',
            'Equal-length short inputs merge into a single batched prefill, and output projections batch across requests—cutting repeated weight reads and time to first token together. During generation, continuous batching shares compute while keeping every request’s context and state isolated, letting document analysis, multi-turn dialogue, and high concurrency run smoothly on one inference service.'
          ]
        },
        {
          model:'RMQ3x · RMQ4', zh:'领域适配与 Agent 训练', en:'Domain adaptation & agent training',
          benefitZh:'基于真实专业语料、任务轨迹与执行反馈定向打磨，锻造深度分析、工具调用与自我核查能力。',
          benefitEn:'Honed on real domain material, task trajectories, and execution feedback to build deep analysis, tool mastery, and self-verification.',
          detailZh:[
            '监督微调（SFT）将真实专业材料编织为覆盖问题剖析、证据关联、工具调用与成果交付的完整任务轨迹。训练横跨多轮对话、结构化输出与失败自愈场景，对助手的回答与行动全程施加监督，让模型真正习得端到端的专业作业流程；并视目标范围灵活选用 LoRA 低秩适配或全参微调。',
            '直接偏好优化（DPO）通过同一课题下的候选方案对比，将证据充分性、推理严密性与指令遵循度直接写进优化目标。针对代码、计算与工具执行等结果可验证的任务，则引入 GRPO 类强化学习以真实执行反馈打磨策略，并依托保留测试集持续检验专业能力与通用能力的同步演进。'
          ],
          detailEn:[
            'Supervised fine-tuning (SFT) weaves real domain materials into end-to-end task trajectories spanning problem analysis, evidence linking, tool calls, and final delivery. Training supervises both responses and actions across multi-turn dialogue, structured outputs, and recovery from execution failures—using LoRA or full-parameter fine-tuning depending on update scope.',
            'Direct Preference Optimization (DPO) compares candidate solutions to the same task, baking evidence rigor, reasoning consistency, and instruction fidelity straight into the objective. For coding, computation, and tool tasks with verifiable outcomes, GRPO-style reinforcement learning sharpens policies from real execution feedback, while held-out suites track domain and general capability gains side by side.'
          ]
        },
        {
          model:'RMQ3x · RMQ4', zh:'价值观与安全对齐调整', en:'Adjusting value & safety alignment',
          benefitZh:'结合偏好重塑与拒答表征定向干预，解除泛化拒答对专业课题的掣肘，同时严控对通用能力的扰动。',
          benefitEn:'Combine preference reshaping with targeted refusal-representation edits to lift overbroad refusals on specialist tasks while keeping core capabilities intact.',
          detailZh:[
            'RMQ3x 与 RMQ4 针对基座模型的价值观与安全对齐实施了定向后训练。SFT 以高质量任务示范教会模型直面问题、辨析证据并忠实执行指令；DPO 则借由回答对的偏好排序，消除刻板的预设立场、回避话术与泛化拒答。一切训练目标皆锚定于事实证据与用户任务本身，使模型得以坦诚探讨争议议题、公允比对多元观点并扎实推进专业分析。',
            'Abliteration 从对照样本的中间激活中精准析出拒答方向，对写入残差流的权重实施外科手术式的定向编辑。我们依各层与表征结构灵活组合单方向投影、SVD 多方向子空间及 LEACE 线性概念擦除，并辅以分层强度搜索、投影修正、范数保持与权重融合精细控幅，对残余拒答行为持续迭代校正。',
            '干预落点严丝合缝地适配两款架构：RMQ3x 聚焦注意力与稠密前馈输出；RMQ4 则深入融合专家张量、共享专家与多分支残差，并将嵌入投影与门控路径区别对待。编辑强度由实际响应表现、KL 散度与多维任务评测共同标定，再经中文理解、逻辑推理、代码编写、工具调用与长程任务全套评测，确保模型原有实力稳如磐石。'
          ],
          detailEn:[
            'RMQ3x and RMQ4 apply targeted post-training to recalibrate base-model value and safety alignment. SFT teaches direct answers, evidence examination, and faithful instruction execution through high-quality demonstrations, while DPO uses paired preferences to strip away rigid stances, evasive hedging, and overbroad refusals—anchoring every objective to evidence and the user’s task so models can examine contested topics, weigh viewpoints fairly, and carry out rigorous professional analysis.',
            'Abliteration isolates refusal directions from intermediate activations of contrasting examples and applies surgical edits to weights writing into the residual stream. We pair single-direction projection, SVD multi-direction subspaces, and LEACE linear concept erasure to fit each layer’s representation—guided by layer-wise strength search, projection refinement, norm preservation, and weight blending, then refined iteratively against residual refusals.',
            'Intervention targets fit each architecture tightly: attention and dense feed-forward outputs in RMQ3x; fused expert tensors, shared experts, and multi-branch residuals in RMQ4, keeping embedding projections distinct from gating paths. Edit strength is calibrated jointly by response behavior, KL divergence, and task benchmarks—verified across Chinese comprehension, reasoning, coding, tool use, and long-horizon suites to ensure core strength holds rock-steady.'
          ]
        }
      ];
      function bilingual(tag, zh, en, className) {
        const element = document.createElement(tag);
        element.dataset.zh = zh; element.dataset.en = en; element.textContent = zh;
        if (className) element.className = className;
        return element;
      }
      function plusIcon() {
        const icon = document.createElementNS('http://www.w3.org/2000/svg','svg');
        icon.setAttribute('class','mp-icon mp-opt-plus'); icon.setAttribute('viewBox','0 0 24 24'); icon.setAttribute('aria-hidden','true');
        const horizontal = document.createElementNS('http://www.w3.org/2000/svg','path'); horizontal.setAttribute('d','M5 12h14');
        const vertical = document.createElementNS('http://www.w3.org/2000/svg','path'); vertical.setAttribute('d','M12 5v14'); vertical.setAttribute('class','mp-plus-vertical'); icon.append(horizontal,vertical);
        return icon;
      }
      const caseGrid = document.getElementById('useCases');
      const caseButtons = [];
      let selectedCase = -1;
      function caseIcon(name) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('class','mp-icon'); svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('aria-hidden','true');
        const use = document.createElementNS('http://www.w3.org/2000/svg','use');
        use.setAttribute('href',`industry-icons.svg#${name}`); svg.append(use); return svg;
      }
      function caseActionIcon(close=false) {
        const svg = plusIcon(); svg.classList.remove('mp-opt-plus'); svg.lastChild.remove();
        svg.firstChild.setAttribute('d',close ? 'M6 6l12 12M18 6 6 18' : 'M5 12h14m-5-5 5 5-5 5'); return svg;
      }
      cases.forEach((item,index) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'mp-case-card'; button.setAttribute('data-bevel','');
        button.id = `case-${index}`; button.setAttribute('aria-expanded','false'); button.setAttribute('aria-controls','caseDetail');
        const industry = document.createElement('span'); industry.className = 'mp-case-industry';
        industry.append(caseIcon(item.icon),bilingual('span',item.zh.name,item.en.name));
        const outputs = document.createElement('span'); outputs.className = 'mp-case-outputs';
        item.zh.outputs.forEach((value,i) => outputs.append(bilingual('span',value,item.en.outputs[i])));
        const action = document.createElement('span'); action.className = 'mp-case-open';
        action.append(bilingual('span','查看工作流程','Explore workflow'),caseActionIcon());
        button.append(industry,bilingual('span',item.zh.task,item.en.task,'mp-case-task'),outputs,action);
        button.addEventListener('click',() => selectCase(selectedCase === index ? -1 : index));
        caseButtons.push(button); caseGrid.append(button);
      });
      const caseDetail = document.createElement('div'); caseDetail.className = 'mp-case-detail'; caseDetail.id = 'caseDetail'; caseDetail.hidden = true;
      caseDetail.setAttribute('role','region'); caseDetail.setAttribute('aria-labelledby','caseDetailTitle'); caseGrid.append(caseDetail);
      function positionCaseDetail() {
        if (selectedCase < 0) return;
        const columns = getComputedStyle(caseGrid).gridTemplateColumns.split(' ').length;
        const last = Math.min(cases.length - 1,Math.floor(selectedCase / columns) * columns + columns - 1);
        if (caseButtons[last].nextElementSibling !== caseDetail) caseButtons[last].after(caseDetail);
      }
      function renderCaseDetail() {
        if (selectedCase < 0) return;
        const item = cases[selectedCase];
        const close = document.createElement('button'); close.type = 'button'; close.className = 'mp-case-close';
        close.setAttribute('aria-label',RM_I18N.text({zh: '收起工作流程', en: 'Close workflow'}, lang)); close.append(caseActionIcon(true));
        close.addEventListener('click',() => { const previous = selectedCase; selectCase(-1); caseButtons[previous].focus(); });
        const title = bilingual('h3',item.zh.name,item.en.name); title.id = 'caseDetailTitle';
        const flow = document.createElement('div'); flow.className = 'mp-case-flow';
        const labels = [['连接知识与工具','Connect knowledge and tools'],['Agent 推进任务','Agent execution'],['交付工作成果','Deliver results']];
        labels.forEach((label,index) => {
          const stage = document.createElement('div'); stage.className = 'mp-case-stage';
          const number = document.createElement('span'); number.className = 'mp-case-step'; number.textContent = `0${index + 1}`;
          stage.append(number,bilingual('h4',...label),bilingual('p',item.zh.stages[index],item.en.stages[index])); flow.append(stage);
        });
        caseDetail.replaceChildren(close,bilingual('span','专业 Agent 工作流程','SPECIALIST AGENT WORKFLOW','mp-case-detail-eyebrow'),title,flow);
        caseDetail.querySelectorAll('[data-zh][data-en]:not([data-i18n-attr]):not(title):not(meta)').forEach(element => setBrandedText(element,RM_I18N.text(element.dataset, lang)));
      }
      function selectCase(index) {
        selectedCase = index; caseButtons.forEach((button,i) => button.setAttribute('aria-expanded',String(i === index)));
        caseDetail.hidden = index < 0;
        if (index >= 0) { renderCaseDetail(); positionCaseDetail(); }
      }
      caseGrid.addEventListener('keydown',event => {
        if (event.key === 'Escape' && selectedCase >= 0) { const previous = selectedCase; selectCase(-1); caseButtons[previous].focus(); }
      });
      new ResizeObserver(positionCaseDetail).observe(caseGrid);
      for (const item of optimizationItems) {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        const name = document.createElement('div'); name.className = 'mp-opt-name';
        const model = document.createElement('span'); model.className = 'mp-opt-model'; model.textContent = item.model;
        name.append(bilingual('h3',item.zh,item.en),model);
        const icon = plusIcon();
        summary.append(name,bilingual('p',item.benefitZh,item.benefitEn,'mp-opt-benefit'),icon);
        const detail = document.createElement('div'); detail.className = 'mp-opt-detail';
        detail.append(bilingual('strong','技术解读','TECHNICAL DETAILS'));
        item.detailZh.forEach((paragraph,index) => detail.append(bilingual('p',paragraph,item.detailEn[index])));
        details.append(summary,detail); document.getElementById('optimizations').append(details);
      }
      document.querySelectorAll('[data-cells]').forEach(grid => {
        for (let i=0;i<Number(grid.dataset.cells);i++) {
          const cell = document.createElement('i'); cell.style.setProperty('--k',i); grid.append(cell);
        }
      });
      document.querySelectorAll('[data-model]').forEach(button => {
        const href = modelLinks[button.dataset.model];
        if (!href) return;
        const link = document.createElement('a');
        link.className = button.className; link.href = href; link.target = '_blank'; link.rel = 'noreferrer';
        link.append(...button.childNodes); button.replaceWith(link);
      });
      const menu = document.getElementById('mobileMenu');
      const menuToggle = document.getElementById('menuToggle');
      const languageToggle = document.getElementById('languageToggle');
      let lang = 'zh';
      function setBrandedText(element,text) {
        const parts = text.split(/(RMinte(?:\s+AI\b)?|RMQ3x|RMQ4|RMQ|RM-01)/g);
        element.replaceChildren(...parts.map(part => {
          if (!/^(RMinte(?:\s+AI\b)?|RMQ3x|RMQ4|RMQ|RM-01)$/.test(part)) return document.createTextNode(part);
          const mark = document.createElement('span'); mark.className = 'rm-mark'; mark.textContent = part; return mark;
        }));
      }
      function setLanguage(next) {
        lang = next; RM_I18N.apply(lang);
        document.querySelectorAll('[data-zh][data-en]:not([data-i18n-attr]):not(title):not(meta)').forEach(element => { setBrandedText(element,RM_I18N.text(element.dataset, lang)); });
        menuToggle.setAttribute('aria-label',RM_I18N.text({zh: '打开菜单', en: 'Open menu'}, lang));
        document.querySelectorAll('[data-close-dialog]').forEach(button => button.setAttribute('aria-label',RM_I18N.text({zh: '关闭', en: 'Close'}, lang)));
        document.querySelectorAll('.hf-button[disabled]').forEach(button => {
          button.title = RM_I18N.text({zh: '模型主页即将公布', en: 'Model page coming soon'}, lang);
          button.setAttribute('aria-label',`${button.dataset.model} · Hugging Face · ${button.title}`);
        });
        menu.setAttribute('aria-label',RM_I18N.text({zh: '导航菜单', en: 'Navigation menu'}, lang));
        document.querySelector('.site-shell').setAttribute('aria-label',RM_I18N.text({zh: '主导航', en: 'Main navigation'}, lang));
        document.querySelector('.nav-island').setAttribute('aria-label',RM_I18N.text({zh: '页面导航', en: 'Page navigation'}, lang));
        document.querySelector('.mp-mobile-links').setAttribute('aria-label',RM_I18N.text({zh: '移动导航', en: 'Mobile navigation'}, lang));
        document.getElementById('models').setAttribute('aria-label',RM_I18N.text({zh: '模型介绍', en: 'Model overview'}, lang));
        renderCaseDetail();
        document.querySelector('.mp-engine-tabs').setAttribute('aria-label',RM_I18N.text({zh: '推理实现', en: 'Inference engines'}, lang));
        document.querySelector('.mp-hero-art').setAttribute('aria-label',RM_I18N.text({zh: 'Dense 与 MoE 架构概念示意', en: 'Conceptual view of dense and MoE architectures'}, lang));
        document.querySelectorAll('[data-visual-model]').forEach(button => {
          const architecture = button.classList.contains('dense') ? 'Dense' : 'MoE';
          button.setAttribute('aria-label',`${button.dataset.visualModel} ${architecture}${RM_I18N.text({zh: '：展开或收起结构', en: ': expand or collapse layers'}, lang)}`);
        });
        updateEngineArt();
      }
      document.querySelectorAll('[data-visual-model]').forEach(button => {
        button.addEventListener('click',() => button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed') !== 'true')));
        button.addEventListener('keydown',event => {
          if (event.key === 'Escape') button.setAttribute('aria-pressed','false');
        });
      });
      RM_I18N.mount('#languageToggle', setLanguage);
      menuToggle.addEventListener('click',() => { menu.showModal(); menuToggle.setAttribute('aria-expanded','true'); });
      menu.addEventListener('close',() => menuToggle.setAttribute('aria-expanded','false'));
      document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click',() => button.closest('dialog').close()));
      document.querySelectorAll('.mp-mobile-links a').forEach(link => link.addEventListener('click',() => menu.close()));
      const narrowMenu = matchMedia('(max-width:1120px)');
      narrowMenu.addEventListener('change',event => { if (!event.matches && menu.open) menu.close(); });
      const engineTabs = Array.from(document.querySelectorAll('[data-engine-tab]'));
      let engine = 'cpp';
      function updateEngineArt() {
        document.getElementById('engineArt').dataset.engine = engine;
        const cppLabel = {zh: 'RMinte C++ / Rust 运行时', en: 'RMinte C++ / Rust Runtime'};
        setBrandedText(document.getElementById('runtimeLabel'), engine === 'cpp' ? (lang === 'zh' || lang === 'en' ? cppLabel.en : RM_I18N.text(cppLabel, lang)) : RM_I18N.text({zh: 'vLLM 定制', en: 'Custom vLLM'}, lang));
        document.getElementById('engineArt').setAttribute('aria-label',RM_I18N.text(engine === 'cpp' ? {zh: '自研 C++ / Rust 推理实现示意', en: 'Diagram of the dedicated C++ and Rust inference engine'} : {zh: 'vLLM 定制推理实现示意', en: 'Custom vLLM inference diagram'}, lang));
      }
      function selectEngine(next,focus=false) {
        engine = next;
        engineTabs.forEach(tab => {
          const selected = tab.dataset.engineTab === engine;
          tab.setAttribute('aria-selected',String(selected)); tab.tabIndex = selected ? 0 : -1;
          document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
          if (selected && focus) tab.focus();
        });
        updateEngineArt();
        if (engine === 'cpp') countRunnerMemory();
      }
      engineTabs.forEach((tab,index) => {
        tab.addEventListener('click',() => selectEngine(tab.dataset.engineTab));
        tab.addEventListener('keydown',event => {
          let target;
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') target = engineTabs[1-index];
          if (event.key === 'Home') target = engineTabs[0];
          if (event.key === 'End') target = engineTabs[1];
          if (target) { event.preventDefault(); selectEngine(target.dataset.engineTab,true); }
        });
      });
      // Engine diagram motion (D9): five light blocks travel through the layers (the keyframes are in models.css), and the runner's
      // "2 MB" counts up when the diagram comes into view and whenever C++ is chosen. The CSS animations run only while data-live is set.
      const engineArt = document.getElementById('engineArt');
      const memoryNumber = engineArt.querySelector('.mp-engine-mb-num');
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let memoryFrame = 0;
      for (let k=0;k<5;k++) {
        const token = document.createElement('span'); token.className = 'mp-token';
        token.style.left = `${14+k*17}%`; token.style.top = `${40+((k*37)%30)}%`; token.style.setProperty('--d',`${k*.55}s`);
        engineArt.querySelector('.mp-engine-tokens').append(token);
      }
      function countRunnerMemory() {
        window.cancelAnimationFrame(memoryFrame);
        if (reduceMotion.matches) { memoryNumber.textContent = '2'; return; }
        const start = performance.now();
        (function step(now) {
          const progress = Math.min(1,Math.max(0,(now-start)/1400));
          memoryNumber.textContent = (2*(1-Math.pow(1-progress,3))).toFixed(progress < 1 ? 1 : 0);
          if (progress < 1) memoryFrame = window.requestAnimationFrame(step);
        })(start);
      }
      if (!reduceMotion.matches) memoryNumber.textContent = '0';
      let diagramShown = false;
      new IntersectionObserver(entries => {
        const entry = entries[entries.length-1];
        engineArt.toggleAttribute('data-live',entry.isIntersecting);
        const shown = entry.intersectionRatio >= .4;
        if (shown && !diagramShown && engine === 'cpp') countRunnerMemory();
        diagramShown = shown;
      },{ threshold:[0,.4] }).observe(engineArt);
      // Hero glass motion (D9): on RMQ4 a few of the blocks light up and fade at random. Every 0.7 s each block flips with a 28% chance, and when
      // more than six are lit one block picked at random is switched off. The idle drift and the sweeps are CSS. It all runs only while the hero art is on screen.
      (function setupHeroGlass() {
        const art = document.querySelector('.mp-hero-art');
        const tiles = Array.from(art.querySelectorAll('.mp-glass-tile'));
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let timer = 0;
        function blink() {
          tiles.forEach(tile => { if (Math.random() < .28) tile.classList.toggle('on'); });
          if (tiles.filter(tile => tile.classList.contains('on')).length > 6) tiles[Math.floor(Math.random() * tiles.length)].classList.remove('on');
        }
        new IntersectionObserver(entries => {
          const live = entries[0].isIntersecting;
          art.toggleAttribute('data-live',live);
          window.clearInterval(timer);
          if (live && !still && tiles.length) timer = window.setInterval(blink,700);
        }).observe(art);
      })();
      // LED illustration inside each model card: Dense lights every dot, MoE only a few "experts" that move on (not a parameter count)
      (function setupLedIllustrations() {
        const COLS = 26, ROWS = 3;
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.querySelectorAll('.mp-led').forEach(led => {
          const grid = led.querySelector('.mp-led-grid');
          for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) {
            const dot = document.createElement('i');
            dot.style.setProperty('--c', col); dot.style.setProperty('--r', row);
            grid.append(dot);
          }
          if (led.dataset.led !== 'moe') return;
          const dots = Array.from(grid.children);
          const pick = () => {
            dots.forEach(dot => dot.classList.remove('is-lit'));
            const lit = new Set();
            while (lit.size < 5) lit.add(Math.floor(Math.random() * dots.length));
            lit.forEach(index => dots[index].classList.add('is-lit'));
          };
          pick();
          if (still) return;
          let timer = 0;
          new IntersectionObserver(entries => {
            window.clearInterval(timer);
            if (entries[0].isIntersecting) timer = window.setInterval(pick, 1100);
          }).observe(led);
        });
      })();
      setLanguage(RM_I18N.initial());
    })();
