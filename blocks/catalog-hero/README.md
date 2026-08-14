# Catalog Hero

Homepage hero: eyebrow, heading, lede, a quick-order-by-part-number form, secondary links, and a live-animated chromatogram panel with spec chips.

## Content model

- Row 1 (1 cell): eyebrow paragraph, H1, body paragraph, a link (becomes the quick-order submit target), a paragraph with secondary links.
- Row 2 (up to 3 cells): spec chips authored as `**Label** value`.

## Configuration

None — all content is authored. The first link in row 1 controls the quick-order form's `action` and button label.

## Integration

- No URL parameters, localStorage, or drop-in dependencies.
- Draws an animated chromatogram trace to a `<canvas>` on decorate; respects `prefers-reduced-motion` (draws the final frame instantly instead of animating).

## Behavior

Quick-order form is decoration-injected (input + button); it does not perform SKU lookup itself — it submits to the authored link's URL. No error states beyond standard form submission.
