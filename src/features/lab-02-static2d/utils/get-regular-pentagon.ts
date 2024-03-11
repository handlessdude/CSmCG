interface Point {
  x: number;
  y: number;
}


const generateRegularPolygon = (
  numSides: number,
  center: Point,
  radius: number
): Point[] => {
  const vertices: Point[] = [];
  const angleIncrement = (2 * Math.PI) / numSides;

  for (let i = numSides - 1; i >= 0; i--) {
    const x = center.x + radius * Math.cos(i * angleIncrement);
    const y = center.y + radius * Math.sin(i * angleIncrement);
    vertices.push({ x, y });
  }

  return vertices;
};

export {
  generateRegularPolygon
}
export type {
  Point
}
