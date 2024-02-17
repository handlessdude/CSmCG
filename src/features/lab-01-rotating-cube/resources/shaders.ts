const vertexShaderSource = `#version 300 es
in vec3 vertPosition;
in vec3 vertColor;
out vec3 fragColor;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main() {
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
  fragColor = vertColor;
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 fragColor;
out vec4 outColor;

void main() {
  outColor = vec4(fragColor, 1.0);
}
`;

export { fragmentShaderSource, vertexShaderSource };
