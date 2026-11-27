"""Bundle the demo into one self-contained HTML that works from file:// (no module imports, no external files)."""
import base64, re, os, sys
# usage: python3 tools/bundle.py OUT.html [--pages]
# Builds ONE self-contained HTML (scripts, styles, images, font inlined) for the gh-pages demo / offline sharing.
# Not needed for production: the site itself is the plain files in this folder.
SP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..') + '/'
OUT = sys.argv[1]
html = open(SP + 'index.html').read()
css = open(SP + 'css/site.css').read().replace('url(../media/', 'url(media/')
assert '<link rel="stylesheet" href="css/site.css">' in html
html = html.replace('<link rel="stylesheet" href="css/site.css">', '<style>\n' + css + '</style>')
MIME = {'.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg'}
cache = {}


def data_uri(rel):
    if rel not in cache:
        ext = os.path.splitext(rel)[1]
        cache[rel] = f'data:{MIME[ext]};base64,' + base64.b64encode(open(SP + rel, 'rb').read()).decode()
    return cache[rel]


def pairs(lst):
    out = []
    for part in lst.split(','):
        part = part.strip()
        if not part:
            continue
        a, b = ([x.strip() for x in part.split(' as ')] if ' as ' in part else (part, part))
        out.append((a, b))
    return out


IMP = re.compile(r'^import\s*\{([^}]*)\}\s*from\s*[\'"]([^\'"]+)[\'"];?[ \t]*$', re.M)
IMP_NS = re.compile(r'^import\s*\*\s*as\s*(\w+)\s*from\s*[\'"]([^\'"]+)[\'"];?[ \t]*$', re.M)
EXP_FROM = re.compile(r'^export\s*\{([^}]*)\}\s*from\s*[\'"]([^\'"]+)[\'"];?[ \t]*$', re.M)
EXP = re.compile(r'^export\s*\{([^}]*)\};?[ \t]*$', re.M)
EXP_DECL = re.compile(r'^export\s+((?:async\s+)?function\*?|class|const|let|var)\s+(\w+)', re.M)


def wrap(src, sources):
    """Turn an ES module into an IIFE. sources: specifier -> JS expression of an exports object."""
    head, ret = [], []
    for m in IMP.finditer(src):
        head.append('const {' + ', '.join(a if a == b else f'{a}: {b}' for a, b in pairs(m.group(1))) + '} = ' + sources[m.group(2)] + ';')
    for m in IMP_NS.finditer(src):
        head.append(f'const {m.group(1)} = {sources[m.group(2)]};')
    for m in EXP_FROM.finditer(src):
        for a, b in pairs(m.group(1)):
            ret.append(f'{b}: {sources[m.group(2)]}.{a}')
    for m in EXP.finditer(src):
        for a, b in pairs(m.group(1)):
            ret.append(f'{b}: {a}')
    for m in EXP_DECL.finditer(src):
        ret.append(f'{m.group(2)}: {m.group(2)}')
    body = IMP.sub('', src); body = IMP_NS.sub('', body); body = EXP_FROM.sub('', body); body = EXP.sub('', body)
    body = re.sub(r'^export\s+(?=(?:async\s+)?function|class|const|let|var)', '', body, flags=re.M)
    assert not re.search(r'^\s*(import|export)\b', body, re.M), 'unhandled import/export'
    return '(() => {\n' + '\n'.join(head) + '\n' + body + '\nreturn {' + ', '.join(ret) + '};\n})()'


rd = lambda p: open(SP + p).read()
st3d = rd('js/station3d.js')
for rel in ['media/station-real.webp', 'media/gun-l.png', 'media/gun-r.png']:
    st3d = st3d.replace(f"'{rel}'", "'" + data_uri(rel) + "'")
assert not re.search(r"'media/", st3d), 'unresolved media in station3d'
code = '\n'.join([
    'const __core = ' + wrap(rd('js/vendor/three.core.js'), {}) + ';',
    'const __three = ' + wrap(rd('js/vendor/three.module.js'), {'./three.core.js': '__core'}) + ';',
    'const __room = ' + wrap(rd('js/vendor/RoomEnvironment.js'), {'three': '__three'}) + ';',
    'const __st3d = ' + wrap(st3d, {'three': '__three', './vendor/RoomEnvironment.js': '__room'}) + ';',
])
m = re.search(r'<script type="module" src="js/main.js"></script>', html)
page_mod = rd('js/main.js').replace("import { createStation3D } from './station3d.js';", 'const { createStation3D } = __st3d;')
assert 'import ' not in page_mod
inner = code + '\n' + page_mod
assert '</script' not in inner
html = html[:m.start()] + '@@MODULE@@' + html[m.end():]
html = html.replace('<script type="importmap">{"imports":{"three":"./js/vendor/three.module.js"}}</script>', '')
for rel in ['js/vendor/lenis.min.js', 'js/app.js', 'js/uz-geo.js', 'js/locations.js', 'js/partner.js', 'js/i18n.js']:
    tag = f'<script src="{rel}"></script>'
    assert tag in html, tag
    src = rd(rel); assert '</script' not in src
    html = html.replace(tag, '<script>\n' + src + '\n</script>')
html = re.sub(r'((?:src|href)=")((?:media|brand)/[^"]+)(")', lambda m: m.group(1) + data_uri(m.group(2)) + m.group(3), html)
html = re.sub(r'(url\()((?:media|brand)/[^)]+)(\))', lambda m: m.group(1) + data_uri(m.group(2)) + m.group(3), html)
FONT = open(SP + 'tools/font-inline.css').read()  # Inter Tight variable woff2 as base64 (the single file works offline)
for l in ['<link rel="preconnect" href="https://fonts.googleapis.com">', '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
          '<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&display=swap" rel="stylesheet">']:
    assert l in html, l
    html = html.replace(l, '')
html = html.replace('</head>', '<style>' + FONT + '</style>\n</head>', 1)
html = html.replace('@@MODULE@@', '<script type="module">\n' + inner + '\n</script>')
left = re.findall(r'(?:src|href)="((?:media|brand|js)/[^"]+)"|url\(((?:media|brand)/[^)]+)\)', html)
assert not left, left
if '--pages' in sys.argv:  # demo copy on GitHub Pages: own preview URL, hidden from search engines
    G = 'https://tsoyanatoliy7.github.io/energocharge/'
    html = html.replace('<meta property="og:url" content="https://energocharge.uz/">', f'<meta property="og:url" content="{G}">')
    html = html.replace('<meta property="og:image" content="https://energocharge.uz/media/og.jpg">', f'<meta property="og:image" content="{G}og.jpg">')
    html = html.replace('<meta name="description"', '<meta name="robots" content="noindex">\n<meta name="description"', 1)
open(OUT, 'w').write(html)
print(len(html) // 1024, 'KB')
