import Renderer from 'engine/Renderer';
import { createUUID } from './system/Utils';

interface TexturesMap {
  [index: string]: Texture;
}

class Texture {
  private _img: HTMLImageElement;
  private _texture: WebGLTexture;
  private _ready: boolean;
  private _filter: number;

  private static textures: TexturesMap = {};

  public readonly id: string;
  public readonly key: string;

  constructor(key: string, src: string, filter?: number) {
    this.id = createUUID();
    this.key = key;
    this._ready = false;

    if (!filter) {
      filter = Renderer.instance.gl.NEAREST;
    }

    this._filter = filter;

    this._img = new Image();
    this._img.src = src;
    this._img.onload = () => this._processTexture();

    Texture.textures[key] = this;
  }

  private _processTexture(): void {
    const renderer = Renderer.instance;
    const gl = renderer.gl;

    this._ready = true;

    this._texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  public get texture(): WebGLTexture {
    return this._texture;
  }

  public static areTexturesReady(): boolean {
    for (const ind in Texture.textures) {
      if (!Texture.textures[ind]._ready) {
        return false;
      }
    }

    return true;
  }

  public static getTexture(key: string): Texture {
    if (!Texture.textures[key]) {
      throw new Error(`texture ${key} not found`);
    }

    return Texture.textures[key];
  }
}

export default Texture;
