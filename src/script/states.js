// == Selectors ===========================================================
// Canvas
const canvas = document.querySelector("canvas");

// Tool buttons
const toolButtons = document.querySelectorAll(".tool-btn");

// Object list
const objectList = document.querySelectorAll(".object-list");
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
for (let i = 0; i < objectList.length; i++) {
  objectList[i].querySelector(".object-label").addEventListener("click", () => {
    objectList[i].classList.toggle("open");
    objectList[i].querySelector(".fa-caret-down").classList.toggle("hide");
    objectList[i].querySelector(".fa-caret-right").classList.toggle("hide");
  });
}

function insertShapeToHTML(type) {
  if (type === "line") {
    lineObjects.querySelector(
      ".items"
    ).innerHTML += `<div class="list object-item">Line ${shapes.lines.length}</div>`;
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
    shapes.lines.push(new Line(x, y, shapeColor));
    insertShapeToHTML("line");
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
