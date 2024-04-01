const setupVBO = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  vertices: Float32Array,
  attribKey: string,
) => {
  const vertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const attribLocation = gl.getAttribLocation(program, attribKey);
  // if (attribLocation===-1) throw new Error(`Unable to getAttribLocation: ${attribKey}`)
  return {
    vertexBufferObject,
    attribLocation
  }
}

const setupEBO = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  indices: Uint16Array,
) => {
  const indexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    indexBufferObject,
  }
}

const setupBuffers = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  vertices: Float32Array,
  indices: Uint16Array,
) => {
  const vertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const indexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

  return {
    positionAttribLocation,
    colorAttribLocation,
    indexBufferObject,
    vertexBufferObject
  }
}

export {
  setupBuffers,
  setupVBO,
  setupEBO
}
