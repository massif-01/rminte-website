"""Build two isolated review homepages; do not write production or earlier samples."""
from pathlib import Path

HERE=Path(__file__).resolve().parent
page=(HERE/'index.html').read_text()
preview_script=(HERE/'preview.js').read_text()
start=preview_script.index('  function renderNetwork(lang) {')
end=preview_script.index('  function renderCopy() {',start)
review_script=preview_script[:start]+'''  function renderNetwork(lang) {
    window.RMReviewGraph.render(lang);
  }

'''+preview_script[end:]
review_script=review_script.replace("document.getElementById('networkGraph').dataset.focus = activeSystem;", "document.getElementById('networkGraph').dataset.focus = activeSystem;\n    window.RMReviewGraph.clearInspection();\n    window.RMReviewGraph.setFocus(activeSystem);")
review_script=review_script.replace('    renderCopy();\n    new MutationObserver', '''    renderCopy();
    // Resolve the requested review section after font-dependent layout settles.
    const initialAnchor=location.hash.slice(1);
    if(['engine','tianshanos'].includes(initialAnchor)) document.fonts.ready.then(() => {
      document.getElementById(initialAnchor).scrollIntoView({behavior:'instant',block:'start'});
    });
    new MutationObserver''')
review_script=review_script.replace("    document.getElementById('networkGraph').setAttribute('aria-label',", "    const controller=document.body.dataset.material==='abstract'?'ESP32':'ESP32-S3';\n    document.getElementById('networkGraph').setAttribute('aria-label',")
review_script=review_script.replace('storage. ESP32-S3 connects', "storage. '+controller+' connects").replace('交换机，ESP32-S3 经', "交换机，'+controller+' 经")
(HERE/'review-interactions.js').write_text(review_script)

# Keep the approved engine and page layout; exclude the superseded pin/die styling.
css=(HERE/'preview.css').read_text()
engine=css[:css.index('/* Compact system study:')]
layout=css[css.index('/* Compact system study:'):css.index('.visual-preview .network-graph text')]
(HERE/'review-base.css').write_text(engine+layout)

for key,material,zh,en in [('a','abstract','抽象磨砂','Abstract glass'),('b','silicon','芯片材质','Silicon detail')]:
    output=page.replace('<title>设计预览 · ',f'<title>待审核 {key.upper()} · {zh} · ')
    output=output.replace('class="home-body visual-preview"',f'class="home-body visual-preview material-review" data-material="{material}"')
    output=output.replace('<link rel="stylesheet" href="preview.css">','<link rel="stylesheet" href="review-base.css">\n  <link rel="stylesheet" href="review.css">')
    output=output.replace('<script src="preview.js" defer></script>','<script src="review-graph.js" defer></script>\n  <script src="review-interactions.js" defer></script>')
    output=output.replace('<span data-preview-zh="设计预览" data-preview-en="Design preview">设计预览</span>',f'<span class="review-version" data-preview-zh="待审核 {key.upper()} · {zh}" data-preview-en="Review {key.upper()} · {en}">待审核 {key.upper()} · {zh}</span>')
    output=output.replace('<a href="../../website/#engine" target="_blank" rel="noopener" data-preview-zh="查看原版" data-preview-en="Original">查看原版</a>',f'<a href="review-{"b" if key=="a" else "a"}.html#tianshanos" data-review-other target="_blank" rel="noopener" data-preview-zh="对照 {"B" if key=="a" else "A"}" data-preview-en="Compare {"B" if key=="a" else "A"}">对照 {"B" if key=="a" else "A"}</a>')
    (HERE/f'review-{key}.html').write_text(output)
print('Built review-a.html and review-b.html; production and material-study files unchanged.')
