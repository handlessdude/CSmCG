const uniformKeys = {
  lightPos: 'lightPos',
  viewPos: 'viewPos',

  lightAmbientStrength: 'lightAmbientStrength',
  lightSpecularStrength: 'lightSpecularStrength',
  lightAmbientColor: 'lightAmbientColor',
  lightDiffuseColor: 'lightDiffuseColor',
  lightSpecularColor: 'lightSpecularColor',

/*
  materialShininess: 'materialShininess',
  materialAmbientColor: 'materialAmbientColor',
  materialDiffuseColor: 'materialDiffuseColor',
  materialSpecularColor: 'materialSpecularColor',
*/
}

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 fragColor;
in vec3 fragNormal;
in vec3 fragPos;

uniform vec3 lightPos;
uniform vec3 viewPos;

uniform float lightAmbientStrength;
uniform float lightSpecularStrength;
uniform vec3 lightAmbientColor;
uniform vec3 lightDiffuseColor;
uniform vec3 lightSpecularColor;

// uniform float materialShininess;
// uniform vec3 materialAmbientColor;
// uniform vec3 materialDiffuseColor;
// uniform vec3 materialSpecularColor;

out vec4 outColor;

void main() {

  float materialShininess = 8.0;

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
  fragmentShaderSource, uniformKeys,
}
