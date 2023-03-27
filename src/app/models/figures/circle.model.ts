import { MathUtils } from '../../utils/math-utils.utils';
import { AbstractFigure } from '../abstract-figure.model';

export class Circle extends AbstractFigure {
  public get precision(): number {
    const positions = this.distancesFromCentroid();
    let deriviation = MathUtils.standardDeviation(positions, this.getRadius());
    if (deriviation > 100) {
      deriviation = 100;
    }
    return 100 - deriviation;
  }

  public draw(ctx: CanvasRenderingContext2D, color = 'black'): void {
    const { x, y } = this.centroid;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.arc(x, y, this.getRadius(), 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  }

  public override isInvalid(): boolean {
    return super.isInvalid() || this.precision === 0.0 || this.getRadius() <= 20;
  }

  private getRadius() {
    return MathUtils.mean(this.distancesFromCentroid());
  }

  private distancesFromCentroid() {
    return this.drawingCoords.map((c) => MathUtils.eucledeanDistance(c, this.centroid));
  }
}
