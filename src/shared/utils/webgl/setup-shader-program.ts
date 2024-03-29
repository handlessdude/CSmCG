// todo: remove
const setupShaderProgram = (
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
) => {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  if (!vertexShader) {
    throw new Error('Vertex shader not found')
  }
  if (!fragmentShader) {
    throw new Error('Fragment shader not found')
  }

  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.shaderSource(fragmentShader, fragmentShaderSource);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      'ERROR compiling vertex shader!',
      gl.getShaderInfoLog(vertexShader)
    );
    return;
  }
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      'ERROR compiling fragment shader!',
      gl.getShaderInfoLog(fragmentShader)
    );
    return;
  }

  const program = gl.createProgram() as WebGLProgram;
  if (!program) {
    throw new Error('Error creating gl program')
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('ERROR validating program!', gl.getProgramInfoLog(program));
    return;
  }

  return program;
};

export {
  setupShaderProgram
}
