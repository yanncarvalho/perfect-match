import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, merge, Observable, pairwise, Subscription, switchMap, takeUntil } from 'rxjs';
import { Coordinates } from './coordinates';

@Component({
  selector: 'app-circle-drawing',
  templateUrl: './circle-drawing.component.html',
})
export class DrawingCircleComponent implements AfterViewInit {
  @ViewChild('handDrawing') handingWriting: ElementRef | undefined;

  private context!: CanvasRenderingContext2D;

  private color = 0;

  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;

  private drawingCoords: Coordinates[] = [];

  get precision() {
    const centroid = this.centroid(this.drawingCoords);
    const radiuses = this.drawingCoords.map((c) => this.eucledeanDistance(c, centroid));
    const meanR = this.mean(radiuses);

    let deriviation = this.standardDeviation(radiuses, meanR);
    if (deriviation > 100) {
      deriviation = 100;
    }
    return 100 - deriviation;
  }

  ngAfterViewInit() {
    const canvas = this.handingWriting?.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.context = canvas.getContext('2d');
    if (this.context === null) {
      throw new Error('not possible to load');
    }
    this.context.lineWidth = 10;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#000';
    this.captureEvents(canvas);

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  captureEvents(canvas: HTMLCanvasElement) {
    const mousedown$ = fromEvent<MouseEvent>(document, 'mousedown');
    const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');
    const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const touchstart$ = fromEvent<TouchEvent>(document, 'touchstart');
    const touchend$ = fromEvent<TouchEvent>(document, 'touchend');
    const touchcancel$ = fromEvent<TouchEvent>(document, 'touchcancel');
    const touchmove$ = fromEvent<TouchEvent>(document, 'touchmove');

    merge(touchstart$, mousedown$)
      .pipe(
        switchMap(() => {
          this.initializeCanvas(canvas);
          return merge(touchmove$, mousemove$).pipe(takeUntil(touchend$), takeUntil(touchcancel$), takeUntil(mouseup$), pairwise());
        })
      )
      .subscribe((res) => {
        const rect = canvas.getBoundingClientRect();
        const prevEvent = res[0] as any;
        const currEvent = res[1] as any;

        const prevCoord: Coordinates = {
          x: (prevEvent.clientX || (prevEvent as TouchEvent).touches[0].clientX) - rect.left,
          y: (prevEvent.clientY || (prevEvent as TouchEvent).touches[0].clientY) - rect.top,
        };

        const currentCoord: Coordinates = {
          x: (currEvent.clientX || currEvent.touches[0].clientX) - rect.left,
          y: (currEvent.clientY || currEvent.touches[0].clientY) - rect.top,
        };

        this.drawOnCanvas(prevCoord, currentCoord);
      });
    merge(touchend$, mouseup$).subscribe(() => {
      const centroid = this.centroid(this.drawingCoords);
      const radiuses = this.drawingCoords.map((c) => this.eucledeanDistance(c, centroid));
      const meanR = this.mean(radiuses);
      if (this.precision === 0.0 || meanR <= 20 || !this.isDrawSurround(this.drawingCoords)) {
        this.canvasDrawText('That circle is invalid!', 'red', this.context, centroid);
        return;
      }

      this.drawCircle(centroid, meanR, 'red');
    });
  }

  private drawCircle(positions: Coordinates, radius: number, color: string) {
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.lineWidth = 2;
    this.context.arc(positions.x, positions.y, radius, 0, 2 * Math.PI);
    this.context.stroke();
    this.context.closePath();
  }

  //TODO fazer função para veficiar se o circulo fecha
  private isDrawSurround(points: Coordinates[]): boolean {
    return true;
  }

  private initializeCanvas(canvas: HTMLCanvasElement) {
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.drawingCoords = [];
    this.color = 0;
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 10;
    this.context.closePath();
  }

  private drawOnCanvas(prevCoord: Coordinates, currentCoord: Coordinates) {
    if (!this.context) {
      return;
    }

    this.context.beginPath();
    this.color += 1;
    if (prevCoord) {
      this.drawingCoords.push(currentCoord);
      this.context.moveTo(prevCoord.x, prevCoord.y);
      this.context.lineTo(currentCoord.x, currentCoord.y);
      this.context.strokeStyle = '#' + parseInt(this.color.toString(), 16);
      this.context.stroke();
    }
    this.context.closePath();
  }

  private eucledeanDistance(startPoint: Coordinates, endPoint: Coordinates): number {
    const x = startPoint.x - endPoint.x;
    const y = startPoint.y - endPoint.y;
    return Math.sqrt(x ** 2 + y ** 2);
  }

  private mean(values: number[]): number {
    return values.reduce((total, valor) => total + valor / values.length, 0);
  }

  private centroid(pts: Coordinates[]): Coordinates {
    const nPts = pts.length;
    let twicearea = 0,
      x = 0,
      y = 0,
      p1: Coordinates,
      p2: Coordinates,
      f: number;
    for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
      p1 = pts[i];
      p2 = pts[j];
      f = p1.x * p2.y - p2.x * p1.y;
      twicearea += f;
      x += (p1.x + p2.x) * f;
      y += (p1.y + p2.y) * f;
    }
    f = twicearea * 3;
    return { x: x / f, y: y / f };
  }

  private standardDeviation(radiuses: number[], radiusMean: number): number {
    const variance = radiuses.reduce((total, value) => total + Math.pow(radiusMean - value, 2) / radiuses.length, 0);
    return Math.sqrt(variance);
  }

  private canvasDrawText(msg: string, color: string, ctx: CanvasRenderingContext2D, poits: Coordinates): void {
    ctx.beginPath();
    ctx.font = '30px Quantico';
    ctx.fillStyle = color;
    ctx.fillText(msg, poits.x, poits.y);
    ctx.closePath();
  }
}
