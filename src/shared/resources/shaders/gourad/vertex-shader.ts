import { attributes, uniforms } from 'src/shared/resources/shaders/shader-keys';

const vertexShaderSource = `#version 300 es
in vec3 ${attributes.vertPosition};
in vec3 ${attributes.vertNormal};
// in vec3 ${attributes.vertColor};

uniform vec3 ${uniforms.lightPos};
uniform vec3 ${uniforms.viewPos};

uniform mat4 ${uniforms.mWorld};
uniform mat4 ${uniforms.mView};
uniform mat4 ${uniforms.mProj};

uniform float ${uniforms.lightAmbientStrength};
uniform float ${uniforms.lightSpecularStrength};
uniform vec3 ${uniforms.lightAmbientColor};
uniform vec3 ${uniforms.lightDiffuseColor};
uniform vec3 ${uniforms.lightSpecularColor};

uniform vec3 ${uniforms.attenuation};

uniform float ${uniforms.materialShininess};
uniform vec3 ${uniforms.materialAmbientColor};
uniform vec3 ${uniforms.materialDiffuseColor};
uniform vec3 ${uniforms.materialSpecularColor};

uniform float ${uniforms.isPhongLightingEnabled};

out vec3 fragColor;

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
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), ${uniforms.materialShininess});
  vec3 specular = lightSpecularStrength * spec * lightSpecularColor;

  float distance = length(${uniforms.lightPos} - Position);
  float attCoef = 1.0 / (${uniforms.attenuation}.x + ${uniforms.attenuation}.y * distance + ${uniforms.attenuation}.z * pow(distance, 2.0));

  fragColor =
    attCoef * (
    ${uniforms.isPhongLightingEnabled} * ambient * ${uniforms.materialAmbientColor}
    + diffuse * ${uniforms.materialDiffuseColor}
    + ${uniforms.isPhongLightingEnabled} * specular * ${uniforms.materialSpecularColor}
    );
}
`;

export {
  vertexShaderSource,
};
