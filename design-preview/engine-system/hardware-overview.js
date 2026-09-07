(() => {
  'use strict';
  function render() {
    const en = document.documentElement.lang === 'en';
    const translate = value => typeof value === 'string' ? value : value[en ? 'en' : 'zh'];
    const root = document.getElementById('moduleBento');
    root.replaceChildren(...window.RM_SOFT.modules.map(module => {
      const row = document.createElement('article');
      row.className = 'hardware-overview-row';
      for (const [tag, className, value] of [
        ['h3','overview-name',module.name],
        ['p','overview-description',module.text],
        ['p','overview-spec',module.spec]
      ]) {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = translate(value);
        row.append(element);
      }
      return row;
    }));
    document.querySelector('[data-review-other]').href = `review-a.html?lang=${en ? 'en' : 'zh'}#hardware`;
  }
  document.addEventListener('DOMContentLoaded', () => {
    render();
    new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    if(location.hash === '#hardware') document.fonts.ready.then(() => document.getElementById('hardware').scrollIntoView({behavior:'instant',block:'start'}));
  });
})();
