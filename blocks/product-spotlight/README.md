# Product Spotlight

Dark full-bleed banner for a single featured instrument: eyebrow, heading, copy, spec chips, and primary/secondary CTAs, with a decorative instrument-panel graphic.

## Content model

- Row 1 (1 cell): eyebrow, H2, body paragraph, primary CTA link (bold), secondary CTA link (plain or italic).
- Row 2 (up to 3 cells): spec chips authored as `**Label** value`.

## Configuration

None — all content is authored. CTA styling (`.button`/`.button.primary`) follows the repo's standard bold/italic buttonization convention from `decorateButtons`.

## Integration

No URL parameters, localStorage, events, or drop-in dependencies. The visual panel is a static inline SVG, not an authored image.

## Behavior

Single column on mobile, two columns (copy | visual) at 900px+.
