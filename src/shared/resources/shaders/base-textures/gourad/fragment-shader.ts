import { uniforms } from 'src/shared/resources/shaders/shader-keys';

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 fragColor;
in vec2 fragTextureCoord;

uniform sampler2D ${uniforms.sampler1};

out vec4 outColor;

void main() {
  vec4 textureColor = texture(${uniforms.sampler1}, fragTextureCoord);
  outColor = vec4(fragColor, 1.0) * textureColor;
}
`;

export {
  fragmentShaderSource,
}
