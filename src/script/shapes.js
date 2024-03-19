class Shape {
  constructor(x, y, rgbaColor) {
    this.vertexBuffer = [];
    this.colorBuffer = [];
    this.anchor = [x, y];
  }

  setEndVertex(x, y) {
    throw new Error("Must be implemented");
  }

  render() {
    throw new Error("Must be implemented");
  }

  print() {
    throw new Error("Must be implemented");
  }
}

class Line extends Shape {
  constructor(x, y, rgbaColor) {
    super(x, y, rgbaColor);
    this.vertexBuffer = [x, y, x, y];
    this.colorBuffer = [...rgbaColor, ...rgbaColor];
  }

  render(program) {
    // Render vertex buffer
    render(gl, program, "vertexPosition", this.vertexBuffer, 2);

    // Render colorBuffer
    render(gl, program, "vertexColor", this.colorBuffer, 4);

    // Draw the line
    for (let i = 0; i < this.vertexBuffer.length; i += 2) {
      gl.drawArrays(gl.LINES, i, 2);
    }
  }

  setEndVertex(x, y) {
    this.vertexBuffer[2] = x;
    this.vertexBuffer[3] = y;
  }

  print() {
    showLog("\nLine");
    showLog(`vertexBuffer: ${this.vertexBuffer}`);
    showLog(`color: ${this.color}`);
    showLog(`colorBuffer: ${this.colorBuffer}`);
  }
}
