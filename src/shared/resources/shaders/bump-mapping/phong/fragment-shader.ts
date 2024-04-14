import { uniforms } from 'src/shared/resources/shaders/shader-keys';

// todo: insert keys in script itself

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 fragNormal;
in vec3 fragPos;
in vec2 fragTextureCoord;


uniform sampler2D ${uniforms.sampler0};

uniform vec3 ${uniforms.lightPos};
uniform vec3 ${uniforms.viewPos};

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


out vec4 outColor;

void main() {

  vec3 norm = normalize(fragNormal);
  vec3 lightDir = normalize(lightPos - fragPos);

  // ambient
  vec3 ambient = lightAmbientStrength * lightAmbientColor;

  // diffuse
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
  vec3 viewDir = normalize(viewPos - fragPos);
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

  float distance = length(${uniforms.lightPos} - fragPos);
  float attCoef = 1.0 / (${uniforms.attenuation}.x + ${uniforms.attenuation}.y * distance + ${uniforms.attenuation}.z * pow(distance, 2.0));

  vec3 lighting =
    attCoef * (
    ${uniforms.isPhongLightingEnabled} * ambient * ${uniforms.materialAmbientColor}
    + 1.0                              * diffuse * ${uniforms.materialDiffuseColor}
    + ${uniforms.isPhongLightingEnabled} * specular * ${uniforms.materialSpecularColor}
  );

  vec4 textureColor = texture(${uniforms.sampler0}, fragTextureCoord);

  outColor = vec4(lighting, 1.0) * textureColor;
}
`;

export {
  fragmentShaderSource,
}
