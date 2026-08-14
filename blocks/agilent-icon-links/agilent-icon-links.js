export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'agilent-icon-links-item';
    const [iconCell, labelCell] = row.children;
    iconCell?.classList.add('agilent-icon-links-icon');
    labelCell?.classList.add('agilent-icon-links-label');
  });
}
