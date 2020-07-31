const LINE_WIDTH = '1';
const SPACE_BETWEEN = '10';
const SVG_WIDTH = '600';
const SVG_HEIGHT = '50';

export const getX = (time: number) => (time * (parseInt(LINE_WIDTH) + parseInt(SPACE_BETWEEN))) % parseInt(SVG_WIDTH);
export const flushSVGs = () => document.querySelectorAll('svg').forEach((svg) => (svg.innerHTML = ''));

export function appendSVGWithLabel(label: string) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', SVG_WIDTH);
  svg.setAttribute('height', SVG_HEIGHT);
  svg.setAttribute('viewbox', `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`);

  const wrapper = document.createElement('div');
  wrapper.className = 'svg-box';

  const labelDiv = document.createElement('div');
  labelDiv.className = 'svg-label';
  labelDiv.innerText = label;

  wrapper.append(labelDiv, svg);
  document.body.append(wrapper);

  return { svg, wrapper, label };
}

export function drawLine({ svg, x, color }) {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('width', LINE_WIDTH);
  rect.setAttribute('height', SVG_HEIGHT);
  rect.setAttribute('fill', color);
  rect.setAttribute('x', x + '');
  rect.setAttribute('y', '0');
  svg.append(rect);
}
