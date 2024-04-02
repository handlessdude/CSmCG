const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 fragColor;
in vec3 lightingColor;

out vec4 outColor;

void main() {
  outColor = vec4(lightingColor * fragColor, 1.0);
}
`;

export {
  fragmentShaderSource,
}
