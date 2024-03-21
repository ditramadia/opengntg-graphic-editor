// Load shader from shader source code
function loadShader(type, shaderSourceCode) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSourceCode);
  gl.compileShader(shader);

  // Throw error if failed to compile shader
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(shader);
    showError(`Failed to compile vertex shader - ${compileError}`);
    return;
  }

  return shader;
}

// Create a shader program
function createShaderProgram(vertexShaderSource, fragmentShaderSource) {
  // Load the vertex shader
  const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);

  // Load the fragment shader
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Create a program
  const program = gl.createProgram();

  // Link the shaders to see wether both fragments are compatible with each other
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const linkError = gl.getProgramInfoLog(program);
    showError(`Failed to link shaders - ${linkError}`);
    return;
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

function render(gl, program, attribute, bufferInput, size) {
  // Get the vertex attribute location
  let attributeLocation;
  try {
    attributeLocation = gl.getAttribLocation(program, attribute);
  } catch (error) {
    showError(error);
  }

  // Validate if the vertex attribute location is valid
  if (attributeLocation < 0) {
    showError("Failed to get attrib location for vertexPosition");
    return;
  }

  // Bind the buffer to a GL Array Buffer in the GPU
  const cpuBuffer = new Float32Array(bufferInput);
  const buffer = gl.createBuffer();
  if (!buffer) {
    showError("Fail to create line geo buffer");
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, cpuBuffer, gl.STATIC_DRAW);

  // Set GPU program (vertex + fragment shader pair)
  gl.useProgram(program);
  gl.enableVertexAttribArray(attributeLocation);

  // Input assembler
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(
    // index
    attributeLocation,
    // size
    size,
    // type
    gl.FLOAT,
    // normalize
    false,
    // stride
    0,
    // offset
    0
  );
}

// Render each objects
function renderObjects(shapes, program) {
  clear();

  let keys = Object.keys(shapes);
  for (let key of keys) {
    for (let shape of shapes[key]) {
      shape.render(program);
    }
  }

  window.requestAnimFrame(() => {
    renderObjects(shapes, program);
  });
}
