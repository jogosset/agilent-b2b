function buildPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.className = 'agilent-quick-order-placeholder';
  placeholder.setAttribute('aria-hidden', 'true');
  placeholder.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="4" width="18" height="16" rx="1"></rect><path d="M3 15l5-5 4 4 3-3 6 6"></path><circle cx="8" cy="9" r="1.5"></circle></svg>';
  return placeholder;
}

export default function decorate(block) {
  const rows = [...block.children];
  const headingRow = rows.find((r) => !r.querySelector('a') && !r.querySelector('img'));
  const mediaRow = rows.find((r) => r.querySelector('img'));
  const linksRow = rows.find((r) => r.querySelector('a'));

  const wrap = document.createElement('div');
  wrap.className = 'agilent-quick-order-inner';

  const content = document.createElement('div');
  content.className = 'agilent-quick-order-content';

  const heading = document.createElement('h2');
  heading.textContent = headingRow?.textContent.trim() || 'Quick orders';
  content.append(heading);

  const label = document.createElement('label');
  label.className = 'agilent-quick-order-field-label';
  label.textContent = 'Enter Part number';
  label.setAttribute('for', 'agilent-quick-order-input');

  const field = document.createElement('div');
  field.className = 'agilent-quick-order-field';
  field.innerHTML = '<input id="agilent-quick-order-input" type="text" placeholder="Enter Part Number" />';

  const actions = document.createElement('div');
  actions.className = 'agilent-quick-order-actions';
  const links = linksRow ? [...linksRow.querySelectorAll('a')] : [];
  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'agilent-quick-order-add';
  addButton.textContent = links[0]?.textContent.trim() || 'Add to cart';

  const multiLink = document.createElement('a');
  multiLink.className = 'agilent-quick-order-multi';
  multiLink.href = links[1]?.getAttribute('href') || '#';
  multiLink.innerHTML = `${links[1]?.textContent.trim() || 'Add multiple items'} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg>`;

  actions.append(addButton, multiLink);
  content.append(label, field, actions);

  const media = document.createElement('div');
  media.className = 'agilent-quick-order-media';
  const img = mediaRow?.querySelector('img');
  media.append(img ? mediaRow.querySelector('picture') || img : buildPlaceholder());

  wrap.append(content, media);
  block.replaceChildren(wrap);
}
