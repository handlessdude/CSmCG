const attributeKeys = {
  vertPosition: 'vertPosition',
  vertColor: 'vertColor',
  vertNormal: 'vertNormal',
}

const uniformKeys = {
  mWorld: 'mWorld',
  mView: 'mView',
  mProj: 'mProj',
}

const vertexShaderSource = `#version 300 es
layout(location = 0) in vec3 vertPosition;
layout(location = 1) in vec3 vertColor;
layout(location = 2) in vec3 vertNormal;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

out vec3 fragColor;
out vec3 fragPos;
out vec3 fragNormal;

void main() {
  vec4 vertPosition4 = vec4(vertPosition, 1.0);
  gl_Position = mProj * mView * mWorld * vertPosition4;
  fragColor = vertColor;
  fragPos = vec3(mWorld * vertPosition4);

  // todo: move calculation to cpu
  mat3 normalMat = mat3(transpose(inverse(mWorld)));
  fragNormal = normalMat * vertNormal;
}
`;

export {
  attributeKeys,
  vertexShaderSource,
  uniformKeys
};
