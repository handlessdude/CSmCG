const bengalParticleVertSource = `#version 300 es
layout(location = 0) in vec3 vertPosition;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main() {
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
  gl_PointSize = 16.0;
}
`;

export {
  bengalParticleVertSource,
};
