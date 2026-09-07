(() => {
  'use strict';
  const data = window.RM_SOFT;
  let expandedEngine = 0;
  let activeSystem = 0;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const language = () => document.documentElement.lang === 'en' ? 'en' : 'zh';
  const translated = value => value[language()];

  function updateEngine() {
    document.getElementById('engineArt').dataset.scene = Math.max(0, expandedEngine);
    document.getElementById('ecosystemLabel').textContent = ['vLLM · Transformers', language() === 'en' ? 'Concurrent requests' : '并发请求', language() === 'en' ? 'Model · Application' : '模型 · 应用'][Math.max(0, expandedEngine)];
    document.getElementById('kernelLabel').innerHTML = expandedEngine === 1 ? 'Paged KV Cache' : '<span class="rm-mark">RMinte</span> Inference';
    document.querySelectorAll('[data-engine-toggle]').forEach((button, index) => {
      button.setAttribute('aria-expanded', String(index === expandedEngine));
      document.getElementById(`engineDetail${index}`).hidden = index !== expandedEngine;
    });
  }

  function updateSystem() {
    document.getElementById('networkGraph').dataset.focus = activeSystem;
    window.RMReviewGraph.clearInspection();
    window.RMReviewGraph.setFocus(activeSystem);
    document.querySelectorAll('[data-system-tab]').forEach((button, index) => {
      const selected = index === activeSystem;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      document.getElementById(`systemPanel${index}`).hidden = !selected;
    });
  }

  function renderNetwork(lang) {
    window.RMReviewGraph.render(lang);
  }

  function renderCopy() {
    const lang = language();
    document.querySelectorAll('[data-preview-zh]').forEach(element => {
      element.textContent = lang === 'en' ? element.dataset.previewEn : element.dataset.previewZh;
    });
    document.getElementById('engineArt').setAttribute('aria-label', lang === 'en' ? 'Software layers above the CUDA compute platform' : '推理软件与 CUDA 计算平台的分层示意');
    const controller=document.body.dataset.material==='abstract'?'ESP32':'ESP32-S3';
    document.getElementById('networkGraph').setAttribute('aria-label', lang === 'en' ? 'Each computer connects through an Ethernet controller and PHY to the onboard switch and has dedicated storage. '+controller+' connects through W5500 and has its own configuration storage.' : '两台计算模组分别经以太网控制器和 PHY 接入板载交换机，'+controller+' 经 W5500 接入并拥有自己的配置存储；两台计算机各有独立存储。');
    document.getElementById('engineReading').innerHTML = data.engine.map((item, index) => `<article class="engine-topic">
      <h3><button class="engine-topic-toggle" type="button" id="engineToggle${index}" data-engine-toggle="${index}" aria-expanded="${index === expandedEngine}" aria-controls="engineDetail${index}">${escape(translated(item.title))}<svg class="topic-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></button></h3>
      <div class="engine-detail" id="engineDetail${index}" role="region" aria-labelledby="engineToggle${index}" ${index === expandedEngine ? '' : 'hidden'}><p>${escape(translated(item.text))}</p></div>
    </article>`).join('');
    document.querySelectorAll('[data-engine-toggle]').forEach(button => button.addEventListener('click', () => {
      const index = Number(button.dataset.engineToggle);
      expandedEngine = expandedEngine === index ? -1 : index;
      updateEngine();
    }));
    document.getElementById('systemReading').innerHTML = `<div class="system-tabs" role="tablist" aria-label="${lang === 'en' ? 'TianshanOS capabilities' : 'TianshanOS 功能'}">${data.pillars.map((item, index) => `<button type="button" role="tab" id="systemTab${index}" data-system-tab="${index}" aria-controls="systemPanel${index}" aria-selected="${index === activeSystem}" tabindex="${index === activeSystem ? 0 : -1}">${escape(translated(item.title))}</button>`).join('')}</div><div class="system-panels">${data.pillars.map((item, index) => `<div role="tabpanel" tabindex="0" class="system-panel" id="systemPanel${index}" aria-labelledby="systemTab${index}" ${index === activeSystem ? '' : 'hidden'}><p>${escape(translated(item.text))}</p></div>`).join('')}</div>`;
    const tabs = Array.from(document.querySelectorAll('[data-system-tab]'));
    tabs.forEach((button, index) => {
      button.addEventListener('click', () => {activeSystem = index; updateSystem();});
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        activeSystem = next;
        updateSystem();
        tabs[next].focus();
      });
    });
    updateEngine();
    renderNetwork(lang);
    updateSystem();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.toggle('preview-reduced-motion', new URLSearchParams(location.search).get('motion') === 'reduce');
    document.querySelector('.compute-grid').innerHTML = '<i></i>'.repeat(96);
    document.querySelector('.memory-grid').innerHTML = '<i></i>'.repeat(48);
    renderCopy();
    // Resolve the requested review section after font-dependent layout settles.
    const initialAnchor=location.hash.slice(1);
    if(['engine','tianshanos'].includes(initialAnchor)) document.fonts.ready.then(() => {
      document.getElementById(initialAnchor).scrollIntoView({behavior:'instant',block:'start'});
    });
    new MutationObserver(renderCopy).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
    document.querySelectorAll('[data-preview-jump]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      const id = link.dataset.previewJump;
      history.pushState(null, '', `#${id}`);
      document.getElementById(id).scrollIntoView({behavior:'instant', block:'start'});
    }));
  });
})();
