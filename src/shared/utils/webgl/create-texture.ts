
const createTexture = (
  glContext: WebGL2RenderingContext,
  image: HTMLImageElement,
  textureUnitIdx: number,
) => {
  glContext.enable(glContext.BLEND);
  glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE);
  const texture = glContext.createTexture();
  const textureUnit = glContext.TEXTURE0 +  textureUnitIdx;
  glContext.activeTexture(textureUnit);
  glContext.bindTexture(glContext.TEXTURE_2D, texture);
/*  glContext.texImage2D(
    glContext.TEXTURE_2D,
    0,
    glContext.RGBA,
    glContext.RGBA,
    glContext.UNSIGNED_BYTE,
    image,
  );*/

  // glContext.pixelStorei(glContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  glContext.texImage2D(
    glContext.TEXTURE_2D, 0, glContext.RGBA8, 16,16, 0, glContext.RGBA, glContext.UNSIGNED_BYTE, image);
  glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);
  glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
  glContext.bindTexture(glContext.TEXTURE_2D, null);

  return {
    textureUnit,
    texture: texture as WebGLTexture
  };
}

export {
  createTexture
}
