// == Color ===============================================================
editColorInput.addEventListener("input", () => {
  const newColor = hexToRGBA(editColorInput.value);

  // Change every selected vertices
  for (let i = 0; i < selectedPoints.parentShape.length; i++) {
    vertexObj = selectedPoints.parentShape[i];
    vertexIdx = selectedPoints.pointIndex[i];
    vertexObj.setColor(vertexIdx, newColor);
  }
});

// == Translate X =========================================================
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

// == Rotate ==============================================================
rotateInput.addEventListener("input", () => {
  const rotation = (rotateInput.value * Math.PI) / 180;
  const rotatedObjectsId = [];
  for (let i = 0; i < selectedPoints.length; i++) {
    if (rotatedObjectsId.includes(selectedPoints[i].id)) {
      continue;
    }

    const obj = selectedPoints[i];

    for (let j = 0; j < obj.getNumOfVertex(); j++) {
      const initialX = initialPointsPosition[j][0];
      const initialY = initialPointsPosition[j][1];

      showLog(obj.getAnchor());

      obj.setVertexX(
        j,
        initialX * Math.cos(rotation) -
          initialY * Math.sin(rotation) +
          obj.getAnchor()[0]
      );
      obj.setVertexY(
        j,
        initialX * Math.sin(rotation) +
          initialY * Math.cos(rotation) +
          obj.getAnchor()[1]
      );
    }

    rotatedObjectsId.push(obj.id);
  }
});
