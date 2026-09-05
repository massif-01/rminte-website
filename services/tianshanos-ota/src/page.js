import {brandCSS, brandLogo} from './brand.generated.js';
export function homePage(origin, defaultLang, RELEASE) {
 const serviceUrl = origin;
 return `<!doctype html><html lang="${defaultLang==='zh'?'zh-CN':'en'}"><head>
 <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#141618">
 <title>TianShanOS OTA · RMinte</title>
 <link rel="icon" href="https://rminte.com/assets/images/favicon.png">
 <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600&display=swap" rel="stylesheet">
 <style>${brandCSS}
 .ota-main{width:calc(100% - var(--section-x)*2);max-width:var(--section-w);margin:88px auto 0}.ota-hero{max-width:760px}.ota-hero h1{font-size:var(--page-title);font-weight:500;line-height:1.13;letter-spacing:-.045em;margin:18px 0 24px}.ota-lead{max-width:690px;color:var(--muted);font-size:16px;line-height:1.9;margin:0}
 .ota-address{margin:48px 0 56px;padding:28px 32px;background:var(--panel);border:1px solid var(--line);border-radius:var(--radius-panel)}.ota-address label{display:block;font-size:12px;color:var(--muted);margin-bottom:14px}.ota-url{display:flex;align-items:center;justify-content:space-between;gap:24px}.ota-url code{font-size:clamp(17px,2.4vw,26px);overflow-wrap:anywhere;letter-spacing:-.02em}.ota-url button{flex-shrink:0}.copy-feedback{font-size:13px;color:var(--muted);min-height:22px;margin:10px 0 0}
 .ota-columns{display:grid;grid-template-columns:1.35fr 1fr;gap:clamp(40px,7vw,104px)}.ota-columns h2{font-size:24px;font-weight:500;letter-spacing:-.02em;margin:0 0 28px}.ota-steps{list-style:none;margin:0;padding:0;counter-reset:step}.ota-steps li{counter-increment:step;display:grid;grid-template-columns:28px 1fr;gap:18px;border-top:1px solid var(--line);padding:20px 0;color:var(--muted);font-size:15px;line-height:1.9}.ota-steps li:before{content:'0' counter(step);font-size:11px;color:var(--dim);padding-top:4px}.ota-steps strong{font-weight:500;color:var(--ink)}
 .release-version{font-size:18px;overflow-wrap:anywhere;margin:0 0 24px}.release-list{margin:0}.release-list div{padding:18px 0;border-top:1px solid var(--line)}.release-list dt{font-size:12px;color:var(--muted);margin-bottom:6px}.release-list dd{margin:0;font:14px/1.8 monospace;overflow-wrap:anywhere}.release-list small{color:var(--muted)}.ota-links{display:flex;gap:16px;flex-wrap:wrap;margin-top:24px;font-size:12px;color:var(--muted)}.ota-links a{border-bottom:1px solid var(--line);padding:8px 0}.brand-name{white-space:nowrap}
 @media(max-width:767px){.ota-main{margin-top:56px}.ota-hero h1{font-size:34px}.ota-lead{font-size:15px}.ota-address{margin:32px 0 40px;padding:22px}.ota-url{align-items:flex-start;flex-direction:column;gap:20px}.ota-columns{grid-template-columns:1fr;gap:40px}.ota-columns h2{font-size:22px}.ota-steps li{gap:12px}}
 </style></head><body class="brand-page">
 <header class="brand-header"><a class="brand-logo" href="https://rminte.com/" aria-label="RMinte">${brandLogo}</a><nav class="brand-nav" id="brandNav" aria-label="RMinte"><a href="https://rminte.com/gallery/" data-i18n="gallery">图册</a><a href="https://rminte.com/#engine" data-i18n="product">产品</a><a href="https://rminte.com/#teardown" data-i18n="architecture">架构</a><a href="https://rminte.com/guides/" data-i18n="guides">指南</a><a href="https://rminte.com/downloads/" data-i18n="downloads">下载</a></nav><div class="brand-actions"><button id="langToggle" class="brand-language" type="button">EN</button><button id="brandMenu" class="brand-menu" aria-controls="brandNav" aria-expanded="false" data-i18n-aria="menu" aria-label="菜单">☰</button></div></header>
 <main class="ota-main"><section class="ota-hero"><span class="brand-kicker">RM-01 / TIANSHANOS</span><h1 data-i18n="pageTitle">OTA 更新服务</h1><p class="ota-lead" data-i18n-html="lead"></p></section>
 <section class="ota-address" aria-labelledby="addressLabel"><label id="addressLabel" data-i18n="address">OTA 服务地址</label><div class="ota-url"><code id="serviceUrl">${serviceUrl}</code><button id="copyButton" class="brand-button primary" data-i18n="copy">复制地址</button></div><p class="copy-feedback" id="copyFeedback" role="status" aria-live="polite"></p></section>
 <div class="ota-columns"><section><h2 data-i18n="setup">连接更新服务</h2><ol class="ota-steps"><li><span data-i18n-html="step1"></span></li><li><span data-i18n-html="step2"></span></li><li><span data-i18n-html="step3"></span></li><li><span data-i18n-html="step4"></span></li></ol><div class="ota-links"><a href="https://rminte.com/guides/" data-i18n="readGuide">阅读使用指南 ↗</a></div></section>
 <section><h2 data-i18n="release">当前发布</h2><p class="release-version">${RELEASE.version}</p><dl class="release-list"><div><dt data-i18n="firmware">固件</dt><dd>${RELEASE.firmware.name}<br><small>${(RELEASE.firmware.size/1024/1024).toFixed(1)} MB</small></dd></div><div><dt>WebUI</dt><dd>${RELEASE.www.name}<br><small>${(RELEASE.www.size/1024/1024).toFixed(1)} MB</small></dd></div></dl><div class="ota-links"><a href="/version" data-i18n="versionInfo">查看版本信息</a><a href="/health" data-i18n="health">服务接口信息</a></div></section></div></main>
 <footer class="brand-footer"><span>RMinte · TianShanOS</span><div class="brand-footer-links"><a class="brand-button" href="mailto:support@rminte.com" data-i18n="contact">联系我们</a><a class="brand-button" href="https://rminte.com/" data-i18n="home">返回主站</a><a class="brand-button" href="https://github.com/RMinte-AI" target="_blank" rel="noopener">GitHub ↗</a></div></footer>
 <script>
    const translations = {
      zh: {
        title: '<span class="brand-name">TianShanOS</span><br>OTA 更新服务',
        lead: '为 <span class="brand-name">RM-01</span> 本机的 <span class="brand-name">TianShanOS</span> OTA 页面提供正式固件与 WebUI 更新文件。刷写操作仍在设备自己的管理页面中完成。',
        online: '服务在线', copy: '复制地址', copied: '已复制', firmware: '固件', versionInfo: '查看版本信息', health: '服务健康状态',
        step1: '让电脑或平板连接 <span class="brand-name">RM-01</span> 所在网络。',
        step2: '打开 <span class="brand-name">RM-01</span> 的 <span class="brand-name">TianShanOS</span> WebUI，并进入<strong>“OTA 升级”</strong>。',
        step3: '把上面的地址填入<strong>“OTA 服务器”</strong>并保存。',
        step4: '点击<strong>“检查更新”</strong>，确认版本后开始升级。'
      },
      en: {
        title: '<span class="brand-name">TianShanOS</span><br>OTA Update Service',
        lead: 'Provides official firmware and WebUI updates to the <span class="brand-name">TianShanOS</span> OTA page hosted on your <span class="brand-name">RM-01</span>. Flashing remains securely controlled by the device’s own management interface.',
        online: 'Service online', copy: 'Copy address', copied: 'Copied', firmware: 'Firmware', versionInfo: 'View version information', health: 'Service health',
        step1: 'Connect your computer or tablet to the same network as the <span class="brand-name">RM-01</span>.',
        step2: 'Open the <span class="brand-name">TianShanOS</span> WebUI on your <span class="brand-name">RM-01</span>, then go to <strong>OTA Update</strong>.',
        step3: 'Enter the address above under <strong>OTA Server</strong>, then save it.',
        step4: 'Select <strong>Check for Updates</strong>, confirm the version, and start the update.'
      }
    };

 Object.assign(translations.zh,{contact:'联系我们',pageTitle:'OTA 更新服务',address:'OTA 服务地址',setup:'连接更新服务',release:'当前发布',readGuide:'阅读使用指南 ↗',health:'服务接口信息',gallery:'图册',product:'产品',architecture:'架构',guides:'指南',downloads:'下载',home:'返回主站',menu:'菜单',copyFailed:'复制未完成，请手动选择上方地址复制。'});
 Object.assign(translations.en,{contact:'Contact us',pageTitle:'OTA update service',address:'OTA SERVER ADDRESS',setup:'Connect to the service',release:'Current release',readGuide:'Read the guides ↗',health:'Service API information',gallery:'Gallery',product:'Product',architecture:'Architecture',guides:'Guides',downloads:'Downloads',home:'Back to RMinte',menu:'Menu',copyFailed:'Could not copy. Select the address above and copy it manually.'});
 let currentLang=localStorage.getItem('rm-ota-lang')==='zh'?'zh':localStorage.getItem('rm-ota-lang')==='en'?'en':${JSON.stringify(defaultLang)};
 const langToggle=document.getElementById('langToggle'),copyButton=document.getElementById('copyButton'),feedback=document.getElementById('copyFeedback');
 function applyLanguage(lang,remember=true){currentLang=lang;if(remember)localStorage.setItem('rm-ota-lang',lang);document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=translations[lang][el.dataset.i18n]);document.querySelectorAll('[data-i18n-html]').forEach(el=>el.innerHTML=translations[lang][el.dataset.i18nHtml]);document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',translations[lang][el.dataset.i18nAria]));langToggle.textContent=lang==='zh'?'EN':'中';langToggle.setAttribute('aria-label',lang==='zh'?'切换到英文':'Switch to Chinese');feedback.textContent='';}
 langToggle.addEventListener('click',()=>applyLanguage(currentLang==='zh'?'en':'zh'));
 copyButton.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.getElementById('serviceUrl').textContent);feedback.textContent=translations[currentLang].copied;}catch{feedback.textContent=translations[currentLang].copyFailed;}});
 const menu=document.getElementById('brandMenu'),nav=document.getElementById('brandNav');
 function closeMenu(){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');}
 menu.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open')){closeMenu();menu.focus();}});document.addEventListener('click',e=>{if(!e.target.closest('.brand-header'))closeMenu();});
 applyLanguage(currentLang,false);
 </script></body></html>`;
}
