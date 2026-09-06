"""Build a discussion preview from the unchanged production homepage."""
from pathlib import Path
import re

HERE = Path(__file__).resolve().parent
SITE = HERE.parents[1] / "website"
PREFIX = "../../website/"

source = (SITE / "index.html").read_text()
sections = (HERE / "sections.html").read_text()
start = source.index('    <section class="section engine-section"')
end = source.index('    <section class="section hardware-section"', start)
page = source[:start] + sections + "\n" + source[end:]
page = page.replace('"assets/', f'"{PREFIX}assets/')
page = page.replace('  <script src="visitor-language.js" defer></script>\n', '')
page = re.sub(r'<script src="[^"]*assets/main.js[^\"]*" defer></script>', '<script src="page-main.js" defer></script>', page)
page = page.replace('</head>', '  <link rel="stylesheet" href="preview.css">\n  <script src="preview.js" defer></script>\n</head>')
page = page.replace('<body class="home-body">', '<body class="home-body visual-preview">')
page = page.replace('</body>', '''<aside class="preview-dock" aria-label="设计预览导航">
  <span data-preview-zh="设计预览" data-preview-en="Design preview">设计预览</span>
  <a href="#engine" data-preview-jump="engine" data-preview-zh="推理引擎" data-preview-en="Engine">推理引擎</a>
  <a href="#tianshanos" data-preview-jump="tianshanos" data-preview-zh="整机协同" data-preview-en="System">整机协同</a>
  <a href="../../website/#engine" target="_blank" rel="noopener" data-preview-zh="查看原版" data-preview-en="Original">查看原版</a>
</aside>\n</body>''')
page = page.replace('<title>', '<title>设计预览 · ')
(HERE / "index.html").write_text(page)

main = (SITE / "assets/main.js").read_text()
main = main.replace("const imageBase = 'assets/images/';", f"const imageBase = '{PREFIX}assets/images/';")
main = main.replace("let lang = localStorage.getItem('rm-soft-lang') || window.RM_DEFAULT_LANG || 'en';", "const requestedLang = new URLSearchParams(location.search).get('lang');\n  let lang = ['zh', 'en'].includes(requestedLang) ? requestedLang : 'zh';")
main = main.replace("desktopLink.href = options.href ||", f"desktopLink.href = options.href ? '{PREFIX}' + options.href :")
main = main.replace("mobileLink.href = options.href ||", f"mobileLink.href = options.href ? '{PREFIX}' + options.href :")
(HERE / "page-main.js").write_text(main)
print("Updated preview homepage and its isolated navigation script")
