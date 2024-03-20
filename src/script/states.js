// == Selectors ===========================================================
// Canvas
const canvas = document.querySelector("canvas");

// Tool buttons
const toolButtons = document.querySelectorAll(".tool-btn");

// Object list
const lineObjects = document.querySelector("#line-objects");
const squareObjects = document.querySelector("#square-objects");
const rectangleObjects = document.querySelector("#rectangle-objects");
const polygonObjects = document.querySelector("#polygon-objects");

// Properties
const propertyContainer = document.querySelectorAll(".property-container");
const canvasColorInput = document.querySelector("#canvas-color-input");
const canvasColorValueSpan = document.querySelector("#canvas-color-value");
const shapeColorInput = document.querySelector("#shape-color-input");
const shapeColorValueSpan = document.querySelector("#shape-color-value");
const editColorInput = document.querySelector("#edit-color-input");
const editColorValueSpan = document.querySelector("#edit-color-value");

// == State variables =====================================================
let gl = undefined;
let canvasColor = [0.08, 0.08, 0.08, 1.0];
let selectedTool = "cursor";
let shapeColor = [0.9, 0.9, 0.9, 1.0];
let isDrawing = false;
let isEditing = false;
const shapes = {
  lines: [],
};
// let selectedShapes = []; // Unused?
let selectedPoints = [];
let selectedPointIndex = [];
let initialPointsPosition = [];
let editColor = [0.9, 0.9, 0.9, 1.0];

// == WebGL state =========================================================
// Clear the color and depth buffer
function clear() {
  gl.clearColor(...canvasColor);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// Initialize WebGL
try {
  gl = canvas.getContext("webgl2");
  if (!gl) {
    throw Error("This browser does not support WebGL 2.");
  }

  // Merge the shaded pixel fragment with the existing output image
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  // Rasterizer
  gl.viewport(0, 0, canvas.width, canvas.height);

  clear();
} catch (error) {
  showError(`Initialize canvas failed - ${error}`);
}

// == Select tool event handler ===========================================
for (let i = 0; i < toolButtons.length; i++) {
  toolButtons[i].addEventListener("click", () => {
    if (selectedTool === toolButtons[i].id) {
      return;
    }

    selectedTool = toolButtons[i].id;
    for (let j = 0; j < toolButtons.length; j++) {
      toolButtons[j].classList.remove("active");
    }
    toolButtons[i].classList.add("active");

    updatePropertyBar();
  });
}

// == Object lists ========================================================
// Update selected objects
function updateSelectedObjects() {
  // Clear the array
  // selectedShapes = [];
  selectedPoints = [];
  selectedPointIndex = [];
  initialPointsPosition = [];

  // Insert all the checked objects id into an array
  const checkedObjectIds = [];
  document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
    if (checkbox.checked) {
      checkedObjectIds.push(checkbox.value);
    }
  });

  // Insert all the checked objects into selectedPoints
  checkedObjectIds.forEach((id) => {
    if (id.includes("l-") && id.includes("point")) {
      const obj = shapes.lines[parseInt(id.split("-")[1]) - 1];
      const pointId = parseInt(id.split("-")[3]) - 1;
      const pointObj = [obj.getVertexX(pointId), obj.getVertexY(pointId)];

      selectedPoints.push(obj);
      selectedPointIndex.push(pointId);
      initialPointsPosition.push(pointObj);
    }
  });

  // Update mode
  isEditing = selectedPoints.length > 0;

  // Update edit color
  editColor = shapes.lines[0].getColor(0);
  editColorInput.value = rgbaToHex(editColor);
  editColorValueSpan.innerHTML = editColorInput.value;

  // Update property bar
  updatePropertyBar();
}

// Insert a newly created object into HTML object list
function insertShapeToHTML(type, obj) {
  if (type === "line") {
    // Append new line to line object list
    const newLine = document.createElement("div");
    newLine.innerHTML = `<div class="object-item list">
    <input type="checkbox" id="l-${obj.id}" name="l-${obj.id}" value="l-${obj.id}" />
    <label for="l-${obj.id}">Line ${obj.id}</label>
    </div>`;
    lineObjects.querySelector(".items").appendChild(newLine);

    // Append new line points to line point list
    for (let i = 1; i <= obj.numOfVertex; i++) {
      newLine.innerHTML += `<div class="point-item list">
      <input type="checkbox" id="l-${obj.id}-point-${i}" name="l-${obj.id}-point" value="l-${obj.id}-point-${i}" />
      <label for="l-${obj.id}-point-${i}">Point ${i}</label>
    </div>`;
    }

    // Handle shape checkbox event
    const shapeInput = document.querySelector(`#l-${obj.id}`);
    shapeInput.addEventListener("change", () => {
      if (shapeInput.checked) {
        // Insert the shape into selectedShapes
        // selectedShapes.push(shapeInput.id);

        // Check all the point boxes
        pointInputs.forEach((point) => {
          point.checked = true;
        });
      } else {
        // Remove the shape from selectedShapes
        // selectedShapes.splice(selectedShapes.indexOf(shapeInput.id), 1);

        // Uncheck all the point boxes
        pointInputs.forEach((point) => {
          point.checked = false;
        });
      }

      updateSelectedObjects();
    });

    // Handle point checkbox event
    const pointInputs = document.querySelectorAll(
      `input[name="l-${obj.id}-point"]`
    );
    pointInputs.forEach((point) => {
      point.addEventListener("change", () => {
        // Update selected objects
        updateSelectedObjects();
      });
    });
  }
}

// == Property handler ====================================================
// Property bar
function updatePropertyBar() {
  for (let j = 0; j < propertyContainer.length; j++) {
    propertyContainer[j].classList.remove("active");
  }

  if (selectedTool === "cursor") {
    canvas.style.cursor = "default";
    return;
  }
  if (selectedTool === "canvas") {
    canvas.style.cursor = "default";
    propertyContainer[0].classList.add("active");
  } else {
    if (!isEditing) {
      canvas.style.cursor = "crosshair";
      propertyContainer[1].classList.add("active");
    } else {
      canvas.style.cursor = "move";
      propertyContainer[2].classList.add("active");
    }
  }
}

// Canvas color
canvasColorInput.addEventListener("input", () => {
  canvasColorValueSpan.innerHTML = canvasColorInput.value;
  canvasColor = hexToRGBA(canvasColorInput.value);
  gl.clearColor(...canvasColor);
});

// Shape color
shapeColorInput.addEventListener("input", () => {
  shapeColorValueSpan.innerHTML = shapeColorInput.value;
  shapeColor = hexToRGBA(shapeColorInput.value);
});

// == Drawing state handler ===============================================
// When the user started drawing
canvas.addEventListener("mousedown", (e) => {
  if (
    selectedTool === "cursor" ||
    selectedTool === "canvas" ||
    isDrawing ||
    isEditing
  ) {
    return;
  }

  if (selectedTool === "line") {
    const { x, y } = getMousePos(e);
    const newId = shapes.lines.length + 1;
    const newLine = new Line(x, y, shapeColor, newId);
    shapes.lines.push(newLine);
    insertShapeToHTML("line", newLine);
  }

  isDrawing = true;
});

// When the user is drawing
canvas.addEventListener("mousemove", (e) => {
  if (
    selectedTool === "cursor" ||
    selectedTool === "canvas" ||
    !isDrawing ||
    isEditing
  ) {
    return;
  }

  if (selectedTool === "line") {
    const { x, y } = getMousePos(e);
    shapes.lines[shapes.lines.length - 1].setEndVertex(x, y);
  }
});

// When the user stopped drawing
canvas.addEventListener("mouseup", (e) => {
  if (
    selectedTool === "cursor" ||
    selectedTool === "canvas" ||
    !isDrawing ||
    isEditing
  ) {
    return;
  }

  isDrawing = false;
});
