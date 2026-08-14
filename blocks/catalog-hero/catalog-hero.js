/**
 * Draws an animated chromatogram trace onto the given canvas, mirroring the
 * agilent-ecommerce.html prototype. Respects prefers-reduced-motion.
 * @param {HTMLCanvasElement} canvas
 */
function animateChromatogram(canvas) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const baseline = h - 40;
  const peak = (x, center, width, height) => {
    const d = (x - center) / width;
    return height * Math.exp(-(d * d));
  };
  const traceY = (x) => baseline
    - peak(x, w * 0.18, 26, 40)
    - peak(x, w * 0.46, 34, 130)
    - peak(x, w * 0.74, 22, 70)
    - peak(x, w * 0.6, 10, 18);

  const draw = (progress) => {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, baseline);
    ctx.lineTo(w - 20, baseline);
    ctx.stroke();

    const endX = 30 + (w - 60) * progress;
    ctx.strokeStyle = '#d9700c';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let x = 30; x <= endX; x += 2) {
      const y = traceY(x);
      if (x === 30) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    if (progress > 0.98) {
      ctx.fillStyle = '#8ea6bb';
      ctx.font = '10px monospace';
      ctx.fillText('2.1 min', w * 0.14, h - 18);
      ctx.fillText('4.6 min', w * 0.42, h - 18);
      ctx.fillText('7.3 min', w * 0.70, h - 18);
    }
  };

  if (reduce) {
    draw(1);
    return;
  }

  let start = null;
  const duration = 1600;
  const frame = (ts) => {
    if (!start) start = ts;
    const progress = Math.min(1, (ts - start) / duration);
    draw(progress);
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

/**
 * Builds the scope panel (live chromatogram + spec chips) from the block's
 * second authored row, where each cell is authored as `**Label** value`.
 * @param {Element} specsRow
 * @returns {HTMLDivElement}
 */
function buildScopePanel(specsRow) {
  const specs = specsRow
    ? [...specsRow.children].map((cell) => {
      const label = cell.querySelector('strong')?.textContent.trim() || '';
      const value = cell.textContent.replace(label, '').trim();
      return { label, value };
    })
    : [];

  const panel = document.createElement('div');
  panel.className = 'catalog-hero-scope';
  panel.innerHTML = `
    <div class="catalog-hero-scope-head">
      <span>LC/MS SIGNAL — CH.1</span>
      <span class="catalog-hero-live">Live trace</span>
    </div>
    <div class="catalog-hero-scope-canvas">
      <canvas width="640" height="380" role="img" aria-label="Chromatogram trace showing three resolved peaks"></canvas>
    </div>
    <div class="catalog-hero-specs">
      ${specs.map((s) => `<div><div class="k">${s.label}</div><div class="v">${s.value}</div></div>`).join('')}
    </div>
  `;
  return panel;
}

export default function decorate(block) {
  const [contentRow, specsRow] = [...block.children];

  const content = document.createElement('div');
  content.className = 'catalog-hero-content';
  const cell = contentRow?.firstElementChild;
  if (cell) {
    while (cell.firstElementChild) content.append(cell.firstElementChild);
  }

  const paragraphs = [...content.querySelectorAll('p')];

  // first paragraph containing a link becomes the quick-order form
  const primaryPara = paragraphs.find((p) => p.querySelector('a'));
  const primaryLink = primaryPara?.querySelector('a');
  if (primaryPara && primaryLink) {
    const form = document.createElement('form');
    form.className = 'catalog-hero-quick-order';
    form.action = primaryLink.getAttribute('href') || '#';
    const label = primaryLink.textContent.trim() || 'Add to cart';
    form.innerHTML = `
      <input type="text" name="sku" placeholder="Enter part number — e.g. 959941-902" aria-label="Quick order by part number" />
      <button type="submit">${label}</button>
    `;
    primaryPara.replaceWith(form);
  }

  // remaining paragraph with links becomes the secondary link row
  const secondaryPara = paragraphs.find((p) => p !== primaryPara && p.querySelector('a'));
  secondaryPara?.classList.add('catalog-hero-links');

  // Everything else, in authored order, is [eyebrow, heading, lede...].
  // If the heading wasn't authored as a real <h1>/<h2>, promote the second
  // plain paragraph so the CSS (and page title) always has a real heading.
  const plainParagraphs = paragraphs.filter((p) => p !== primaryPara && p !== secondaryPara);
  let heading = content.querySelector('h1, h2');
  let eyebrow;
  let lede;
  if (heading) {
    eyebrow = heading.previousElementSibling?.tagName === 'P' ? heading.previousElementSibling : null;
    lede = plainParagraphs.find((p) => p !== eyebrow && p !== heading) || null;
  } else if (plainParagraphs.length) {
    [eyebrow] = plainParagraphs;
    const headingPara = plainParagraphs[1];
    if (headingPara) {
      heading = document.createElement('h1');
      heading.append(...headingPara.childNodes);
      headingPara.replaceWith(heading);
    }
    lede = plainParagraphs[2] || null;
  }
  eyebrow?.classList.add('catalog-hero-eyebrow');
  lede?.classList.add('catalog-hero-lede');

  const scope = buildScopePanel(specsRow);
  block.replaceChildren(content, scope);

  animateChromatogram(scope.querySelector('canvas'));
}
