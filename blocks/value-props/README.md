# Value Props

Centered 4-up icon grid for short trust/value statements (e.g. "Validated methods").

## Content model

Collection block — one row per item, 2 cells: icon (`:icon-name:`), rich text (H3 heading + description paragraph).

## Configuration

None — all content is authored.

## Integration

No URL parameters, localStorage, or events. Icons resolve through the standard `:icon-name:` → `decorateIcons` pipeline; no drop-in dependencies.

## Behavior

2-column grid on mobile, 4-column at 900px+. No interactive states.
