// == Color ===============================================================
editColorInput.addEventListener("input", () => {
  const newColor = hexToRGBA(editColorInput.value);

  // Change every selected vertices
  for (let i = 0; i < selectedPoints.length; i++) {
    vertexObj = selectedPoints[i];
    vertexIdx = selectedPointIndex[i];
    vertexObj.setColor(vertexIdx, newColor);
  }
});

// == Translate X =========================================================
// Variables
const translateXInput = document.querySelector("#translate-x-input");

// Event handler
translateXInput.addEventListener("input", () => {
  const xValue = translateXInput.value / 100;

  // Translate every selected vertices
  for (let i = 0; i < selectedPoints.length; i++) {
    vertexObj = selectedPoints[i];
    vertexIdx = selectedPointIndex[i];
    const initialX = initialPointsPosition[i][0];
    const finalX = initialX + xValue;
    vertexObj.setVertexX(vertexIdx, finalX);
  }
});

// == Translate X =========================================================
// Variables
const translateYInput = document.querySelector("#translate-y-input");

// Event handler
translateYInput.addEventListener("input", () => {
  const yValue = translateYInput.value / 100;

  // Translate every selected vertices
  for (let i = 0; i < selectedPoints.length; i++) {
    vertexObj = selectedPoints[i];
    vertexIdx = selectedPointIndex[i];
    const initialY = initialPointsPosition[i][1];
    const finalY = initialY + yValue;
    vertexObj.setVertexY(vertexIdx, finalY);
  }
});

// == Move ================================================================
// Variables
let isMoving = false;
let initialMousePos = [];

// Event handler
// User has started to move a vertex
canvas.addEventListener("mousedown", (e) => {
  if (!isMoving && isEditing) {
    isMoving = true;
    const { x, y } = getMousePos(e);
    initialMousePos = [x, y];
  }
});

// User is moving a vertex
canvas.addEventListener("mousemove", (e) => {
  if (!isMoving || !isEditing) {
    return;
  }

  const { x, y } = getMousePos(e);
  for (let i = 0; i < selectedPoints.length; i++) {
    vertexObj = selectedPoints[i];
    vertexIdx = selectedPointIndex[i];
    const initialX = initialPointsPosition[i][0];
    const initialY = initialPointsPosition[i][1];
    const finalX = initialX + x - initialMousePos[0];
    const finalY = initialY + y - initialMousePos[1];
    vertexObj.setVertexX(vertexIdx, finalX);
    vertexObj.setVertexY(vertexIdx, finalY);
  }
});

// User has stopped moving a vertex
canvas.addEventListener("mouseup", () => {
  if (isMoving) {
    isMoving = false;
    updateSelectedObjects();
  }
});
