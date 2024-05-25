import { attributes, uniforms } from 'src/shared/resources/shaders/shader-keys';

const fireworkParticleVertSource = `#version 300 es
precision highp float;
layout(location = 0) in vec3 ${attributes.vertPosition};
layout(location = 1) in vec3 ${attributes.vertColor};
layout(location = 2) in float ${attributes.vertSize};

uniform mat4 ${uniforms.mWorld};
uniform mat4 ${uniforms.mView};
uniform mat4 ${uniforms.mProj};

out vec3 fragColor;

void main() {
  fragColor = ${attributes.vertColor};
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
  gl_PointSize = vertSize;
}
`;

export {
  fireworkParticleVertSource,
};
