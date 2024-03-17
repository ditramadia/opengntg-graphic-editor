function helloTriangle(lineVertices) {
  // Get WebGL Context
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    showError("This browser does not support WebGL 2.");
    return;
  }

  // Make CPU Buffer from array of line vertices
  const lineGeoCpuBuffer = new Float32Array(lineVertices);

  // Bind the buffer to a GL Array Buffer in the GPU
  const lineGeoBuffer = gl.createBuffer();
  if (!lineGeoBuffer) {
    showError("Fail to create line geo buffer");
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, lineGeoBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, lineGeoCpuBuffer, gl.STATIC_DRAW);

  // Define the vertex shader
  const vertexShaderSourceCode = `#version 300 es
  precision mediump float;

  in vec2 vertexPosition;
  
  void main() {
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
  }`;

  // Create then compile the vertex shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSourceCode);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(vertexShader);
    showError(`Failed to compile vertex shader - ${compileError}`);
    return;
  }

  // Define the fragment shader
  const fragmentShaderSourceCode = `#version 300 es
  precision mediump float;
  
  out vec4 outputColor;

  void main() {
    outputColor = vec4(0.9, 0.9, 0.9, 1.0);
  }`;

  // Create then compile the fragment shader
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(fragmentShader);
    showError(`Failed to compile fragment shader - ${compileError}`);
    return;
  }

  // Create and link the program to see wether both fragments are compatible with each other
  const lineProgram = gl.createProgram();
  gl.attachShader(lineProgram, vertexShader);
  gl.attachShader(lineProgram, fragmentShader);
  gl.linkProgram(lineProgram);
  if (!gl.getProgramParameter(lineProgram, gl.LINK_STATUS)) {
    const linkError = gl.getProgramInfoLog(lineProgram);
    showError(`Failed to link shaders - ${linkError}`);
    return;
  }

  // Get the vertex attribute location
  const vertexPositionAttributeLocation = gl.getAttribLocation(
    lineProgram,
    "vertexPosition"
  );
  if (vertexPositionAttributeLocation < 0) {
    showError("Failed to get attrib location for vertexPosition");
    return;
  }

  // Merge the shaded pixel fragment with the existing output image
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  // Clear the color and depth buffer
  gl.clearColor(0.08, 0.08, 0.08, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Rasterizer
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Set GPU program (vertex + fragment shader pair)
  gl.useProgram(lineProgram);
  gl.enableVertexAttribArray(vertexPositionAttributeLocation);

  // Input assembler
  gl.bindBuffer(gl.ARRAY_BUFFER, lineGeoBuffer);
  gl.vertexAttribPointer(
    // index
    vertexPositionAttributeLocation,
    // size
    2,
    // type
    gl.FLOAT,
    // normalize
    false,
    // stride
    2 * Float32Array.BYTES_PER_ELEMENT,
    // offset
    0
  );

  // Draw call
  gl.drawArrays(gl.LINES, 0, 2);
}
