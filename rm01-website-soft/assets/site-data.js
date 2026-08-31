window.RM_SOFT = {
  assetBase: 'assets/images/',
  nav: [
    ['product', { zh: '产品', en: 'Product' }],
    ['hardware', { zh: '架构', en: 'Architecture' }],
    ['proof', { zh: '验证', en: 'Proof' }],
    ['applications', { zh: '应用', en: 'Use Cases' }],
    ['team', { zh: '团队', en: 'Team' }]
  ],
  metrics: [
    { value: '140W', label: { zh: '整机功耗', en: 'total power' } },
    { value: '64', label: { zh: '路峰值并发', en: 'peak sessions' } },
    { value: '7x24', label: { zh: '工业级运行', en: 'industrial runtime' } },
    { value: '30B-200B', label: { zh: '模型参数规模', en: 'model scale' } }
  ],
  pillars: [
    {
      title: { zh: '配置驱动硬件', en: 'Configuration-driven hardware' },
      text: { zh: 'TianshanOS 把引脚、服务和系统行为放进 JSON 配置，现场调试不再依赖反复改代码。', en: 'TianshanOS defines pins, services, and system behavior through JSON, reducing code changes during field tuning.' }
    },
    {
      title: { zh: '南北向设备控制', en: 'North-south device control' },
      text: { zh: '北向管理 AGX 算力，南向管理 LPMU 通用计算与存储，让 RM-01 的内部设备协同工作。', en: 'It coordinates AGX compute northbound and LPMU compute/storage southbound so RM-01 behaves as one system.' }
    },
    {
      title: { zh: '安全配置包', en: 'Secure config packs' },
      text: { zh: '配置包支持 ECDH、AES-256-GCM 与 ECDSA 签名，适合模型、密钥和现场参数的受控交付。', en: 'Config packs use ECDH, AES-256-GCM, and ECDSA signatures for controlled delivery of site parameters.' }
    },
    {
      title: { zh: 'OTA 与自动化', en: 'OTA and automation' },
      text: { zh: 'HTTPS / SD 卡双通道升级、自动回滚、WebUI / CLI / API 和规则引擎支撑长期现场运维。', en: 'HTTPS/SD OTA, rollback, WebUI/CLI/API control, and rule automation support long-term field operations.' }
    }
  ],
  features: [
    {
      kicker: { zh: 'READY', en: 'READY' },
      title: { zh: '一根 USB-C 即可启动本地 AI 服务', en: 'One USB-C cable starts local AI service' },
      body: { zh: '终端部署、机房调用、离线运行都不需要复杂运维。RM-01 把模型、应用和硬件封装成可交付的现场单元。', en: 'Endpoint deployment, data-center calls, and offline use do not need heavy operations. RM-01 packages model, app, and hardware into a field-ready unit.' },
      image: 'img5.png'
    },
    {
      kicker: { zh: 'NATIVE', en: 'NATIVE' },
      title: { zh: '为大模型推理路径反向定义硬件', en: 'Hardware shaped by the inference path' },
      body: { zh: '自研推理引擎兼容 30B-200B 参数规模，支持开源模型与官方量化模型，以源码级部署保留模型精度。', en: 'The self-developed inference engine supports 30B-200B parameter models, open-source checkpoints, and official quantized models while preserving accuracy through source-level deployment.' },
      image: 'img7.png'
    },
    {
      kicker: { zh: 'SUSTAINED', en: 'SUSTAINED' },
      title: { zh: '低功耗、高并发、适应恶劣现场', en: 'Low power, high concurrency, rugged runtime' },
      body: { zh: '峰值 64 路并发、140W 整机功耗、工业级元器件和独立风道，让设备能够 7x24 运行。', en: 'Peak 64-way concurrency, 140W total power, industrial components, and isolated airflow support 24/7 operation.' },
      image: 'img6.png'
    }
  ],
  modules: [
    { name: { zh: '计算模块', en: 'Compute' }, spec: 'Core i3 / 16GB ECC / 512GB-2TB NVMe', text: { zh: '工业级 Intel Core i3 处理器、ECC 内存与高速 NVMe SSD。', en: 'Industrial Intel Core i3, ECC memory, and high-speed NVMe SSD.' }, icon: 'img5.png' },
    { name: { zh: 'AI 推理模块', en: 'AI inference' }, spec: '64GB-128GB VRAM / 275 TOPS / 2070 TFLOPS', text: { zh: '集成高性能 AI 加速器，面向 CUDA 与 TensorRT 路径优化。', en: 'High-performance AI acceleration optimized for CUDA and TensorRT.' }, icon: 'img7.png' },
    { name: { zh: '加密模块', en: 'Crypto' }, spec: 'TPM 2.0 / RSA / ECC', text: { zh: '内置硬件信任根，保护本地模型、数据和交付密钥。', en: 'Hardware root of trust protects local models, data, and delivery keys.' }, icon: 'img12.png' },
    { name: { zh: '网络模块', en: 'Network' }, spec: 'Unified API / Scheduler', text: { zh: '统一 API 与轻量级任务调度框架，支持多模型并行负载均衡。', en: 'Unified API and lightweight scheduling for multi-model balancing.' }, icon: 'img9.png' },
    { name: { zh: '电源与热管理', en: 'Power and thermal' }, spec: 'Server sequencing / Airflow', text: { zh: '服务器级电源时序、冗余保护与高效气流设计。', en: 'Server-grade sequencing, redundancy, and efficient airflow.' }, icon: 'img6.png' }
  ],
  engine: [
    {
      label: { zh: '入口', en: 'Front door' },
      title: { zh: '以开源前端框架为入口', en: 'Open-source frontends as the interface' },
      text: { zh: '采用 vLLM 作为前端引擎，Hugging Face Transformers 加载模型，替换核心推理内核为自研版本。', en: 'Uses vLLM as the frontend engine and Hugging Face Transformers for loading, while replacing the core inference kernel.' }
    },
    {
      label: { zh: '内核', en: 'Kernel' },
      title: { zh: '深度优化推理路径', en: 'Deeply optimized inference path' },
      text: { zh: '定制 CUDA 内核，优化 FlashAttention、FlashInfer、PagedAttention、KV Cache 和持续批处理。', en: 'Custom CUDA kernels optimize FlashAttention, FlashInfer, PagedAttention, KV Cache, and continuous batching.' }
    },
    {
      label: { zh: '架构', en: 'Architecture' },
      title: { zh: '以引擎反向定义整机', en: 'The engine defines the system' },
      text: { zh: '聚焦主流 MoE 架构，进行内核级与融合层优化，反向设计主板与整机协同架构。', en: 'Targets mainstream MoE architectures with kernel and fusion-layer optimization, then shapes the board and system architecture.' }
    }
  ],
  honors: [
    { image: 'poster-3.png', title: { zh: '成都全制造', en: 'Made in Chengdu' }, text: { zh: '全球首个便携 AI 超算，比 NVIDIA 和 AMD 同类产品提前 5 个月实现认证并商业交付。', en: 'The first portable AI supercomputer, certified and commercially delivered 5 months ahead of comparable NVIDIA and AMD products.' } },
    { image: 'poster-1.png', title: { zh: '金熊猫大赛', en: 'Golden Panda' }, text: { zh: '2025 金熊猫全球创新创业大赛，从 2 万 5 千支队伍中脱颖而出，荣获第二名。', en: 'Second place in the 2025 Golden Panda Global Innovation and Entrepreneurship Competition among 25,000 teams.' } },
    { image: 'imgimage169.png', title: { zh: 'CCC 认证', en: 'CCC certified' }, text: { zh: '获得中国国家强制性产品认证，具备量产能力并通过质量与安规标准。', en: 'Passed China Compulsory Certification with mass-production readiness and safety compliance.' } },
    { image: 'poster-5.png', title: { zh: '国家级示范工程', en: 'National projects' }, text: { zh: '承担三项国家级示范工程人工智能部分建设，由国投、海峡富汇与泛灵人工智能联合打造。', en: 'Undertakes the AI portion of three national demonstration projects with SDIC and Haixia Fuhui.' } }
  ],
  teams: [
    { name: { zh: '徐子景', en: 'Xu Zijing' }, role: { zh: 'CEO · 联合创始人', en: 'CEO · Co-Founder' }, focus: { zh: '战略、融资、产品、海外市场', en: 'Strategy, financing, product, overseas markets' }, bio: { zh: '多伦多大学、布朗大学计算机科学背景。', en: 'Computer science background from University of Toronto and Brown University.' } },
    { name: { zh: '朱杰', en: 'Zhu Jie' }, role: { zh: 'COO · 联合创始人', en: 'COO · Co-Founder' }, focus: { zh: '供应链、销售、运营、量产交付', en: 'Supply chain, sales, operations, production delivery' }, bio: { zh: '近 20 年一线消费电子供应链经验。', en: 'Nearly 20 years of frontline consumer electronics supply-chain experience.' } },
    { name: { zh: '唐云峰', en: 'Tang Yunfeng' }, role: { zh: 'CTO · 联合创始人', en: 'CTO · Co-Founder' }, focus: { zh: '技术架构、推理引擎、生态构建', en: 'Technical architecture, inference engine, ecosystem' }, bio: { zh: '全栈 AI 系统架构师，主导 RMInte 推理引擎与 RM-01 硬件设计。', en: 'Full-stack AI systems architect leading the RMInte inference engine and RM-01 hardware design.' } },
    { name: { zh: '石一', en: 'Shi Yi' }, role: { zh: 'CDO · 联合创始人', en: 'CDO · Co-Founder' }, focus: { zh: '工业设计、产品定义、应用适配', en: 'Industrial design, product definition, application fit' }, bio: { zh: '近 20 年国际消费电子工业设计经验。', en: 'Nearly 20 years of international consumer electronics industrial-design experience.' } }
  ],
  cases: [
    {
      id: 'chemical',
      file: 'app-chemical.html',
      category: { zh: '行业应用', en: 'Industry' },
      name: { zh: '化学材料', en: 'Chemical Materials' },
      desc: { zh: '基于大模型的化学材料智能搜索。合作单位：四川能投、SBI 金鼎资产管理平台。', en: 'AI-powered chemical-material search based on large models. Partners: Sichuan Energy Investment and SBI Kingtop Asset Management.' },
      overview: { zh: '泛灵人工智能打造的化学材料智能搜索系统，基于 RM-01 便携 AI 超算与本地大模型，为化工企业构建私有化、安全可靠的化学材料知识库。通过 RAG 检索增强生成技术，实现化学材料数据的高效检索与智能问答。', en: 'An intelligent chemical-material search system powered by RM-01 and local large models, building a private and secure materials knowledge base for chemical enterprises through RAG retrieval and Q&A.' },
      deploy: { zh: 'RM-01 可直接部署在客户机房或边缘端，无需连接公网。化学材料数据完全本地存储和处理，确保商业机密安全。', en: 'RM-01 can be deployed in customer server rooms or at the edge without public internet. Materials data is stored and processed locally.' },
      partners: [{ zh: '四川能投', en: 'Sichuan Energy Investment' }, { zh: 'SBI 金鼎资产管理平台', en: 'SBI Kingtop Asset Management' }],
      images: []
    },
    {
      id: 'pharma',
      file: 'app-pharma.html',
      category: { zh: '行业应用', en: 'Industry' },
      name: { zh: '药物发现', en: 'Drug Discovery' },
      desc: { zh: '分子相似性搜索加速药物研发。合作单位：四川译讯科技。', en: 'Molecular similarity search accelerates drug discovery. Partner: Sichuan Yixun Tech.' },
      overview: { zh: '基于 RM-01 的药物发现系统，利用大模型进行分子相似性搜索和虚拟筛选，大幅缩短药物研发周期。系统支持私有化部署，保障药物研发数据的机密性。', en: 'A drug-discovery system powered by RM-01, using large models for molecular similarity search and virtual screening to reduce R&D cycles while preserving data confidentiality.' },
      deploy: { zh: '系统可部署在药企内部，分子数据库完全本地化管理。RM-01 的离线推理能力确保研发数据不出域，满足医药行业严格的合规要求。', en: 'The system can be deployed inside pharmaceutical companies, with molecular databases managed locally and offline inference keeping R&D data in-domain.' },
      partners: [{ zh: '四川译讯科技', en: 'Sichuan Yixun Tech' }],
      images: ['app-pharma-slide-57.jpg', 'app-pharma-slide-58.jpg']
    },
    {
      id: 'logistics',
      file: 'app-logistics.html',
      category: { zh: '行业应用', en: 'Industry' },
      name: { zh: '智慧物流', en: 'Smart Logistics' },
      desc: { zh: '无人机配送路径规划，提升物流调度效率。合作单位：四川智飞。', en: 'Drone delivery route planning improves logistics scheduling. Partner: Sichuan Zhifei.' },
      overview: { zh: '智慧物流调度系统利用 AI 大模型进行配送路径规划和智能调度。结合无人机配送场景，实现最后一公里的自动化、智能化物流配送。', en: 'A smart logistics system that uses large models for route planning and intelligent dispatch in drone-based last-mile delivery.' },
      deploy: { zh: 'RM-01 可直接部署在物流调度中心或移动指挥车上，支持弱网环境下的实时决策。低功耗设计适合野外或临时部署场景。', en: 'RM-01 can be deployed in logistics dispatch centers or mobile command vehicles, supporting real-time decisions in weak-network environments.' },
      partners: [{ zh: '四川智飞', en: 'Sichuan Zhifei' }],
      images: ['app-logistics-slide-52.jpg', 'app-logistics-slide-53.jpg', 'app-logistics-slide-54.jpg']
    },
    {
      id: 'medical',
      file: 'app-medical.html',
      category: { zh: '行业应用', en: 'Industry' },
      name: { zh: 'AI 医疗', en: 'AI Healthcare' },
      desc: { zh: '肺结节 CT 智能检测与知识库辅助诊断。合作单位：北京思达新能。', en: 'Intelligent lung-nodule CT detection and knowledge-assisted diagnosis. Partner: Beijing Sida Xineng.' },
      overview: { zh: 'AI 医疗辅助诊断系统结合医学影像分析与知识图谱技术，为医生提供智能化的诊断辅助。支持肺结节 CT 自动检测、病灶分析与鉴别诊断建议。', en: 'AI medical-assistance combines imaging analysis and knowledge graphs to support doctors with lung-nodule CT detection, lesion analysis, and differential diagnosis.' },
      deploy: { zh: '系统可部署在医院内部，患者数据不出医院局域网。符合医疗数据安全法规，支持 HIPAA、等保三级等合规标准。', en: 'The system deploys within hospitals so patient data remains inside the local network, supporting healthcare security and compliance requirements.' },
      partners: [{ zh: '北京思达新能', en: 'Beijing Sida Xineng' }],
      images: ['app-medical-slide-64.jpg', 'app-medical-slide-65.jpg']
    },
    {
      id: 'traffic',
      file: 'app-traffic.html',
      category: { zh: '行业应用', en: 'Industry' },
      name: { zh: '智慧交通', en: 'Smart Transportation' },
      desc: { zh: '多模态识别与智能分析。合作单位：杭州宜远。', en: 'Multimodal recognition and intelligent analysis. Partner: Hangzhou Yiyuan.' },
      overview: { zh: '智慧交通分析系统利用多模态 AI 技术，对交通场景进行实时分析和智能决策。支持违章检测、流量分析、事故预警等多种应用场景。', en: 'A smart-transportation system using multimodal AI for real-time traffic analysis, violation detection, flow analytics, and incident warnings.' },
      deploy: { zh: 'RM-01 可部署在交通指挥中心或路边单元，支持边缘计算与云端协同。毫秒级推理响应满足交通场景的实时性要求。', en: 'RM-01 can be deployed in traffic command centers or roadside units, combining edge computing with cloud coordination.' },
      partners: [{ zh: '杭州宜远', en: 'Hangzhou Yiyuan' }],
      images: []
    },
    {
      id: 'knowledge',
      file: 'app-knowledge.html',
      category: { zh: 'AI 能力平台', en: 'AI Platform' },
      name: { zh: '知识库构建', en: 'Knowledge Base' },
      desc: { zh: '多领域知识库快速构建。合作单位：电子科大、重庆地震局、新疆交投等。', en: 'Rapid multi-domain knowledge-base construction. Partners include UESTC, Chongqing Earthquake Bureau, and Xinjiang Communications Investment.' },
      overview: { zh: '基于 RM-01 的知识库构建平台，支持多领域、多格式文档的快速导入与向量化处理。通过 RAG 技术实现知识库的智能检索与问答。', en: 'A knowledge-base platform powered by RM-01, supporting multi-domain document import, vectorization, retrieval, and Q&A through RAG.' },
      deploy: { zh: '知识库系统完全私有化部署，文档数据本地存储。支持 PDF、Word、Excel 等多种格式批量导入，通过嵌入模型实现智能语义检索。', en: 'The system is privately deployed with local document storage, supporting batch import of PDF, Word, Excel, and semantic retrieval through embedding models.' },
      partners: [{ zh: '电子科技大学', en: 'UESTC' }, { zh: '重庆地震局', en: 'Chongqing Earthquake Bureau' }, { zh: '新疆交投集团', en: 'Xinjiang Communications Investment' }, { zh: '四川译讯科技', en: 'Sichuan Yixun Tech' }],
      images: ['app-knowledge-slide-69.jpg']
    },
    {
      id: 'multimodal',
      file: 'app-multimodal.html',
      category: { zh: 'AI 能力平台', en: 'AI Platform' },
      name: { zh: '多模态实时分析', en: 'Multimodal Analysis' },
      desc: { zh: 'VLM 基多模态分析，支持校园防霸凌、交通执法、政务决策。合作单位：辽宁实验学校、杭州宜远。', en: 'VLM-based multimodal analysis for school safety, traffic enforcement, and public-sector decisions. Partners: Liaoning Experimental School and Hangzhou Yiyuan.' },
      overview: { zh: '基于 VLM 的多模态实时分析引擎，能够同时处理视频、音频、文本等多种数据模式。已应用于校园安全监控、交通执法辅助、政务巡查等场景。', en: 'A VLM-based real-time multimodal engine that processes video, audio, and text across school safety, traffic enforcement, and public-sector inspection.' },
      deploy: { zh: '分析引擎可部署在监控中心或边缘节点，支持多路视频流的实时分析。本地化处理保护隐私，减少网络延迟。', en: 'The engine deploys in control centers or edge nodes for multi-stream real-time analysis, protecting privacy while reducing latency.' },
      partners: [{ zh: '辽宁省实验学校', en: 'Liaoning Experimental School' }, { zh: '杭州宜远', en: 'Hangzhou Yiyuan' }],
      images: ['app-multimodal-slide-70.jpg']
    },
    {
      id: 'energy',
      file: 'app-energy.html',
      category: { zh: 'AI 能力平台', en: 'AI Platform' },
      name: { zh: '工业能源优化', en: 'Energy Optimization' },
      desc: { zh: 'AI 驱动的节能调节与园区能耗优化。合作单位：北京思达新能、四川商投。', en: 'AI-driven energy regulation and industrial-park energy optimization. Partners: Beijing Sida Xineng and Sichuan Commercial Investment.' },
      overview: { zh: '工业能源优化系统利用 AI 技术对工业生产过程进行实时监测和智能调节，实现能耗优化。支持园区级能源管理，通过预测性分析降低能源成本。', en: 'Industrial energy optimization monitors and adjusts production processes in real time, using predictive analytics to reduce energy cost at park scale.' },
      deploy: { zh: '系统部署在工业园区或企业数据中心，支持 OPC UA、Modbus 等工业协议接入。7x24 小时持续运行，无需人工干预。', en: 'The system deploys in industrial parks or enterprise data centers, supports OPC UA and Modbus, and runs 24/7 without manual intervention.' },
      partners: [{ zh: '北京思达新能', en: 'Beijing Sida Xineng' }, { zh: '四川商投', en: 'Sichuan Commercial Investment' }],
      images: ['app-energy-slide-71.jpg']
    },
    {
      id: 'graph',
      file: 'app-graph.html',
      category: { zh: 'AI 能力平台', en: 'AI Platform' },
      name: { zh: 'AI 知识图谱', en: 'AI Knowledge Graph' },
      desc: { zh: 'AI 知识图谱构建与推理。合作单位：电子科大 5G 实验室、公安部经济案件分析。', en: 'Knowledge-graph construction and reasoning. Partners: UESTC 5G Lab and Ministry of Public Security economic-case analysis.' },
      overview: { zh: 'AI 知识图谱系统利用大模型技术进行知识抽取、实体关系识别和图谱构建。支持复杂查询、智能推理和可视化展示。', en: 'The AI knowledge-graph system uses large models for knowledge extraction, entity relation recognition, graph construction, complex querying, and reasoning.' },
      deploy: { zh: '知识图谱系统完全私有化部署，敏感数据本地处理。支持大规模图谱的存储与推理，满足高并发查询需求。', en: 'The graph system is privately deployed with sensitive data processed locally, supporting large-scale graph storage, reasoning, and high-concurrency queries.' },
      partners: [{ zh: '电子科大 5G 实验室', en: 'UESTC 5G Lab' }, { zh: '公安部经济案件分析', en: 'Ministry of Public Security Economic Case Analysis' }],
      images: ['app-graph-slide-72.jpg']
    },
    {
      id: 'execution',
      file: 'app-execution.html',
      category: { zh: 'AI 能力平台', en: 'AI Platform' },
      name: { zh: '自动化执行系统', en: 'Automated Execution' },
      desc: { zh: '持续进化的工作流编排与自动化执行。合作单位：电子科大软通学院。', en: 'Continuously evolving workflow orchestration and automated execution. Partner: UESTC Ruantong College.' },
      overview: { zh: '自动化执行系统基于 AI Agent 技术，实现业务流程的智能编排与自动化执行。系统能够持续学习优化，适应不断变化的业务需求。', en: 'The automated-execution system uses AI Agent technology for intelligent workflow orchestration and execution, continuously learning and adapting to business needs.' },
      deploy: { zh: '系统可部署在企业内部，支持 API 集成和自定义工作流。本地化运行确保业务流程数据不出域。', en: 'The system deploys inside enterprises, supports API integration and custom workflows, and keeps process data in-domain.' },
      partners: [{ zh: '电子科大软通学院', en: 'UESTC Ruantong College' }],
      images: ['app-execution-slide-73.jpg']
    }
  ],
  ui: {
    zh: {
      langToggle: 'EN',
      mobileMenu: '菜单',
      closeMenu: '关闭',
      heroKicker: '本地 AI 交付',
      heroTitle: '生产级\nAI 交付基座',
      heroLead: 'RM-01 把大模型、推理引擎与工业级硬件压缩进可现场交付的便携单元。企业不必先建设完整机房，就能在弱网、内网与高安全场景中获得本地 AI 生产力。',
      explore: '探索架构',
      viewCases: '查看应用',
      scroll: '继续向下',
      productKicker: 'PRODUCT LOGIC',
      productTitle: 'TianshanOS 是 RM-01 的设备级控制层。',
      productLead: 'RM-01 不只是运行模型的硬件盒子。TianshanOS 负责机内设备管理、配置同步、安全配置包、OTA 升级、WebUI / CLI / API 与自动化规则，把现场交付变成可配置、可审计、可维护的系统动作。',
      featuresTitle: '即用、原生、强悍',
      featuresLead: '三项能力共同决定 RM-01 的产品边界：现场可用、模型原生、长时间稳定。',
      hardwareTitle: '模块化层叠架构',
      hardwareLead: '核心模块满足服务器级设计标准，以便携形态提供完整、本地、可靠的 AI 算力基础设施。',
      filmTitle: '硬件结构动态分解',
      filmLead: '完整保留原始拆解视频画面，用滚动进度驱动帧序列，让用户按自己的节奏看清散热、主板、壳体和模块层叠关系。',
      engineTitle: '自研推理引擎，反向定义整机架构',
      engineLead: '不是把通用计算塞进小盒子，而是从推理路径出发重新组织硬件。',
      thermalTitle: 'EricLake 封闭式热管理系统',
      thermalLead: '0.13mm 特制叶片、定制电机、Z 型增压风道与 CFD 优化，共同保障 RM-01 在高强度并发推理时保持稳定。',
      silentTitle: '真正的便携，是无声、无感，却随时可用。',
      proofTitle: '商业落地能力已获验证',
      proofLead: '从金熊猫大赛到国家级示范工程，RM-01 已跨过认证、量产和客户验证的关键门槛。',
      appTitle: '覆盖多行业真实部署场景',
      appLead: 'RM-01 不是展示型硬件，它围绕企业应用交付、私有数据处理和现场算力部署而设计。',
      industry: '行业应用',
      platform: 'AI 能力平台',
      learn: '进入案例',
      teamTitle: '四位合伙人，覆盖从推理内核到规模化交付的完整链条。',
      quote: '一支具备 AI 硬件核心技术，拥有从 0 到 1 自主研发实力的硬科技团队。',
      footer: '泛灵（成都）人工智能科技有限公司',
      copyright: '© 2026 泛灵人工智能 · RM-01 便携 AI 超算',
      contactButton: '联系我们',
      contactKicker: 'CONTACT',
      contactTitle: '联系我们',
      salesContact: '销售联系',
      supportContact: '支持联系',
      back: '返回首页',
      overview: '方案概述',
      partners: '合作单位',
      deployment: '部署方式',
      evidence: '界面与现场截图',
      noImages: '该案例以私有部署文字材料为主，当前版本不展示外部截图。',
      nextCase: '下一个案例'
    },
    en: {
      langToggle: '中文',
      mobileMenu: 'Menu',
      closeMenu: 'Close',
      heroKicker: 'Local AI Delivery',
      heroTitle: 'Production-grade\nAI delivery base',
      heroLead: 'RM-01 compresses large models, the inference engine, and industrial-grade hardware into a portable unit that can be delivered directly on site. Enterprises get local AI productivity without first building a full machine room.',
      explore: 'Explore architecture',
      viewCases: 'View use cases',
      scroll: 'Continue',
      productKicker: 'PRODUCT LOGIC',
      productTitle: 'TianshanOS is the device-control layer inside RM-01.',
      productLead: 'RM-01 is not only a model box. TianshanOS manages internal devices, configuration sync, secure config packs, OTA updates, WebUI / CLI / API control, and automation rules so field delivery becomes configurable, auditable, and maintainable.',
      featuresTitle: 'Ready, native, sustained',
      featuresLead: 'Three capabilities define RM-01: field readiness, model-native architecture, and long-duration stability.',
      hardwareTitle: 'Modular stacked architecture',
      hardwareLead: 'Server-grade modules deliver complete, local, and reliable AI infrastructure in a portable form.',
      filmTitle: 'Dynamic hardware teardown',
      filmLead: 'The original teardown film is preserved as a scroll-driven frame sequence so viewers can inspect cooling, boards, chassis, and module stacking at their own pace.',
      engineTitle: 'The inference engine defines the hardware',
      engineLead: 'RM-01 starts from the inference path rather than squeezing generic compute into a small box.',
      thermalTitle: 'EricLake closed thermal system',
      thermalLead: '0.13mm custom blades, custom motors, Z-shaped pressurized airflow, and CFD optimization keep RM-01 stable under concurrent inference.',
      silentTitle: 'True portability is silent, unobtrusive, and always available.',
      proofTitle: 'Commercial delivery has been validated',
      proofLead: 'From Golden Panda to national demonstration projects, RM-01 has crossed key certification, production, and customer-validation gates.',
      appTitle: 'Real deployments across industries',
      appLead: 'RM-01 is built around enterprise delivery, private data processing, and on-site compute.',
      industry: 'Industry applications',
      platform: 'AI capability platform',
      learn: 'Open case',
      teamTitle: 'Four partners covering the full chain from inference kernel to scaled delivery.',
      quote: 'A hard-tech team with core AI-hardware capability and proven 0-to-1 self-development.',
      footer: 'RMinte AI (Chengdu) Technology Co., Ltd.',
      copyright: '© 2026 RMinte AI · RM-01 Portable AI Supercomputer',
      contactButton: 'Contact',
      contactKicker: 'CONTACT',
      contactTitle: 'Contact us',
      salesContact: 'Sales',
      supportContact: 'Support',
      back: 'Back home',
      overview: 'Solution overview',
      partners: 'Partners',
      deployment: 'Deployment',
      evidence: 'Interface and field screenshots',
      noImages: 'This case is represented by private deployment material; no external screenshots are shown in this version.',
      nextCase: 'Next case'
    }
  }
};
