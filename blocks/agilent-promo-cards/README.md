# Agilent Promo Cards

Small image + copy + button cards matching agilent.com/en's row of 3 secondary promotions
below the large promo tiles.

## Content model

Collection block — one row per card, 2 cells: image (or empty for a placeholder), rich text
(description paragraph + a paragraph containing only a link, which becomes the button).

## Configuration

None — all content is authored.

## Integration

No URL parameters, localStorage, events, or drop-in dependencies.

## Behavior

Stacked on mobile, 3-up at 900px+. Missing images render a neutral placeholder box.
