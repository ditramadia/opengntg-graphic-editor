// Check if WebGL is supported
window.onload = function start() {
  if (!gl) {
    alert("WebGL not supported");
  }
};

// Create a shader
const program = createShaderProgram(vertexShader, fragmentShader);
if (!program) {
  showError("Failed to create program");
}

// Render all objects
renderObjects(shapes, program);
