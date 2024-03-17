// Show error message inside the page error box
function showError(errorText) {
  const errorTextP = document.createElement("p");
  errorTextP.innerText = errorText;
  errorBoxDiv.appendChild(errorTextP);
  console.log(errorText);
}

// Show log messages inside the page log box
function showLog(logMessage) {
  const logMessageP = document.createElement("p");
  logMessageP.innerText = logMessage;
  logBoxDiv.appendChild(logMessageP);
  console.log(logMessage);
}

// Setup canvas
function initCanvas() {
  // Get WebGL Context
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    showError("This browser does not support WebGL 2.");
    return;
  }

  // Clear the color and depth buffer
  gl.clearColor(0.08, 0.08, 0.08, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// Normalize coordinate unit from pixel, to canvas unit
function normalizeCoor(x, y) {
  canvasXCenter = canvas.width / 2;
  canvasYCenter = canvas.height / 2;

  n_x = (x - canvasXCenter) / canvasXCenter;
  n_y = (canvasYCenter - y) / canvasYCenter;

  return { n_x, n_y };
}

// Get current mouse position relevant to the canvas
function getMousePos(e) {
  const pos = canvas.getBoundingClientRect();

  const x = e.clientX - pos.x;
  const y = e.clientY - pos.y;

  const { n_x, n_y } = normalizeCoor(x, y);

  return { n_x, n_y };
}
