# Agilent Product Carousel

Horizontally-scrollable product card carousel matching agilent.com/en's "Recently viewed"
module (and reusable anywhere a product scroller is needed).

## Content model

Collection block — one row per product, 2 cells: image (optional — omit for a placeholder
box), rich text (heading paragraph, promoted to `<h3>` if not already a heading, plus a
description paragraph).

## Configuration

None — all content is authored.

## Integration

No URL parameters, localStorage, events, or drop-in dependencies. Not connected to real
"recently viewed" tracking — cards are fully author-controlled.

## Behavior

Horizontal scroll-snap track with prev/next arrow buttons that scroll by one card width.
Arrows hide automatically when there's only one card. Missing images render a neutral
placeholder box.
