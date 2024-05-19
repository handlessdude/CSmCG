import { attributes, uniforms } from 'src/shared/resources/shaders/shader-keys';

const bengalParticleTrackVertSource = `#version 300 es
in vec3 ${attributes.vertPosition};
in vec3 ${attributes.vertColor};

uniform mat4 ${uniforms.mWorld};
uniform mat4 ${uniforms.mView};
uniform mat4 ${uniforms.mProj};

out vec3 fragColor;
out vec3 fragPos;

void main() {
  fragColor = ${attributes.vertColor};
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}
`;

export {
  bengalParticleTrackVertSource,
};
