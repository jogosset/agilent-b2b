# Agilent Sustainability

Full-bleed photo banner + 4-column icon blurbs + CTA, matching agilent.com/en's
"Empowering a sustainable future for our planet" module.

## Content model

Standalone block:
- Row 1: image (optional) + heading text — the banner.
- Middle rows: icon (optional) + blurb text — one per column.
- Last row (contains a link): the "Read more" CTA.

## Configuration

None — all content is authored.

## Integration

No URL parameters, localStorage, or events. Icons resolve through the standard
`:icon-name:` pipeline; no drop-in dependencies.

## Behavior

Banner is full-bleed edge to edge; blurbs + CTA stay within the page's normal content width.
2-column blurb grid on mobile, 4-column + inline CTA at 900px+. No banner image authored →
renders on a neutral dark gradient instead of a broken image.
