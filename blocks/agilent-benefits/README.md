# Agilent Benefits

"Unlock your personalized experience" panel matching agilent.com/en: a light-blue card with
a heading, a two-column checklist, and Create account / Sign in actions.

## Content model

Standalone block:
- Row 1 (1 cell, no link): heading text.
- Rows 2..N (1 cell, no link): one checklist benefit per row.
- Last row (2 cells, each containing a link): the two CTAs — first cell becomes the primary
  (solid) button, second becomes the secondary (outline, arrow) button.

## Configuration

None — all content is authored. Row classification is by shape (link count), not by content
model fields.

## Integration

No URL parameters, localStorage, events, or drop-in dependencies.

## Behavior

Single column on mobile; 2-column checklist with heading spanning full width at 900px+.
