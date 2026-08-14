export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'value-props-item';
    const [iconCell, textCell] = row.children;
    iconCell?.classList.add('value-props-icon');
    textCell?.classList.add('value-props-text');
  });
}
