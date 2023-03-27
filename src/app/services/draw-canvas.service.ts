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

  public drawText(msg: string, color: string, ctx: CanvasRenderingContext2D, poits: Coordinates): void {
    ctx.beginPath();
    //TODO add colors
    ctx.font = '30px Quantico';
    ctx.fillStyle = color;
    ctx.fillText(msg, poits.x, poits.y);
    ctx.closePath();
  }

  public verifyDrawing(): void {
    if (this.figure.isInvalid()) {
      const figureName = this.figure.constructor.name.toLowerCase();
      this.drawText(`That is not a valid ${figureName}`, 'red', this.ctx, this.figure.centroid);
      return;
    }
    this.figure.draw(this.ctx, 'red');
  }
}
