import { attributeKeys, uniformKeys } from 'src/shared/resources/shaders/shader-keys';

const vertexShaderSource = `#version 300 es
layout(location = 0) in vec3 ${attributeKeys.vertPosition};
layout(location = 1) in vec3 ${attributeKeys.vertColor};
layout(location = 2) in vec3 ${attributeKeys.vertNormal};

uniform vec3 ${uniformKeys.lightPos};
uniform vec3 ${uniformKeys.viewPos};

uniform mat4 ${uniformKeys.mWorld};
uniform mat4 ${uniformKeys.mView};
uniform mat4 ${uniformKeys.mProj};

uniform float ${uniformKeys.lightAmbientStrength};
uniform float ${uniformKeys.lightSpecularStrength};
uniform vec3 ${uniformKeys.lightAmbientColor};
uniform vec3 ${uniformKeys.lightDiffuseColor};
uniform vec3 ${uniformKeys.lightSpecularColor};

uniform float ${uniformKeys.materialShininess};
// uniform vec3 materialAmbientColor;
// uniform vec3 materialDiffuseColor;
// uniform vec3 materialSpecularColor;

uniform float ${uniformKeys.isPhongLightingEnabled};

out vec3 fragColor;
out vec3 lightingColor;

void main() {

  vec4 vertPosition4 = vec4(vertPosition, 1.0);
  gl_Position = mProj * mView * mWorld * vertPosition4;
  vec3 Position = vec3(mWorld * vertPosition4);

  // todo: move calculation to cpu
  mat3 normalMat = mat3(transpose(inverse(mWorld)));
  vec3 Normal = normalMat * vertNormal;

  // ambient
  vec3 ambient = lightAmbientStrength * lightAmbientColor;

  // diffuse
  vec3 norm = normalize(Normal);
  vec3 lightDir = normalize(lightPos - Position);
  float diffuseStrength = max(dot(norm, lightDir), 0.0);
  vec3 diffuse = diffuseStrength * lightDiffuseColor;

  // specular
  vec3 viewDir = normalize(viewPos - Position);
  vec3 reflectDir = reflect(-lightDir, norm);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), ${uniformKeys.materialShininess});
  vec3 specular = lightSpecularStrength * spec * lightSpecularColor;

  lightingColor =
    ${uniformKeys.isPhongLightingEnabled} * ambient
    + diffuse
    + ${uniformKeys.isPhongLightingEnabled} * specular;

  fragColor = lightingColor * vertColor;
}
`;

export {
  vertexShaderSource,
};
