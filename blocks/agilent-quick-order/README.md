# Agilent Quick Order

"Quick orders" panel matching agilent.com/en: part-number input + Add to cart + Add multiple
items, with a supporting image. Presentational shell only — no cart/commerce wiring (this
project's real quick-order flow lives on the dedicated `/quick-order` page).

## Content model

Standalone block, 3 rows:
- Row 1 (1 cell, no link/image): heading text.
- Row 2 (1 cell): image (optional — omit for a placeholder box).
- Row 3 (1 cell with 2 links): first link's text becomes the "Add to cart" button label,
  second becomes the "Add multiple items" link (both keep their authored `href`).

## Configuration

None — all content is authored.

## Integration

No URL parameters, localStorage, or events. Intentionally has no drop-in dependency — it's a
presentational match of the real site's module, not a functional cart integration.

## Behavior

Stacked on mobile, content | image two-column at 900px+. The "Add to cart" button has no
attached behavior yet (no SKU-lookup backend for this module).
