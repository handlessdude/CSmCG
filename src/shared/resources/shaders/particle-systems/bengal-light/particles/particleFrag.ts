const bengalParticleFragSource = `#version 300 es
precision highp float;

uniform sampler2D u_pointTexture;

out vec4 outColor;

void main() {
  outColor = texture(u_pointTexture, gl_PointCoord);
}
`;

export {
  bengalParticleFragSource
}
