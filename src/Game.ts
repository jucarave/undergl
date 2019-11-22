import Renderer from 'engine/Renderer';
import Matrix4 from 'engine/math/Matrix4';

class Game {
  private _renderer: Renderer;
  public angle: number = 0;

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

    const camera = Matrix4.createPerspective((60 * Math.PI) / 180, 854 / 480, 0.1, 1000.0);

    const view = Matrix4.createIdentity();
    view.translate(0, 0, -5);

    this.loopRender(vertexBuffer, indexBuffer, camera, view);
  }

  private loopRender(vertexBuffer: WebGLBuffer, indexBuffer: WebGLBuffer, camera: Matrix4, view: Matrix4) {
    const gl = this._renderer.gl;
    const shader = this._renderer.shader;

    this.angle += 2;
    view.setIdentity();
    view.setRotationY(this.angle);
    view.translate(0, 0, -5);

    this._renderer.clear();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(shader.attributes['aPosition'], 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.uniformMatrix4fv(shader.uniforms['uProjection'], false, camera.data);
    gl.uniformMatrix4fv(shader.uniforms['uView'], false, view.data);

    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(() => this.loopRender(vertexBuffer, indexBuffer, camera, view));
  }
}

window.onload = () => {
  const game = new Game();
  game.init();
};
