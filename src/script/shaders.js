// Vertex shader
const vertexShader = `#version 300 es
  precision mediump float;

  in vec2 vertexPosition;
  in vec4 vertexColor;

  out vec4 fragmentColor;
  
  void main() {
    fragmentColor = vertexColor;
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
  }`;

// Fragment shader
const fragmentShader = `#version 300 es
  precision mediump float;

  in vec4 fragmentColor;

  out vec4 outputColor;

  void main() {
    outputColor = fragmentColor;
  }`;
