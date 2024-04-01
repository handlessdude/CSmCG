const attributeKeys = {
  vertPosition: 'vertPosition',
  vertColor: 'vertColor',
  vertNormal: 'vertNormal',
}

const vertexShaderSource = `#version 300 es
layout(location = 0) in vec3 vertPosition;
layout(location = 1) in vec3 vertColor;
layout(location = 2) in vec3 vertNormal;

out vec3 fragColor;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main() {
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
  fragColor = vertColor;
}
`;

export {
  attributeKeys,
  vertexShaderSource
};
