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

// == Width ===============================================================
function setShapesWidth() {
  const newWidth = widthInput.value;

  // Change width for every selected shape
  for (let i = 0; i < selectedShapes.length; i++) {
    vertexObj = selectedShapes[i];
    vertexObj.setWidth(newWidth);
  }
}

widthInput.addEventListener("focusout", setShapesWidth);
widthInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    widthInput.blur();
  }
});

// == Height ==============================================================
function setShapesHeight() {
  const newHeight = heightInput.value;

  // Change height for every selected shape
  for (let i = 0; i < selectedShapes.length; i++) {
    vertexObj = selectedShapes[i];
    vertexObj.setHeight(newHeight);
  }
}

heightInput.addEventListener("focusout", setShapesHeight);
heightInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    heightInput.blur();
  }
});

// == Translate X =========================================================
function translateShapesX() {
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
}

translateXInput.addEventListener("focusout", translateShapesX);
translateXInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    translateXInput.blur();
  }
});

// == Translate Y =========================================================
function translateShapesY() {
  const valuePx = translateYInput.value;
  const valueY = normalizeY(valuePx);

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
}

translateYInput.addEventListener("focusout", translateShapesY);
translateYInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    translateYInput.blur();
  }
});

// == Rotate ==============================================================
function rotateShapes() {
  const rad = degreeToRadian(rotateInput.value);

  for (let i = 0; i < selectedShapes.length; i++) {
    const obj = selectedShapes[i];
    obj.rotate(rad);
  }
}

rotateInput.addEventListener("focusout", rotateShapes);
rotateInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    rotateInput.blur();
  }
});

// == Move ================================================================
// Variables
let isMoving = false;
let initialMousePos = [];

// Event handler
// User has started to move objects
canvas.addEventListener("mousedown", (e) => {
  if (!isMoving && isEditing) {
    isMoving = true;
    const { x, y } = getMousePos(e);
    initialMousePos = [x, y];
  }
});

// User is moving objects
canvas.addEventListener("mousemove", (e) => {
  if (!isMoving || !isEditing) {
    return;
  }

  const { x, y } = getMousePos(e);
  const diffX = x - initialMousePos[0];
  const diffY = y - initialMousePos[1];

  for (let i = 0; i < selectedPoints.parentShape.length; i++) {
    console.log(selectedPoints.parentShape);
    if (
      selectedPoints.parentShape.length === 1 &&
      !(selectedPoints.parentShape[0] instanceof Line)
    ) {
      const { x, y, x_pix, y_pix } = getMousePos(e);

      vertexObj = selectedPoints.parentShape[0];
      vertexIdx = selectedPoints.pointIndex[0];

      vertexObj.pointDrag(vertexIdx, x_pix, y_pix, x, y);
    } else {
      vertexObj = selectedPoints.parentShape[i];
      vertexIdx = selectedPoints.pointIndex[i];

      vertexObj.translateX(vertexIdx, diffX);
      vertexObj.translateY(vertexIdx, diffY);
    }

    updatePropertyValues();
  }
});

// User has stopped moving objects
canvas.addEventListener("mouseup", () => {
  if (isMoving) {
    isMoving = false;
  }

  for (let i = 0; i < selectedPoints.parentShape.length; i++) {
    selectedPoints.parentShape[i].updateVertexBase();
  }
});
