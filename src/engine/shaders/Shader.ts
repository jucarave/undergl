import ShaderStruct from './ShaderStruct';
import Renderer from 'engine/Renderer';

interface StructMap {
  [index: string]: Array<string>;
}

interface Attributes {
  [index: string]: number;
}

interface Uniforms {
  [index: string]: WebGLUniformLocation;
}

class Shader {
  private _renderer: Renderer;
  private _program: WebGLProgram;

  public attributesCount: number;
  public attributes: Attributes;
  public uniforms: Uniforms;

  public static maxAttribLength: number = 0;

  constructor(shaderInfo: ShaderStruct, renderer: Renderer) {
    this._renderer = renderer;

    this._compileShaders(shaderInfo);
    this._getShaderAttributes(shaderInfo);
    this._getShaderUniforms(shaderInfo);
  }

  private _compileShaders(shaderInfo: ShaderStruct) {
    const gl = this._renderer.gl;

    const vShader: WebGLShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, shaderInfo.vertexShader);
    gl.compileShader(vShader);

    const fShader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, shaderInfo.fragmentShader);
    gl.compileShader(fShader);

    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(vShader));
      throw new Error('Error compiling vertex shader');
    }

    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(fShader));
      throw new Error('Error compiling fragment shader');
    }

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log(gl.getProgramInfoLog(program));
      throw new Error('Error linking the program');
    }

    this._program = program;
  }

  private _getShaderAttributes(shader: ShaderStruct): void {
    const code: Array<string> = shader.vertexShader.split(/\n/g),
      gl: WebGLRenderingContext = this._renderer.gl,
      program = this._program;

    let attribute: string;
    let location: number;

    this.attributesCount = 0;

    const attributes: Attributes = {};

    for (let i = 0, len = code.length; i < len; i++) {
      const c: Array<string> = code[i].trim().split(/ /g);

      if (c[0] == 'attribute') {
        attribute = c.pop().replace(/;/g, '');
        location = gl.getAttribLocation(program, attribute);

        attributes[attribute] = location;
        this.attributesCount += 1;
      }
    }

    this.attributes = attributes;

    Shader.maxAttribLength = Math.max(Shader.maxAttribLength, this.attributesCount);
  }

  private _getShaderUniforms(shader: ShaderStruct): void {
    let code: Array<string> = shader.vertexShader.split(/\n/g);
    code = code.concat(shader.fragmentShader.split(/\n/g));

    const gl: WebGLRenderingContext = this._renderer.gl;
    const program = this._program;

    const usedUniforms: Array<string> = [];
    let uniform: string;
    let location: WebGLUniformLocation;

    const uniforms: Uniforms = {};

    const structMap: StructMap = {};
    let lastStruct: string = null;

    const defines: any = {};

    for (let i = 0, len = code.length; i < len; i++) {
      const c: Array<string> = code[i].trim().split(/ /g);
      if (c[0] == '') {
        continue;
      }

      if (c[0] == 'struct') {
        lastStruct = c[1];
        structMap[lastStruct] = [];
      } else if (c[0] == 'uniform') {
        uniform = c.pop().replace(/;/g, '');
        let size: number = 0;

        if (uniform.indexOf('[') != -1) {
          const ind = uniform.indexOf('[');
          const sizeStr = uniform.substring(ind + 1, uniform.indexOf(']'));

          size = defines[sizeStr] ? parseInt(defines[sizeStr]) : parseInt(sizeStr);
          uniform = uniform.substring(0, ind);
        }

        const type: string = c.pop();

        if (structMap[type]) {
          const struct = structMap[type];
          for (let k = 0; k < Math.max(size, 1); k++) {
            for (let j = 0, prop; (prop = struct[j]); j++) {
              const uniformProperty = uniform + (size > 0 ? '[' + k + ']' : '') + '.' + prop;
              if (usedUniforms.indexOf(uniformProperty) != -1) {
                continue;
              }

              location = gl.getUniformLocation(program, uniformProperty);
              usedUniforms.push(uniformProperty);
              uniforms[uniformProperty] = location;
            }
          }
        } else {
          for (let k = 0; k < Math.max(size, 1); k++) {
            const uniformProperty = uniform + (size > 0 ? '[' + k + ']' : '');
            if (usedUniforms.indexOf(uniformProperty) != -1) {
              continue;
            }

            location = gl.getUniformLocation(program, uniformProperty);
            usedUniforms.push(uniformProperty);
            uniforms[uniformProperty] = location;
          }
        }
      } else if (c[0] == '#define') {
        defines[c[1]] = c[2];
      } else if (lastStruct != null) {
        const property: string = c.pop().replace(/;/g, '');
        if (property == '}') {
          lastStruct = null;
        } else {
          structMap[lastStruct].push(property);
        }
      }
    }

    this.uniforms = uniforms;
  }

  public useProgram() {
    const gl = this._renderer.gl;
    gl.useProgram(this._program);

    for (let i = 0; i < Shader.maxAttribLength; i++) {
      if (i < this.attributesCount) {
        gl.enableVertexAttribArray(i);
      } else {
        gl.disableVertexAttribArray(i);
      }
    }
  }
}

export default Shader;
