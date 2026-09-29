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

// ---------------------------------------------------------------------------
// Level 4 figures: people as the lecture draws them (a row of figures whose
// heights ARE the data), dot plots, number lines and histograms.
// ---------------------------------------------------------------------------
const PEOPLE_COLOURS = ['#1f6f8b', '#e07b39'];

// A simple figure, feet on `baseY`, `h` tall: a head and a rounded body.
function drawPerson(parent, cx, baseY, h, colour, maxW = 20) {
  const w = Math.max(5, Math.min(h * 0.3, maxW));
  const r = w * 0.42;
  const g = svgEl('g', { class: 'person' });
  g.appendChild(svgEl('circle', { cx, cy: baseY - h + r, r, fill: colour }));
  g.appendChild(svgEl('rect', { x: cx - w / 2, y: baseY - h + 2 * r + 1.5, width: w, height: Math.max(2, h - 2 * r - 1.5), rx: w / 2.4, fill: colour }));
  parent.appendChild(g);
}

// Heights are drawn from a floor set per figure, well below the shortest
// person, so that differences of a few centimetres are visible -- the way
// the lecture's figures exaggerate. `heightScale` fits a set of heights
// into `px` of drawing height; 4b uses one scale for both groups, so they
// can be compared.
function heightScale(heights, px, pad = 0.35) {
  const lo = Math.min(...heights), hi = Math.max(...heights);
  const floor = lo - Math.max(8, (hi - lo) * pad);
  return { floor, k: px / (hi - floor) };
}

// 4b: one group, for one of the two answer buttons.
function drawGroup(group, colour, label, scale) {
  const W = 170, H = 150, base = 144;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'people-graph', role: 'img',
    'aria-label': `${label}: heights ${group.heights.join(', ')} cm` });
  const n = group.heights.length;
  const step = (W - 16) / n;
  const meanY = base - (group.mean - scale.floor) * scale.k;
  svg.appendChild(svgEl('line', { x1: 4, x2: W - 4, y1: base, y2: base, class: 'bar-axis' }));
  group.heights.forEach((h, i) => drawPerson(svg, 8 + step * (i + 0.5), base, (h - scale.floor) * scale.k, colour, step * 0.62));
  svg.appendChild(svgEl('line', { x1: 2, x2: W - 2, y1: meanY, y2: meanY, class: 'mean-line' }));
  return svg;
}

// 4c: one group with an arrow from the mean to every head, and three
// candidate sigma arrows A, B and C beside it, on the same scale.
function drawSigmaGroup(g) {
  const W = 340, H = 200, base = 192;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'people-graph wide', role: 'img',
    'aria-label': `Heights ${g.heights.join(', ')} cm, with arrows from the mean to each person, and three arrows labelled A, B and C` });
  const peopleW = 236;
  const n = g.heights.length;
  const step = (peopleW - 12) / n;
  // Room above the tallest person for arrow C (twice sigma) to fit.
  const { floor, k } = heightScale([...g.heights, g.mean + 2.2 * g.sd], 170, 0.6);
  const yOf = h => base - (h - floor) * k;
  const meanY = yOf(g.mean);
  svg.appendChild(svgEl('line', { x1: 4, x2: peopleW, y1: base, y2: base, class: 'bar-axis' }));
  g.heights.forEach((h, i) => {
    const cx = 10 + step * (i + 0.5);
    drawPerson(svg, cx, base, (h - floor) * k, '#c9d6db', step * 0.62);
    if (Math.abs(yOf(h) - meanY) > 2) {
      svg.appendChild(svgEl('line', { x1: cx, x2: cx, y1: meanY, y2: yOf(h), class: 'dev-arrow', 'marker-end': 'url(#arrowhead-dev)' }));
    }
  });
  svg.appendChild(svgEl('line', { x1: 4, x2: W - 4, y1: meanY, y2: meanY, class: 'mean-line' }));
  const meanText = svgEl('text', { x: 6, y: meanY - 5, class: 'bar-tick' });
  meanText.textContent = 'mean';
  svg.appendChild(meanText);
  const defs = svgEl('defs');
  defs.innerHTML = '<marker id="arrowhead-dev" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7a7369"/></marker>' +
    '<marker id="arrowhead-sig" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1f4e5f"/></marker>';
  svg.prepend(defs);
  g.arrows.forEach((a, i) => {
    const x = peopleW + 24 + i * 32;
    svg.appendChild(svgEl('line', { x1: x, x2: x, y1: meanY, y2: meanY - a.length * k, class: 'sigma-arrow', 'marker-end': 'url(#arrowhead-sig)' }));
    const t = svgEl('text', { x, y: meanY + 18, class: 'bar-label', 'text-anchor': 'middle' });
    t.textContent = a.letter;
    svg.appendChild(t);
  });
  return svg;
}

// A figure with a marker to drag along its line: a native range input laid
// over the line, snapping to every half standard deviation from -2 to +2.
// A slider rather than nine separate tap targets because on a phone the
// points can be a few pixels apart, and a slider can be dragged, nudged
// with arrow keys, and read out by a screen reader. It starts at the mean.
const SLIDER_THUMB = 30;
function figureWithSlider(svg, viewW, viewH, lineY, xAt, readout, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'tap-figure';
  wrap.appendChild(svg);
  const x0 = xAt(-2), x1 = xAt(2);
  const input = document.createElement('input');
  input.type = 'range';
  input.className = 'z-slider';
  input.min = '-2';
  input.max = '2';
  input.step = '0.5';
  input.value = '0';
  // The thumb's centre travels from half a thumb in from each end, so the
  // input is widened by one thumb and shifted half a thumb left: then the
  // centre sits exactly on -2 sigma and +2 sigma at the ends.
  input.style.left = `calc(${(x0 / viewW) * 100}% - ${SLIDER_THUMB / 2}px)`;
  input.style.width = `calc(${((x1 - x0) / viewW) * 100}% + ${SLIDER_THUMB}px)`;
  input.style.top = `calc(${(lineY / viewH) * 100}% - ${SLIDER_THUMB / 2}px)`;
  const update = () => {
    input.setAttribute('aria-valuetext', readout(Number(input.value)));
    onChange(Number(input.value));
  };
  input.addEventListener('input', update);
  wrap.appendChild(input);
  update();
  // Marks where the answer was, once it's been checked.
  const markAt = (z, cls) => {
    const c = svgEl('circle', { cx: xAt(z), cy: lineY, r: 9, class: cls });
    svg.appendChild(c);
  };
  return { wrap, input, markAt };
}

// 4d: a dot plot of heights -- small figures stacked over a height line --
// with the mean and one SD either side marked. Targets every half SD.
const LINE_W = 340;
function heightLineFigure(d, onChange) {
  const H = 196, axisY = 140, left = 22, right = LINE_W - 22;
  const lo = d.mean - 2.3 * d.sd, hi = d.mean + 2.3 * d.sd;
  const x = h => left + ((h - lo) / (hi - lo)) * (right - left);
  const svg = svgEl('svg', { viewBox: `0 0 ${LINE_W} ${H}`, class: 'line-graph', role: 'img',
    'aria-label': `Heights of ${d.heights.length} people, mean ${d.mean} cm, standard deviation ${d.sd} cm` });
  // Stack figures in half-SD columns, clear of the line and the marker.
  const cols = {};
  d.heights.forEach(h => {
    const c = Math.max(-4, Math.min(4, Math.round((h - d.mean) / (d.sd / 2))));
    cols[c] = (cols[c] || 0) + 1;
  });
  Object.entries(cols).forEach(([c, count]) => {
    for (let i = 0; i < count; i++) drawPerson(svg, x(d.mean + (c * d.sd) / 2), axisY - 20 - i * 14, 12, '#1f6f8b', 8);
  });
  svg.appendChild(svgEl('line', { x1: left - 10, x2: right + 10, y1: axisY, y2: axisY, class: 'bar-axis' }));
  for (let z = -2; z <= 2; z += 0.5) {
    svg.appendChild(svgEl('line', { x1: x(d.mean + z * d.sd), x2: x(d.mean + z * d.sd), y1: axisY - 4, y2: axisY + 4, class: 'bar-axis' }));
  }
  [-1, 0, 1].forEach(z => {
    const h = d.mean + z * d.sd;
    svg.appendChild(svgEl('line', { x1: x(h), x2: x(h), y1: axisY - 10, y2: axisY + 10, class: z ? 'sd-tick' : 'mean-tick' }));
    const t = svgEl('text', { x: x(h), y: axisY + 34, class: 'bar-label', 'text-anchor': 'middle' });
    t.textContent = `${h} cm`;
    svg.appendChild(t);
    const u = svgEl('text', { x: x(h), y: axisY + 50, class: 'bar-tick', 'text-anchor': 'middle' });
    u.textContent = z === 0 ? 'mean' : (z < 0 ? '−1σ' : '+1σ');
    svg.appendChild(u);
  });
  return figureWithSlider(svg, LINE_W, H, axisY, z => x(d.mean + z * d.sd), z => `${+(d.mean + z * d.sd).toFixed(1)} cm`, onChange);
}

// 4e: a 1-7 rating line with the z-scale lined up underneath it, as on the
// lecture's slide 50. Dashed lines join the mean and one SD either side to
// z = 0 and z = -1/+1. Targets every half SD on the rating line.
function ratingLineFigure(d, onChange) {
  const H = 150, rateY = 56, zY = 118, left = 26, right = LINE_W - 26;
  const x = r => left + ((r - 1) / 6) * (right - left);
  const svg = svgEl('svg', { viewBox: `0 0 ${LINE_W} ${H}`, class: 'line-graph', role: 'img',
    'aria-label': `A 1 to 7 rating scale. This participant's mean is ${d.mean} and their standard deviation is ${d.sd}.` });
  const cap = svgEl('text', { x: left - 16, y: 16, class: 'bar-title' });
  cap.textContent = 'Rating';
  svg.appendChild(cap);
  svg.appendChild(svgEl('line', { x1: left, x2: right, y1: rateY, y2: rateY, class: 'bar-axis' }));
  for (let r = 1; r <= 7; r++) {
    svg.appendChild(svgEl('line', { x1: x(r), x2: x(r), y1: rateY - 6, y2: rateY + 6, class: 'bar-axis' }));
    const t = svgEl('text', { x: x(r), y: rateY - 22, class: 'bar-label', 'text-anchor': 'middle' });
    t.textContent = r;
    svg.appendChild(t);
  }
  const zcap = svgEl('text', { x: left - 16, y: zY + 30, class: 'bar-title' });
  zcap.textContent = 'z-score';
  svg.appendChild(zcap);
  svg.appendChild(svgEl('line', { x1: left, x2: right, y1: zY, y2: zY, class: 'bar-axis' }));
  [-1, 0, 1].forEach(z => {
    const px = x(d.mean + z * d.sd);
    svg.appendChild(svgEl('line', { x1: px, x2: px, y1: rateY + 16, y2: zY, class: 'align-line' }));
    svg.appendChild(svgEl('line', { x1: px, x2: px, y1: zY - 7, y2: zY + 7, class: z ? 'sd-tick' : 'mean-tick' }));
    const t = svgEl('text', { x: px, y: zY + 22, class: 'bar-label', 'text-anchor': 'middle' });
    t.textContent = z === 0 ? 'z = 0' : (z < 0 ? '−1' : '+1');
    svg.appendChild(t);
  });
  return figureWithSlider(svg, LINE_W, H, rateY, z => x(d.mean + z * d.sd), z => `rating ${+(d.mean + z * d.sd).toFixed(2)}`, onChange);
}

// 4f: a histogram with no numbers -- the question is about shape only.
function drawHistogram(d) {
  const W = 340, H = 190, left = 20, right = W - 10, top = 12, bottom = 160;
  const n = d.counts.length;
  const max = Math.max(...d.counts);
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'bar-graph', role: 'img',
    'aria-label': `Histogram with bar heights ${d.counts.join(', ')}` });
  const bw = (right - left) / n;
  d.counts.forEach((c, i) => {
    const h = (c / max) * (bottom - top);
    svg.appendChild(svgEl('rect', { x: left + i * bw + 1, y: bottom - h, width: bw - 2, height: h, fill: '#1f6f8b', class: 'bar' }));
  });
  svg.appendChild(svgEl('line', { x1: left, x2: right, y1: bottom, y2: bottom, class: 'bar-axis' }));
  svg.appendChild(svgEl('line', { x1: left, x2: left, y1: top, y2: bottom, class: 'bar-axis' }));
  const xt = svgEl('text', { x: (left + right) / 2, y: H - 10, class: 'bar-title', 'text-anchor': 'middle' });
  xt.textContent = 'Score';
  svg.appendChild(xt);
  const yt = svgEl('text', { class: 'bar-title', 'text-anchor': 'middle', transform: `translate(12 ${(top + bottom) / 2}) rotate(-90)` });
  yt.textContent = 'How many';
  svg.appendChild(yt);
  return svg;
}
