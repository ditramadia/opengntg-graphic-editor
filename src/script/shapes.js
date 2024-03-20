class Shape {
  constructor(x, y, rgbaColor, id) {
    this.id = id;
    this.vertexBuffer = [];
    this.colorBuffer = [];
    this.anchor = [x, y];
    this.numOfVertex = 0;
  }

  setEndVertex(x, y) {
    throw new Error("Must be implemented");
  }

  setColor(i, rgba) {
    this.colorBuffer[i * 4] = rgba[0];
    this.colorBuffer[i * 4 + 1] = rgba[1];
    this.colorBuffer[i * 4 + 2] = rgba[2];
    this.colorBuffer[i * 4 + 3] = rgba[3];
  }

  setVertexX(i, x) {
    this.vertexBuffer[i * 2] = x;
  }

  setVertexY(i, y) {
    this.vertexBuffer[i * 2 + 1] = y;
  }

  getColor(i) {
    return this.colorBuffer.slice(i * 4, i * 4 + 4);
  }

  getVertexX(i) {
    return this.vertexBuffer[i * 2];
  }

  getVertexY(i) {
    return this.vertexBuffer[i * 2 + 1];
  }

  render() {
    throw new Error("Must be implemented");
  }

  print() {
    throw new Error("Must be implemented");
  }
}

class Line extends Shape {
  constructor(x, y, rgbaColor, id) {
    super(x, y, rgbaColor, id);
    this.vertexBuffer = [x, y, x, y];
    this.colorBuffer = [...rgbaColor, ...rgbaColor];
    this.numOfVertex = this.vertexBuffer.length / 2;
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
    showLog(`id: ${this.id}`);
    showLog(`vertexBuffer: ${this.vertexBuffer}`);
    showLog(`numOfVertex: ${this.numOfVertex}`);
    showLog(`color: ${this.color}`);
    showLog(`colorBuffer: ${this.colorBuffer}`);
  }
}
