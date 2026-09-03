window.RM_SOFT = {
  nav: [
    ['gallery', { zh: '图册', en: 'Gallery' }, { href: 'gallery/index.html' }],
    ['product', { zh: '产品', en: 'Product' }],
    ['hardware', { zh: '架构', en: 'Architecture' }],
    ['guides', { zh: '指南', en: 'Guides' }, { href: 'guides/index.html' }],
    ['downloads', { zh: '下载', en: 'Downloads' }, { href: 'downloads/index.html' }]
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
  modules: [
    { name: { zh: '应用模组', en: 'Application module' }, spec: { zh: 'x86 / 8 核 8 线程 / 16GB–32GB ECC / 512GB–2TB NVMe', en: 'x86 / 8 cores, 8 threads / 16GB–32GB ECC / 512GB–2TB NVMe' }, text: { zh: '通过独立 x86 应用模组承载客户应用、数据库与软件依赖，减少迁移适配与显存占用，缩短从开发到现场运行的时间。', en: 'A dedicated x86 module runs customer applications, databases, and software dependencies, reducing migration work and VRAM use while shortening the path from development to on-site operation.' }, icon: 'icon-application-module.svg' },
    { name: { zh: '推理模组', en: 'Inference module' }, spec: '64GB / 128GB+128GB VRAM · 275 TOPS INT8 / 1200–2070 TFLOPS FP4', text: { zh: '通过自研推理引擎与自主设计的高速互联线路，将 GPU 与显存集中用于模型推理和 KV Cache，在有限资源中承载更大模型、更长上下文与更高并发。', en: 'A self-developed inference engine and in-house high-speed interconnect dedicate the GPU and VRAM to inference and KV Cache, supporting larger models, longer contexts, and higher concurrency within finite resources.' }, icon: 'icon-inference-module.svg' },
    { name: { zh: '加密模组', en: 'Encryption module' }, spec: 'TPM 2.0 / RSA / ECC', text: { zh: '通过硬件级非对称密钥保护，将私钥隔离在独立安全模组内，降低导出与复制风险，为客户的后训练模型、RAG 知识库、业务数据与应用代码建立设备级安全边界。', en: 'Hardware-backed asymmetric key protection isolates private keys within a dedicated security module, reducing export and duplication risks and establishing a device-level security boundary for post-trained models, RAG knowledge bases, business data, and application code.' }, icon: 'icon-encryption-module.svg' },
    { name: { zh: '网络模组', en: 'Network module' }, spec: { zh: '内部交换 / 路由 / 统一 API', en: 'Internal switching / routing / unified API' }, text: { zh: '通过内部交换、路由与统一 API 连接各个模组，让应用像调用云服务一样调用本地 AI，并减少扩展或维护时对整套系统的改动。', en: 'Internal switching, routing, and unified APIs connect every module, allowing applications to call local AI like a cloud service while reducing system-wide changes during expansion or maintenance.' }, icon: 'icon-network-module.svg' },
    { name: { zh: '电源与热管理', en: 'Power and thermal management' }, spec: { zh: 'USB-C PD 3.1 / 最高 140W / Z 型独立风道', en: 'USB-C PD 3.1 / up to 140W / independent Z-shaped air duct' }, text: { zh: '通过统一供电、启动时序与 Z 型独立风道，降低频繁启停、高负载和积尘对稳定运行的影响，减少停机与现场维护。', en: 'Unified power delivery, startup sequencing, and a dedicated Z-shaped airflow path reduce the impact of frequent restarts, high loads, and dust buildup, limiting downtime and on-site maintenance.' }, icon: 'icon-power-thermal.svg' }
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
      text: { zh: '聚焦主流 MoE 与 Dense（稠密）模型架构，进行内核级与融合层优化，反向设计主板与整机协同架构。', en: 'Targets mainstream MoE and dense model architectures with kernel and fusion-layer optimization, then shapes the board and system architecture.' }
    }
  ],
  ui: {
    zh: {
      langToggle: 'EN',
      mobileMenu: '菜单',
      closeMenu: '关闭',
      heroTitle: '生产级\nAI 交付基座',
      heroLead: 'RM-01 把大模型、推理引擎与工业级硬件压缩进可现场交付的便携单元。企业不必先建设完整机房，就能在弱网、内网与高安全场景中获得本地 AI 生产力。',
      explore: '探索架构',
      scroll: '继续向下',
      productKicker: 'PRODUCT LOGIC',
      productTitle: 'TianshanOS 是 RM-01 的设备级控制层。',
      productLead: 'RM-01 不只是运行模型的硬件盒子。TianshanOS 负责机内设备管理、配置同步、安全配置包、OTA 升级、WebUI / CLI / API 与自动化规则，把现场交付变成可配置、可审计、可维护的系统动作。',
      agentTitle: '只把最简单的选择留给用户',
      agentLead: '一个接入能量，一个接入世界。RM-01 内部运行完整的 Ubuntu 系统，让 Agent 能调用模型、运行代码、读写文件并连接网络与设备。智能眼镜、电脑、路由器、手机与平板，都可以成为它与人、数据和现实世界交互的入口。',
      agentPointOne: 'Ubuntu 系统',
      agentPointTwo: 'Agent 执行',
      agentPointThree: '多终端访问',
      hardwareTitle: '让每一份算力，只做它最擅长的事',
      hardwareLead: '应用、推理、加密、网络与电源热管理各自独立，通过内部网络与统一 API 协同。客户应用运行在 x86 应用模组，显存集中用于模型推理和 KV Cache，维护范围也能收敛到单个模组。',
      filmTitle: '硬件结构动态分解',
      filmLead: '层叠架构不止于紧凑，更带来整机级的坚固与稳定，为高温、高湿、高海拔及野外部署而设计。',
      engineTitle: '自研推理引擎',
      engineLead: '让同一台设备完成更多推理任务，使用户以更少的硬件与能耗投入，获得更快响应、更高并发和更低的长期运行成本。',
      thermalTitle: 'EricLake 封闭式热管理系统',
      thermalLead: '0.13 mm 特制叶片、定制电机与经过计算流体力学仿真优化的 Z 型独立风道，在高并发推理时持续导出热量，并减少灰尘进入核心器件区域。稳定，不只经得起高负载，也经得起日复一日的运行。',
      thermalPointBlade: '0.13mm',
      thermalPointDuct: 'Z 型风道',
      thermalPointCfd: 'CFD 优化',
      sapphireTitle: '蓝宝石亮起，智能开始工作',
      sapphireLead: '我们选择蓝宝石，不只因为它坚硬、纯净，更因为它能够承载一束清晰而持久的光。工作时，蓝宝石随之亮起，如同航海中的灯塔。',
      sapphireFactOne: '复杂切面',
      sapphireFactTwo: '异材直面',
      sapphireLabel: '蓝宝石 × 铝合金',
      cartridgeTitle: '换一张卡，切换一套 AI。',
      cartridgeLead: 'RM-01 把模型与应用装进可更换存储卡。插入设备，即可切换对应的 AI 能力，让现场交付从复杂的软件部署，变成一次清晰、可控的物理动作。',
      cartridgeFactOne: '插卡即用',
      cartridgeFactTwo: '模型应用',
      craftTitle: '把世界级制造，做到每一处细节',
      craftLead: '从 6063 铝合金到 260 目精细喷砂，RM-01 对材料、表面处理与装配精度逐项把控。最终落到用户手上的，是细腻的触感、严密的接缝，以及从第一次上手就能感受到的整机品质。',
      craftMaterial: '高品质铝合金机身',
      craftMeshUnit: '目',
      craftFinish: '精细喷砂表面工艺',
      craftCaptionSurface: '均匀细腻的喷砂表面，让光线在金属上呈现克制的层次。',
      craftCaptionFit: '严密的接缝与干净的收口，让设计精度落到真实装配。',
      craftCaptionEdge: '从结构边缘到散热开槽，保持一致的加工与表面标准。',
      footer: '泛灵（成都）人工智能科技有限公司',
      copyright: '2026 RMinte ( Chengdu ) Artificial Intelligence Technology Co., Ltd. · RM-01 Protable AI Supercomputer',
      contactButton: '联系我们',
      contactKicker: 'CONTACT',
      contactTitle: '联系我们',
      salesContact: '销售联系',
      supportContact: '支持联系'
    },
    en: {
      langToggle: '中文',
      mobileMenu: 'Menu',
      closeMenu: 'Close',
      heroTitle: 'Production-grade\nAI delivery base',
      heroLead: 'RM-01 compresses large models, the inference engine, and industrial-grade hardware into a portable unit that can be delivered directly on site. Enterprises get local AI productivity without first building a full machine room.',
      explore: 'Explore architecture',
      scroll: 'Continue',
      productKicker: 'PRODUCT LOGIC',
      productTitle: 'TianshanOS is the device-control layer inside RM-01.',
      productLead: 'RM-01 is not only a model box. TianshanOS manages internal devices, configuration sync, secure config packs, OTA updates, WebUI / CLI / API control, and automation rules so field delivery becomes configurable, auditable, and maintainable.',
      agentTitle: 'Only two ports, connected to the world',
      agentLead: 'One brings power. One opens the world. RM-01 runs a complete Ubuntu system, allowing agents to call models, run code, read and write files, and connect to networks and devices. Smart glasses, computers, routers, phones, and tablets become its interfaces to people, data, and the physical world.',
      agentPointOne: 'Ubuntu system',
      agentPointTwo: 'Agent execution',
      agentPointThree: 'Multi-device access',
      hardwareTitle: 'Let every compute resource do what it does best',
      hardwareLead: 'Application, inference, encryption, networking, power, and thermal functions remain independent while working together through the internal network and unified APIs. Customer applications run on the x86 application module, VRAM stays focused on model inference and KV Cache, and maintenance can be contained to a single module.',
      filmTitle: 'Dynamic hardware teardown',
      filmLead: 'The layered architecture goes beyond compactness to deliver system-level durability and stability, engineered for heat, humidity, high altitude, and field deployment.',
      engineTitle: 'Self-developed inference engine',
      engineLead: 'RM-01 starts from the inference path rather than squeezing generic compute into a small box.',
      thermalTitle: 'EricLake closed thermal system',
      thermalLead: '0.13 mm custom blades, a purpose-built motor, and a Z-shaped independent air duct optimized through computational fluid dynamics simulation continuously remove heat during high-concurrency inference while reducing dust entering the core component area. Stability stands up not only to high loads, but to day after day of operation.',
      thermalPointBlade: '0.13mm',
      thermalPointDuct: 'Z-shaped duct',
      thermalPointCfd: 'CFD optimized',
      sapphireTitle: 'When sapphire lights up, intelligence gets to work',
      sapphireLead: 'We chose sapphire not only for its hardness and purity, but for its ability to carry a clear, enduring light. When the system is at work, the sapphire illuminates with it, like a lighthouse at sea.',
      sapphireFactOne: 'Complex facets',
      sapphireFactTwo: 'One shared plane',
      sapphireLabel: 'Sapphire × aluminum',
      cartridgeTitle: 'Change the card. Change the AI.',
      cartridgeLead: 'RM-01 packages models and applications on replaceable storage cards. Insert a card to switch the AI capability for the task, turning field delivery from a complex software rollout into a clear, controlled physical action.',
      cartridgeFactOne: 'Plug in and use',
      cartridgeFactTwo: 'Models + applications',
      craftTitle: 'World-class manufacturing, resolved in every detail',
      craftLead: 'From 6063 aluminium alloy to a fine 260-mesh sandblasted finish, RM-01 controls material selection, surface treatment, and assembly precision. The result reflects both product quality and our ability to integrate the supply chain for consistent manufacturing.',
      craftMaterial: 'High-quality aluminium chassis',
      craftMeshUnit: 'mesh',
      craftFinish: 'Fine sandblasted finish',
      craftCaptionSurface: 'A fine, even finish gives light a restrained depth across the metal surface.',
      craftCaptionFit: 'Tight seams and clean edges carry design precision into real assembly.',
      craftCaptionEdge: 'Structural edges and cooling slots share one consistent manufacturing standard.',
      footer: 'RMinte AI (Chengdu) Technology Co., Ltd.',
      copyright: '2026 RMinte ( Chengdu ) Artificial Intelligence Technology Co., Ltd. · RM-01 Protable AI Supercomputer',
      contactButton: 'Contact',
      contactKicker: 'CONTACT',
      contactTitle: 'Contact us',
      salesContact: 'Sales',
      supportContact: 'Support'
    }
  }
};
