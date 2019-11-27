import Material from './Material';
import Camera from 'engine/Camera';
import Geometry from 'engine/geometries/Geometry';
import Entity from 'engine/Entity';
import { VERTEX_SIZE, TEX_COORDS_SIZE, FLOAT_SIZE } from 'engine/system/Constants';
import Renderer from 'engine/Renderer';
import Texture from 'engine/Texture';

const STRIDE = (VERTEX_SIZE + TEX_COORDS_SIZE) * FLOAT_SIZE;
const VERTEX_OFFSET = 0;
const COLOR_OFFSET = VERTEX_SIZE * FLOAT_SIZE;

class MaterialSkybox extends Material {
  constructor(texture: Texture) {
    super();

    this._texture = texture;

    this._shader = Renderer.instance.skyboxShader;
  }

  private _renderGeometry(geometry: Geometry) {
    const gl = this._renderer.gl;
    const shader = this._renderer.shader;

    gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);

    gl.vertexAttribPointer(shader.attributes['aPosition'], VERTEX_SIZE, gl.FLOAT, false, STRIDE, VERTEX_OFFSET);
    gl.vertexAttribPointer(shader.attributes['aTexCoord'], TEX_COORDS_SIZE, gl.FLOAT, false, STRIDE, COLOR_OFFSET);

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

    gl.uniformMatrix4fv(shader.uniforms['uView'], false, entity.worldMatrix.translate(0, 0, 0).data);
  }

  private _uploadColors() {
    const shader = this._renderer.shader;

    this._renderer.bindTexture(this._texture, shader.uniforms['uTexture']);
  }

  public render(camera: Camera, entity: Entity, geometry: Geometry): void {
    const gl = this._renderer.gl;

    this._renderer.useShader(this._shader);

    this._renderGeometry(geometry);
    this._renderCameraProperties(camera);
    this._renderEntityProperties(entity);
    this._uploadColors();

    gl.drawElements(gl.TRIANGLES, geometry.trianglesSize, gl.UNSIGNED_SHORT, 0);
  }
}

export default MaterialSkybox;
