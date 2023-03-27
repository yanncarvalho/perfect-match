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

  static standardDeviation(radiuses: number[], radiusMean: number): number {
    const variance = radiuses.reduce((total, value) => total + Math.pow(radiusMean - value, 2) / radiuses.length, 0);
    return Math.sqrt(variance);
  }
}
