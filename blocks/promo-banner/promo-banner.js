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

  block.replaceChildren(tag, content);
}
