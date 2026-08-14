# Agilent Services

Icon + heading + chevron-link-list groups matching agilent.com/en's "Services and support"
column layout (Maintenance and repair / Training / Support). Scoped to the link-groups only
— the real page's testimonial image and "Find resources" search were left out of this pass.

## Content model

Collection block with a sparse leading cell, designed to be fast to author by tabbing
through a table:
- Cell 1: `icon-name | Group heading` — only filled on the **first** row of a new group
  (e.g. `check-shield | Maintenance and repair`); leave blank for the rest of that group's
  links.
- Cell 2: a link (or plain text) belonging to the current group.

## Configuration

None — grouping is inferred from which rows have a filled first cell.

## Integration

No URL parameters, localStorage, or events. Icons resolve through the standard
`:icon-name:` → `decorateIcons` pipeline; no drop-in dependencies.

## Behavior

Single column on mobile, 3-column at 900px+. A row with an empty first cell always attaches
to whichever group came before it — the very first row must have cell 1 filled.
