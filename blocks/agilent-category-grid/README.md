# Agilent Category Grid

"Browse by category" tile grid matching agilent.com/en: optional product image above a
centered label, highlighting on hover. Some tiles have no image, matching the real site.

## Content model

Collection block — one row per category, 2 cells: image (optional — omit for a text-only
tile, matching real tiles like "Liquid Chromatography"), label (plain text or a link).

## Configuration

None — all content is authored.

## Integration

No URL parameters, localStorage, events, or drop-in dependencies.

## Behavior

2 columns on mobile, 3 at 600px+, 5 at 900px+ (matches the real site's 5-column desktop
grid). No image authored → the tile renders as centered text only, no placeholder box.
