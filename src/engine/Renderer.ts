import Shader from './shaders/Shader';
import basicShader from './shaders/glsl/basicShader';
import Texture from './Texture';
import Input from './system/Input';
import skyboxShader from './shaders/glsl/skyboxShader';

class Renderer {
  private _canvas: HTMLCanvasElement;
  private _gl: WebGLRenderingContext;
  private _basicShader: Shader;
  private _skyboxShader: Shader;
  private _shader: Shader;
  private _lastTexture: string;

  public static instance: Renderer;

  constructor(width: number, height: number, container?: HTMLElement) {
    Renderer.instance = this;

    this._createCanvas(width, height, container);
    this._initGL();
    this._loadShaders();

    Input.init(this._canvas);
  }

  private _createCanvas(width: number, height: number, container?: HTMLElement) {
    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    if (container) {
      container.appendChild(canvas);
    }

    this._canvas = canvas;
  }

  private _initGL() {
    const gl = this._canvas.getContext('webgl');

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1.0);

    this._gl = gl;
  }

  private _loadShaders() {
    this._basicShader = new Shader('basicS', basicShader);
    this._basicShader.useProgram();

    this._skyboxShader = new Shader('skyboxS', skyboxShader);

    this._shader = this._basicShader;
  }

  public clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  public useShader(shader: Shader) {
    shader.useProgram();
    this._shader = shader;
  }

  public bindTexture(texture: Texture, uniform: WebGLUniformLocation) {
    if (this._lastTexture === texture.key) {
      return;
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture.texture);
    this.gl.uniform1i(uniform, 0);
  }

  public get gl(): WebGLRenderingContext {
    return this._gl;
  }

  public get shader(): Shader {
    return this._shader;
  }

  public get basicShader(): Shader {
    return this._basicShader;
  }

  public get skyboxShader(): Shader {
    return this._skyboxShader;
  }
}

export default Renderer;
