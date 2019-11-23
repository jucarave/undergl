import Material from './Material';
import Camera from 'engine/Camera';
import Geometry from 'engine/Geometry';

class MaterialBasic extends Material {
  private renderGeometry(geometry: Geometry) {
    const gl = this._renderer.gl;
    const shader = this._renderer.shader;

    gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);

    gl.vertexAttribPointer(shader.attributes['aPosition'], 3, gl.FLOAT, false, 7 * 4, 0);
    gl.vertexAttribPointer(shader.attributes['aColor'], 4, gl.FLOAT, false, 7 * 4, 3 * 4);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);
  }

  private renderCameraProperties(camera: Camera) {
    const gl = this._renderer.gl;
    const shader = this._renderer.shader;

    gl.uniformMatrix4fv(shader.uniforms['uProjection'], false, camera.projection.data);
    gl.uniformMatrix4fv(shader.uniforms['uView'], false, camera.viewMatrix.data);
  }

  public render(camera: Camera, geometry: Geometry): void {
    const gl = this._renderer.gl;

    this.renderGeometry(geometry);
    this.renderCameraProperties(camera);

    gl.drawElements(gl.TRIANGLES, geometry.trianglesSize, gl.UNSIGNED_SHORT, 0);
  }
}

export default MaterialBasic;
