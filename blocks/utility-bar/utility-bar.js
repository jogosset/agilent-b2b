export default function decorate(block) {
  const [labelRow, ...linkRows] = [...block.children];

  const label = document.createElement('span');
  label.className = 'utility-bar-label';
  label.textContent = labelRow?.textContent.trim() || '';

  const list = document.createElement('div');
  list.className = 'utility-bar-links';
  linkRows.forEach((row) => {
    row.className = 'utility-bar-item';
    list.append(row);
  });

  block.replaceChildren(label, list);
}
