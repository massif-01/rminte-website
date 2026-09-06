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
    document.querySelectorAll('[data-system-tab]').forEach((button, index) => {
      const selected = index === activeSystem;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      document.getElementById(`systemPanel${index}`).hidden = !selected;
    });
  }

  function renderNetwork(lang) {
    const en = lang === 'en';
    const words = {
      inference: en ? 'Inference computer' : '推理计算机',
      application: en ? 'Application computer' : '应用计算机',
      storage: en ? 'Dedicated storage' : '独立存储',
      network: en ? 'Onboard Ethernet switch' : '板载以太网交换机',
      config: en ? 'Config storage' : '配置存储'
    };
    function scene(mobile) {
      const id = mobile ? 'mobile' : 'desktop';
      const paint = name => `url(#${id}-${name})`;
      const label = (x,y,text,style = '') => `<text x="${x}" y="${y}" class="${style}">${text}</text>`;
      function chip(x,y,w,h,name,type) {
        const x0=-w/2, y0=-h/2;
        const isCompute=type==='compute', isCUDA=name==='CUDA';
        const variant=isCompute ? (isCUDA ? 'inference' : 'application') : name==='W5500' ? 'ethernet' : type;
        const outline=`M ${x0+3} ${y0} H ${w/2-3} L ${w/2} ${y0+3} V ${h/2-3} L ${w/2-3} ${h/2} H ${x0+3} L ${x0} ${h/2-3} V ${y0+3} Z`;
        let pins='', die='';
        if(isCompute) {
          // BGA-style edge contacts sit flush with the two-dimensional package.
          for(let i=0;i<14;i++) {
            const px=x0+10+(w-20)*i/13;
            pins+=`<rect x="${px-1.3}" y="${y0-3}" width="2.6" height="3" fill="#a5acad" opacity=".65"/><rect x="${px-1.3}" y="${h/2}" width="2.6" height="3" fill="#a5acad" opacity=".4"/>`;
          }
          for(let i=0;i<12;i++) {
            const py=y0+10+(h-20)*i/11;
            pins+=`<rect x="${x0-3}" y="${py-1.3}" width="3" height="2.6" fill="#a5acad" opacity=".55"/><rect x="${w/2}" y="${py-1.3}" width="3" height="2.6" fill="#a5acad" opacity=".55"/>`;
          }
        } else {
          const count=type==='switch'?16:type==='management'?11:name==='W5500'?8:7;
          for(let i=0;i<count;i++) {
            const px=x0+7+(w-14)*i/(count-1), py=y0+7+(h-14)*i/(count-1);
            pins+=`<path d="M ${px} ${y0-5} v 5 M ${px} ${h/2} v 5 M ${x0-5} ${py} h 5 M ${w/2} ${py} h 5" stroke="${paint('pin')}" stroke-width="1.7"/>`;
          }
        }
        let labelY=5, labelX=0;
        if(isCUDA) {
          die=`<rect x="${x0+11}" y="${y0+11}" width="${w-22}" height="${h-22}" rx="2" fill="${paint('glass')}" stroke="#c4cccf" stroke-opacity=".37" stroke-width=".6"/>`;
          for(let row=0;row<6;row++) for(let col=0;col<10;col++) {
            const cy=row<3 ? y0+19+row*7 : h/2-36+(row-3)*7;
            const cw=(w-40)/10;
            die+=`<rect x="${x0+20+col*cw}" y="${cy}" width="${cw-2.5}" height="4.5" rx=".6" fill="#cfd7da" opacity="${(row+col)%5===0?'.5':'.19'}"/>`;
          }
          die+=`<path d="M ${x0+20} -12 H ${w/2-20} M ${x0+20} 17 H ${w/2-20}" stroke="#b5c1c6" stroke-width=".5" opacity=".25"/>`;
        } else if(isCompute) {
          const dw=w*.5-15;
          die=`<rect x="${x0+12}" y="${y0+12}" width="${w-24}" height="${h-24}" rx="2" fill="${paint('glass')}" fill-opacity=".55" stroke="#d1d6d8" stroke-opacity=".18" stroke-width=".7"/>
            <rect x="${x0+19}" y="${y0+19}" width="${dw}" height="${h-38}" rx="1" fill="${paint('glass')}" stroke="#b9c5ca" stroke-opacity=".3" stroke-width=".5"/>
            <rect x="13" y="${y0+20}" width="${w/2-33}" height="${h*.24}" rx="1" fill="#cad5da" fill-opacity=".14" stroke="#b9c5ca" stroke-opacity=".2" stroke-width=".5"/>
            <rect x="13" y="${h/2-37}" width="${w/2-33}" height="17" rx="1" fill="#cad5da" fill-opacity=".1" stroke="#b9c5ca" stroke-opacity=".2" stroke-width=".5"/>`;
          for(let j=0;j<10;j++) die+=`<path d="M ${x0+25} ${y0+25+j*(h-50)/10} h ${dw-12}" stroke="#d2d9dc" stroke-opacity=".2" stroke-width=".7"/>`;
          for(let j=0;j<4;j++) die+=`<path d="M ${x0+29+j*8} ${y0+25} v ${h-51}" stroke="#d2d9dc" stroke-opacity=".12" stroke-width=".5"/>`;
          labelX=w*.22;
        } else if(type==='switch') {
          for(let row=0;row<5;row++) for(let col=0;col<7;col++) {
            const cw=(w-27)/7, ch=(h-40)/5;
            die+=`<rect x="${x0+15+col*cw}" y="${y0+12+row*ch}" width="${cw-3}" height="${ch-3}" rx=".5" fill="#d2dbdf" opacity="${(row*3+col)%6===0?'.48':'.12'}"/>`;
          }
          labelY=h/2-12;
        } else if(type==='management') {
          die=`<rect x="-29" y="${y0+11}" width="58" height="28" rx="1.5" fill="${paint('glass')}" stroke="#b4c1c7" stroke-opacity=".3" stroke-width=".6"/><rect class="mcu-cell" x="-23" y="${y0+17}" width="18" height="16" rx="1" fill="#d5dcdf" opacity=".3"/><rect class="mcu-cell" x="3" y="${y0+17}" width="20" height="16" rx="1" fill="#d5dcdf" opacity=".13"/><path d="M -26 22 H 14 M -26 25 H 6" stroke="#a7b4bc" stroke-opacity=".25" stroke-width=".8"/>`;
          labelY=13;
        } else if(name==='W5500') {
          for(let j=0;j<4;j++) die+=`<rect x="${-19+j*10}" y="${y0+9}" width="7" height="11" rx="1" fill="#bfcbd1" opacity="${j%2?'.15':'.4'}"/>`;
          labelY=13;
        } else {
          die=`<rect x="-17" y="${y0+8}" width="14" height="13" rx="1" fill="#d0d9dd" fill-opacity=".23" stroke="#b8c5cd" stroke-opacity=".2" stroke-width=".5"/><rect x="3" y="${y0+8}" width="14" height="13" rx="1" fill="#d0d9dd" fill-opacity=".1" stroke="#b8c5cd" stroke-opacity=".2" stroke-width=".5"/>`;
          labelY=14;
        }
        return `<g class="chip chip-${type} chip-${variant}" transform="translate(${x} ${y})">
          ${pins}<path d="${outline}" fill="${paint(isCUDA ? 'glass' : type==='switch' ? 'matrix' : type==='management' ? 'control' : 'package')}" class="chip-top" filter="${paint('grain')}"/>
          <path d="M ${x0+3} ${y0+16} V ${y0+3} H ${w/2-5}" fill="none" stroke="#edf3f6" stroke-width=".5" opacity=".13"/>${die}${isCompute ? `<path d="M ${x0+12} ${y0+12} H ${w*.16} L ${-w*.22} ${h/2-12} H ${x0+12} Z" fill="${paint('sheen')}"/>` : ''}<path class="focus-glint" d="M ${x0} ${y0+14} V ${y0+3} L ${x0+3} ${y0} H ${w/2-3} L ${w/2} ${y0+3} V ${y0+14}"/>
          ${label(labelX,labelY,name,isCompute ? 'chip-label-large' : 'chip-label')}
        </g>`;
      }
      function storage(x,y,configuration=false) {
        const cells=configuration ? Array.from({length:4},(_,i)=>`<rect class="storage-cell" x="${-25+i*13}" y="-7" width="10" height="14" rx=".7" fill="#dce6eb"/>`).join('') : `<rect x="-24" y="-8" width="20" height="15" rx="1" fill="${paint('die')}"/><rect x="3" y="-8" width="20" height="15" rx="1" fill="${paint('die')}"/>`;
        return `<g class="local-storage ${configuration?'config-storage':''}" transform="translate(${x} ${y})"><rect class="storage-case" x="-33" y="-13" width="66" height="26" rx="2" fill="${paint(configuration?'glass':'package')}" stroke="#85939b" stroke-width=".6"/><path class="storage-edge" d="M -30 10 V -10 H 30" stroke="#dce7ed" stroke-opacity=".27" stroke-width=".55" fill="none"/>${cells}${label(0,36,configuration?words.config:words.storage,'graph-small storage-label')}</g>`;
      }
      const defs = `<defs>
        <filter id="${id}-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="2" seed="7" result="noise"/><feColorMatrix in="noise" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".065"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in" result="texture"/><feBlend in="SourceGraphic" in2="texture" mode="soft-light"/></filter>
        <linearGradient id="${id}-package" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#738087" stop-opacity=".38"/><stop offset=".4" stop-color="#282f34" stop-opacity=".7"/><stop offset="1" stop-color="#444f56" stop-opacity=".4"/></linearGradient>
        <linearGradient id="${id}-glass" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#e2e8eb" stop-opacity=".34"/><stop offset=".42" stop-color="#aebcc4" stop-opacity=".07"/><stop offset="1" stop-color="#cad6db" stop-opacity=".19"/></linearGradient>
        <linearGradient id="${id}-matrix" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b2bfc6" stop-opacity=".23"/><stop offset=".55" stop-color="#52616b" stop-opacity=".12"/><stop offset="1" stop-color="#9aaeb9" stop-opacity=".15"/></linearGradient>
        <linearGradient id="${id}-control" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#697981" stop-opacity=".45"/><stop offset="1" stop-color="#1a2227" stop-opacity=".85"/></linearGradient>
        <linearGradient id="${id}-sheen" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f2f6f8" stop-opacity=".07"/><stop offset="1" stop-color="#e9f1f5" stop-opacity=".01"/></linearGradient>
        <linearGradient id="${id}-pin" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c8cfd3" stop-opacity=".65"/><stop offset=".5" stop-color="#75838c" stop-opacity=".5"/><stop offset="1" stop-color="#aebbc3" stop-opacity=".6"/></linearGradient>
        <linearGradient id="${id}-die" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ced9df" stop-opacity=".35"/><stop offset="1" stop-color="#80919c" stop-opacity=".13"/></linearGradient>
      </defs>`;
      let graphic;
      if(!mobile) {
        // A flat arrangement with deliberately staggered functional groups.
        // Paths show logical buses; their shape is composed for this illustration.
        const boardLabel = label;
        function bus(d,network=false) {
          // Parallel traces communicate a bus without a separate diagram box.
          return [-4.5,-1.5,1.5,4.5].map(offset => `<path d="${d}" transform="translate(0 ${offset})" class="${network ? 'network-wire' : 'bus-wire'}"/>`).join('');
        }
        graphic = `<g>
          ${bus('M 487 80 H 450 L 440 70 H 416')}
          ${bus('M 583 80 H 616 L 645 109 V 122')}
          ${bus('M 385 94 V 135 L 325 195 V 233',true)}
          ${bus('M 130 208 V 248 L 90 288 V 325')}
          ${bus('M 117 350 H 180 L 226 304 H 250',true)}
          ${bus('M 510 210 V 235 L 480 265 V 272 L 491 283')}
          ${bus('M 483 185 H 430 L 391 224 V 249 L 360 280',true)}
          ${bus('M 197 150 H 210 L 218 142 H 222')}
          ${bus('M 586 350 H 609 L 650 391 V 417')}
          ${chip(130,150,134,116,'CUDA','compute')}
          ${chip(535,80,96,80,'ESP32-S3','management')}
          ${chip(385,70,62,48,'W5500','interface')}
          ${chip(305,280,110,94,'RTL8367RB','switch')}
          ${chip(90,350,54,50,'MAC/PHY','interface')}
          ${chip(510,185,54,50,'MAC/PHY','interface')}
          ${chip(515,345,142,124,'x86','compute')}
          ${storage(255,142)}${storage(650,430)}${storage(645,135,true)}
          ${label(155,248,'PCIe','bus-label')}${label(541,248,'PCIe','bus-label')}
          ${label(455,61,'SPI','bus-label')}
        </g>
          ${boardLabel(130,63,words.inference,'graph-title')}
          ${boardLabel(535,14,'TianshanOS','graph-brand')}
          ${boardLabel(305,366,words.network)}
          ${boardLabel(515,450,words.application,'graph-title')}
        `;
      } else {
        const boardLabel = label;
        const bus = (d,network=false) => [-2.5,0,2.5].map(offset => `<path d="${d}" transform="translate(0 ${offset})" class="${network ? 'network-wire' : 'bus-wire'}"/>`).join('');
        graphic = `<g>
          ${bus('M 230 90 H 185 L 175 100 H 147')}
          ${bus('M 320 90 H 346 L 365 109 V 117')}
          ${bus('M 120 122 V 130 H 174 L 229 185 H 277 V 267 L 250 294 V 300',true)}
          ${bus('M 95 268 V 320 L 80 335 V 353')}
          ${bus('M 105 375 H 145 L 185 335 H 205',true)}
          ${bus('M 350 210 H 357 L 370 223 V 400 L 348 422 H 300')}
          ${bus('M 300 210 H 292 V 283 L 285 290 V 300',true)}
          ${bus('M 150 220 H 174 L 179 225 H 189')}
          ${bus('M 215 490 H 186 L 157 519')}
          ${chip(275,90,90,72,'ESP32-S3','management')}
          ${chip(120,100,54,44,'W5500','interface')}
          ${chip(95,220,110,96,'CUDA','compute')}
          ${chip(250,340,90,80,'RTL8367RB','switch')}
          ${chip(80,375,50,44,'MAC/PHY','interface')}
          ${chip(325,210,50,44,'MAC/PHY','interface')}
          ${chip(270,470,110,96,'x86','compute')}
          ${storage(222,225)}${storage(125,520)}${storage(365,130,true)}
          ${label(115,313,'PCIe','bus-label')}${label(356,294,'PCIe','bus-label')}
          ${label(190,75,'SPI','bus-label')}
        </g>
          ${boardLabel(275,27,'TianshanOS','graph-brand')}
          ${boardLabel(95,156,words.inference,'graph-title')}
          ${boardLabel(250,409,words.network,'graph-small')}
          ${boardLabel(270,555,words.application,'graph-title')}
        `;
      }
      return `<div class="network-${id}"><svg viewBox="0 0 ${mobile ? '430 580' : '700 500'}" aria-hidden="true" focusable="false">${defs}${graphic}</svg></div>`;
    }
    document.getElementById('networkGraph').innerHTML = scene(false) + scene(true);
  }

  function renderCopy() {
    const lang = language();
    document.querySelectorAll('[data-preview-zh]').forEach(element => {
      element.textContent = lang === 'en' ? element.dataset.previewEn : element.dataset.previewZh;
    });
    document.getElementById('engineArt').setAttribute('aria-label', lang === 'en' ? 'Software layers above the CUDA compute platform' : '推理软件与 CUDA 计算平台的分层示意');
    document.getElementById('networkGraph').setAttribute('aria-label', lang === 'en' ? 'Each computer connects through an Ethernet controller and PHY to the onboard switch and has dedicated storage. ESP32-S3 connects through W5500 and has its own configuration storage.' : '两台计算模组分别经以太网控制器和 PHY 接入板载交换机，ESP32-S3 经 W5500 接入并拥有自己的配置存储；两台计算机各有独立存储。');
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
    new MutationObserver(renderCopy).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
    document.querySelectorAll('[data-preview-jump]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      const id = link.dataset.previewJump;
      history.pushState(null, '', `#${id}`);
      document.getElementById(id).scrollIntoView({behavior:'instant', block:'start'});
    }));
  });
})();
