import * as rx from 'rxjs';
import * as op from 'rxjs/operators';
import { getX, flushSVGs, appendSVGWithLabel, drawLine } from './helpers';

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
