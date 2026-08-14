function ensureHeading(cell) {
  if (cell.querySelector('h1, h2, h3, h4')) return;
  const first = cell.querySelector('p');
  if (!first) return;
  const heading = document.createElement('h3');
  heading.append(...first.childNodes);
  first.replaceWith(heading);
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'agilent-promo-tiles-tile';
    const cell = row.firstElementChild;
    if (!cell) return;
    cell.className = 'agilent-promo-tiles-content';
    ensureHeading(cell);

    const linkPara = [...cell.querySelectorAll('p')].find((p) => {
      const a = p.querySelector('a');
      return a && p.textContent.trim() === a.textContent.trim();
    });
    linkPara?.classList.add('agilent-promo-tiles-link');
  });
}
