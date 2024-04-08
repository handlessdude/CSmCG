const attributes = {
  vertPosition: 'vertPosition',
  vertColor: 'vertColor',
  vertNormal: 'vertNormal',
  vertTextureCoord: 'vertTextureCoord',
}

const uniforms = {
  mWorld: 'mWorld',
  mView: 'mView',
  mProj: 'mProj',

  lightPos: 'lightPos',
  viewPos: 'viewPos',

  lightAmbientStrength: 'lightAmbientStrength',
  lightSpecularStrength: 'lightSpecularStrength',
  lightAmbientColor: 'lightAmbientColor',
  lightDiffuseColor: 'lightDiffuseColor',
  lightSpecularColor: 'lightSpecularColor',

  materialShininess: 'materialShininess',
  materialAmbientColor: 'materialAmbientColor',
  materialDiffuseColor: 'materialDiffuseColor',
  materialSpecularColor: 'materialSpecularColor',
  attenuation: 'attenuation',

  isPhongLightingEnabled: 'isPhongLightingEnabled',
  isBlinnLightingEnabled: 'isBlinnLightingEnabled',
  isToonLightingEnabled: 'isToonLightingEnabled',

  toonCoefs: 'toonCoefs',
  toonThresholds: 'toonThresholds',

  sampler0: 'sampler0',
  sampler1: 'sampler1',
  sampler2: 'sampler2',

  colorContrib: 'colorContrib',
  numberTextureContrib: 'numberTextureContrib',
  mtlTextureContrib: 'mtlTextureContrib',
}

export {
  uniforms, attributes
}
