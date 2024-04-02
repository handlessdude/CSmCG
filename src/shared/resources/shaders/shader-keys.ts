const attributes = {
  vertPosition: 'vertPosition',
  vertColor: 'vertColor',
  vertNormal: 'vertNormal',
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
  /*
    // todo: use in shaders
    materialShininess: 'materialShininess',
    materialAmbientColor: 'materialAmbientColor',
    materialDiffuseColor: 'materialDiffuseColor',
    materialSpecularColor: 'materialSpecularColor',
  */
  isPhongLightingEnabled: 'isPhongLightingEnabled',
}

export {
  uniforms, attributes
}
