import { BaseShaderProgram } from 'src/shared/utils/webgl/base-shader-program';
import { Mesh } from 'src/shared/entities/mesh/mesh';
import { ReadonlyVec3 } from 'gl-matrix';

class MeshGroup<T extends Mesh> {
  #members: Array<T> = [];

  get members() {
    return this.#members
  }

  draw = (shader: BaseShaderProgram) => {
    this.#members.forEach((mesh) => {
      mesh.draw(shader);
    })
  };

  // todo: maybe theres appropriate multiplication in gl-matrix to replace this
  get center(): ReadonlyVec3 {
    const groupCenter = this.#members.reduce((prev, cur)=>{
      return [
        prev[0] + cur.center[0],
        prev[1] + cur.center[1],
        prev[2] + cur.center[2],
      ]
    }, [0, 0, 0])
    return [
      groupCenter[0] / this.#members.length,
      groupCenter[1] / this.#members.length,
      groupCenter[2] / this.#members.length,
    ]
  }
}

export {
  MeshGroup
}
