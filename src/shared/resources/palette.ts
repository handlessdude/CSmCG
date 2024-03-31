import { toFracIntensity } from 'src/shared/utils/color-models';

const palette = {
  black      : [0.0, 0.0, 0.0],
  white      : [1.0, 1.0, 1.0],
  red        :   [1.0, 0.0, 0.0],
  yellow     : [1.0, 1.0, 0.0],
  green      : [0.0, 1.0, 0.0],
  cyan       : [0.0, 1.0, 1.0],
  blue       : [0.0, 0.0, 1.0],
  magenta    : [1.0, 0.0, 1.0],
  darkBlue   :  toFracIntensity ([54, 56, 87]),
  silver     : toFracIntensity ([218, 232, 240]),
  gold       : toFracIntensity([249, 229, 164]),
  bronze     : toFracIntensity([250, 189, 98]),
}

export {
  palette
}
