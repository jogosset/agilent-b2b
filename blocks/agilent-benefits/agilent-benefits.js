export default function decorate(block) {
  const rows = [...block.children];
  const wrap = document.createElement('div');
  wrap.className = 'agilent-benefits-inner';

  const list = document.createElement('ul');
  list.className = 'agilent-benefits-list';

  const actions = document.createElement('div');
  actions.className = 'agilent-benefits-actions';

  let headingSet = false;

  rows.forEach((row) => {
    const cells = [...row.children];
    const links = cells.filter((c) => c.querySelector('a'));

    if (cells.length >= 2 && links.length >= 2) {
      // CTA row: each cell with a link becomes an action button
      links.forEach((cell, i) => {
        const a = cell.querySelector('a');
        a.classList.add(i === 0 ? 'agilent-benefits-button-primary' : 'agilent-benefits-button-secondary');
        actions.append(a);
      });
      return;
    }

    if (!headingSet && !row.querySelector('a')) {
      const heading = document.createElement('h2');
      heading.className = 'agilent-benefits-heading';
      heading.textContent = row.textContent.trim();
      wrap.append(heading);
      headingSet = true;
      return;
    }

    const li = document.createElement('li');
    li.className = 'agilent-benefits-item';
    li.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M8 12l3 3 5-6"></path></svg>';
    const text = document.createElement('span');
    text.textContent = row.textContent.trim();
    li.append(text);
    list.append(li);
  });

  wrap.append(list, actions);
  block.replaceChildren(wrap);
}
