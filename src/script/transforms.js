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
translateXInput.addEventListener("focusout", () => {
  const valuePx = translateXInput.value;
  const valueX = normalizeX(valuePx);

  const initialX = allShapesVertex[0].getVertexXBase(
    selectedPoints.pointIndex[0] || 0
  );

  const diffX = valueX - initialX;

  // Translate every selected vertices
  for (let i = 0; i < selectedPoints.parentShape.length; i++) {
    vertexObj = selectedPoints.parentShape[i];
    vertexIdx = selectedPoints.pointIndex[i];

    vertexObj.translateX(vertexIdx, diffX);
  }
});

// == Translate Y =========================================================
translateYInput.addEventListener("focusout", () => {
  const valuePy = translateYInput.value;
  const valueY = normalizeY(valuePy);

  const initialY = allShapesVertex[0].getVertexYBase(
    selectedPoints.pointIndex[0] || 0
  );

  const diffY = valueY - initialY;

  // Translate every selected vertices
  for (let i = 0; i < selectedPoints.parentShape.length; i++) {
    vertexObj = selectedPoints.parentShape[i];
    vertexIdx = selectedPoints.pointIndex[i];

    vertexObj.translateY(vertexIdx, diffY);
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
  const diffX = x - initialMousePos[0];
  const diffY = y - initialMousePos[1];

  for (let i = 0; i < selectedPoints.parentShape.length; i++) {
    vertexObj = selectedPoints.parentShape[i];
    vertexIdx = selectedPoints.pointIndex[i];

    vertexObj.translateX(vertexIdx, diffX);
    vertexObj.translateY(vertexIdx, diffY);

    updatePropertyValues();
  }
});

// User has stopped moving a vertex
canvas.addEventListener("mouseup", () => {
  if (isMoving) {
    isMoving = false;
  }

  for (let i = 0; i < selectedPoints.parentShape.length; i++) {
    selectedPoints.parentShape[i].updateVertexBase();
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
