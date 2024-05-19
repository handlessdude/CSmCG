import { Spark } from 'src/features/lab-08-fireworks/entities/spark';

const moveSparks = (sparks: Spark[]) => {
  const now = performance.now();
  for (let i = 0; i < sparks.length; i++) {
    sparks[i].move(now);
  }
};

const getSparksPositions = (sparks: Spark[]) => {
  const positions: number[] = [];
  sparks.forEach(function(item) {
    // искры двигаются только в одной плоскости xy
    positions.push(item.x, item.y, 0);
  });
  return positions;
}

const getTracksColors = (sparksPositions: number[]) => {
  const tracksColors: number[] = [];
  for (let i = 0; i < sparksPositions.length; i += 3) {
    // цвет в начале координат будет белый (горячий), а дальше будет приближаться к оранжевому
    tracksColors.push(
      1, 1, 1,
      // 0.47, 0.31, 0.24,
      1, 0, 0,
    );
  }
  return tracksColors;
}

const getTracksPositions = (sparksPositions: number[]) => {
  const tracksPositions: number[] = [];
  for (let i = 0; i < sparksPositions.length; i += 3) {
    tracksPositions.push(
      // для каждой координаты добавляем точку начала координат, чтобы получить след искры
      0, 0, 0,
      sparksPositions[i], sparksPositions[i + 1], sparksPositions[i + 2]
    );
  }
  return tracksPositions;
}

export {getSparksPositions, moveSparks, getTracksColors, getTracksPositions}
