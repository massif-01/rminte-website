export const groups = [
    {zh: '交通服务', en: 'Transport'},
    {zh: '企业运营', en: 'Enterprise operations'},
    {zh: '公共事务', en: 'Public affairs'},
    {zh: '文档与知识', en: 'Documents and knowledge'},
    {zh: '工业研发', en: 'Industrial R&D'}
  ];
const jiesiGongchuang = {name: {zh: '捷思共创（成都）科技有限公司'}, pinyin: 'Jiesi Gongchuang (Chengdu)', suffix: {zh: '科技有限公司', en: 'Technology Co., Ltd.'}, email: '304008097@qq.com'};

  // Index = position in caseIds (the resource routes), so the order here never changes; each card sits under its group.
export const cases = [
    {group: 0, supplier: {name: {zh: '成都博熵科技有限公司'}, pinyin: 'Chengdu Boshang', suffix: {zh: '科技有限公司', en: 'Technology Co., Ltd.'}, email: 'xiaoyi@botropy.com'}, name: {zh: 'AI 数字收费员', en: 'AI Digital Toll Operator'}, desc: {zh: '面向收费业务的 AI 应用，探索数字收费员参与业务服务的方式。', en: 'An AI application for toll operations, exploring how a digital operator can take part in the service.'}},
    {group: 1, name: {zh: 'AI 信息资产审计', en: 'AI Information Asset Audit'}, desc: {zh: '围绕信息资产开展 AI 审计，辅助审阅与整理相关材料。', en: 'AI-assisted audit of information assets, helping review and organise the related materials.'}},
    {group: 2, name: {zh: '基层事务 AI 助理', en: 'Community Affairs AI Assistant'}, desc: {zh: '面向基层日常事务，探索 AI 辅助处理与信息整理。', en: 'Exploring AI support for everyday community affairs, from handling to organising information.'}},
    {group: 1, name: {zh: 'AI 节能调度专家', en: 'AI Energy Dispatch Expert'}, desc: {zh: '将 AI 应用于节能与调度场景，辅助分析业务中的能源使用与调度问题。', en: 'AI for energy saving and dispatch, helping analyse energy use and scheduling in the business.'}},
    {group: 3, name: {zh: 'AI 文档识别与翻译知识库', en: 'AI Document Recognition, Translation and Knowledge Base'}, desc: {zh: '结合 OCR、翻译与知识库，衔接文档识别、语言转换和知识查询。', en: 'Combines OCR, translation and a knowledge base, linking document recognition, language conversion and lookup.'}},
    {group: 3, supplier: jiesiGongchuang, name: {zh: 'AI录音卡片会议总结', en: 'AI Recording Card Meeting Summaries'}, desc: {zh: '将任何品类的数十个 AI 录音卡片接入 RM-01，形成录音自动转写和总结的软硬件一体服务', en: 'Connect dozens of AI recording cards across any category to RM-01 for an integrated hardware and software service that automatically transcribes and summarizes recordings.'}},
    {group: 3, name: {zh: 'AI 企业档案管理', en: 'AI Enterprise Archive Management'}, desc: {zh: '结合 OCR 与知识库，让企业档案进入可识别、可查询的工作流程。', en: 'Uses OCR and a knowledge base to bring enterprise archives into a searchable workflow.'}},
    {group: 2, name: {zh: '无人机机场 AI 分析师', en: 'Drone Airport AI Analyst'}, desc: {zh: '面向森林防火误报与户外活动人员探测，开展无人机影像分析。', en: 'Drone imagery analysis for false fire alarms in forests and detection of people in outdoor activity.'}},
    {group: 4, supplier: jiesiGongchuang, name: {zh: 'AI 汽车研发与工业建模', en: 'AI Automotive R&D and Industrial Modelling'}, desc: {zh: '覆盖零件平面图转 3D、装配建模、工业焊接机器人编程与汽车安全检测。', en: 'Covers part drawings to 3D, assembly modelling, industrial welding-robot programming and automotive safety inspection.'}},
    {group: 3, name: {zh: '刑事律师材料与线索 AI 整理师', en: 'AI Organiser for Criminal Defence Materials and Leads'}, desc: {zh: '面向刑事律师工作中的材料与线索整理，辅助组织已有信息。', en: 'Helps criminal defence lawyers organise case materials and leads from existing information.'}},
    {group: 4, name: {zh: 'AI 汽车功能安全检测', en: 'AI Automotive Functional Safety Inspection'}, desc: {zh: '聚焦汽车功能安全检测场景，展示 AI 在专业检测工作中的应用。', en: 'Focused on functional safety inspection of vehicles, showing AI in professional inspection work.'}},
    {group: 0, supplier: {name: {zh: '成都博熵科技有限公司'}, pinyin: 'Chengdu Boshang', suffix: {zh: '科技有限公司', en: 'Technology Co., Ltd.'}, email: 'xiaoyi@botropy.com'}, name: {zh: '高速公路现场智能协同', en: 'Intelligent Highway Field Coordination'}, desc: {zh: '面向收费站、隧道、桥梁与光伏场景，展示现场感知、智能研判和协同处置。', en: 'Shows field sensing, intelligent assessment and coordinated response across toll stations, tunnels, bridges and solar sites.'}}
  ];
export const caseIds = ['digital-toll', 'asset-audit', 'community-assistant', 'energy-dispatch', 'document-knowledge', 'voxdock', 'archive-management', 'drone-analysis', 'industrial-modeling', 'legal-materials', 'functional-safety', 'highway-coordination'];

export const caseCatalog = cases.map((item,index)=>({...item,id:caseIds[index]}));
