class Shape {
  constructor(id) {
    this.id = id;
    this.numOfVertex = 0;
    this.vertexBuffer = [];
    this.vertexBufferBase = [];
    this.vertexPx = [];
    this.rotation = 0;
    this.rotationBase = 0;
    this.width = 0;
    this.height = 0;
    this.colorBuffer = [];
    this.anchor = [];
  }

  setEndVertex(x, y, xPx, yPx) {
    const lastVertexIdx = this.numOfVertex - 1;
    this.vertexBuffer[lastVertexIdx * 2] = x;
    this.vertexBuffer[lastVertexIdx * 2 + 1] = y;
    this.vertexPx[lastVertexIdx * 2 + 1] = xPx;
    this.vertexPx[lastVertexIdx * 2 + 1] = yPx;
    this.updateVertexBase();
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  setVertexX(i, x, xPx) {
    this.vertexBuffer[i * 2] = x;
    this.vertexPx[i * 2] = xPx;
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  setVertexY(i, y, yPx) {
    this.vertexBuffer[i * 2 + 1] = y;
    this.vertexPx[i * 2 + 1] = yPx;
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  setWidth() {
    throw new Error("Must be implemented");
  }

  setHeight() {
    throw new Error("Must be implemented");
  }

  pointDrag(i, xPx, yPx) {
    throw new Error("Must be implemented");
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

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getAnchor() {
    return this.anchor;
  }

  translateX(i, diffX) {
    const finalX = this.vertexBufferBase[i * 2] + diffX;
    this.setVertexX(i, finalX, denormalizeX(finalX));
    this.updateAnchor();
  }

  translateY(i, diffY) {
    const finalY = this.vertexBufferBase[i * 2 + 1] + diffY;
    this.setVertexY(i, finalY, denormalizeY(finalY));
    this.updateAnchor();
  }

  rotate(rad) {
    const cos = Math.cos(rad - degreeToRadian(this.rotation));
    const sin = Math.sin(rad - degreeToRadian(this.rotation));
    const anchorPx = [
      denormalizeX(this.anchor[0]),
      denormalizeY(this.anchor[1]),
    ];

    for (let i = 0; i < this.getNumOfVertex(); i++) {
      const xDist = this.getVertexXPx(i) - anchorPx[0];
      const yDist = this.getVertexYPx(i) - anchorPx[1];

      const finalX = xDist * cos - yDist * sin + anchorPx[0];
      const finalY = xDist * sin + yDist * cos + anchorPx[1];

      this.setVertexX(i, normalizeX(finalX), finalX);
      this.setVertexY(i, normalizeY(finalY), finalY);
    }

    this.rotation = radianToDegree(rad);
    this.updateVertexBase();
  }

  updateVertexBase() {
    for (let i = 0; i < this.vertexBuffer.length; i += 2) {
      this.vertexBufferBase[i] = this.vertexBuffer[i];
      this.vertexBufferBase[i + 1] = this.vertexBuffer[i + 1];
    }
  }

  updateWidth() {
    throw new Error("Must be implemented");
  }

  updateHeight() {
    throw new Error("Must be implemented");
  }

  updateAnchor() {
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

  delete() {
    this.vertexBuffer = [];
    this.vertexBufferBase = [];
    this.vertexPx = [];
    this.colorBuffer = [];
    this.numOfVertex = 0;
    this.anchor = [];
    this.width = 0;
    this.height = 0;
    this.rotation = 0;
    this.rotationBase = 0;
  }

  print() {
    throw new Error("Must be implemented");
  }
}

class Line extends Shape {
  constructor(id, x, y, xPx, yPx, rgbaColor) {
    super(id);

    this.vertexBuffer = [x, y, x, y];
    this.vertexBufferBase = [x, y, x, y];
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

  setWidth(newWidth) {
    const halfWidth = this.width / 2;
    const halfDiff = (newWidth - this.width) / 2;

    const anchorPx = [
      denormalizeX(this.anchor[0]),
      denormalizeY(this.anchor[1]),
    ];

    const initDiagonal = this.width / 2;
    const finalDiagonal = halfWidth + halfDiff;

    for (let i = 0; i < this.numOfVertex; i++) {
      const initHorizontal = this.getVertexXPx(i) - anchorPx[0];
      const initVertical = this.getVertexYPx(i) - anchorPx[1];

      const ratioHorizontal = initHorizontal / initDiagonal;
      const ratioVertical = initVertical / initDiagonal;

      const finalHorizontal = finalDiagonal * ratioHorizontal + anchorPx[0];
      const finalVertical = finalDiagonal * ratioVertical + anchorPx[1];

      this.setVertexX(i, normalizeX(finalHorizontal), finalHorizontal);
      this.setVertexY(i, normalizeY(finalVertical), finalVertical);
    }

    this.updateWidth();
    this.updateVertexBase();
  }

  updateWidth() {
    this.width = distance2Vec(
      this.getVertexXPx(0),
      this.getVertexYPx(0),
      this.getVertexXPx(1),
      this.getVertexYPx(1)
    );
  }

  updateHeight() {
    this.height = 0;
  }

  setEndVertex(x, y, xPx, yPx) {
    this.vertexBuffer[2] = x;
    this.vertexBuffer[3] = y;
    this.vertexPx[2] = xPx;
    this.vertexPx[3] = yPx;
    this.updateVertexBase();
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  print() {
    showLog("\nLine");
    showLog(`id: ${this.id}`);
    showLog(`numOfVertex: ${this.numOfVertex}`);
    showLog(`colorBuffer: ${this.colorBuffer}`);
    showLog(`vertexBuffer: ${this.vertexBuffer}`);
    showLog(`vertexPx: ${this.vertexPx}`);
    showLog(`vertexBufferBase: ${this.vertexBufferBase}`);
    showLog(`Width: ${this.width}`);
    showLog(`Height: ${this.height}`);
    showLog(`Rotation: ${this.rotation}`);
    showLog(`RotationBase: ${this.rotationBase}`);
    showLog(`Anchor: ${this.anchor}`);
  }
}

class Square extends Shape {
  constructor(id, x, y, xPx, yPx, rgbaColor) {
    super(id);

    this.vertexBuffer = [x, y, x, y, x, y, x, y];
    this.vertexBufferBase = [x, y, x, y, x, y, x, y];
    this.vertexPx = [xPx, yPx, xPx, yPx, xPx, yPx, xPx, yPx];
    this.colorBuffer = [...rgbaColor, ...rgbaColor, ...rgbaColor, ...rgbaColor];
    this.numOfVertex = 4;
    this.anchor = [x, y];
  }

  render(program) {
    // Render vertex buffer
    render(gl, program, "vertexPosition", this.vertexBuffer, 2);

    // Render colorBuffer
    render(gl, program, "vertexColor", this.colorBuffer, 4);

    // Draw the square
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  setEndVertex(x, y, xPx, yPx) {
    const lastVertexIdx = 3;
    const upperRightIdx = 1;
    const lowerLeftIdx = 2;
    const firstVertexIdx = 0;

    const dx = Math.abs(xPx - this.getVertexXPx(firstVertexIdx));
    const dy = Math.abs(yPx - this.getVertexYPx(firstVertexIdx));
    const size = Math.min(dx, dy);

    const directionX = xPx >= this.getVertexXPx(firstVertexIdx) ? 1 : -1;
    const directionY = yPx >= this.getVertexYPx(firstVertexIdx) ? 1 : -1;

    this.setVertexX(
      lastVertexIdx,
      normalizeX(this.getVertexXPx(firstVertexIdx) + size * directionX),
      this.getVertexXPx(firstVertexIdx) + size * directionX
    );
    this.setVertexY(
      lastVertexIdx,
      normalizeY(this.getVertexYPx(firstVertexIdx) + size * directionY),
      this.getVertexYPx(firstVertexIdx) + size * directionY
    );

    this.setVertexX(
      upperRightIdx,
      normalizeX(this.getVertexXPx(firstVertexIdx) + size * directionX),
      this.getVertexXPx(firstVertexIdx) + size * directionX
    );
    this.setVertexY(
      upperRightIdx,
      normalizeY(this.getVertexYPx(firstVertexIdx)),
      this.getVertexYPx(firstVertexIdx)
    );

    this.setVertexX(
      lowerLeftIdx,
      normalizeX(this.getVertexXPx(firstVertexIdx)),
      this.getVertexXPx(firstVertexIdx)
    );
    this.setVertexY(
      lowerLeftIdx,
      normalizeY(this.getVertexYPx(firstVertexIdx) + size * directionY),
      this.getVertexYPx(firstVertexIdx) + size * directionY
    );

    this.updateVertexBase();
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  setWidth(newWidth) {
    const halfWidth = this.width / 2;
    const halfDiff = (newWidth - this.width) / 2;

    const anchorPx = [
      denormalizeX(this.anchor[0]),
      denormalizeY(this.anchor[1]),
    ];

    const initDiagonal = this.width / 2;
    const finalDiagonal = halfWidth + halfDiff;

    for (let i = 0; i < this.numOfVertex; i++) {
      const initHorizontal = this.getVertexXPx(i) - anchorPx[0];
      const initVertical = this.getVertexYPx(i) - anchorPx[1];

      const ratioHorizontal = initHorizontal / initDiagonal;
      const ratioVertical = initVertical / initDiagonal;

      const finalHorizontal = finalDiagonal * ratioHorizontal + anchorPx[0];
      const finalVertical = finalDiagonal * ratioVertical + anchorPx[1];

      this.setVertexX(i, normalizeX(finalHorizontal), finalHorizontal);
      this.setVertexY(i, normalizeY(finalVertical), finalVertical);
    }

    this.updateWidth();
    this.updateVertexBase();
  }

  setHeight(newHeight) {
    this.setWidth(newHeight);
  }

  pointDrag(selectedPoint, xPx, yPx) {
    const lastVertexIdx = 3;
    const upperRightIdx = 1;
    const lowerLeftIdx = 2;
    const firstVertexIdx = 0;

    const dx = Math.abs(
      xPx -
        this.getVertexXPx(
          selectedPoint === lastVertexIdx
            ? firstVertexIdx
            : selectedPoint === upperRightIdx
            ? lowerLeftIdx
            : selectedPoint === lowerLeftIdx
            ? upperRightIdx
            : lastVertexIdx
        )
    );
    const dy = Math.abs(
      yPx -
        this.getVertexYPx(
          selectedPoint === lastVertexIdx
            ? firstVertexIdx
            : selectedPoint === upperRightIdx
            ? lowerLeftIdx
            : selectedPoint === lowerLeftIdx
            ? upperRightIdx
            : lastVertexIdx
        )
    );
    const size = Math.min(dx, dy);
    const directionX =
      xPx >=
      this.getVertexXPx(
        selectedPoint === lastVertexIdx
          ? firstVertexIdx
          : selectedPoint === upperRightIdx
          ? lowerLeftIdx
          : selectedPoint === lowerLeftIdx
          ? upperRightIdx
          : lastVertexIdx
      )
        ? 1
        : -1;
    const directionY =
      yPx >=
      this.getVertexYPx(
        selectedPoint === lastVertexIdx
          ? firstVertexIdx
          : selectedPoint === upperRightIdx
          ? lowerLeftIdx
          : selectedPoint === lowerLeftIdx
          ? upperRightIdx
          : lastVertexIdx
      )
        ? 1
        : -1;

    if (selectedPoint === lastVertexIdx) {
      this.setVertexX(
        lastVertexIdx,
        normalizeX(this.getVertexXPx(firstVertexIdx) + size * directionX),
        this.getVertexXPx(firstVertexIdx) + size * directionX
      );
      this.setVertexY(
        lastVertexIdx,
        normalizeY(this.getVertexYPx(firstVertexIdx) + size * directionY),
        this.getVertexYPx(firstVertexIdx) + size * directionY
      );

      this.setVertexX(
        upperRightIdx,
        normalizeX(this.getVertexXPx(firstVertexIdx) + size * directionX),
        this.getVertexXPx(firstVertexIdx) + size * directionX
      );
      this.setVertexY(
        upperRightIdx,
        normalizeY(this.getVertexYPx(firstVertexIdx)),
        this.getVertexYPx(firstVertexIdx)
      );

      this.setVertexX(
        lowerLeftIdx,
        normalizeX(this.getVertexXPx(firstVertexIdx)),
        this.getVertexXPx(firstVertexIdx)
      );
      this.setVertexY(
        lowerLeftIdx,
        normalizeY(this.getVertexYPx(firstVertexIdx) + size * directionY),
        this.getVertexYPx(firstVertexIdx) + size * directionY
      );
    } else if (selectedPoint === upperRightIdx) {
      this.setVertexX(
        upperRightIdx,
        normalizeX(this.getVertexXPx(lowerLeftIdx) + size * directionX),
        this.getVertexXPx(lowerLeftIdx) + size * directionX
      );
      this.setVertexY(
        upperRightIdx,
        normalizeY(this.getVertexYPx(lowerLeftIdx) + size * directionY),
        this.getVertexYPx(lowerLeftIdx) + size * directionY
      );

      this.setVertexX(
        lastVertexIdx,
        normalizeX(this.getVertexXPx(lowerLeftIdx) + size * directionX),
        this.getVertexXPx(lowerLeftIdx) + size * directionX
      );
      this.setVertexY(
        lastVertexIdx,
        normalizeY(this.getVertexYPx(lowerLeftIdx)),
        this.getVertexYPx(lowerLeftIdx)
      );

      this.setVertexX(
        firstVertexIdx,
        normalizeX(this.getVertexXPx(lowerLeftIdx)),
        this.getVertexXPx(lowerLeftIdx)
      );
      this.setVertexY(
        firstVertexIdx,
        normalizeY(this.getVertexYPx(lowerLeftIdx) + size * directionY),
        this.getVertexYPx(lowerLeftIdx) + size * directionY
      );
    } else if (selectedPoint === lowerLeftIdx) {
      this.setVertexX(
        lowerLeftIdx,
        normalizeX(this.getVertexXPx(upperRightIdx) + size * directionX),
        this.getVertexXPx(upperRightIdx) + size * directionX
      );
      this.setVertexY(
        lowerLeftIdx,
        normalizeY(this.getVertexYPx(upperRightIdx) + size * directionY),
        this.getVertexYPx(upperRightIdx) + size * directionY
      );

      this.setVertexX(
        firstVertexIdx,
        normalizeX(this.getVertexXPx(upperRightIdx) + size * directionX),
        this.getVertexXPx(upperRightIdx) + size * directionX
      );
      this.setVertexY(
        firstVertexIdx,
        normalizeY(this.getVertexYPx(upperRightIdx)),
        this.getVertexYPx(upperRightIdx)
      );

      this.setVertexX(
        lastVertexIdx,
        normalizeX(this.getVertexXPx(upperRightIdx)),
        this.getVertexXPx(upperRightIdx)
      );
      this.setVertexY(
        lastVertexIdx,
        normalizeY(this.getVertexYPx(upperRightIdx) + size * directionY),
        this.getVertexYPx(upperRightIdx) + size * directionY
      );
    } else if (selectedPoint === firstVertexIdx) {
      this.setVertexX(
        firstVertexIdx,
        normalizeX(this.getVertexXPx(lastVertexIdx) + size * directionX),
        this.getVertexXPx(lastVertexIdx) + size * directionX
      );
      this.setVertexY(
        firstVertexIdx,
        normalizeY(this.getVertexYPx(lastVertexIdx) + size * directionY),
        this.getVertexYPx(lastVertexIdx) + size * directionY
      );

      this.setVertexX(
        upperRightIdx,
        normalizeX(this.getVertexXPx(lastVertexIdx)),
        this.getVertexXPx(lastVertexIdx)
      );
      this.setVertexY(
        upperRightIdx,
        normalizeY(this.getVertexYPx(lastVertexIdx) + size * directionY),
        this.getVertexYPx(lastVertexIdx) + size * directionY
      );

      this.setVertexX(
        lowerLeftIdx,
        normalizeX(this.getVertexXPx(lastVertexIdx) + size * directionX),
        this.getVertexXPx(lastVertexIdx) + size * directionX
      );
      this.setVertexY(
        lowerLeftIdx,
        normalizeY(this.getVertexYPx(lastVertexIdx)),
        this.getVertexYPx(lastVertexIdx)
      );
    }

    this.updateVertexBase();
    this.updateWidth();
    this.updateHeight();
  }

  updateWidth() {
    this.width = distance2Vec(
      this.getVertexXPx(0),
      this.getVertexYPx(0),
      this.getVertexXPx(1),
      this.getVertexYPx(1)
    );
  }

  updateHeight() {
    this.height = distance2Vec(
      this.getVertexXPx(0),
      this.getVertexYPx(0),
      this.getVertexXPx(2),
      this.getVertexYPx(2)
    );
  }
}

class Rectangle extends Shape {
  constructor(id, x, y, xPx, yPx, rgbaColor) {
    super(id);

    this.vertexBuffer = [x, y, x, y, x, y, x, y];
    this.vertexBufferBase = [x, y, x, y, x, y, x, y];
    this.vertexPx = [xPx, yPx, xPx, yPx, xPx, yPx, xPx, yPx];
    this.colorBuffer = [...rgbaColor, ...rgbaColor, ...rgbaColor, ...rgbaColor];
    this.numOfVertex = 4;
    this.anchor = [x, y];
  }

  render(program) {
    // Render vertex buffer
    render(gl, program, "vertexPosition", this.vertexBuffer, 2);

    // Render colorBuffer
    render(gl, program, "vertexColor", this.colorBuffer, 4);

    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  setEndVertex(x, y, xPx, yPx) {
    const lastVertexIdx = 3;
    const upperRightIdx = 1;
    const lowerLeftIdx = 2;
    const firstVertexIdx = 0;

    this.setVertexX(lastVertexIdx, x, xPx);
    this.setVertexY(lastVertexIdx, y, yPx);

    this.setVertexX(upperRightIdx, x, xPx);
    this.setVertexY(
      upperRightIdx,
      this.getVertexY(firstVertexIdx),
      this.getVertexYPx(firstVertexIdx)
    );

    this.setVertexX(
      lowerLeftIdx,
      this.getVertexX(firstVertexIdx),
      this.getVertexXPx(firstVertexIdx)
    );
    this.setVertexY(lowerLeftIdx, y, yPx);

    this.updateVertexBase();
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  setWidth(newWidth) {
    const halfDiff = (newWidth - this.width) / 2;

    const cos = Math.cos(degreeToRadian(this.rotation));
    const sin = Math.sin(degreeToRadian(this.rotation));

    for (let i = 0; i < this.numOfVertex; i++) {
      if (i % 2 === 0) {
        const finalX = this.getVertexXPx(i) - halfDiff * cos;
        const finalY = this.getVertexYPx(i) - halfDiff * sin;

        this.setVertexX(i, normalizeX(finalX), finalX);
        this.setVertexY(i, normalizeY(finalY), finalY);
      } else {
        const finalX = this.getVertexXPx(i) + halfDiff * cos;
        const finalY = this.getVertexYPx(i) + halfDiff * sin;

        this.setVertexX(i, normalizeX(finalX), finalX);
        this.setVertexY(i, normalizeY(finalY), finalY);
      }
    }

    this.updateWidth();
    this.updateVertexBase();
  }

  setHeight(newHeight) {
    const halfDiff = (newHeight - this.height) / 2;

    const cos = Math.cos(degreeToRadian(this.rotation));
    const sin = Math.sin(degreeToRadian(this.rotation));

    for (let i = 0; i < this.numOfVertex; i++) {
      if (i === 0 || i === 1) {
        const finalX = this.getVertexXPx(i) + halfDiff * sin;
        const finalY = this.getVertexYPx(i) - halfDiff * cos;

        this.setVertexX(i, normalizeX(finalX), finalX);
        this.setVertexY(i, normalizeY(finalY), finalY);
      } else {
        const finalX = this.getVertexXPx(i) - halfDiff * sin;
        const finalY = this.getVertexYPx(i) + halfDiff * cos;

        this.setVertexX(i, normalizeX(finalX), finalX);
        this.setVertexY(i, normalizeY(finalY), finalY);
      }
    }

    this.updateHeight();
    this.updateVertexBase();
  }

  pointDrag(selectedPoint, xPx, yPx) {
    const lastVertexIdx = 3;
    const upperRightIdx = 1;
    const lowerLeftIdx = 2;
    const firstVertexIdx = 0;

    var dx = Math.abs(
      xPx -
        this.getVertexXPx(
          selectedPoint === lastVertexIdx
            ? firstVertexIdx
            : selectedPoint === upperRightIdx
            ? lowerLeftIdx
            : selectedPoint === lowerLeftIdx
            ? upperRightIdx
            : lastVertexIdx
        )
    );
    var dy = Math.abs(
      yPx -
        this.getVertexYPx(
          selectedPoint === lastVertexIdx
            ? firstVertexIdx
            : selectedPoint === upperRightIdx
            ? lowerLeftIdx
            : selectedPoint === lowerLeftIdx
            ? upperRightIdx
            : lastVertexIdx
        )
    );
    const directionX =
      xPx >=
      this.getVertexXPx(
        selectedPoint === lastVertexIdx
          ? firstVertexIdx
          : selectedPoint === upperRightIdx
          ? lowerLeftIdx
          : selectedPoint === lowerLeftIdx
          ? upperRightIdx
          : lastVertexIdx
      )
        ? 1
        : -1;
    const directionY =
      yPx >=
      this.getVertexYPx(
        selectedPoint === lastVertexIdx
          ? firstVertexIdx
          : selectedPoint === upperRightIdx
          ? lowerLeftIdx
          : selectedPoint === lowerLeftIdx
          ? upperRightIdx
          : lastVertexIdx
      )
        ? 1
        : -1;

    const currentWidth = Math.abs(
      this.getVertexXPx(upperRightIdx) - this.getVertexXPx(lowerLeftIdx)
    );
    const currentHeight = Math.abs(
      this.getVertexYPx(upperRightIdx) - this.getVertexYPx(lowerLeftIdx)
    );
    const aspectRatio = currentWidth / currentHeight;

    if (dx > dy * aspectRatio) {
      dy = dx / aspectRatio;
    } else {
      dx = dy * aspectRatio;
    }

    if (selectedPoint === lastVertexIdx) {
      this.setVertexX(
        lastVertexIdx,
        normalizeX(this.getVertexXPx(firstVertexIdx) + dx * directionX),
        this.getVertexXPx(firstVertexIdx) + dx * directionX
      );
      this.setVertexY(
        lastVertexIdx,
        normalizeY(this.getVertexYPx(firstVertexIdx) + dy * directionY),
        this.getVertexYPx(firstVertexIdx) + dy * directionY
      );

      this.setVertexX(
        upperRightIdx,
        normalizeX(this.getVertexXPx(firstVertexIdx) + dx * directionX),
        this.getVertexXPx(firstVertexIdx) + dx * directionX
      );
      this.setVertexY(
        upperRightIdx,
        normalizeY(this.getVertexYPx(firstVertexIdx)),
        this.getVertexYPx(firstVertexIdx)
      );

      this.setVertexX(
        lowerLeftIdx,
        normalizeX(this.getVertexXPx(firstVertexIdx)),
        this.getVertexXPx(firstVertexIdx)
      );
      this.setVertexY(
        lowerLeftIdx,
        normalizeY(this.getVertexYPx(firstVertexIdx) + dy * directionY),
        this.getVertexYPx(firstVertexIdx) + dy * directionY
      );
    } else if (selectedPoint === upperRightIdx) {
      this.setVertexX(
        upperRightIdx,
        normalizeX(this.getVertexXPx(lowerLeftIdx) + dx * directionX),
        this.getVertexXPx(lowerLeftIdx) + dx * directionX
      );
      this.setVertexY(
        upperRightIdx,
        normalizeY(this.getVertexYPx(lowerLeftIdx) + dy * directionY),
        this.getVertexYPx(lowerLeftIdx) + dy * directionY
      );

      this.setVertexX(
        lastVertexIdx,
        normalizeX(this.getVertexXPx(lowerLeftIdx) + dx * directionX),
        this.getVertexXPx(lowerLeftIdx) + dx * directionX
      );
      this.setVertexY(
        lastVertexIdx,
        normalizeY(this.getVertexYPx(lowerLeftIdx)),
        this.getVertexYPx(lowerLeftIdx)
      );

      this.setVertexX(
        firstVertexIdx,
        normalizeX(this.getVertexXPx(lowerLeftIdx)),
        this.getVertexXPx(lowerLeftIdx)
      );
      this.setVertexY(
        firstVertexIdx,
        normalizeY(this.getVertexYPx(lowerLeftIdx) + dy * directionY),
        this.getVertexYPx(lowerLeftIdx) + dy * directionY
      );
    } else if (selectedPoint === lowerLeftIdx) {
      this.setVertexX(
        lowerLeftIdx,
        normalizeX(this.getVertexXPx(upperRightIdx) + dx * directionX),
        this.getVertexXPx(upperRightIdx) + dx * directionX
      );
      this.setVertexY(
        lowerLeftIdx,
        normalizeY(this.getVertexYPx(upperRightIdx) + dy * directionY),
        this.getVertexYPx(upperRightIdx) + dy * directionY
      );

      this.setVertexX(
        firstVertexIdx,
        normalizeX(this.getVertexXPx(upperRightIdx) + dx * directionX),
        this.getVertexXPx(upperRightIdx) + dx * directionX
      );
      this.setVertexY(
        firstVertexIdx,
        normalizeY(this.getVertexYPx(upperRightIdx)),
        this.getVertexYPx(upperRightIdx)
      );

      this.setVertexX(
        lastVertexIdx,
        normalizeX(this.getVertexXPx(upperRightIdx)),
        this.getVertexXPx(upperRightIdx)
      );
      this.setVertexY(
        lastVertexIdx,
        normalizeY(this.getVertexYPx(upperRightIdx) + dy * directionY),
        this.getVertexYPx(upperRightIdx) + dy * directionY
      );
    } else if (selectedPoint === firstVertexIdx) {
      this.setVertexX(
        firstVertexIdx,
        normalizeX(this.getVertexXPx(lastVertexIdx) + dx * directionX),
        this.getVertexXPx(lastVertexIdx) + dx * directionX
      );
      this.setVertexY(
        firstVertexIdx,
        normalizeY(this.getVertexYPx(lastVertexIdx) + dy * directionY),
        this.getVertexYPx(lastVertexIdx) + dy * directionY
      );

      this.setVertexX(
        upperRightIdx,
        normalizeX(this.getVertexXPx(lastVertexIdx) + dx * directionX),
        this.getVertexXPx(lastVertexIdx) + dx * directionX
      );
      this.setVertexY(
        upperRightIdx,
        normalizeY(this.getVertexYPx(lastVertexIdx)),
        this.getVertexYPx(lastVertexIdx)
      );

      this.setVertexX(
        lowerLeftIdx,
        normalizeX(this.getVertexXPx(lastVertexIdx)),
        this.getVertexXPx(lastVertexIdx)
      );
      this.setVertexY(
        lowerLeftIdx,
        normalizeY(this.getVertexYPx(lastVertexIdx) + dy * directionY),
        this.getVertexYPx(lastVertexIdx) + dy * directionY
      );
    }

    this.updateVertexBase();
    this.updateWidth();
    this.updateHeight();
  }

  updateWidth() {
    this.width = distance2Vec(
      this.getVertexXPx(0),
      this.getVertexYPx(0),
      this.getVertexXPx(1),
      this.getVertexYPx(1)
    );
  }

  updateHeight() {
    this.height = distance2Vec(
      this.getVertexXPx(0),
      this.getVertexYPx(0),
      this.getVertexXPx(2),
      this.getVertexYPx(2)
    );
  }
}

class Polygon extends Shape {
  constructor(id, x, y, xPx, yPx, rgbaColor) {
    super(id);

    this.vertexBuffer = [x, y, x, y];
    this.vertexBufferBase = [x, y, x, y];
    this.vertexPx = [xPx, yPx, xPx, yPx];
    this.colorBuffer = [...rgbaColor, ...rgbaColor];
    this.numOfVertex = 2;
    this.anchor = [x, y];
  }

  updateWidth() {
    this.width = 0;
  }

  updateHeight() {
    this.height = 0;
  }

  removeVertex(i) {
    this.vertexBuffer.splice(i * 2, 2);
    this.vertexPx.splice(i * 2, 2);
    this.colorBuffer.splice(i * 4, 4);
    this.numOfVertex--;
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  editPolygon(x, y, xPx, yPx, rgbaColor) {
    if (this.numOfVertex < 3) {
      return;
    }

    // If a vertex is selected, remove the vertex
    let minDistance = Number.MAX_SAFE_INTEGER;
    let index = -1;
    for (let i = 0; i < this.numOfVertex; i++) {
      const dx = this.getVertexX(i) - x;
      const dy = this.getVertexY(i) - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
            minDistance = distance;
            index = i;
        }
      if (distance < 0.05) {
        this.removeVertex(i);
        return;
      }
    }

    const dxAf = (index === this.numOfVertex - 1)
        ?this.getVertexX(0) - x
        :this.getVertexX(index+1) - x;
    const dyAf = (index === this.numOfVertex - 1)
        ?this.getVertexX(0) - x
        :this.getVertexY(index+1) - y;
    const distanceAf = Math.sqrt(dxAf * dxAf + dyAf * dyAf);
    const dxBf = this.getVertexX(index-1) - x;
    const dyBf = this.getVertexY(index-1) - y;
    const distanceBf = Math.sqrt(dxBf * dxBf + dyBf * dyBf);

    // Add a new vertex
    (distanceAf>distanceBf)?this.addVertexSpecificIndex(x, y, xPx, yPx, rgbaColor, (index === this.numOfVertex - 1)?0:index+1):
    this.addVertexSpecificIndex(x, y, xPx, yPx, rgbaColor, index);
  }

  isClosed() {
    if (this.numOfVertex < 3) {
      return;
    }
    const lastVertexIdx = this.numOfVertex - 1;
    const dx = this.getVertexX(0) - this.getVertexX(lastVertexIdx);
    const dy = this.getVertexY(0) - this.getVertexY(lastVertexIdx);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 0.05;
  }

  addVertex(x, y, xPx, yPx, rgbaColor) {
    this.vertexBuffer.push(x, y);
    this.vertexBufferBase.push(x, y);
    this.vertexPx.push(xPx, yPx);
    this.colorBuffer.push(...rgbaColor);
    this.numOfVertex++;
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  addVertexSpecificIndex(x, y, xPx, yPx, rgbaColor, index) {
    this.vertexBuffer.splice(index * 2, 0, x, y);
    this.vertexBufferBase.splice(index * 2, 0, x, y);
    this.vertexPx.splice(index * 2, 0, xPx, yPx);
    this.colorBuffer.splice(index * 4, 0, ...rgbaColor);
    this.numOfVertex++;
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  closePolygon() {
    this.vertexBuffer.pop();
    this.vertexBuffer.pop();
    this.vertexBufferBase.pop();
    this.vertexBufferBase.pop();
    this.vertexPx.pop();
    this.vertexPx.pop();
    this.colorBuffer.pop();
    this.colorBuffer.pop();
    this.colorBuffer.pop();
    this.colorBuffer.pop();
    this.numOfVertex -= 1;
    this.updateAnchor();
    this.updateWidth();
    this.updateHeight();
  }

  pointDrag(i, xPx, yPx) {}

  render(program) {
    // Render vertex buffer
    render(gl, program, "vertexPosition", this.vertexBuffer, 2);

    // Render colorBuffer
    render(gl, program, "vertexColor", this.colorBuffer, 4);

    // Draw the line
    if (this.numOfVertex > 2) {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, this.numOfVertex);
    } else {
      for (let i = 0; i < this.numOfVertex; i += 2) {
        gl.drawArrays(gl.LINES, i, 2);
      }
    }
  }
}
