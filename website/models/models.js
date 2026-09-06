    (() => {
      'use strict';
      // Add the actual RMQ model URLs when supplied; never link to the base models.
      const modelLinks = { RMQ3x: '', RMQ4: '' };
      const cases = [
  {
    "icon": "scale",
    "zh": {
      "name": "司法与法律服务",
      "task": "推进案件研究\n与诉讼准备",
      "outputs": [
        "合同修订稿",
        "庭审提纲"
      ],
      "stages": [
        "卷宗、合同、法律数据库与相关判例。",
        "检索依据，建立证据与法律要件的联系，起草文书并交叉验证引用。",
        "附依据的法律意见、合同修订稿与庭审提纲。"
      ]
    },
    "en": {
      "name": "Justice & legal services",
      "task": "Research cases and prepare for trial",
      "outputs": [
        "Contract revisions",
        "Trial outlines"
      ],
      "stages": [
        "Case files, contracts, legal databases, and relevant precedents.",
        "Find legal authorities, map evidence to legal elements, draft documents, and cross-check citations.",
        "Legal opinions with supporting authorities, contract revisions, and trial outlines."
      ]
    }
  },
  {
    "icon": "fingerprint",
    "zh": {
      "name": "刑事调查与数字取证",
      "task": "追踪关键线索\n重建事件关联",
      "outputs": [
        "事件时间线",
        "取证核查任务"
      ],
      "stages": [
        "通信记录、设备数据与调查资料。",
        "联查实体和事件，检验竞争性解释，生成取证查询与后续核查任务。",
        "可追溯的事件时间线、关联线索与核查计划。"
      ]
    },
    "en": {
      "name": "Criminal investigation & digital forensics",
      "task": "Trace key leads and reconstruct event links",
      "outputs": [
        "Event timelines",
        "Forensic verification tasks"
      ],
      "stages": [
        "Communication records, device data, and investigation records.",
        "Cross-reference entities and events, test competing explanations, and generate forensic queries and follow-up verification tasks.",
        "Traceable event timelines, related leads, and verification plans."
      ]
    }
  },
  {
    "icon": "shield",
    "zh": {
      "name": "网络安全防御",
      "task": "发现威胁\n推进响应处置",
      "outputs": [
        "检测查询",
        "修复方案"
      ],
      "stages": [
        "安全日志、威胁情报与检测工具。",
        "执行告警分诊，追踪攻击路径，编写检测查询与处置脚本。",
        "事件调查记录、修复方案与处置验证结果。"
      ]
    },
    "en": {
      "name": "Cyber defense",
      "task": "Detect threats and drive incident response",
      "outputs": [
        "Detection queries",
        "Remediation plans"
      ],
      "stages": [
        "Security logs, threat intelligence, and detection tools.",
        "Triage alerts, trace attack paths, and write detection queries and response scripts.",
        "Investigation records, remediation plans, and response validation results."
      ]
    }
  },
  {
    "icon": "list-filter",
    "zh": {
      "name": "平台内容治理",
      "task": "执行治理规则\n处理复杂争议",
      "outputs": [
        "审核任务分派",
        "申诉复核意见"
      ],
      "stages": [
        "用户内容、平台规则、举报与申诉。",
        "识别语境与行为关联，完成风险分级，结合历史案例生成复核依据。",
        "审核任务分派、复核意见与规则缺口清单。"
      ]
    },
    "en": {
      "name": "Platform content governance",
      "task": "Apply policies and handle complex disputes",
      "outputs": [
        "Review assignments",
        "Appeal assessments"
      ],
      "stages": [
        "User content, platform policies, reports, and appeals.",
        "Examine context and links between behaviors, classify risks by severity, and use prior cases to support review decisions.",
        "Review assignments, review recommendations, and a list of policy gaps."
      ]
    }
  },
  {
    "icon": "network",
    "zh": {
      "name": "企业调查与反舞弊",
      "task": "穿透交易关系\n推进疑点核查",
      "outputs": [
        "异常关系线索",
        "调查报告"
      ],
      "stages": [
        "合同、资金流水、内部通信与工商信息。",
        "交叉核验异常交易和实体关联，制定调查计划与访谈提纲。",
        "附证据索引的调查报告与待核实事项。"
      ]
    },
    "en": {
      "name": "Corporate investigations & anti-fraud",
      "task": "Uncover transaction links and investigate anomalies",
      "outputs": [
        "Unusual connections",
        "Investigation reports"
      ],
      "stages": [
        "Contracts, transaction records, internal communications, and company registration records.",
        "Cross-check unusual transactions and entity relationships, and prepare investigation plans and interview outlines.",
        "Investigation reports with evidence indexes and items requiring verification."
      ]
    }
  },
  {
    "icon": "scan-line",
    "zh": {
      "name": "法医、毒理与事故调查",
      "task": "推演发生机制\n设计验证路径",
      "outputs": [
        "机制假设",
        "补充检验方案"
      ],
      "stages": [
        "检验结果、现场记录与专业文献。",
        "构建竞争性解释，推演因果链条，识别可区分不同机制的关键证据。",
        "机制假设、鉴别问题与补充检验方案。"
      ]
    },
    "en": {
      "name": "Forensic medicine, toxicology & accident investigation",
      "task": "Explain mechanisms and plan tests",
      "outputs": [
        "Mechanistic hypotheses",
        "Follow-up testing plans"
      ],
      "stages": [
        "Examination results, scene records, and specialist literature.",
        "Develop competing explanations, examine causal chains, and identify evidence that distinguishes possible mechanisms.",
        "Mechanistic hypotheses, questions that distinguish competing explanations, and follow-up testing plans."
      ]
    }
  },
  {
    "icon": "layers",
    "zh": {
      "name": "材料与工业化学研究",
      "task": "探索材料工艺\n推动研发迭代",
      "outputs": [
        "实验矩阵",
        "仿真脚本"
      ],
      "stages": [
        "研究文献、材料数据库、实验与仿真工具。",
        "提出配方和机理假设，编写仿真脚本，设计实验矩阵并据结果修订方案。",
        "候选方案、实验矩阵与可复现的数据处理脚本。"
      ]
    },
    "en": {
      "name": "Materials & industrial chemistry research",
      "task": "Explore materials and processes. Advance R&D.",
      "outputs": [
        "Experimental matrices",
        "Simulation scripts"
      ],
      "stages": [
        "Research literature, materials databases, and experimental and simulation tools.",
        "Propose formulations and hypotheses about mechanisms, write simulation scripts, design experimental matrices, and revise plans based on the results.",
        "Candidate approaches, experimental matrices, and reproducible data-processing scripts."
      ]
    }
  },
  {
    "icon": "dna",
    "zh": {
      "name": "生命科学与生物医学研究",
      "task": "形成研究假设\n推进实验验证",
      "outputs": [
        "实验设计",
        "研究脚本"
      ],
      "stages": [
        "文献、生物数据库与实验数据。",
        "建立机制假设和研究优先级，设计实验与数据处理流程，随反馈迭代。",
        "实验设计、可复现脚本与研究方案。"
      ]
    },
    "en": {
      "name": "Life sciences & biomedical research",
      "task": "Develop hypotheses and test them through experiments",
      "outputs": [
        "Experimental designs",
        "Research scripts"
      ],
      "stages": [
        "Literature, biological databases, and experimental data.",
        "Develop mechanistic hypotheses, set research priorities, design experiments and data-processing workflows, and refine them based on feedback.",
        "Experimental designs, reproducible scripts, and research plans."
      ]
    }
  },
  {
    "icon": "messages-square",
    "zh": {
      "name": "社会学、犯罪学与伦理研究",
      "task": "构建研究设计\n检验制度影响",
      "outputs": [
        "研究设计",
        "理论检验报告"
      ],
      "stages": [
        "访谈、案例、统计数据与理论文献。",
        "制定抽样方案，执行质性编码与统计建模，检验解释并推演制度影响。",
        "研究设计、模型结果与有证据支撑的论证。"
      ]
    },
    "en": {
      "name": "Sociology, criminology & ethics",
      "task": "Design studies and examine institutional effects",
      "outputs": [
        "Study designs",
        "Theory-testing reports"
      ],
      "stages": [
        "Interviews, cases, statistical data, and theoretical literature.",
        "Develop sampling plans, code qualitative data, build statistical models, test explanations, and examine the effects of institutions.",
        "Study designs, model results, and arguments supported by evidence."
      ]
    }
  }
];
      const optimizationItems = [
        {
          model:'RMQ3x · RMQ4', zh:'Gated DeltaNet 递归记忆', en:'Gated DeltaNet recurrent memory',
          benefitZh:'将历史信息写入递归状态，让长序列处理兼顾记忆更新与缓存开销。',
          benefitEn:'Store history in a recurrent state to update memory while controlling cache costs for long sequences.',
          detailZh:[
            'Gated DeltaNet 将遗忘门控与 Delta 更新规则结合：门控调节旧状态的保留程度，Delta 规则用新信息修正当前状态的预测误差。GDN 层以固定规模的状态承接历史信息，避免逐 token 累积完整的键值缓存。',
            '两款模型都以三个 GDN 层搭配一个注意力层。GDN 支持预填充阶段的分块并行与解码阶段的递归更新；注意力层保留对上下文细节的检索路径。状态记忆与注意力检索互补，共同处理长文档与多轮任务。'
          ],
          detailEn:[
            'Gated DeltaNet combines a forget gate with the delta update rule. The gate controls how much of the previous state is retained; the delta rule uses new information to correct the state’s prediction error. Each GDN layer stores history in a fixed-size state rather than growing a full key-value cache with every token.',
            'Both models pair three GDN layers with one attention layer. GDN supports chunk-parallel prefill and recurrent updates during decode; attention retrieves details from the context. Recurrent memory and attention-based retrieval work together to process long documents and multi-turn tasks.'
          ]
        },
        {
          model:'RMQ3x', zh:'全局注意力与稠密计算', en:'Global attention & dense computation',
          benefitZh:'全局检索连接上下文细节，规整的前馈计算便于持续执行与算子融合。',
          benefitEn:'Global attention retrieves details across the context; a regular feed-forward path supports sustained execution and operator fusion.',
          detailZh:[
            'RMQ3x 在 GDN 之间保留 Gated Attention 层，对因果范围内的上下文计算全局注意力，再通过输出门控调节检索结果的贡献。每个 token 经过完整的稠密前馈网络，计算路径无需专家路由与重排。',
            '这一路径的优化重点是投影矩阵乘法、SwiGLU 激活与输出投影，以及残差相加和 RMSNorm 等相邻运算的融合。将可合并的步骤连续执行，减少中间张量的写回与读取，让规整的计算结构匹配硬件执行。'
          ],
          detailEn:[
            'RMQ3x retains Gated Attention layers between GDN layers. These attend across the causal context, with an output gate controlling the contribution of retrieved information. Every token passes through the full dense feed-forward network, without expert routing or token reordering.',
            'Optimization covers projection matrix multiplications, SwiGLU activation, output projection, and fusion of adjacent operations such as residual addition and RMSNorm. Combining compatible steps reduces intermediate tensor writes and reads and aligns the computation path with the hardware.'
          ]
        },
        {
          model:'RMQ4', zh:'QSA 块级稀疏注意力', en:'QSA block-sparse attention',
          benefitZh:'先定位相关上下文，再读取原始 token，将注意力计算集中到选中的内容。',
          benefitEn:'Find relevant context blocks, then attend to their original tokens to focus computation on selected content.',
          detailZh:[
            'QSA（Qwen Sparse Attention）通过轻量索引器，将历史键压缩为微块表示并评估相关性。选中的微块展开为原始 token 位置，交由主注意力模块计算；当前尚未填满的尾部块也参与计算。块级索引缩短了候选序列，细粒度注意力则保留对原始内容的读取。',
            'RMQ4 用 QSA 承担 GDN 之外的上下文检索。工程重点贯穿块级索引、Top-k 选择、稀疏键值访问与注意力计算，控制索引成本和访存开销，使长上下文中的检索更有针对性。'
          ],
          detailEn:[
            'QSA (Qwen Sparse Attention) uses a lightweight indexer to compress past keys into micro-block representations and score their relevance. Selected blocks are mapped back to their original token positions for the main attention computation, along with the current incomplete tail block. Block indexing shortens the candidate sequence; token-level attention preserves access to the original content.',
            'QSA handles context retrieval alongside GDN in RMQ4. Optimization covers block indexing, top-k selection, sparse key-value access, and attention computation to control indexing and memory-access costs while focusing retrieval on relevant context.'
          ]
        },
        {
          model:'RMQ4', zh:'稀疏专家与 Fused MoE', en:'Sparse experts & Fused MoE',
          benefitZh:'每个 token 调用部分路由专家与共享专家，让模型容量与单次计算成本分开扩展。',
          benefitEn:'Each token activates selected routed experts and a shared expert, allowing model capacity to scale separately from per-token computation.',
          detailZh:[
            'RMQ4 的路由器根据 token 表征选择专家，由被选中的专家与共享专家参与前馈计算，再将结果加权汇总。稀疏激活让模型容纳更多专家，同时控制每个 token 的计算量；完整权重仍需相应的存储与访问机制。',
            'Fused MoE 将 token 分组与重排、专家矩阵计算、门控激活和加权归并组织为协同执行路径。优化围绕专家负载、数据布局和中间结果展开，减少碎片化的小规模计算与数据搬运，保持路由关系和专家计算的语义。'
          ],
          detailEn:[
            'RMQ4 selects experts based on each token’s representation. The selected experts and a shared expert perform feed-forward computation, and a weighted sum combines their outputs. Sparse activation supports a larger expert pool while limiting per-token computation. The full set of weights still needs storage and an access mechanism.',
            'Fused MoE coordinates token grouping and reordering, expert matrix operations, gated activation, and weighted reduction. Tuning expert workloads, data layouts, and intermediate results reduces fragmented small operations and data movement while preserving routing and expert-computation semantics.'
          ]
        },
        {
          model:'RMQ4', zh:'Gated Residual 门控残差', en:'Gated Residual',
          benefitZh:'通过多分支残差与动态读写门控，调节各层接收和保留的信息。',
          benefitEn:'Use multiple residual branches and dynamic read-write gates to control what each layer receives and retains.',
          detailZh:[
            'Gated Residual 将残差流扩展为多个分支。读取时，各分支分别归一化，按输入生成逐通道门控，再聚合为当前计算模块的输入；写入时，为每个分支生成标量权重，控制模块输出加入该分支的程度。',
            '这种结构把跨层信息选择细化到分支与通道，增强深层网络的信息传递能力。读门控与归一化共用计算路径，分支不再经过额外的残差混合矩阵，减少宽残差流的重复读取。'
          ],
          detailEn:[
            'Gated Residual widens the residual stream into multiple branches. Each read normalizes the branches, applies input-dependent gates to their channels, and aggregates them into the current block’s input. Each write assigns a scalar weight to each branch to control how much of the block output it receives.',
            'Branch- and channel-level selection improves information flow through deep networks. Read gating shares a computation path with normalization. Removing the additional residual-mixing matrix reduces repeated reads of the widened residual stream.'
          ]
        },
        {
          model:'RMQ4', zh:'N-gram 条件记忆', en:'N-gram conditional memory',
          benefitZh:'用局部 token 组合检索嵌入表，以较少的额外计算扩展模型表达容量。',
          benefitEn:'Look up local token combinations in an embedding table to expand representational capacity with little extra computation.',
          detailZh:[
            'N-gram 嵌入以当前 token 及其相邻前文构成短序列，生成确定的查表索引。取出的向量经投影与门控注入模型表征，让输入同时携带单 token 信息与局部组合特征。嵌入表中的知识来自训练，推理时按索引读取。',
            '这类容量扩展主要增加查表与投影开销，无需为每次访问执行完整专家网络。确定的索引便于将嵌入预取与前序层计算重叠。工程重点是查表带宽、数据布局和存储调度，控制大容量嵌入带来的访问成本。'
          ],
          detailEn:[
            'N-gram embeddings combine the current token with nearby preceding tokens to form short sequences and deterministic lookup indices. Retrieved vectors are projected and gated into the model representation, adding features from local token combinations to individual-token information. The embedding table is learned during training and read by index during inference.',
            'Most of the added cost comes from lookup and projection, without running a full expert network for each access. Deterministic indices let embedding prefetch overlap with computation in earlier layers. Optimization focuses on lookup bandwidth, data layout, and memory scheduling to control the cost of accessing a large embedding table.'
          ]
        },
        {
          model:'RMQ3x · RMQ4', zh:'领域适配与 Agent 训练', en:'Domain adaptation & agent training',
          benefitZh:'围绕专业材料、任务轨迹与执行反馈，训练分析、工具使用和结果核查能力。',
          benefitEn:'Train analysis, tool use, and result verification with domain material, task trajectories, and execution feedback.',
          detailZh:[
            '监督微调（SFT）将专业材料组织为问题分析、证据关联、工具调用与成果交付的任务轨迹。训练覆盖多轮对话、结构化输出与执行失败后的修正，对助手回答和动作施加监督，让模型学习完整的任务过程。LoRA 低秩适配与全参微调用于不同范围的权重更新。',
            '直接偏好优化（DPO）比较同一问题下的候选结果，将证据充分性、推理一致性和指令遵循纳入训练目标。对代码、计算与工具执行等可验证任务，GRPO 类强化学习利用结果反馈优化策略，并通过保留集检查专业能力与通用能力的变化。'
          ],
          detailEn:[
            'Supervised fine-tuning (SFT) uses task trajectories built from domain material, covering problem analysis, evidence synthesis, tool calls, and delivery. Training supervises assistant responses and actions across multi-turn dialogue, structured outputs, and recovery from execution failures to teach the full task process. Low-rank adaptation (LoRA) and full-parameter fine-tuning offer different approaches to updating weights.',
            'Direct Preference Optimization (DPO) uses preferences between responses to the same problem, with evidence quality, reasoning consistency, and instruction following as training criteria. For coding, computation, and tool tasks with verifiable outcomes, GRPO-style reinforcement learning uses result feedback to refine the policy. Held-out evaluations track changes in domain and general capabilities.'
          ]
        },
        {
          model:'RMQ3x · RMQ4', zh:'价值观与安全对齐调整', en:'Adjusting value & safety alignment',
          benefitZh:'结合偏好重塑与拒答表征干预，解除预设对齐对专业问题的响应限制，并控制对原有能力的扰动。',
          benefitEn:'Reshape preferences and edit refusal-related representations to remove preset alignment constraints on professional tasks and limit disruption to existing capabilities.',
          detailZh:[
            'RMQ3x 与 RMQ4 针对基座模型的价值观与安全对齐进行后训练。SFT 通过任务示范训练直接回答、证据辨析和指令执行；DPO 通过回答对的偏好关系，调整预设立场、回避表达与泛化拒答。训练目标围绕问题证据和用户任务设定，使模型能够讨论争议内容、比较不同观点并完成专业分析。',
            'Abliteration 从对照样本的中间激活中提取拒答相关方向，对写入残差流的权重实施定向编辑。按层与表征结构采用单方向投影、SVD 多方向子空间及 LEACE 线性概念擦除；结合分层强度搜索、投影修正、范数保持与权重融合控制干预，并针对残余拒答行为迭代校正。',
            '干预位置按架构适配：RMQ3x 处理注意力与稠密前馈输出；RMQ4 处理融合专家张量、共享专家与多分支残差，并区分嵌入投影和门控路径。以响应表现、KL 散度和任务评测共同选择编辑强度，通过中文、推理、代码、工具调用与长任务评测检查能力保持。'
          ],
          detailEn:[
            'RMQ3x and RMQ4 use post-training to adjust their base models’ value and safety alignment. SFT uses task demonstrations to teach direct answers, evidence analysis, and instruction following. DPO uses preferences between paired responses to adjust predefined stances, evasive language, and overgeneralized refusals. Training objectives center on the evidence and the user’s task so models can discuss contested topics, compare viewpoints, and conduct professional analysis.',
            'Abliteration extracts refusal-related directions from intermediate activations of contrasting examples and edits weights that write into the residual stream. We select single-direction projection, SVD-based multidirectional subspaces, and LEACE linear concept erasure to suit each layer and representation structure. Layer-wise strength search, projection refinement, norm preservation, and weight blending control the intervention. Successive edits target remaining refusal behavior.',
            'Edit targets follow each architecture: attention and dense feed-forward outputs in RMQ3x; fused expert tensors, shared experts, and multiple residual branches in RMQ4. Embedding projections are treated separately from gating paths. Response behavior, KL divergence, and task evaluations guide edit strength. Evaluations of Chinese-language performance, reasoning, coding, tool use, and long-horizon tasks check capability retention.'
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
        const button = document.createElement('button'); button.type = 'button'; button.className = 'mp-case-card';
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
        close.setAttribute('aria-label',lang === 'zh' ? '收起工作流程' : 'Close workflow'); close.append(caseActionIcon(true));
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
        caseDetail.querySelectorAll('[data-zh][data-en]').forEach(element => setBrandedText(element,element.dataset[lang]));
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
        for (let i=0;i<Number(grid.dataset.cells);i++) grid.append(document.createElement('i'));
      });
      document.querySelectorAll('[data-model]').forEach(button => {
        const href = modelLinks[button.dataset.model];
        if (!href) return;
        const link = document.createElement('a');
        link.className = button.className; link.href = href; link.target = '_blank'; link.rel = 'noreferrer';
        link.append(...button.childNodes); button.replaceWith(link);
      });
      const menu = document.getElementById('mobileMenu');
      const contact = document.getElementById('contactPopover');
      const menuToggle = document.getElementById('menuToggle');
      const contactToggle = document.getElementById('contactToggle');
      const languageToggle = document.getElementById('languageToggle');
      const pageDescription = document.querySelector('meta[name="description"]');
      const descriptionZh = pageDescription.content;
      let lang = 'zh';
      function setBrandedText(element,text) {
        const parts = text.split(/(RMinte(?:\s+AI\b)?|RMQ3x|RMQ4|RMQ|RM-01)/g);
        element.replaceChildren(...parts.map(part => {
          if (!/^(RMinte(?:\s+AI\b)?|RMQ3x|RMQ4|RMQ|RM-01)$/.test(part)) return document.createTextNode(part);
          const mark = document.createElement('span'); mark.className = 'rm-mark'; mark.textContent = part; return mark;
        }));
      }
      function setLanguage(next) {
        lang = next; localStorage.setItem('rm-soft-lang', lang); document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        document.title = lang === 'zh' ? '模型 · RMinte' : 'Models · RMinte';
        pageDescription.content = lang === 'zh' ? descriptionZh : 'RMQ3x and RMQ4: RMinte’s specialist models with targeted training, dedicated inference engines, and architecture optimization.';
        document.querySelectorAll('[data-zh][data-en]').forEach(element => { setBrandedText(element,element.dataset[lang]); });
        languageToggle.textContent = lang === 'zh' ? 'EN' : '中文';
        languageToggle.setAttribute('aria-label',lang === 'zh' ? '切换到英文' : 'Switch to Chinese');
        menuToggle.setAttribute('aria-label',lang === 'zh' ? '打开菜单' : 'Open menu');
        document.querySelectorAll('[data-close-dialog]').forEach(button => button.setAttribute('aria-label',lang === 'zh' ? '关闭' : 'Close'));
        document.querySelectorAll('.hf-button[disabled]').forEach(button => {
          button.title = lang === 'zh' ? '模型主页即将公布' : 'Model page coming soon';
          button.setAttribute('aria-label',`${button.dataset.model} · Hugging Face · ${button.title}`);
        });
        menu.setAttribute('aria-label',lang === 'zh' ? '导航菜单' : 'Navigation menu');
        document.querySelector('.site-shell').setAttribute('aria-label',lang === 'zh' ? '主导航' : 'Main navigation');
        document.querySelector('.nav-island').setAttribute('aria-label',lang === 'zh' ? '页面导航' : 'Page navigation');
        document.querySelector('.mp-mobile-links').setAttribute('aria-label',lang === 'zh' ? '移动导航' : 'Mobile navigation');
        document.getElementById('models').setAttribute('aria-label',lang === 'zh' ? '模型介绍' : 'Model overview');
        renderCaseDetail();
        document.querySelector('.mp-engine-tabs').setAttribute('aria-label',lang === 'zh' ? '推理实现' : 'Inference engines');
        document.querySelector('.mp-hero-art').setAttribute('aria-label',lang === 'zh' ? 'Dense 与 MoE 架构概念示意' : 'Conceptual view of dense and MoE architectures');
        document.querySelectorAll('[data-visual-model]').forEach(button => {
          const architecture = button.classList.contains('dense') ? 'Dense' : 'MoE';
          button.setAttribute('aria-label',`${button.dataset.visualModel} ${architecture}${lang === 'zh' ? '：展开或收起结构' : ': expand or collapse layers'}`);
        });
        updateEngineArt();
      }
      document.querySelectorAll('[data-visual-model]').forEach(button => {
        button.addEventListener('click',() => button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed') !== 'true')));
        button.addEventListener('keydown',event => {
          if (event.key === 'Escape') button.setAttribute('aria-pressed','false');
        });
      });
      languageToggle.addEventListener('click',() => setLanguage(lang === 'zh' ? 'en' : 'zh'));
      menuToggle.addEventListener('click',() => { menu.showModal(); menuToggle.setAttribute('aria-expanded','true'); });
      menu.addEventListener('close',() => menuToggle.setAttribute('aria-expanded','false'));
      document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click',() => button.closest('dialog').close()));
      document.querySelectorAll('.mp-mobile-links a').forEach(link => link.addEventListener('click',() => menu.close()));
      // Keep the shared non-modal panel out of keyboard navigation while closed.
      new MutationObserver(() => {
        const open = contact.getAttribute('aria-hidden') === 'false';
        const restoreFocus = !open && contact.contains(document.activeElement);
        contact.inert = !open;
        if (open && contactToggle.matches(':focus-visible')) {
          contact.querySelector('[data-contact-close]').focus();
        } else if (restoreFocus) {
          contactToggle.focus();
        }
      }).observe(contact,{ attributes:true, attributeFilter:['aria-hidden'] });
      const narrowMenu = matchMedia('(max-width:1120px)');
      narrowMenu.addEventListener('change',event => { if (!event.matches && menu.open) menu.close(); });
      const engineTabs = Array.from(document.querySelectorAll('[data-engine-tab]'));
      let engine = 'cpp';
      function updateEngineArt() {
        document.getElementById('engineArt').dataset.engine = engine;
        document.getElementById('runtimeLabel').innerHTML = engine === 'cpp' ? '<span class="rm-mark">RMinte</span> C++ Runtime' : 'Custom vLLM';
        document.getElementById('engineArt').setAttribute('aria-label',lang === 'zh' ? `${engine === 'cpp' ? '自研 C++' : 'vLLM 定制'}推理实现示意` : `${engine === 'cpp' ? 'RMinte C++' : 'Custom vLLM'} inference diagram`);
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
      const initialLanguage = new URL(location.href).searchParams.get('lang');
      setLanguage(['zh', 'en'].includes(initialLanguage) ? initialLanguage : localStorage.getItem('rm-soft-lang') || window.RM_DEFAULT_LANG || 'en');
    })();
