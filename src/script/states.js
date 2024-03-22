// == Global state ========================================================
// WebGL
let gl = undefined;

// Tool states
let selectedTool = "cursor";
let isDrawing = false;
let isEditing = false;

// Canvas states
let canvasColor = [0.08, 0.08, 0.08, 1.0];

// Shape states
let shapeColor = [0.9, 0.9, 0.9, 1.0];
const shapes = {
  lines: [],
};

// Selected shapes states
let editColor = [0.9, 0.9, 0.9, 1.0];
let selectedShapes = [];
let selectedPoints = {
  parentShape: [],
  pointIndex: [],
};
let allShapesVertex = [];

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
  selectedShapes = [];
  selectedPoints = {
    parentShape: [],
    pointIndex: [],
  };

  // Insert all the checked objects id into an array
  const checkedObjectIds = [];
  document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
    if (checkbox.checked) {
      checkedObjectIds.push(checkbox.value);
    }
  });

  // Insert all the checked objects into selectedShapes and selectedPoints
  checkedObjectIds.forEach((id) => {
    // Insert line object
    if (id.includes("l-") && id.includes("point")) {
      const obj = shapes.lines[parseInt(id.split("-")[1]) - 1];
      const pointId = parseInt(id.split("-")[3]) - 1;

      selectedPoints.parentShape.push(obj);
      selectedPoints.pointIndex.push(pointId);
    } else {
      const obj = shapes.lines[parseInt(id.split("-")[1]) - 1];
      selectedShapes.push(obj);
    }
  });
  allShapesVertex = selectedPoints.parentShape.concat(selectedShapes);

  // Update mode
  isEditing =
    selectedPoints.parentShape.length > 0 || selectedShapes.length > 0;

  // Update property bar values
  updatePropertyValues();

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
// Update property bar
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

// Update property values
function updatePropertyValues() {
  if (!isEditing) {
    return;
  }

  const firstSelected = allShapesVertex[0];
  const firstSelectedIndex = selectedPoints.pointIndex[0] || 0;

  // Update color
  editColorInput.value = rgbaToHex(firstSelected.getColor(firstSelectedIndex));
  editColorValueSpan.innerHTML = editColorInput.value;
  editColor = hexToRGBA(editColorInput.value);

  // Update transform
  translateXInput.value = Math.floor(
    firstSelected.getVertexXPx(firstSelectedIndex)
  );
  translateYInput.value = Math.floor(
    firstSelected.getVertexYPx(firstSelectedIndex)
  );
  rotateInput.value = firstSelected.getRotation();
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
    const { x, y, x_pix, y_pix } = getMousePos(e);
    const newId = shapes.lines.length + 1;
    const newLine = new Line(newId, x, y, x_pix, y_pix, shapeColor);
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
    const { x, y, x_pix, y_pix } = getMousePos(e);
    shapes.lines[shapes.lines.length - 1].setEndVertex(x, y, x_pix, y_pix);
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
