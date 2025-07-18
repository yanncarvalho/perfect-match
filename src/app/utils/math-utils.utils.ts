import { Coordinates } from 'src/app/models/coordinates.model';

export class MathUtils {
  static eucledeanDistance(startPoint: Coordinates, endPoint: Coordinates): number {
    const x = startPoint.x - endPoint.x;
    const y = startPoint.y - endPoint.y;
    return Math.sqrt(x ** 2 + y ** 2);
  }

  static mean(values: number[]): number {
    return values.reduce((total, valor) => total + valor / values.length, 0);
  }

  static centroid(pts: Coordinates[]): Coordinates {
    if (pts.length === 0) return { x: 0, y: 0 };
    const sum = pts.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    return {
      x: sum.x / pts.length,
      y: sum.y / pts.length,
    };
  }

  static standardDeviation(radiuses: number[], radiusMean: number): number {
    const variance = radiuses.reduce((total, value) => total + Math.pow(radiusMean - value, 2) / radiuses.length, 0);
    return Math.sqrt(variance);
  }
}
