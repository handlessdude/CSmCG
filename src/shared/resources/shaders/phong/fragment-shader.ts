import { uniformKeys } from 'src/shared/resources/shaders/shader-keys';

// todo: insert keys in script itself

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 fragColor;
in vec3 fragNormal;
in vec3 fragPos;

uniform vec3 ${uniformKeys.lightPos};
uniform vec3 ${uniformKeys.viewPos};

uniform float ${uniformKeys.lightAmbientStrength};
uniform float ${uniformKeys.lightSpecularStrength};
uniform vec3 ${uniformKeys.lightAmbientColor};
uniform vec3 ${uniformKeys.lightDiffuseColor};
uniform vec3 ${uniformKeys.lightSpecularColor};

uniform float ${uniformKeys.materialShininess};

// uniform vec3 materialAmbientColor;
// uniform vec3 materialDiffuseColor;
// uniform vec3 materialSpecularColor;

out vec4 outColor;

void main() {

  vec3 norm = normalize(fragNormal);
  vec3 lightDir = normalize(lightPos - fragPos);

  vec3 ambient = lightAmbientStrength * lightAmbientColor;

  float diffuseStrength = max(dot(norm, lightDir), 0.0);
  vec3 diffuse = diffuseStrength * lightDiffuseColor;

  vec3 viewDir = normalize(viewPos - fragPos);
  vec3 reflectDir = reflect(-lightDir, norm);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), materialShininess);
  vec3 specular = lightSpecularStrength * spec * lightSpecularColor;

  vec3 result = (ambient + diffuse + specular) * fragColor;

  outColor = vec4(result, 1.0);
}
`;

export {
  fragmentShaderSource,
}
