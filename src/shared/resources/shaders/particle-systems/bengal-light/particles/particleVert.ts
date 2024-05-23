const bengalParticleVertSource = `#version 300 es
precision highp float;
layout(location = 0) in vec3 vertPosition;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main() {
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
  gl_PointSize = 40.0;
}
`;

export {
  bengalParticleVertSource,
};
