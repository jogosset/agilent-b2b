# Agilent Hero

Full-bleed homepage hero carousel matching agilent.com/en: image + heading + copy + CTA per
slide, with prev/next arrows, dot indicators, and a pause/resume autoplay toggle.

## Content model

Collection block — one row per slide, 2 cells: image (or left empty for a placeholder box),
rich text (heading paragraph, body paragraph, and a paragraph containing only a link, which
becomes the CTA button).

## Configuration

None — all content is authored. If the first paragraph in the content cell isn't a real
heading tag, `decorate()` promotes it to `<h2>` automatically.

## Integration

No URL parameters, localStorage, or drop-in dependencies. Autoplay advances every 6s and
respects `prefers-reduced-motion` (starts paused). No events emitted.

## Behavior

- 1 slide: renders statically, navigation hidden.
- 2+ slides: arrows/dots/pause all functional; clicking a dot or arrow also pauses autoplay
  implicitly only if the visitor clicks the pause button — manual nav does not stop autoplay.
- Missing images render a neutral placeholder box instead of a broken image.
