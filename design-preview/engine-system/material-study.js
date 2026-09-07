const scene = document.getElementById('scene');
const language = document.getElementById('language');
const copy = {
  zh: {eyebrow:'整机协同 / 材质样张',title:'两种表面，同一种聚焦。',lead:'先选择材质，再切换聚焦，比较从磨砂到清晰的变化。',versionA:'A / 抽象磨砂',versionB:'B / 芯片材质',storage:'独立存储',caption:'仅比较材质与接线；B 版芯片从参考插画提取，不表示完整硬件架构。',rest:'静态表面',active:'聚焦 · 看清内部'},
  en: {eyebrow:'System coordination / Material study',title:'Two surfaces. One focus.',lead:'Choose a material, then focus to compare the transition from frosted to clear.',versionA:'A / Abstract glass',versionB:'B / Silicon detail',storage:'Storage',caption:'Surface and connection study only. Version B uses chips extracted from the reference illustration, not a full hardware diagram.',rest:'At rest',active:'Focus · Reveal detail'}
};
let lang = 'zh';
language.addEventListener('click', () => {
  lang = lang === 'zh' ? 'en' : 'zh';
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-copy]').forEach(el => { el.textContent = copy[lang][el.dataset.copy]; });
  language.textContent = lang === 'zh' ? 'EN' : '中';
  language.setAttribute('aria-label', lang === 'zh' ? '切换到英文' : 'Switch to Chinese');
  document.title = lang === 'zh' ? '磨砂材质样张 · RMinte' : 'Frosted material study · RMinte';
  document.querySelector('.version-controls').setAttribute('aria-label', lang === 'zh' ? '材质版本' : 'Material version');
  document.querySelector('.study-controls').setAttribute('aria-label', lang === 'zh' ? '材质状态' : 'Material state');
  ['compute','storage','controller','application'].forEach((id,i) => document.getElementById(id).setAttribute('aria-label',lang === 'zh' ? ['CUDA 计算模块材质示意','独立存储材质示意','ESP32-S3 控制模块材质示意','x86 计算模块材质示意'][i] : ['CUDA compute surface study','Independent storage surface study','ESP32-S3 controller surface study','x86 compute surface study'][i]));
});
document.querySelectorAll('.study-controls [data-state]').forEach(button => {
  button.addEventListener('click', () => {
    scene.dataset.state = button.dataset.state;
    document.querySelectorAll('.study-controls button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
});
document.querySelectorAll('.version-controls [data-version]').forEach(button => {
  button.addEventListener('click', () => {
    scene.dataset.version = button.dataset.version;
    document.querySelectorAll('.version-controls button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
});
// Measure physical edges. Each wire has its own port; no translated bundles or hidden overshoot.
function drawConnections() {
  const compute = document.getElementById('compute');
  const storage = document.getElementById('storage');
  const controller = document.getElementById('controller');
  const x1 = compute.offsetLeft + compute.offsetWidth;
  const x2 = storage.offsetLeft;
  const y = storage.offsetTop + storage.offsetHeight / 2;
  document.getElementById('storage-wires').innerHTML = [-4,0,4].map(offset => `<path d="M${x1} ${y+offset}H${x2}"/>`).join('');
  const cx = controller.offsetLeft + controller.offsetWidth / 2;
  const top = controller.offsetTop;
  document.getElementById('entry').setAttribute('y1', top - 66);
  document.getElementById('entry').setAttribute('y2', top);
  document.getElementById('control-wires').innerHTML = [-4,0,4].map(offset => `<path d="M${cx+offset} ${top-66}V${top}"/>`).join('');
}
new ResizeObserver(drawConnections).observe(scene);
drawConnections();
