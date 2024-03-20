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

// == State variables =====================================================
let gl = undefined;
let canvasColor = [0.08, 0.08, 0.08, 1.0];
let selectedTool = "cursor";
let shapeColor = [0.9, 0.9, 0.9, 1.0];
let isDrawing = false;
const shapes = {
  lines: [],
};
const selectedShapes = {
  lines: [],
};

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

    for (let j = 0; j < propertyContainer.length; j++) {
      propertyContainer[j].classList.remove("active");
    }
    if (selectedTool === "cursor") {
      return;
    }
    if (selectedTool === "canvas") {
      propertyContainer[0].classList.add("active");
    } else {
      propertyContainer[1].classList.add("active");
    }
  });
}

// == Object lists ========================================================
function insertShapeToHTML(type, obj) {
  if (type === "line") {
    showLog("Insert line to HTML");
    showLog(`id: ${obj.id}`);
    showLog(`n_point: ${obj.numOfVertex}`);

    // Append new line to line object list
    const newLine = document.createElement("div");
    newLine.innerHTML = `<div class="object-item list">
    <input type="checkbox" id="line-${obj.id}" name="line-${obj.id}" value="line-${obj.id}" />
    <label for="line-${obj.id}">Line ${obj.id}</label>
    </div>`;
    lineObjects.querySelector(".items").appendChild(newLine);

    // Append new line points to line point list
    for (let i = 1; i <= obj.numOfVertex; i++) {
      newLine.innerHTML += `<div class="point-item list">
      <input type="checkbox" id="line-${obj.id}-point-${i}" name="line-${obj.id}-point" value="line-${obj.id}-point-${i}" />
      <label for="line-${obj.id}-point-${i}">Point ${i}</label>
    </div>`;
    }

    // Set the checked checkbox
    let shapeSelection = document.querySelector(`#line-${obj.id}`);
    shapeSelection.addEventListener("change", () => {
      if (shapeSelection.checked) {
        document
          .querySelectorAll(`input[name="line-${obj.id}-point"]`)
          .forEach((point) => {
            point.checked = true;
          });
      } else {
        document
          .querySelectorAll(`input[name="line-${obj.id}-point"]`)
          .forEach((point) => {
            point.checked = false;
          });
      }
    });
  }
}

// == Property handler ====================================================
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
canvas.addEventListener("mousedown", (e) => {
  if (selectedTool === "cursor" || selectedTool === "canvas" || isDrawing) {
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

canvas.addEventListener("mousemove", (e) => {
  if (selectedTool === "cursor" || selectedTool === "canvas" || !isDrawing) {
    return;
  }

  if (selectedTool === "line") {
    const { x, y } = getMousePos(e);
    shapes.lines[shapes.lines.length - 1].setEndVertex(x, y);
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (selectedTool === "cursor" || selectedTool === "canvas" || !isDrawing) {
    return;
  }

  isDrawing = false;
});
