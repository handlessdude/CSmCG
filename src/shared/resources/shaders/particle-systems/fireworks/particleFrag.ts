const fireworkParticleFragSource = `#version 300 es
precision highp float;

in vec3 fragColor;
out vec4 outColor;

uniform sampler2D u_pointTexture;

void main() {
  outColor = vec4(fragColor, 1.0) * texture(u_pointTexture, gl_PointCoord);
}
`;

export {
  fireworkParticleFragSource
}
