// == Canvas =================================================================
const canvas = document.querySelector("canvas");

// == Tool Buttons ===========================================================
const toolButtons = document.querySelectorAll(".tool-btn");

// == Object List ============================================================
const lineObjects = document.querySelector("#line-objects");
const squareObjects = document.querySelector("#square-objects");
const rectangleObjects = document.querySelector("#rectangle-objects");
const polygonObjects = document.querySelector("#polygon-objects");

// == Properties =============================================================
// Property container
const propertyContainer = document.querySelectorAll(".property-container");

// Canvas color
const canvasColorInput = document.querySelector("#canvas-color-input");
const canvasColorValueSpan = document.querySelector("#canvas-color-value");

// Shape color
const shapeColorInput = document.querySelector("#shape-color-input");
const shapeColorValueSpan = document.querySelector("#shape-color-value");

// Edit color
const editColorInput = document.querySelector("#edit-color-input");
const editColorValueSpan = document.querySelector("#edit-color-value");

// Edit Shape
const translateXInput = document.querySelector("#translate-x-input");
const translateYInput = document.querySelector("#translate-y-input");
const rotateInput = document.querySelector("#rotate-input");
