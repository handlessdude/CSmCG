const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 fragColor;
in vec3 fragNormal;
in vec3 fragPos;

uniform vec3 lightPos;
uniform vec3 viewPos;

out vec4 outColor;

void main() {

  float uAmbientStrength = 0.2;
  float uSpecularStrength = 0.5;
  float shininess = 32.0;

  vec3 uAmbientLightColor = vec3(1.0);
  vec3 uDiffuseLightColor = vec3(1.0);
  vec3 uSpecularLightColor = vec3(1.0);

  vec3 norm = normalize(fragNormal);
  vec3 lightDir = normalize(lightPos - fragPos);

  vec3 ambient = uAmbientStrength * uAmbientLightColor;

  float diffuseStrength = max(dot(norm, lightDir), 0.0);
  vec3 diffuse = diffuseStrength * uDiffuseLightColor;

  vec3 viewDir = normalize(viewPos - fragPos);
  vec3 reflectDir = reflect(-lightDir, norm);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
  vec3 specular = uSpecularStrength * spec * uSpecularLightColor;

  vec3 result = (ambient + diffuse + specular) * fragColor;

  outColor = vec4(result, 1.0);
}
`;

export {
  fragmentShaderSource
};
