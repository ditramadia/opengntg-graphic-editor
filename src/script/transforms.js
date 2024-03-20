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
