export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'agilent-category-grid-tile';
    const [mediaCell, labelCell] = row.children;

    if (mediaCell) {
      mediaCell.className = 'agilent-category-grid-media';
      if (!mediaCell.querySelector('img')) mediaCell.remove();
    }

    if (labelCell) {
      labelCell.className = 'agilent-category-grid-label';
    }
  });
}
