import Renderer from 'engine/Renderer';

class Geometry {
  protected _renderer: Renderer;
  protected _vertexData: Array<number>;
  protected _indices: Array<number>;
  protected _vertexBuffer: WebGLBuffer;
  protected _indexBuffer: WebGLBuffer;
  protected _trianglesSize: number;

  constructor() {
    this._vertexData = new Array();
    this._indices = new Array();
  }

  public addTriangle(v1: number, v2: number, v3: number): Geometry {
    this._indices.push(v1, v2, v3);
    return this;
  }

  public addVertex(x: number, y: number, z: number): Geometry {
    this._vertexData.push(x, y, z);

    return this;
  }

  public addColor(r: number, g: number, b: number, a: number): Geometry {
    this._vertexData.push(r, g, b, a);

    return this;
  }

  public addUVs(x: number, y: number, w: number, h: number): Geometry {
    this._vertexData.push(x, y, w, h);

    return this;
  }

  public addTexCoord(x: number, y: number): Geometry {
    this._vertexData.push(x, y);

    return this;
  }

  public build(): Geometry {
    this._renderer = Renderer.instance;

    const gl = this._renderer.gl;

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertexData), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);

    this._vertexBuffer = vertexBuffer;
    this._indexBuffer = indexBuffer;

    this._trianglesSize = this._indices.length;

    this._indices = null;
    this._vertexData = null;

    return this;
  }

  public get vertexBuffer(): WebGLBuffer {
    return this._vertexBuffer;
  }

  public get indexBuffer(): WebGLBuffer {
    return this._indexBuffer;
  }

  public get trianglesSize(): number {
    return this._trianglesSize;
  }
}

export default Geometry;
