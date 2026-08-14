# Footer

Global site footer. Loads its content from a shared `/footer` fragment page and, on multistore sites, renders a store-switcher button that opens a modal listing available store views.

## Content model

No block-level authoring — content comes entirely from the `/footer` fragment document (or the path in the `footer` page metadata, if set).

## Configuration

- Page metadata `footer`: overrides the default `/footer` fragment path.

## Integration

- Reads store/multistore config via `@dropins/tools/lib/aem/configs.js` (`getRootPath`, `isMultistore`).
- On multistore sites, loads a second fragment (`/store-switcher`) and renders it inside a modal (`blocks/modal`).
- No URL parameters or localStorage usage.

## Behavior

- Single-store sites: renders the footer fragment as-is.
- Multistore sites: adds a store-switcher button; clicking it opens a modal with the store list, grouped by region, keyboard-accessible (Enter/Space toggles a region's expanded state).
- If the store-switcher fragment fails to load, the footer bails out silently (logs an error, renders nothing further) rather than showing a broken switcher.

## Agilent brand reskin

CSS-only: brand blue background, light text/links, mono-styled section headings. No structural changes.
