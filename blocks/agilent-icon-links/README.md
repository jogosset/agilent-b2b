# Agilent Icon Links

Icon + label row matching agilent.com/en's "Featured applications and industries" module.
Generic and reusable anywhere a compact icon-linked list is needed.

## Content model

Collection block — one row per item, 2 cells: icon (`:icon-name:`), label (plain text or a
link).

## Configuration

None — all content is authored.

## Integration

No URL parameters, localStorage, or events. Icons resolve through the standard
`:icon-name:` → `decorateIcons` pipeline; no drop-in dependencies.

## Behavior

2 columns on mobile, 4 at 600px+, 7 at 900px+ (matches the real site's single-row desktop
layout for 7 items — grids gracefully wrap for other counts).
