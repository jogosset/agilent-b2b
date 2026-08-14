# Agilent News Grid

News/press-release cards matching agilent.com/en's "News" module: image, tag pill, and
headline (optionally linked).

## Content model

Collection block — one row per card, 2 cells: image (optional — omit for a placeholder box),
content authored as flat text `Tag | Headline` (e.g. `Press release | Agilent Research
Catalyst Award Presented to Eastern Institute of Technology, Ningbo`). Add a link anywhere in
the content cell to make the headline clickable.

## Configuration

None — all content is authored.

## Integration

No URL parameters, localStorage, events, or drop-in dependencies.

## Behavior

Single column on mobile, 3-up at 900px+. Missing images render a neutral placeholder box.
