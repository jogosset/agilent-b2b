/**
 * Splits flat "Heading — description" text into structured markup when the
 * author didn't (or couldn't) apply real heading formatting.
 * @param {Element} textCell
 */
function ensureStructure(textCell) {
  if (textCell.querySelector('h3')) return;
  const raw = textCell.textContent.trim();
  if (!raw) return;
  const [name, ...rest] = raw.split('—').map((part) => part.trim());
  const description = rest.join(' — ');
  textCell.innerHTML = `
    <h3>${name || raw}</h3>
    ${description ? `<p>${description}</p>` : ''}
  `;
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'value-props-item';
    const [iconCell, textCell] = row.children;
    iconCell?.classList.add('value-props-icon');
    if (textCell) {
      textCell.classList.add('value-props-text');
      ensureStructure(textCell);
    }
  });
}
