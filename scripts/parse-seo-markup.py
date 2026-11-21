"""Use the existing Python 3 toolchain's HTML/XML parsers, including entity decoding."""
import json
import sys
from html.parser import HTMLParser
from xml.etree import ElementTree


class Head(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.result = {"titles": [], "metas": [], "links": [], "schemas": [], "lang": "", "h1": ""}
        self.in_head = False
        self.title = None
        self.schema = None
        self.in_h1 = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.result["lang"] = attrs.get("lang", "")
        if tag == "h1" and not self.result["h1"]:
            self.in_h1 = True
        if tag == "head":
            self.in_head = True
        if not self.in_head:
            return
        if tag == "title":
            self.title = {"text": "", "attrs": attrs}
            self.result["titles"].append(self.title)
        elif tag in ("meta", "link"):
            self.result["metas" if tag == "meta" else "links"].append(attrs)
        elif tag == "script" and attrs.get("type", "").lower() == "application/ld+json":
            self.schema = ""

    def handle_endtag(self, tag):
        if tag == "h1":
            self.in_h1 = False
        if tag == "head":
            self.in_head = False
        elif tag == "title":
            self.title = None
        elif tag == "script" and self.schema is not None:
            self.result["schemas"].append(self.schema)
            self.schema = None

    def handle_data(self, data):
        if self.in_h1:
            self.result["h1"] += data
        if self.title is not None:
            self.title["text"] += data
        if self.schema is not None:
            self.schema += data


raw = sys.stdin.read()
if sys.argv[1] == "html":
    parser = Head()
    parser.feed(raw)
    parser.close()
    result = parser.result
else:
    root = ElementTree.fromstring(raw)
    ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    assert root.tag == ns + "urlset", "Sitemap must be a namespaced urlset"
    urls = root.findall(ns + "url")
    assert all(len(url.findall(ns + "loc")) == 1 for url in urls), "Each URL needs one loc"
    result = {
        "urls": [url.findtext(ns + "loc", "") for url in urls],
        "alternates": {
            url.findtext(ns + "loc", ""): [
                link.attrib for link in url.findall("{http://www.w3.org/1999/xhtml}link")
            ] for url in urls
        },
        "images": [node.text or "" for node in root.iter("{http://www.google.com/schemas/sitemap-image/1.1}loc")],
        "hasLastmod": next(root.iter(ns + "lastmod"), None) is not None,
    }
print(json.dumps(result, ensure_ascii=False))
