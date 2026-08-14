export default function decorate(block) {
  const rows = [...block.children];
  const bannerRow = rows.find((r) => r.querySelector('img'));
  const ctaRow = rows.find((r) => r.querySelector('a') && r !== bannerRow);
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
