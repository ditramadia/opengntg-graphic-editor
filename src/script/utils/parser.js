function hexToRGBA(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  let a = hex.length > 7 ? parseInt(hex.slice(7, 9), 16) / 255 : 1.0;

  return [r, g, b, a];
}
