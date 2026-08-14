# Category Grid

"Shop by technique" tile grid — icon, linked heading, description, and a trailing bold product count per tile.

## Content model

Collection block — one row per tile, 2 cells: icon (`:icon-name:`), rich text (linked `<h3>` + `<p>` description + bold count).

## Configuration

None — all content is authored.

## Integration

No URL parameters, localStorage, or events. Icons resolve through the standard `:icon-name:` → `decorateIcons` pipeline; no drop-in dependencies.

## Behavior

2-column grid on mobile, 3-column at 720px+. Tiles highlight on hover.
