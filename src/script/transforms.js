// == Translate X =========================================================
// Variables
const translateXValueSpan = document.querySelector("#translate-x-value");
const translateXInput = document.querySelector("#translate-x-input");

// Event handler
translateXInput.addEventListener("input", () => {
  translateXValueSpan.innerHTML = translateXInput.value;
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
