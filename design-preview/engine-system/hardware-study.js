(() => {
  'use strict';
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render() {
    const en = document.documentElement.lang === 'en';
    const t = value => typeof value === 'string' ? value : value[en ? 'en' : 'zh'];
    const roles = en
      ? ['A dedicated space for your applications', 'Compute and memory focused on inference', 'Isolate keys. Protect business assets.', 'Connect modules through a unified interface.', 'Power and cooling for sustained operation.']
      : ['应用拥有独立的运行空间', '计算与显存，专注模型推理', '隔离私钥，保护业务资产', '连接内部模组，统一访问接口', '供电与散热，支撑持续运行'];
    const specs = [
      [[en?'Processor':'处理器','x86 · '+(en?'8 cores / 8 threads':'8 核 / 8 线程')],[en?'Memory':'内存','16GB–32GB ECC'],[en?'Storage':'存储','512GB–2TB NVMe']],
      [[en?'GPU memory':'显存','64GB / 128GB+128GB VRAM'],['INT8','275 TOPS'],['FP4','1200–2070 TFLOPS']],
      [[en?'Security module':'安全模组','TPM 2.0'],[en?'Cryptography':'密码算法','RSA / ECC']],
      [[en?'Connectivity':'内部互联',en?'Switching / routing':'交换 / 路由'],[en?'Access':'访问接口',en?'Unified API':'统一 API']],
      [[en?'Power input':'供电','USB-C PD 3.1'],[en?'Maximum power':'最高功率','140W'],[en?'Airflow':'散热风道',en?'Independent Z-shaped air duct':'Z 型独立风道']]
    ];
    const specList = index => `<dl class="hardware-specs">${specs[index].map(([label,value])=>`<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>`;
    const application = `<div class="hw-art hw-art-application" role="img" aria-label="${en?'Abstract application, database and runtime layers':'应用、数据库与运行环境的抽象分层示意'}"><div class="hw-runtime"><div class="hw-runtime-layers"><i></i><i></i><i></i></div><div class="hw-frost"></div><div class="hw-layer-names"><span>${en?'Application':'应用'}</span><span>${en?'Database':'数据库'}</span><span>${en?'Runtime':'运行环境'}</span></div><span class="hw-chip-name">x86</span></div></div>`;
    const inference = `<div class="hw-art hw-art-inference" role="img" aria-label="${en?'Abstract compute array and GPU memory':'计算阵列与显存的抽象示意'}"><div class="hw-accelerator"><div class="hw-array">${'<i></i>'.repeat(16)}</div><div class="hw-memory"><i></i><i></i></div><div class="hw-frost"></div><span class="hw-chip-name">CUDA</span><span class="hw-memory-name">VRAM</span></div></div>`;
    const modules = window.RM_SOFT.modules;
    document.getElementById('moduleBento').innerHTML = `<div class="hardware-compute-pair">${modules.slice(0,2).map((item,i)=>`<article class="hardware-compute"><p class="hardware-module-name">${escape(t(item.name))}</p>${i===0?application:inference}<h3>${roles[i]}</h3><p class="hardware-description">${escape(t(item.text))}</p>${specList(i)}</article>`).join('')}</div><div class="hardware-support">${modules.slice(2).map((item,j)=>{const i=j+2;return `<article class="hardware-support-row"><p class="hardware-module-name">${escape(t(item.name))}</p><div class="hardware-support-copy"><h3>${roles[i]}</h3><p class="hardware-description">${escape(t(item.text))}</p></div>${specList(i)}</article>`;}).join('')}</div>`;
    document.querySelector('[data-review-other]').href = `review-a.html?lang=${en?'en':'zh'}#hardware`;
  }
  document.addEventListener('DOMContentLoaded', () => {
    render();
    new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    if(location.hash==='#hardware') document.fonts.ready.then(()=>document.getElementById('hardware').scrollIntoView({behavior:'instant',block:'start'}));
  });
})();
