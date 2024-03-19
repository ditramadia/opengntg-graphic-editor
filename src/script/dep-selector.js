let isStart = true;
let lineVertices = [];

// Canvas
const canvas = document.querySelector("canvas");
if (!canvas) {
  showError("Cannot get referenced canvas");
}

// Get coordinate of the cursor relevant to the canvas.
canvas.addEventListener("click", (e) => {
  const { n_x, n_y } = getMousePos(e);

  if (isStart) {
    isStart = false;
    lineVertices[0] = n_x;
    lineVertices[1] = n_y;
  } else {
    lineVertices[2] = n_x;
    lineVertices[3] = n_y;
    try {
      helloTriangle(lineVertices);
    } catch (err) {
      showError(`Uncaught JavaScript Exception: ${err}`);
    } finally {
      isStart = true;
      lineVertices = [];
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!isStart) {
    const { n_x, n_y } = getMousePos(e);
    lineVertices[2] = n_x;
    lineVertices[3] = n_y;

    showLog("Draw preview!");
    try {
      helloTriangle(lineVertices);
    } catch {
      showError(`Uncaught JavaScript Exception: ${err}`);
    }
  }
});

// Error box
const errorBoxDiv = document.querySelector("#error-box");

// Log box
const logBoxDiv = document.querySelector("#log-box");
