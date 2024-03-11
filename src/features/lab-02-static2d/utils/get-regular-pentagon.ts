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

  const startAngle = 3 * Math.PI / 2;

  for (let i = numSides - 1; i >= 0; i--) {
    const angle = startAngle + i * angleIncrement;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
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
