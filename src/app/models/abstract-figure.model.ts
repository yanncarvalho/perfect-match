import { MathUtils } from '../utils/math-utils.utils';
import { Coordinates } from './coordinates.model';

export abstract class AbstractFigure {
  abstract draw(ctx: CanvasRenderingContext2D, color: string): void;

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
    return !this.isDrawSurround();
  }

  //TODO fazer função para veficiar se o circulo fecha
  protected isDrawSurround(): boolean {
    return true;
  }
}
