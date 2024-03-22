// == Global state ========================================================
// WebGL
let gl = undefined;

// Tool states
let selectedTool = "cursor";
let isDrawing = false;
let isEditing = false;
let isSelectingPolygon = false;
let isEditingPolygon = false;

// Canvas states
let canvasColor = [0.08, 0.08, 0.08, 1.0];

// Shape states
let shapeColor = [0.9, 0.9, 0.9, 1.0];
const shapes = {
  lines: [],
  polygons: [],
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
    } else if (id.includes("l-")) {
      const obj = shapes.lines[parseInt(id.split("-")[1]) - 1];
      selectedShapes.push(obj);
    }

    // Insert polygon object
    if (id.includes("p-") && id.includes("point")) {
      const obj = shapes.polygons[parseInt(id.split("-")[1]) - 1];
      const pointId = parseInt(id.split("-")[3]) - 1;

      selectedPoints.parentShape.push(obj);
      selectedPoints.pointIndex.push(pointId);
    } else if (id.includes("p-")) {
      const obj = shapes.polygons[parseInt(id.split("-")[1]) - 1];
      selectedShapes.push(obj);
    }
  });
  allShapesVertex = selectedPoints.parentShape.concat(selectedShapes);

  // Update mode
  isEditing =
    selectedPoints.parentShape.length > 0 || selectedShapes.length > 0;

  // Update is editing polygon
  isSelectingPolygon =
    selectedShapes.length === 1 && selectedShapes[0] instanceof Polygon;
  if (isSelectingPolygon) {
    polygonProperty.classList.add("active");
  } else {
    polygonProperty.classList.remove("active");
  }

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

    const pointInputs = document.querySelectorAll(
      `input[name="l-${obj.id}-point"]`
    );

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
    pointInputs.forEach((point) => {
      point.addEventListener("change", () => {
        // Update selected objects
        updateSelectedObjects();
      });
    });
  }

  if (type === "polygon") {
    // Append new polygon to polygon object list
    const newPolygon = document.createElement("div");
    newPolygon.id = `div-p-${obj.id}`;
    newPolygon.innerHTML = `<div class="object-item list">
    <input type="checkbox" id="p-${obj.id}" name="p-${obj.id}" value="p-${obj.id}" />
    <label for="p-${obj.id}">Polygon ${obj.id}</label>
    </div>`;
    polygonObjects.querySelector(".items").appendChild(newPolygon);

    // Append new polygon points to polygon point list
    newPolygon.innerHTML += `<div class="point-item list">
      <input type="checkbox" id="p-${obj.id}-point-${1}" name="p-${
      obj.id
    }-point" value="p-${obj.id}-point-${1}" />
      <label for="p-${obj.id}-point-${1}">Point ${1}</label>
    </div>`;

    const pointInputs = document.querySelectorAll(
      `input[name="p-${obj.id}-point"]`
    );

    // Handle shape checkbox event
    const shapeInput = document.querySelector(`#p-${obj.id}`);
    shapeInput.addEventListener("change", () => {
      if (shapeInput.checked) {
        // Check all the point boxes
        pointInputs.forEach((point) => {
          point.checked = true;
        });
      } else {
        // Uncheck all the point boxes
        pointInputs.forEach((point) => {
          point.checked = false;
        });
      }

      updateSelectedObjects();
    });

    // Handle point checkbox event
    pointInputs.forEach((point) => {
      point.addEventListener("change", () => {
        // Update selected objects
        updateSelectedObjects();
      });
    });
  }
}

function insertPointToHTML(type, obj) {
  if (type === "polygon") {
    const parentPolygonDiv = document.querySelector(`#div-p-${obj.id}`);
    const newPointId = obj.numOfVertex - 1;
    parentPolygonDiv.innerHTML += `<div class="point-item list">
      <input type="checkbox" id="p-${obj.id}-point-${newPointId}" name="p-${obj.id}-point" value="p-${obj.id}-point-${newPointId}" />
      <label for="p-${obj.id}-point-${newPointId}">Point ${newPointId}</label>
    </div>`;

    const pointInputs = document.querySelectorAll(
      `input[name="p-${obj.id}-point"]`
    );

    // Handle shape checkbox event
    const shapeInput = document.querySelector(`#p-${obj.id}`);
    shapeInput.addEventListener("change", () => {
      if (shapeInput.checked) {
        // Check all the point boxes
        pointInputs.forEach((point) => {
          point.checked = true;
        });
      } else {
        // Uncheck all the point boxes
        pointInputs.forEach((point) => {
          point.checked = false;
        });
      }

      updateSelectedObjects();
    });

    // Handle point checkbox event
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
  widthInput.value = Math.floor(firstSelected.getWidth());
  heightInput.value = Math.floor(firstSelected.getHeight());
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

// Edit polygon button
editPolygonBtn.addEventListener("click", () => {
  isEditingPolygon = !isEditingPolygon;
  if (isEditingPolygon) {
    editPolygonBtn.innerHTML = "Done";
    canvas.style.cursor = "crosshair";
  } else {
    editPolygonBtn.innerHTML = "Edit shape";
    canvas.style.cursor = "move";
  }
});

// == Drawing state handler ===============================================
// When the user started drawing
canvas.addEventListener("mousedown", (e) => {
  if (
    selectedTool === "cursor" ||
    selectedTool === "canvas" ||
    selectedTool === "polygon" ||
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

// When the user started drawing polygon
canvas.addEventListener("click", (e) => {
  if (
    selectedTool === "cursor" ||
    selectedTool === "canvas" ||
    selectedTool !== "polygon"
  ) {
    return;
  }

  const { x, y, x_pix, y_pix } = getMousePos(e);

  if (isEditingPolygon) {
    showLog("Insert new polygon point");
    const currentPolygon = selectedShapes[0];
    currentPolygon.editPolygon(x, y, x_pix, y_pix, shapeColor);
    return;
  }

  if (isDrawing && selectedTool === "polygon") {
    const currentPolygon = shapes.polygons[shapes.polygons.length - 1];

    if (currentPolygon.isClosed()) {
      currentPolygon.closePolygon();
      isDrawing = false;
      return;
    }

    currentPolygon.addVertex(x, y, x_pix, y_pix, shapeColor);
    insertPointToHTML("polygon", currentPolygon);
  } else if (selectedTool === "polygon") {
    const newId = shapes.polygons.length + 1;
    const newPolygon = new Polygon(newId, x, y, x_pix, y_pix, shapeColor);
    shapes.polygons.push(newPolygon);
    insertShapeToHTML("polygon", newPolygon);
    isDrawing = true;
  }
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

  if (selectedTool === "polygon") {
    const { x, y, x_pix, y_pix } = getMousePos(e);
    shapes.polygons[shapes.polygons.length - 1].setEndVertex(
      x,
      y,
      x_pix,
      y_pix
    );
  }
});

// When the user stopped drawing
canvas.addEventListener("mouseup", (e) => {
  if (
    selectedTool === "cursor" ||
    selectedTool === "canvas" ||
    selectedTool === "polygon" ||
    !isDrawing ||
    isEditing
  ) {
    return;
  }

  isDrawing = false;
});
