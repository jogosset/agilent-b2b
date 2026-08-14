/**
 * Content model (Tab-friendly, sparse leading cell):
 *   cell 1: "icon-name | Group heading" — only filled on the first row of a
 *           new group, left empty for subsequent links in the same group.
 *   cell 2: a link (or plain text) belonging to the current group.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const wrap = document.createElement('div');
  wrap.className = 'agilent-services-groups';
  let currentList = null;

  rows.forEach((row) => {
    const [metaCell, linkCell] = row.children;
    const metaText = metaCell?.textContent.trim();

    if (metaText) {
      const [iconName, heading] = metaText.split('|').map((s) => s.trim());
      const group = document.createElement('div');
      group.className = 'agilent-services-group';
      group.innerHTML = `<span class="icon icon-${iconName}"></span><h3>${heading || iconName}</h3>`;
      currentList = document.createElement('ul');
      currentList.className = 'agilent-services-links';
      group.append(currentList);
      wrap.append(group);
    }

    if (currentList && linkCell) {
      const li = document.createElement('li');
      const link = linkCell.querySelector('a');
      if (link) li.append(link);
      else li.textContent = linkCell.textContent.trim();
      currentList.append(li);
    }
  });

  block.replaceChildren(wrap);
}
