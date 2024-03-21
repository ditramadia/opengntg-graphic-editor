// Request animation frame
window.requestAnimFrame = (() => {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    /* render per frame (1s / 60 frame) */
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

// Normalize coordinate unit from pixel, to canvas unit
function normalizeCoor(x, y) {
  canvasXCenter = canvas.width / 2;
  canvasYCenter = canvas.height / 2;

  n_x = (x - canvasXCenter) / canvasXCenter;
  n_y = (canvasYCenter - y) / canvasYCenter;

  return { n_x, n_y };
}

// Get current mouse position
function getMousePos(e) {
  const pos = canvas.getBoundingClientRect();

  const x_pix = e.clientX - pos.x;
  const y_pix = e.clientY - pos.y;

  const { n_x: x, n_y: y } = normalizeCoor(x_pix, y_pix);

  return { x, y, x_pix, y_pix };
}
