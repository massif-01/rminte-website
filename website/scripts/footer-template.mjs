import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

// Read the same copy used by footer.js; static HTML must not carry another text source.
const context={window:{}};
runInNewContext(readFileSync(new URL('../assets/site-data.js',import.meta.url),'utf8'),context);
const ui=context.window.RM_SOFT.ui.zh;
function markedText(key) {
  return ui[key].split(/(RMinte(?:\s+AI\b)?|RM-01)/g).map(part=>{
    const text=part.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    return /^(RMinte(?:\s+AI\b)?|RM-01)$/.test(part)?`<span class="rm-mark">${text}</span>`:text;
  }).join('');
}

// Static HTML source for the main site footer and its contact panel.
// Keep placement in each page; all internal markup is generated here.
export const footerPages = [
  'index.html', 'gallery/index.html', 'models/index.html', 'cases/index.html',
  'downloads/index.html', 'guides/index.html',
  'guides/admin.html', 'guides/root.html', 'guides/security.html', 'guides/network.html',
  'guides/api.html'
];
export const guidePages = footerPages.filter(page => /^guides\/(admin|root|security|network|api)\.html$/.test(page));

export function renderFooter(assetPrefix) {
  return `<!-- shared-footer:start -->
<footer class="footer footer--standard" role="contentinfo">
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="${assetPrefix}assets/images/logo-white.svg" alt="RMinte">
      <div>
      <p data-footer-text="footer">${markedText('footer')}</p>
      <span data-footer-text="copyright">${markedText('copyright')}</span>
      </div>
    </div>
    <a class="inception-membership" href="https://www.nvidia.com/en-us/startups/" target="_blank" rel="noopener noreferrer">
      <span class="inception-logo"><img src="${assetPrefix}assets/images/nvidia-inception-white.png" width="1221" height="662" alt="NVIDIA Inception Program"></span>
    </a>
    <div class="footer-actions">
      <button class="footer-contact" type="button" aria-expanded="false" aria-controls="contactPopover" data-contact-toggle>
        <span data-footer-text="contactButton">${markedText('contactButton')}</span>
      </button>
      <a class="footer-github" href="https://github.com/RMinte" target="_blank" rel="noreferrer" aria-label="GitHub">
        <svg class="github" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true" focusable="false" style="display:inline-block;width:18px;height:18px;flex:none;vertical-align:middle"><path d="M12 0c6.63 0 12 5.276 12 11.79-.001 5.067-3.29 9.567-8.175 11.187-.6.118-.825-.25-.825-.56 0-.398.015-1.665.015-3.242 0-1.105-.375-1.813-.81-2.181 2.67-.295 5.475-1.297 5.475-5.822 0-1.297-.465-2.344-1.23-3.169.12-.295.54-1.503-.12-3.125 0 0-1.005-.324-3.3 1.209a11.32 11.32 0 00-3-.398c-1.02 0-2.04.133-3 .398-2.295-1.518-3.3-1.209-3.3-1.209-.66 1.622-.24 2.83-.12 3.125-.765.825-1.23 1.887-1.23 3.169 0 4.51 2.79 5.527 5.46 5.822-.345.294-.66.81-.765 1.577-.69.31-2.415.81-3.495-.973-.225-.354-.9-1.223-1.845-1.209-1.005.015-.405.56.015.781.51.28 1.095 1.327 1.23 1.666.24.663 1.02 1.93 4.035 1.385 0 .988.015 1.916.015 2.196 0 .31-.225.664-.825.56C3.303 21.374-.003 16.867 0 11.791 0 5.276 5.37 0 12 0z"/></svg>
        <span><svg class="github-text" viewBox="0 0 78 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true" focusable="false" style="display:inline-block;width:42.25px;height:13px;flex:none;vertical-align:middle"><path d="M16.598 10.836v9.48c0 .066-.017.181-.1.214 0 0-2.07 1.47-5.484 1.47C6.888 22 2 20.712 2 12.223 2 3.734 6.275 1.983 10.45 2c3.613 0 5.07.81 5.303.958.066.083.1.149.1.231l-.697 2.94c0 .149-.149.33-.331.28-.597-.18-1.491-.544-3.596-.544-2.435 0-5.053.693-5.053 6.16 0 5.466 2.485 6.11 4.275 6.11 1.524 0 2.07-.181 2.07-.181v-3.799h-2.435c-.182 0-.315-.132-.315-.28v-3.04c0-.148.133-.28.315-.28h6.197c.182 0 .315.132.315.28zM76 14.684c0 5.664-1.84 7.283-5.054 7.283-2.717 0-4.175-1.37-4.175-1.37s-.067.759-.15.858c-.05.1-.132.132-.231.132h-2.453c-.165 0-.315-.132-.315-.28l.034-18.349a.29.29 0 01.281-.28h3.53a.29.29 0 01.281.28v6.226s1.359-.875 3.347-.875l-.016-.033c1.988 0 4.921.743 4.921 6.408zM47.865 2.71a.29.29 0 01.281.281V21.34a.29.29 0 01-.281.281h-3.53a.29.29 0 01-.281-.28l.033-7.845h-5.485v7.844a.29.29 0 01-.281.281h-3.53c-.132 0-.281-.132-.281-.28V2.99a.29.29 0 01.281-.28h3.53a.29.29 0 01.281.28v6.755h5.485V2.99a.29.29 0 01.282-.28h3.496zM61.55 8.722c.183 0 .315.132.315.28l-.033 12.337c0 .149-.1.281-.282.281h-2.22c-.116 0-.232-.066-.265-.148-.05-.1-.133-.744-.133-.744S57.061 22 54.758 22c-2.8 0-4.839-.908-4.839-4.542V9.02a.29.29 0 01.282-.28h3.546a.29.29 0 01.282.28v7.845c0 1.238.364 1.8 1.607 1.8 1.243 0 2.154-.644 2.154-.644V9.036c0-.182.1-.314.282-.314h3.48zm-28.84 9.861h.007c.14.029.239.154.234.296v2.477c0 .116-.05.231-.149.264-.166.083-1.226.363-2.104.363-1.922 0-4.74-.412-4.74-4.442v-5.417H24.12c-.149 0-.281-.132-.281-.314V9.564c0-.132.083-.248.215-.28.116-.017 1.922-.463 1.922-.463V5.237c0-.132.083-.215.232-.215h3.58c.148 0 .231.083.231.215v3.485h2.635c.132 0 .265.132.265.28v2.808c0 .182-.116.314-.265.314h-2.635v5.17c0 .777.448 1.372 1.74 1.372.41 0 .797-.081.951-.083zM22.28 8.705a.29.29 0 01.282.281v12.172c0 .297-.083.446-.414.446h-3.182c-.281 0-.497-.116-.497-.446V9.036c0-.182.133-.33.282-.33h3.53zm49.693 6.243c0-2.99-1.21-3.386-2.486-3.253-.994.066-1.79.561-1.79.561v5.813s.813.562 2.022.595c1.707.05 2.254-.562 2.254-3.716zM20.54 3.123a2.26 2.26 0 012.254 2.28A2.26 2.26 0 0120.54 7.68a2.266 2.266 0 01-2.286-2.279c0-1.271 1.01-2.279 2.286-2.279z"/></svg></span>
      </a>
    </div>
  </div>
</footer>
<!-- shared-footer:end -->`;
}

export function renderContactPanel() {
  return `<!-- shared-contact:start -->
<div class="contact-popover" id="contactPopover" role="dialog" aria-labelledby="contactTitle" aria-hidden="true" data-contact-popover>
  <div class="contact-card" data-bevel>
    <div class="contact-card-core">
      <div class="contact-top">
        <div>

          <h2 id="contactTitle" data-footer-text="contactTitle">${markedText('contactTitle')}</h2>
        </div>
        <button class="contact-close" type="button" aria-label="关闭" data-contact-close data-i18n-aria-label-zh="关闭" data-i18n-aria-label-en="Close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;flex-shrink:0;pointer-events:none" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
      </div>
      <div class="contact-links">
        <a href="mailto:jiezhu@rminte.com">
          <span data-footer-text="salesContact">${markedText('salesContact')}</span>
          <strong>jiezhu@rminte.com</strong><svg class="contact-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>
        </a>
        <a href="mailto:yishi@rminte.com">
          <span data-footer-text="manufacturingContact">${markedText('manufacturingContact')}</span>
          <strong>yishi@rminte.com</strong><svg class="contact-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>
        </a>
        <a href="mailto:support@rminte.com">
          <span data-footer-text="supportContact">${markedText('supportContact')}</span>
          <strong>support@rminte.com</strong><svg class="contact-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>
        </a>
        <a href="https://github.com/orgs/RMinte/discussions" target="_blank" rel="noopener noreferrer">
          <span data-footer-text="communityContact">${markedText('communityContact')}</span>
          <strong>GitHub Discussions</strong><svg class="contact-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>
        </a>
        <a href="/sample-loan/#apply" data-sample-loan-open>
          <span data-footer-text="sampleLoan">${markedText('sampleLoan')}</span>
          <strong data-footer-text="sampleApply">${markedText('sampleApply')}</strong><svg class="contact-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>
        </a>
      </div>
      <div class="contact-load-error" data-sample-load-error role="alert" hidden>
        <p data-footer-text="sampleLoadError">${markedText('sampleLoadError')}</p>
        <button class="ghost-button" type="button" data-sample-reload data-footer-text="sampleReload">${markedText('sampleReload')}</button>
      </div>
    </div>
  </div>
</div>
<!-- shared-contact:end -->`;
}
