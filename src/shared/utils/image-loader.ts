const loadImage = async (src: string) => {
  console.log(`Loading texture ${src}...`);
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = src;
  await image.decode();
  return image;
}

export {
  loadImage
}
