import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, merge, pairwise, switchMap, takeUntil } from 'rxjs';
import { Circle } from '../../models/figures/circle.model';

import { Coordinates } from '../../models/coordinates.model';
import { DrawCanvasService } from '../../services/draw-canvas.service';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
})
export class DrawingComponent implements AfterViewInit {
  @ViewChild('handDrawing') canvas: ElementRef<HTMLCanvasElement> | undefined;

  constructor(private cdRef: ChangeDetectorRef) {}

  private context: CanvasRenderingContext2D | null | undefined;

  private drawService: DrawCanvasService | undefined;

  private _hasError = false;

  get hasError() {
    return this._hasError;
  }

  get precision(): number {
    return this.drawService?.drawingPrecision() || 0;
  }

  ngAfterViewInit() {
    const canvasEl = this.canvas?.nativeElement;
    this.context = canvasEl?.getContext('2d');
    if (!canvasEl || !this.context) {
      this._hasError = true;
      this.cdRef.detectChanges();
      return;
    }

    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    this.drawService = new DrawCanvasService(this.context, new Circle());
    this.cdRef.detectChanges();
    this.moveEvent(canvasEl);
    this.resizeEvent(canvasEl);
  }

  private resizeEvent(canvas: HTMLCanvasElement) {
    const resize$ = fromEvent<Event>(window, 'resize');
    resize$.subscribe(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  private moveEvent(canvas: HTMLCanvasElement) {
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
          this.drawService?.initializeCanvas(canvas);
          return merge(touchmove$, mousemove$).pipe(takeUntil(touchend$), takeUntil(touchcancel$), takeUntil(mouseup$), pairwise());
        })
      )
      .subscribe((res) => {
        const rect = canvas.getBoundingClientRect();
        const prevEvent = res[0] instanceof MouseEvent ? (res[0] as MouseEvent) : (res[0] as TouchEvent).touches[0];
        const currEvent = res[1] instanceof MouseEvent ? (res[1] as MouseEvent) : (res[1] as TouchEvent).touches[0];

        const prevCoord: Coordinates = {
          x: prevEvent.clientX - rect.left,
          y: prevEvent.clientY - rect.top,
        };

        const currentCoord: Coordinates = {
          x: currEvent.clientX - rect.left,
          y: currEvent.clientY - rect.top,
        };

        this.drawService?.drawLine(prevCoord, currentCoord);
      });
    merge(touchend$, mouseup$).subscribe(() => {
      this.drawService?.verifyDrawing();
    });
  }
}
