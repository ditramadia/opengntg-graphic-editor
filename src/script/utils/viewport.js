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
function normalizeX(x) {
  const canvasXCenter = canvas.width / 2;
  return (x - canvasXCenter) / canvasXCenter;
}

function normalizeY(y) {
  const canvasYCenter = canvas.height / 2;
  return (canvasYCenter - y) / canvasYCenter;
}

function normalizeCoor(x, y) {
  const n_x = normalizeX(x);
  const n_y = normalizeY(y);

  return { n_x, n_y };
}

// Denormalize coordinate unit from canvas unit, to pixel
function denormalizeX(x) {
  const canvasXCenter = canvas.width / 2;
  return x * canvasXCenter + canvasXCenter;
}

function denormalizeY(y) {
  const canvasYCenter = canvas.height / 2;
  return canvasYCenter - y * canvasYCenter;
}

// Get current mouse position
function getMousePos(e) {
  const pos = canvas.getBoundingClientRect();

  const x_pix = e.clientX - pos.x;
  const y_pix = e.clientY - pos.y;

  const { n_x: x, n_y: y } = normalizeCoor(x_pix, y_pix);

  return { x, y, x_pix, y_pix };
}
