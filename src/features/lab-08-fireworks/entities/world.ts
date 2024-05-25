import { vec3 } from 'gl-matrix';

class World {
  /*mortars = [];

  constructor() {

  }*/

  getLaunchPosition() {
    /*
      const i = Math.random() * this.mortars.length | 0;
      return this.mortars[i];
    */
    return vec3.fromValues(0.0, 0.0, 0.0);
  };

}

export {
   World
}
