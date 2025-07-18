import { MathUtils } from '../../utils/math-utils.utils';
import { AbstractFigure } from '../abstract-figure.model';

export class Circle extends AbstractFigure {
  override figureName = 'Circle';

  override isValidShape(): boolean {
    const center = this.centroid;
    const meanRadius = this.meanRadius();
    const tolerance = AbstractFigure.TOLERANCE_RADIOUS * meanRadius;

    return this.drawingCoords.every((c) => {
      const dist = MathUtils.eucledeanDistance(c, center);
      return Math.abs(dist - meanRadius) <= tolerance;
    });
  }

  public override get precision(): number {
    const positions = this.distancesFromCentroid();
    const mean = positions.reduce((a, b) => a + b, 0) / positions.length;
    const deriviation = MathUtils.standardDeviation(positions, this.meanRadius());
    return Math.max(0, 1 - deriviation / mean) * 100;
  }

  public draw(ctx: CanvasRenderingContext2D, color = 'black'): void {
    const { x, y } = this.centroid;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.arc(x, y, this.meanRadius(), 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  }

  private meanRadius() {
    return MathUtils.mean(this.distancesFromCentroid());
  }

  private distancesFromCentroid() {
    return this.drawingCoords.map((c) => MathUtils.eucledeanDistance(c, this.centroid));
  }
}
