const attributeKeys = {
  vertPosition: 'vertPosition',
  vertColor: 'vertColor',
  vertNormal: 'vertNormal',
}

const vertexShaderSource = `#version 300 es
layout(location = 0) in vec3 vertPosition;
layout(location = 1) in vec3 vertColor;
layout(location = 2) in vec3 vertNormal;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

out vec3 fragNormal;
out vec3 fragColor;
out vec3 fragPos;

void main() {
  vec4 vertPosition4 = vec4(vertPosition, 1.0);
  gl_Position = mProj * mView * mWorld * vertPosition4;
  fragColor = vertColor;
  fragNormal = vertNormal;
  fragPos = vec3(mWorld * vertPosition4);
}
`;

export {
  attributeKeys,
  vertexShaderSource
};
