export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'stats-stat';
    const [num, label] = row.children;
    num?.classList.add('stats-num');
    label?.classList.add('stats-label');
  });
}
