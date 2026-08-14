export default function decorate(block) {
  const rows = [...block.children];
  // positional model: first row is always the banner (image + heading),
  // an optional last row with a link is the CTA, everything else is a blurb
  const bannerRow = rows[0];
  const lastRow = rows[rows.length - 1];
  const ctaRow = rows.length > 1 && lastRow !== bannerRow && lastRow?.querySelector('a') ? lastRow : undefined;
  const blurbRows = rows.filter((r) => r !== bannerRow && r !== ctaRow);

  const banner = document.createElement('div');
  banner.className = 'agilent-sustainability-banner';
  const img = bannerRow?.querySelector('img');
  if (img) {
    banner.append(bannerRow.querySelector('picture') || img);
  }
  const heading = document.createElement('h2');
  const headingCell = [...(bannerRow?.children || [])].find((c) => !c.querySelector('img'));
  heading.textContent = headingCell?.textContent.trim() || '';
  banner.append(heading);

  const blurbs = document.createElement('div');
  blurbs.className = 'agilent-sustainability-blurbs';
  blurbRows.forEach((row) => {
    const [iconCell, textCell] = row.children;
    const item = document.createElement('div');
    item.className = 'agilent-sustainability-blurb';
    if (iconCell) item.append(iconCell);
    const p = document.createElement('p');
    p.textContent = (textCell || row).textContent.trim();
    item.append(p);
    blurbs.append(item);
  });

  if (ctaRow) {
    const link = ctaRow.querySelector('a');
    link.classList.add('agilent-sustainability-cta');
    blurbs.append(link);
  }

  block.replaceChildren(banner, blurbs);
}
