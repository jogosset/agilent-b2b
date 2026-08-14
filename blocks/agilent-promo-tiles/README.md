# Agilent Promo Tiles

Large dark-navy promo tiles matching agilent.com/en's "Featured products and promotions"
section — heading, short copy, and an arrow text-link (not a button).

## Content model

Collection block — one row per tile, 1 cell: heading paragraph (promoted to `<h3>` if not
already a heading), body paragraph, and a paragraph containing only a link (the arrow CTA).

## Configuration

None — all content is authored.

## Integration

No URL parameters, localStorage, events, or drop-in dependencies.

## Behavior

Stacked on mobile, 2-up at 900px+. Always renders on the navy background regardless of
authored content (matches the real site's fixed dark promo treatment).
