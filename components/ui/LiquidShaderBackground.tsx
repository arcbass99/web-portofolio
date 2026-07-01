"use client";

import { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;

  mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
  }

  void main() {
      // Normalize coordinates
      vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
      
      float t = u_time * 0.4;
      
      // Fluid distortion loops
      vec2 p = uv;
      for(int i = 0; i < 4; i++) {
          p *= rot(t * 0.15);
          p += vec2(sin(p.y * 1.5 + t), cos(p.x * 1.5 - t)) * 0.5;
      }
      
      // Create the shape (distance field) - made larger
      float d = length(p * 0.3) - 0.7;
      
      // Map colors based on the heavily distorted space
      vec3 c1 = vec3(0.1, 0.5, 1.0); // Brighter Blue
      vec3 c2 = vec3(0.9, 0.2, 0.8); // Brighter Magenta/Purple
      vec3 c3 = vec3(0.0, 0.9, 0.8); // Brighter Cyan/Teal
      
      float mix1 = sin(p.x * 1.5 + t) * 0.5 + 0.5;
      float mix2 = cos(p.y * 1.5 - t) * 0.5 + 0.5;
      
      vec3 baseCol = mix(mix(c1, c2, mix1), c3, mix2);
      
      // Edge glow effect (bright fluid edge) - increased prominence
      float glow = 0.12 / (abs(d) + 0.05);
      glow = clamp(glow, 0.0, 2.5);
      
      // Inner fill (making it look like a fluid blob with a dark center)
      float fill = smoothstep(0.2, -0.4, d);
      
      // Combine
      vec3 col = baseCol * glow + baseCol * fill * 0.4;
      
      // Dark vignette background - expanded to cover more area
      col *= smoothstep(3.0, 0.5, length(uv));
      
      gl_FragColor = vec4(col, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function LiquidShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.warn("WebGL not supported");
      return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // A full screen quad
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const timeUniformLocation = gl.getUniformLocation(program, "u_time");

    let animationFrameId: number;
    const startTime = Date.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    
    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      gl.uniform1f(timeUniformLocation, (Date.now() - startTime) * 0.001);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#02000A] pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40"
      />
      {/* Dark overlay to tone down the brightness */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
