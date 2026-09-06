const size = document.querySelector('#size');
const layout = document.querySelector('#layout');
const fade = document.querySelector('#fade');
const lang = document.querySelector('#lang');
const comparison = document.querySelector('.comparison');
function render() {
  const [width, height] = size.value.split(',').map(Number);
  comparison.classList.toggle('single', layout.value !== 'both');
  document.querySelector('#value').textContent = `${fade.value}%`;
  for (const article of comparison.children) {
    article.hidden = layout.value !== 'both' && layout.value !== article.id;
    const frame = article.querySelector('.frame');
    const iframe = frame.querySelector('iframe');
    const scale = Math.min(1, article.clientWidth / width);
    frame.style.width = `${width * scale}px`;
    frame.style.height = `${height * scale}px`;
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframe.style.transform = `scale(${scale})`;
    iframe.contentWindow.postMessage({type: 'preview', fade: Number(fade.value), lang: lang.value}, location.origin);
  }
}
for (const input of [size, layout, fade, lang]) input.addEventListener('input', render);
for (const iframe of document.querySelectorAll('iframe')) iframe.addEventListener('load', render);
new ResizeObserver(render).observe(comparison);
document.querySelector('#reset').addEventListener('click', () => {
  size.value = '393,852'; layout.value = 'both'; fade.value = '28'; lang.value = 'zh-CN'; render();
});
render();
