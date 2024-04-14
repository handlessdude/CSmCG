import { attributes, uniforms } from 'src/shared/resources/shaders/shader-keys';

const vertexShaderSource = `#version 300 es
in vec3 ${attributes.vertPosition};
in vec3 ${attributes.vertNormal};
in vec2 ${attributes.vertTextureCoord};

uniform mat4 ${uniforms.mWorld};
uniform mat4 ${uniforms.mView};
uniform mat4 ${uniforms.mProj};

out vec3 fragPos;
out vec3 fragNormal;
out vec2 fragTextureCoord;

void main() {
  vec4 vertPosition4 = vec4(vertPosition, 1.0);
  gl_Position = mProj * mView * mWorld * vertPosition4;
  fragPos = vec3(mWorld * vertPosition4);

  // todo: move calculation to cpu
  mat3 normalMat = mat3(transpose(inverse(mWorld)));
  fragNormal = normalMat * vertNormal;

  fragTextureCoord = ${attributes.vertTextureCoord};
}
`;

export {
  vertexShaderSource,
};
