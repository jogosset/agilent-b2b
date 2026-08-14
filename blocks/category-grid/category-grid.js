export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'category-grid-tile';
    const [iconCell, textCell] = row.children;
    iconCell?.classList.add('category-grid-icon');
    textCell?.classList.add('category-grid-text');
  });
}
