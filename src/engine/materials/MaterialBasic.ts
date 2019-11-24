import Material from './Material';
import Camera from 'engine/Camera';
import Geometry from 'engine/Geometry';
import Entity from 'engine/Entity';
import Texture from 'engine/Texture';

class MaterialBasic extends Material {
  private _texture: Texture;

  constructor(texture: Texture) {
    super();

    this._texture = texture;
  }

  private _renderGeometry(geometry: Geometry) {
    const gl = this._renderer.gl;
    const shader = this._renderer.shader;

    gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);

    gl.vertexAttribPointer(shader.attributes['aPosition'], 3, gl.FLOAT, false, 5 * 4, 0);
    gl.vertexAttribPointer(shader.attributes['aTexCoord'], 2, gl.FLOAT, false, 5 * 4, 3 * 4);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);
  }

  private _renderCameraProperties(camera: Camera) {
    const gl = this._renderer.gl;
    const shader = this._renderer.shader;

    gl.uniformMatrix4fv(shader.uniforms['uProjection'], false, camera.projection.data);
  }

  private _renderEntityProperties(entity: Entity) {
    const gl = this._renderer.gl;
    const shader = this._renderer.shader;

    gl.uniformMatrix4fv(shader.uniforms['uView'], false, entity.worldMatrix.data);
  }

  private _uploadTexture() {
    const gl = this._renderer.gl;
    const shader = this._renderer.shader;

    gl.bindTexture(gl.TEXTURE_2D, this._texture.texture);
    gl.uniform1i(shader.uniforms['uTexture'], 0);
  }

  public render(camera: Camera, entity: Entity, geometry: Geometry): void {
    const gl = this._renderer.gl;

    this._renderGeometry(geometry);
    this._renderCameraProperties(camera);
    this._renderEntityProperties(entity);
    this._uploadTexture();

    gl.drawElements(gl.TRIANGLES, geometry.trianglesSize, gl.UNSIGNED_SHORT, 0);
  }
}

export default MaterialBasic;
