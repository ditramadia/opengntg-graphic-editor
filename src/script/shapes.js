class Shape {
  constructor(id) {
    this.id = id;
    this.numOfVertex = 0;
    this.vertexBuffer = [];
    this.vertexBufferBase = [];
    this.vertexPx = [];
    this.rotation = 0;
    this.rotationBase = 0;
    this.colorBuffer = [];
    this.anchor = [];
  }

  setEndVertex(x, y, xPx, yPx) {
    throw new Error("Must be implemented");
  }

  setVertexX(i, x, xPx) {
    this.vertexBuffer[i * 2] = x;
    this.vertexPx[i * 2] = xPx;
  }

  setVertexY(i, y, yPx) {
    this.vertexBuffer[i * 2 + 1] = y;
    this.vertexPx[i * 2 + 1] = yPx;
  }

  setColor(i, rgba) {
    this.colorBuffer[i * 4] = rgba[0];
    this.colorBuffer[i * 4 + 1] = rgba[1];
    this.colorBuffer[i * 4 + 2] = rgba[2];
    this.colorBuffer[i * 4 + 3] = rgba[3];
  }

  getId() {
    return this.id;
  }

  getNumOfVertex() {
    return this.numOfVertex;
  }

  getVertexX(i) {
    return this.vertexBuffer[i * 2];
  }

  getVertexY(i) {
    return this.vertexBuffer[i * 2 + 1];
  }

  getVertexXPx(i) {
    return this.vertexPx[i * 2];
  }

  getVertexYPx(i) {
    return this.vertexPx[i * 2 + 1];
  }

  getVertexXBase(i) {
    return this.vertexBufferBase[i * 2];
  }

  getVertexYBase(i) {
    return this.vertexBufferBase[i * 2 + 1];
  }

  getRotation() {
    return this.rotation;
  }

  getColor(i) {
    return this.colorBuffer.slice(i * 4, i * 4 + 4);
  }

  getAnchor() {
    return this.anchor;
  }

  translateX(i, diffX) {
    this.setVertexX(
      i,
      this.vertexBufferBase[i * 2] + diffX,
      denormalizeX(this.vertexBufferBase[i * 2] + diffX)
    );
  }

  translateY(i, diffY) {
    this.setVertexY(
      i,
      this.vertexBufferBase[i * 2 + 1] + diffY,
      denormalizeY(this.vertexBufferBase[i * 2 + 1] + diffY)
    );
  }

  updateCentroid() {
    let tempX = 0;
    let tempY = 0;
    for (let i = 0; i < this.vertexBuffer.length; i += 2) {
      tempX += this.vertexBuffer[i];
      tempY += this.vertexBuffer[i + 1];
    }
    this.anchor[0] = tempX / this.numOfVertex;
    this.anchor[1] = tempY / this.numOfVertex;
  }

  render() {
    throw new Error("Must be implemented");
  }

  print() {
    throw new Error("Must be implemented");
  }
}

class Line extends Shape {
  constructor(id, x, y, xPx, yPx, rgbaColor) {
    super(id);

    this.vertexBuffer = [x, y, x, y];
    this.vertexBufferBase = this.vertexBuffer;
    this.vertexPx = [xPx, yPx, xPx, yPx];
    this.colorBuffer = [...rgbaColor, ...rgbaColor];
    this.numOfVertex = this.vertexBuffer.length / 2;
    this.anchor = [x, y];
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

  setEndVertex(x, y, xPx, yPx) {
    this.vertexBuffer[2] = x;
    this.vertexPx[2] = xPx;
    this.vertexBuffer[3] = y;
    this.vertexPx[3] = yPx;
  }

  print() {
    showLog("\nLine");
    showLog(`id: ${this.id}`);
    showLog(`numOfVertex: ${this.numOfVertex}`);
    showLog(`colorBuffer: ${this.colorBuffer}`);
    showLog(`vertexBuffer: ${this.vertexBuffer}`);
    showLog(`vertexPx: ${this.vertexPx}`);
    showLog(`vertexBufferBase: ${this.vertexBufferBase}`);
    showLog(`Rotation: ${this.rotation}`);
    showLog(`RotationBase: ${this.rotationBase}`);
    showLog(`Anchor: ${this.anchor}`);
  }
}
