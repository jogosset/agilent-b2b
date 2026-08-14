/**
 * Splits flat "Name — description — count" text into structured markup when
 * the author didn't (or couldn't) apply real heading/bold formatting.
 * @param {Element} textCell
 */
function ensureStructure(textCell) {
  if (textCell.querySelector('h3')) return;
  const raw = textCell.textContent.trim();
  if (!raw) return;
  const [name, description, count] = raw.split('—').map((part) => part.trim());
  textCell.innerHTML = `
    <h3>${name || raw}</h3>
    ${description ? `<p>${description}</p>` : ''}
    ${count ? `<p><strong>${count}</strong></p>` : ''}
  `;
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'category-grid-tile';
    const [iconCell, textCell] = row.children;
    iconCell?.classList.add('category-grid-icon');
    if (textCell) {
      textCell.classList.add('category-grid-text');
      ensureStructure(textCell);
    }
  });
}
