import ShaderStruct from '../ShaderStruct';

const skyboxShader: ShaderStruct = {
  vertexShader: `
    precision mediump float;

    attribute vec3 aPosition;
    attribute vec2 aTexCoord;

    uniform mat4 uProjection;
    uniform mat4 uView;

    varying vec2 vTexCoord;

    void main(void) {
      vec4 position = vec4(aPosition, 1.0);

      gl_Position = uProjection * uView * position;

      vTexCoord = aTexCoord;
    }
  `,

  fragmentShader: `
    precision mediump float;

    uniform sampler2D uTexture;

    varying vec2 vTexCoord;

    void main(void) {
      gl_FragColor = texture2D(uTexture, vTexCoord);
    }
  `
};

export default skyboxShader;
