import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, takeUntil, switchMap, pairwise } from 'rxjs';
import { Pointer as Coordinates } from './coordenates';

@Component({
  selector: 'app-circle-drawing',
  templateUrl: './circle-drawing.component.html',
})
export class DrawingCircleComponent implements AfterViewInit {
  @ViewChild('handDrawing') handingWriting: ElementRef | undefined;

  private context!: CanvasRenderingContext2D;

  private drawingCoords: Coordinates[] = [];

  ngAfterViewInit() {
    const canvas = this.handingWriting?.nativeElement;

    this.context = canvas.getContext('2d');
    if (this.context == null) {
      throw new Error('not possible to load');
    }
    this.context.lineWidth = 2;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#000';
    this.captureEvents(canvas);
  }

  captureEvents(canvas: HTMLCanvasElement) {
    const mousedown$ = fromEvent(document, 'mousedown');
    const mouseup$ = fromEvent(document, 'mouseup');
    const mousemove$ = fromEvent(document, 'mousemove');

    mousedown$
      .pipe(
        switchMap(() => {
          this.initializeCanvas(canvas);
          return mousemove$.pipe(takeUntil(mouseup$), pairwise());
        })
      )
      .subscribe((res) => {
        const rect = canvas.getBoundingClientRect();
        const prevMouseEvent = res[0] as MouseEvent;
        const currMouseEvent = res[1] as MouseEvent;
        const prevCoord: Coordinates = {
          x: prevMouseEvent.clientX - rect.left,
          y: prevMouseEvent.clientY - rect.top,
        };

        const currentCoord: Coordinates = {
          x: currMouseEvent.clientX - rect.left,
          y: currMouseEvent.clientY - rect.top,
        };

        this.drawOnCanvas(prevCoord, currentCoord);
      });
    mouseup$.subscribe(() => {
      const centroid = this.calcCentroid(this.drawingCoords);
      // const radius = this.calcEucledeanDistance(this.drawingCoords[0], centroid);
      const radiuses = this.drawingCoords.map((c) => this.calcEucledeanDistance(c, centroid));
      for (const r of radiuses) {
        this.context.arc(centroid.x, centroid.y, r, 0, 2 * Math.PI);
        this.context.stroke();
      }
    });
  }

  private initializeCanvas(canvas: HTMLCanvasElement) {
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.drawingCoords = [];
  }

  private drawOnCanvas(prevCoord: Coordinates, currentCoord: Coordinates) {
    if (!this.context) {
      return;
    }

    this.context.beginPath();

    if (prevCoord) {
      this.drawingCoords.push(currentCoord);
      this.context.moveTo(prevCoord.x, prevCoord.y);
      this.context.lineTo(currentCoord.x, currentCoord.y);
      this.context.stroke();
    }
  }
  //TODO pcalcular a distencia euclidiana de cada ponto da figura e pegar a media pondera dos raios, ver qual seria a media ponderada
  private calcEucledeanDistance(startPoint: Coordinates, endPoint: Coordinates): number {
    const x = startPoint.x - endPoint.x;
    const y = startPoint.y - endPoint.y;
    return Math.sqrt(x ** 2 + y ** 2);
  }

  private calcCentroid(pts: Coordinates[]): Coordinates {
    const nPts = pts.length;
    let twicearea = 0,
      x = 0,
      y = 0,
      p1,
      p2,
      f;
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
}
