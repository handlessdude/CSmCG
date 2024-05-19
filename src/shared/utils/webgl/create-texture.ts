const createTexture = (
  glContext: WebGL2RenderingContext,
  image: HTMLImageElement,
  textureUnitIdx: number,
) => {
  const texture = glContext.createTexture();
  const textureUnit = glContext.TEXTURE0 +  textureUnitIdx;
  glContext.activeTexture(textureUnit);
  glContext.bindTexture(glContext.TEXTURE_2D, texture);
  glContext.texImage2D(
    glContext.TEXTURE_2D,
    0,
    glContext.RGBA,
    glContext.RGBA,
    glContext.UNSIGNED_BYTE,
    image,
  );
  glContext.generateMipmap(glContext.TEXTURE_2D);
  glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);
  glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
  glContext.bindTexture(glContext.TEXTURE_2D, null);

  return {
    textureUnit,
    texture: texture as WebGLTexture
  };
}

export {
  createTexture
}
