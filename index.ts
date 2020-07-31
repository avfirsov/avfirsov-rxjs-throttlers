import * as rx from 'rxjs';
import * as op from 'rxjs/operators';

const LINE_WIDTH = '1';
const SPACE_BETWEEN = '10';
const SVG_WIDTH = '600';
const SVG_HEIGHT = '50';

const getX = (time: number) => (time * (parseInt(LINE_WIDTH) + parseInt(SPACE_BETWEEN))) % parseInt(SVG_WIDTH);
const flushSVGs = () => document.querySelectorAll('svg').forEach((svg) => (svg.innerHTML = ''));

const ticker$ = rx.interval(1000);
const xCoord$ = ticker$.pipe(op.map((time) => getX(time)));
const mousemove$ = rx.fromEvent(document, 'mousemove');

xCoord$
  .pipe(
    op.pairwise(),
    op.map(([a, b]) => b - a),
    op.filter((dif) => dif < 0)
  )
  .subscribe(flushSVGs);

const throttlers = [
  {
    stream: mousemove$.pipe(op.throttleTime(1000)),
    label: 'throttleTime(1000)',
    color: 'dodgerblue',
  },
  {
    stream: mousemove$.pipe(op.throttleTime(1000, rx.asyncScheduler, { leading: false, trailing: true })),
    label: 'throttleTime(1000, rx.asyncScheduler, \n{ leading: false, trailing: true })',
    color: 'MediumVioletRed',
  },
  {
    stream: mousemove$.pipe(op.throttleTime(1000, rx.asyncScheduler, { leading: true, trailing: true })),
    label: 'throttleTime(1000, rx.asyncScheduler, \n{ leading: true, trailing: true })',
    color: 'OrangeRed',
  },
  {
    stream: mousemove$.pipe(op.throttleTime(1000, rx.asyncScheduler, { leading: false, trailing: false })),
    label: 'throttleTime(1000, rx.asyncScheduler, \n{ leading: false, trailing: false })',
    color: 'DarkSlateGrey',
  },
  {
    stream: mousemove$.pipe(op.sampleTime(1000)),
    label: 'sampleTime(1000)',
    color: 'DarkSlateGrey',
  },
  {
    stream: mousemove$.pipe(op.debounceTime(1000)),
    label: 'debounceTime(1000)',
    color: 'darkslategray',
  },
];

throttlers.forEach(({ stream, label, color }) => {
  const { svg } = appendSVGWithLabel(label);
  stream.pipe(op.withLatestFrom(xCoord$)).subscribe(([_, x]) => drawLine({ svg, x, color }));
});

function appendSVGWithLabel(label: string) {
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

function drawLine({ svg, x, color }) {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('width', LINE_WIDTH);
  rect.setAttribute('height', SVG_HEIGHT);
  rect.setAttribute('fill', color);
  rect.setAttribute('x', x + '');
  rect.setAttribute('y', '0');
  svg.append(rect);
}
