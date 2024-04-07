import { uniforms } from 'src/shared/resources/shaders/shader-keys';

// todo: insert keys in script itself

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 fragNormal;
in vec3 fragPos;

uniform vec3 ${uniforms.lightPos};
uniform vec3 ${uniforms.viewPos};

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
uniform float ${uniforms.isBlinnLightingEnabled};

out vec4 outColor;

void main() {

  vec3 norm = normalize(fragNormal);
  vec3 lightDir = normalize(lightPos - fragPos);

  // ambient
  vec3 ambient = lightAmbientStrength * lightAmbientColor;

  // diffuse
  float diffuseStrength = max(dot(norm, lightDir), 0.0);
  vec3 diffuse = diffuseStrength * lightDiffuseColor;

  // specular
  vec3 viewDir = normalize(viewPos - fragPos);
  vec3 reflectDir = reflect(-lightDir, norm);
  vec3 halfwayDir = normalize(lightDir + viewDir);

  // mix(x, y, a) = x * (1 - a) + y * a
  vec3 v1 = mix(viewDir, norm, ${uniforms.isBlinnLightingEnabled});
  vec3 v2 = mix(reflectDir, halfwayDir, ${uniforms.isBlinnLightingEnabled});
  float spec = pow(max(dot(v1, v2), 0.0), ${uniforms.materialShininess});

  // float spec = 0.0;
  // if(bool(${uniforms.isBlinnLightingEnabled})) {
  //   vec3 halfwayDir = normalize(lightDir + viewDir);
  //   spec = pow(max(dot(norm, halfwayDir), 0.0), ${uniforms.materialShininess});
  // } else {
  //   spec = pow(max(dot(viewDir, reflectDir), 0.0), ${uniforms.materialShininess});
  // }

  vec3 specular = lightSpecularStrength * spec * lightSpecularColor;

  float distance = length(${uniforms.lightPos} - fragPos);
  float attCoef = 1.0 / (${uniforms.attenuation}.x + ${uniforms.attenuation}.y * distance + ${uniforms.attenuation}.z * pow(distance, 2.0));

  vec3 result =
    attCoef * (
    ${uniforms.isPhongLightingEnabled} * ambient * ${uniforms.materialAmbientColor}
    + diffuse * ${uniforms.materialDiffuseColor}
    + ${uniforms.isPhongLightingEnabled} * specular * ${uniforms.materialSpecularColor}
    );

  outColor = vec4(result, 1.0);
}
`;

export {
  fragmentShaderSource,
}
