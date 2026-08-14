export default function decorate(block) {
  const [row] = [...block.children];
  const [tagCell, textCell] = row?.children || [];

  const tag = document.createElement('span');
  tag.className = 'promo-banner-tag';
  tag.textContent = tagCell?.textContent.trim() || '';

  const content = document.createElement('div');
  content.className = 'promo-banner-content';
  while (textCell?.firstElementChild) content.append(textCell.firstElementChild);

  // paragraph whose only content is a link is the CTA
  const ctaPara = [...content.querySelectorAll('p')].find((p) => {
    const a = p.querySelector('a');
    return a && p.textContent.trim() === a.textContent.trim();
  });
  ctaPara?.classList.add('promo-banner-cta');

  // If the heading wasn't authored as a real heading tag, promote the
  // first remaining plain paragraph so the CSS has a real heading to style.
  if (!content.querySelector('h1, h2, h3, h4')) {
    const headingPara = [...content.querySelectorAll('p')].find((p) => p !== ctaPara);
    if (headingPara) {
      const heading = document.createElement('h3');
      heading.append(...headingPara.childNodes);
      headingPara.replaceWith(heading);
    }
  }

  block.replaceChildren(tag, content);
}
