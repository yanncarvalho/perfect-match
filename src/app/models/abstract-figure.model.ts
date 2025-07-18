import { MathUtils } from '../utils/math-utils.utils';
import { Coordinates } from './coordinates.model';

export abstract class AbstractFigure {
  abstract draw(ctx: CanvasRenderingContext2D, color: string): void;

  protected static TOLERANCE_RADIOUS = 0.8;

  abstract get precision(): number;

  protected _drawingCoords: Coordinates[] = [];

  get drawingCoords() {
    return this._drawingCoords;
  }

  get centroid() {
    return MathUtils.centroid(this.drawingCoords);
  }

  public cleanDrawingCoords(): void {
    this._drawingCoords = [];
  }

  public addDrawingCoords(coord: Coordinates) {
    this._drawingCoords.push(coord);
  }

  public isInvalid(): boolean {
    return this.drawingCoords.length >= 3 && !this.isLine() && !this.isValidShape();
  }

  private isLine(): boolean {
    const coords = this.drawingCoords;
    const { x: x0, y: y0 } = coords[0];
    const { x: x1, y: y1 } = coords[1];
    const tolerance = 1e-2;

    for (let i = 2; i < coords.length; i++) {
      const { x, y } = coords[i];
      const area = Math.abs((x1 - x0) * (y - y0) - (y1 - y0) * (x - x0));
      if (area > tolerance) {
        return false;
      }
    }
    return true;
  }

  abstract isValidShape(): boolean;
}
