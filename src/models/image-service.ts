import { Nullable } from 'src/models/generic';

interface ImageHist {
  r: Array<number>;
  g: Array<number>;
  b: Array<number>;
}

interface ImageSchema {
  id: string;
  name: string;
  img_src: string;
  hist: Nullable<ImageHist>;
  img_alt?: string;
}

interface CorrectionSchema {
  img_in: ImageSchema;
  img_out: ImageSchema;
}

interface SplineCorrectionParams {
  xp: Array<number>;
  fp: Array<number>;
}

interface GetImageParams {
  name: string;
}

interface QuantizationParams extends GetImageParams {
  levels: string; // todo make docs
}

interface OtsuLocalParams extends GetImageParams {
  height_delims: string; // todo make docs
}

export type {
  ImageSchema,
  ImageHist,
  CorrectionSchema,
  SplineCorrectionParams,
  GetImageParams,
  QuantizationParams,
  OtsuLocalParams,
};
