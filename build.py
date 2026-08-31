"""Build index.html and the server price list from products.json.

Prices are integer cents everywhere — the page, the cart and Stripe all speak
the same unit, so nothing has to be re-rounded on the way through.
"""
import json, html as H
from pathlib import Path

SP = Path('/private/tmp/claude-501/-Users-petrubirgauan-Documents-Marketing-Seite-/ac85bb0c-07d1-4150-a686-28289f96d0c4/scratchpad')
ROOT = Path('/Users/petrubirgauan/Documents/Marketing Seite')
products = json.loads(SP.joinpath('products.json').read_text(encoding='utf-8'))

ROWS = [
    ('trading', 'Trading', 'Charts, risk and funded accounts — from the first setup to running a bot.', '#2a1a3d,#161226', 'TR'),
    ('dropshipping', 'Dropshipping', 'Product, supplier, store and the work that starts after the first order lands.', '#123536,#101f26', 'DS'),
    ('ads', 'Paid advertising', 'Meta, TikTok and Google. Structure, creative testing and scaling without losing the return.', '#3a1c1c,#231314', 'AD'),
    ('content', 'Content & social', 'Short-form, long-form and personal brand — attention you do not have to buy.', '#37203a,#1e1524', 'CS'),
    ('ai', 'AI & automation', 'Workflows that run without you, and an honest view of where automation stops helping.', '#153228,#101f1a', 'AI'),
    ('agency', 'Agency & freelancing', 'Finding clients, pricing the work and running the calls that close it.', '#1e2c3d,#141b26', 'AG'),
    ('copy', 'Copy & email', 'Words that carry revenue — sequences, offers and headlines.', '#3b2a15,#231a10', 'CP'),
]

ICON = {
 'user': '<svg class="ico" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
 'play': '<svg class="ico" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
 'layers': '<svg class="ico" viewBox="0 0 24 24"><polygon points="12 3 21 8 12 13 3 8 12 3"/><polyline points="3 14 12 19 21 14"/></svg>',
 'tag': '<svg class="ico" viewBox="0 0 24 24"><path d="M20.6 13.4 12 22l-9-9V4h9l8.6 8.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.2"/></svg>',
}

def euro(c):
    return f"€{c/100:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')

catalogue = {}   # sku -> (name, cents) for the server
cards = {}
lowest, highest = 10**9, 0
deals = 0

for p in products:
    row = next(r for r in ROWS if r[0] == p['cat'])
    a, b = row[3].split(',')
    multi = len(p['variants']) > 1

    opts, first = [], None
    for label, cents, was in p['variants']:
        sku = f"{p['id']}-{label.lower().replace(' ', '-')}" if label else p['id']
        name = f"{p['title']} — {label}" if label else p['title']
        catalogue[sku] = (name, cents)
        if cents > 0:
            lowest, highest = min(lowest, cents), max(highest, cents)
        if first is None:
            first = sku
        opts.append(
            f'<button class="vopt{" on" if sku == first else ""}" data-sku="{sku}" '
            f'data-price="{cents}" data-was="{was or ""}" '
            f'data-name="{H.escape(name)}">{H.escape(label or "Standard")}</button>')

    prices = [c for _l, c, _w in p['variants'] if c > 0]
    on_offer = any(w for _l, _c, w in p['variants'])
    if on_offer:
        deals += 1
    entry = bool(prices) and min(prices) < 5000

    label0, cents0, was0 = p['variants'][0]
    sku0 = first
    name0 = f"{p['title']} — {label0}" if label0 else p['title']

    price_html = (f'<span class="was">{euro(was0)}</span> ' if was0 else '') + \
                 (f'<span class="now">{euro(cents0)}</span>' if cents0 else '<span class="now free">Free</span>')

    variants = f'<div class="variants" role="group" aria-label="Variant">{"".join(opts)}</div>' if multi else ''

    meta = [f'<span>{ICON["play"]}Self-paced</span>']
    if multi:
        meta.append(f'<span>{ICON["layers"]}{len(p["variants"])} variants</span>')
    meta.append(f'<span>{ICON["tag"]}{row[1]}</span>')

    add = (f'<button class="btn btn-soft add" data-id="{sku0}" data-name="{H.escape(name0)}" '
           f'data-price="{cents0}">Add</button>') if cents0 > 0 else \
          '<button class="btn btn-soft add" data-id="{}" data-name="{}" data-price="0" disabled>Free</button>'.format(sku0, H.escape(name0))

    cards.setdefault(p['cat'], []).append(f'''        <article class="card" data-cat="{p['cat']}"
          data-deal="{int(on_offer)}" data-entry="{int(entry)}"
          data-search="{H.escape((p['title'] + ' ' + p['desc'] + ' ' + row[1]).lower())}">
          <div class="thumb" style="background:linear-gradient(135deg,{a},{b})">
            <span class="thumb-mono">{row[4]}</span>
            <span class="thumb-badge">TM</span>
          </div>
          <h3>{H.escape(p['title'])}</h3>
          <p class="card-by">{ICON['user']}Top Marketing</p>
          <p class="card-desc">{H.escape(p['desc'])}</p>
          {variants}
          <p class="card-meta">{"".join(meta)}</p>
          <div class="card-buy">
            <span class="card-price">{price_html}</span>
            {add}
          </div>
        </article>''')

rows_html = []
for key, title, blurb, _g, _m in ROWS:
    rows_html.append(f'''    <section class="row" data-row="{key}">
      <div class="row-head">
        <div>
          <h2>{title}</h2>
          <p>{blurb}</p>
        </div>
        <div class="arrows">
          <button class="arrow" data-scroll="-1" aria-label="Previous">
            <svg class="ico" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button class="arrow" data-scroll="1" aria-label="Next">
            <svg class="ico" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      <div class="track">
{chr(10).join(cards[key])}
      </div>
    </section>''')

page = SP.joinpath('index.tmpl').read_text(encoding='utf-8')
page = (page.replace('<!--ROWS-->', "\n\n".join(rows_html))
            .replace('{{COURSES}}', str(len(products)))
            .replace('{{SKUS}}', str(len(catalogue)))
            .replace('{{LOW}}', euro(lowest))
            .replace('{{HIGH}}', euro(highest))
            .replace('{{DEALS}}', str(deals)))
ROOT.joinpath('index.html').write_text(page, encoding='utf-8')

lines = "\n".join(f'  {json.dumps(sku)}: {{ name: {json.dumps(name)}, cents: {cents} }},'
                  for sku, (name, cents) in catalogue.items())
ROOT.joinpath('api/_catalogue.js').write_text(f'''// Generated from products.json — the authoritative price list, in cents.
// The browser never sets prices: /api/payment-intent looks every sku up here.
// Rebuild this file whenever a price on the page changes.

export const CATALOGUE = {{
{lines}
}};

// Same codes the cart shows. Applied server-side so an edited page cannot
// invent a discount.
export const CODES = {{ LAUNCH20: 0.20, STUDENT10: 0.10 }};
''', encoding='utf-8')

print(f'{len(products)} Produkte, {len(catalogue)} kaufbare Varianten, {euro(lowest)}–{euro(highest)}')
