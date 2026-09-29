// ---------------------------------------------------------------------------
// Small line graphs for 1d. Each is a scatter of points with a trend line
// through them, on labelled axes -- a sketch of real data rather than a bare
// diagonal, so it looks like the graphs students will actually meet.
//
// The points are jittered, but deterministically (seeded from the axis
// labels), so the same graph looks the same every time it comes up and two
// of the four options never differ only by noise.
// ---------------------------------------------------------------------------
const SVG_NS = 'http://www.w3.org/2000/svg';

const GRAPH_W = 200;
const GRAPH_H = 170;
// Plot area: room on the left for the rotated y label, below for the x label.
const PLOT = { left: 34, right: 190, top: 12, bottom: 134 };

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function seededRandom(seedText) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) h = Math.imul(h ^ seedText.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// dir: 'up' or 'down'. Returns an <svg> sized by viewBox, so CSS sets its
// width and it scales cleanly to whatever the answer grid gives it.
function drawGraph({ xLabel, yLabel, dir }) {
  const svg = svgEl('svg', {
    viewBox: `0 0 ${GRAPH_W} ${GRAPH_H}`, class: 'graph', role: 'img',
    'aria-label': `${yLabel} going ${dir === 'up' ? 'up' : 'down'} as ${xLabel} increases`,
  });
  const { left, right, top, bottom } = PLOT;

  // Axes, with arrowheads: they point the way values increase, which is
  // exactly the thing being read off the graph.
  const axes = svgEl('g', { class: 'graph-axes' });
  axes.appendChild(svgEl('path', { d: `M ${left} ${top} L ${left} ${bottom} L ${right} ${bottom}` }));
  axes.appendChild(svgEl('path', { d: `M ${left - 5} ${top + 8} L ${left} ${top} L ${left + 5} ${top + 8}` }));
  axes.appendChild(svgEl('path', { d: `M ${right - 8} ${bottom - 5} L ${right} ${bottom} L ${right - 8} ${bottom + 5}` }));
  svg.appendChild(axes);

  // Trend line from low-left to high-right (or high-left to low-right).
  const x0 = left + 14, x1 = right - 14;
  const yLow = bottom - 18, yHigh = top + 18;
  const [ya, yb] = dir === 'up' ? [yLow, yHigh] : [yHigh, yLow];
  svg.appendChild(svgEl('line', { x1: x0, y1: ya, x2: x1, y2: yb, class: 'graph-line' }));

  const rand = seededRandom(`${xLabel}|${yLabel}|${dir}`);
  const n = 7;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const x = x0 + t * (x1 - x0) + (rand() - 0.5) * 8;
    const y = ya + t * (yb - ya) + (rand() - 0.5) * 22;
    svg.appendChild(svgEl('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 4.2, class: 'graph-dot' }));
  }

  const midX = (left + right) / 2;
  const midY = (top + bottom) / 2;
  const xText = svgEl('text', { x: midX, y: GRAPH_H - 10, class: 'graph-label', 'text-anchor': 'middle', 'data-max': right - left });
  xText.textContent = xLabel;
  const yText = svgEl('text', {
    x: 0, y: 0, class: 'graph-label', 'text-anchor': 'middle', 'data-max': bottom - top,
    transform: `translate(${left - 12} ${midY}) rotate(-90)`,
  });
  yText.textContent = yLabel;
  svg.appendChild(xText);
  svg.appendChild(yText);
  return svg;
}

// Shrink any axis label that's wider than its axis. Measured rather than
// guessed from the character count -- which means it has to run once the
// graphs are on screen: inside a hidden element every measurement is zero
// and this silently does nothing.
function fitGraphLabels(root) {
  root.querySelectorAll('.graph-label').forEach(t => {
    t.style.fontSize = '';
    const max = Number(t.dataset.max);
    const len = t.getComputedTextLength();
    if (len > max && len > 0) {
      const size = parseFloat(getComputedStyle(t).fontSize);
      t.style.fontSize = `${Math.floor(size * max / len * 10) / 10}px`;
    }
  });
}

// ---------------------------------------------------------------------------
// Grouped bar graphs for Level 3: factor A along the bottom, factor B as
// colours, one bar per condition.
//
// The colours are chosen to stay apart for the commonest kinds of colour
// blindness, and every bar group has the same left-to-right order as the
// legend -- so a student who can't tell two colours apart can still read
// the graph by position.
// ---------------------------------------------------------------------------
const BAR_COLOURS = ['#1f6f8b', '#e07b39', '#8e5aa8', '#d9a400'];
const BAR_W = 340;
const BAR_H = 250;
const BAR_PLOT = { left: 38, right: 330, top: 44, bottom: 206 };
const BAR_Y_MAX = 25;

function drawBarGraph(data) {
  const { nA, nB, cells } = data;
  const { left, right, top, bottom } = BAR_PLOT;
  const svg = svgEl('svg', {
    viewBox: `0 0 ${BAR_W} ${BAR_H}`, class: 'bar-graph', role: 'img',
    'aria-label': `Bar graph: score for each level of A (along the bottom), with B shown as ${nB} colours. ` +
      cells.map((r, i) => `A${i + 1}: ` + r.map((v, j) => `B${j + 1} ${v.toFixed(1)}`).join(', ')).join('; '),
  });
  const y = v => bottom - (v / BAR_Y_MAX) * (bottom - top);

  // Gridlines and y labels every 5.
  for (let v = 0; v <= BAR_Y_MAX; v += 5) {
    svg.appendChild(svgEl('line', { x1: left, x2: right, y1: y(v), y2: y(v), class: v ? 'bar-grid' : 'bar-axis' }));
    const t = svgEl('text', { x: left - 6, y: y(v) + 4, class: 'bar-tick', 'text-anchor': 'end' });
    t.textContent = v;
    svg.appendChild(t);
  }
  svg.appendChild(svgEl('line', { x1: left, x2: left, y1: top, y2: bottom, class: 'bar-axis' }));
  const yTitle = svgEl('text', { class: 'bar-title', 'text-anchor': 'middle', transform: `translate(10 ${(top + bottom) / 2}) rotate(-90)` });
  yTitle.textContent = 'Score';
  svg.appendChild(yTitle);

  // Bars, grouped by A.
  const groupW = (right - left) / nA;
  const pad = groupW * 0.16;
  const barW = (groupW - 2 * pad) / nB;
  cells.forEach((row, i) => {
    const gx = left + i * groupW + pad;
    row.forEach((v, j) => {
      svg.appendChild(svgEl('rect', {
        x: gx + j * barW + 1, y: y(v), width: Math.max(2, barW - 2), height: bottom - y(v),
        fill: BAR_COLOURS[j], class: 'bar',
      }));
    });
    const label = svgEl('text', { x: left + (i + 0.5) * groupW, y: bottom + 18, class: 'bar-label', 'text-anchor': 'middle' });
    label.textContent = `A${i + 1}`;
    svg.appendChild(label);
  });
  const xTitle = svgEl('text', { x: (left + right) / 2, y: BAR_H - 6, class: 'bar-title', 'text-anchor': 'middle' });
  xTitle.textContent = 'A';
  svg.appendChild(xTitle);

  // Legend for B across the top.
  const legendW = 64;
  const startX = (left + right) / 2 - (nB * legendW) / 2;
  for (let j = 0; j < nB; j++) {
    const x = startX + j * legendW;
    svg.appendChild(svgEl('rect', { x, y: 12, width: 16, height: 16, rx: 3, fill: BAR_COLOURS[j] }));
    const t = svgEl('text', { x: x + 22, y: 25, class: 'bar-legend' });
    t.textContent = `B${j + 1}`;
    svg.appendChild(t);
  }
  return svg;
}
