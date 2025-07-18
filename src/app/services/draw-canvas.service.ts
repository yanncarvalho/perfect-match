import { Injectable } from '@angular/core';
import { AbstractFigure } from '../models/abstract-figure.model';
import { Coordinates } from '../models/coordinates.model';

@Injectable({
  providedIn: 'root',
})
export class DrawCanvasService {
  constructor(private ctx: CanvasRenderingContext2D, private figure: AbstractFigure) {
    this.ctx.lineWidth = 10;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000';
  }

  public initializeCanvas(canvas: HTMLCanvasElement) {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.figure.cleanDrawingCoords();
    //this.color = 0;
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 10;
    this.ctx.closePath();
  }

  public drawingPrecision(): number {
    return this.figure?.precision;
  }

  public drawLine(prevCoord: Coordinates, currentCoord: Coordinates) {
    if (!this.ctx) {
      return;
    }

    this.ctx.beginPath();

    if (prevCoord) {
      this.figure.addDrawingCoords(currentCoord);
      this.ctx.moveTo(prevCoord.x, prevCoord.y);
      this.ctx.lineTo(currentCoord.x, currentCoord.y);
      this.ctx.stroke();
    }
    this.ctx.closePath();
  }

  public drawText(msg: string, color: string, ctx: CanvasRenderingContext2D, point: Coordinates): void {
    ctx.save();
    ctx.beginPath();
    const maxWidth = ctx.canvas.width * 0.8;
    let fontSize = 18;
    ctx.font = `${fontSize}px Quantico`;
    while (ctx.measureText(msg).width > maxWidth && fontSize > 10) {
      fontSize -= 1;
      ctx.font = `${fontSize}px Quantico`;
    }
    ctx.fillStyle = color;
    const textMetrics = ctx.measureText(msg);
    const x = textMetrics.width > maxWidth ? ctx.canvas.width * 0.1 : Math.max(0, Math.min(point.x, ctx.canvas.width - textMetrics.width));
    const y = Math.max(fontSize, Math.min(point.y, ctx.canvas.height - 10));
    ctx.fillText(msg, x, y, maxWidth);
    ctx.closePath();
    ctx.restore();
  }

  public verifyDrawing(): void {
    if (this.figure.isInvalid()) {
      const figureName = this.figure.figureName.toLowerCase();
      this.drawText(`That is not a valid ${figureName}`, 'red', this.ctx, this.figure.centroid);
      return;
    }
    this.figure.draw(this.ctx, 'red');
  }
}
