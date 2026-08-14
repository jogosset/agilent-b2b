export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'tag-list-items';
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const link = row.querySelector('a');
    if (link) {
      link.className = 'tag-list-chip';
      li.append(link);
    } else {
      li.className = 'tag-list-chip';
      li.textContent = row.textContent.trim();
    }
    ul.append(li);
  });
  block.replaceChildren(ul);
}
