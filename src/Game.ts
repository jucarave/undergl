import Renderer from 'engine/Renderer';

class Game {
  private _renderer: Renderer;

  init() {
    this._renderer = new Renderer(854, 480, document.getElementById('divGame'));

    this.renderTestScene();
  }

  private renderTestScene() {
    const gl = this._renderer.gl;

    const vertices = [-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.0, 0.5, 0.0];
    const indices = [0, 1, 2];

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    this.loopRender(vertexBuffer, indexBuffer);
  }

  private loopRender(vertexBuffer: WebGLBuffer, indexBuffer: WebGLBuffer) {
    const gl = this._renderer.gl;
    const shader = this._renderer.shader;

    this._renderer.clear();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(shader.attributes['aPosition'], 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(() => this.loopRender(vertexBuffer, indexBuffer));
  }
}

window.onload = () => {
  const game = new Game();
  game.init();
};
