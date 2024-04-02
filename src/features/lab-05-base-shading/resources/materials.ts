import { BaseMaterial } from 'src/shared/entities/material/base-material';

const gold = new BaseMaterial(
[	0.24725,	0.1995,	0.0745],
[0.75164,	0.60648,	0.22648],
[0.628281,	0.555802,	0.366065],
0.4,
);

const silver = new BaseMaterial(
  [	0.19225,	0.19225,	0.19225],
  [0.50754,	0.50754,	0.50754],
  [0.508273,	0.508273,	0.508273],
 0.4
)

const bronze = new BaseMaterial(
  [	0.2125,	0.1275,	0.054],
  [0.714,	0.4284,	0.18144],
  [0.393548,	0.271906,	0.166721],
  0.2
)
export {
  gold, bronze, silver
}

