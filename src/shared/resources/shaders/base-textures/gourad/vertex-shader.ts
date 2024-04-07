import { attributes, uniforms } from 'src/shared/resources/shaders/shader-keys';

const vertexShaderSource = `#version 300 es
in vec3 ${attributes.vertPosition};
in vec3 ${attributes.vertNormal};
// in vec3 ${attributes.vertColor};
in vec2 ${attributes.vertTextureCoord};

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
uniform vec3 ${uniforms.toonCoefs};
uniform vec3 ${uniforms.toonThresholds};

uniform float ${uniforms.materialShininess};
uniform vec3 ${uniforms.materialAmbientColor};
uniform vec3 ${uniforms.materialDiffuseColor};
uniform vec3 ${uniforms.materialSpecularColor};

uniform float ${uniforms.isPhongLightingEnabled};
uniform float ${uniforms.isBlinnLightingEnabled};
uniform float ${uniforms.isToonLightingEnabled};

out vec3 fragColor;
out vec2 fragTextureCoord;

void main() {
  fragTextureCoord = ${attributes.vertTextureCoord};

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

  float diffParam = max(dot(norm, lightDir), 0.0);
  diffParam = mix(
    diffParam,
    ${uniforms.toonCoefs}.x * float(diffParam >= ${uniforms.toonThresholds}.x)
      + ${uniforms.toonCoefs}.y * float(diffParam >= ${uniforms.toonThresholds}.y)
      + ${uniforms.toonCoefs}.z * float(diffParam >= ${uniforms.toonThresholds}.z),
    ${uniforms.isToonLightingEnabled}
  );

  vec3 diffuse = diffParam * lightDiffuseColor;

  // specular
  vec3 viewDir = normalize(viewPos - Position);
  vec3 reflectDir = reflect(-lightDir, norm);
  vec3 halfwayDir = normalize(lightDir + viewDir);

  // mix(x, y, a) = x * (1 - a) + y * a
  vec3 v1 = mix(viewDir, norm, ${uniforms.isBlinnLightingEnabled});
  vec3 v2 = mix(reflectDir, halfwayDir, ${uniforms.isBlinnLightingEnabled});
  float spec = pow(max(dot(v1, v2), 0.0), ${uniforms.materialShininess});

  // equivalent result is given by
  // float spec = 0.0;
  // if(bool(${uniforms.isBlinnLightingEnabled})) {
  //   vec3 halfwayDir = normalize(lightDir + viewDir);
  //   spec = pow(max(dot(norm, halfwayDir), 0.0), ${uniforms.materialShininess});
  // } else {
  //   spec = pow(max(dot(viewDir, reflectDir), 0.0), ${uniforms.materialShininess});
  // }

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
