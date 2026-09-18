import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Pane } from "tweakpane";
import styles from "./styles.module.scss";
import { motion } from "motion/react";

const WaterSimulation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);

  // Refs for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const waterTextureRef = useRef<THREE.DataTexture | null>(null);
  const waterBuffersRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const paneRef = useRef<Pane | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const initializedRef = useRef(false);
  const isPlayingRef = useRef(false);

  // Refs for monitors
  const bassMonitorRef = useRef<any>(null);
  const midMonitorRef = useRef<any>(null);
  const trebleMonitorRef = useRef<any>(null);
  const overallMonitorRef = useRef<any>(null);

  const audioLevels = useRef({
    bassLevel: 0,
    midLevel: 0,
    trebleLevel: 0,
    overallLevel: 0,
  });

  // Store container dimensions
  const containerSize = useRef({ width: 0, height: 0 });

  const waterSettings = useRef({
    resolution: 256,
    damping: 0.913,
    tension: 0.02,
    rippleStrength: 0.2,
    mouseIntensity: 1.2,
    clickIntensity: 3.0,
    rippleRadius: 8,
    splatForce: 50000,
    splatThickness: 0.1,
    vorticityInfluence: 0.2,
    swirlIntensity: 0.2,
    pressure: 0.3,
    velocityDissipation: 0.08,
    densityDissipation: 1.0,
    displacementScale: 0.01,
  });

  const settings = useRef({
    preset: "Ice White",
    animationSpeed: 1.3,
    waterStrength: 0.55,
    mouseIntensity: 1.2,
    clickIntensity: 3.0,
    rippleStrength: 0.5,
    damping: 0.913,
    showText: true,
    audioVolume: 1.0,
    impactForce: 50000,
    rippleSize: 0.1,
    swirlingMotion: 0.2,
    spiralIntensity: 0.2,
    fluidPressure: 0.3,
    motionDecay: 0.08,
    rippleDecay: 1.0,
    waveHeight: 0.01,
    audioReactivity: 1.0,
    bassResponse: 1.0,
    midResponse: 1.0,
    trebleResponse: 1.0,
  });

  const lastMousePosition = useRef({ x: 0, y: 0 });
  const mouseThrottleTime = useRef(0);

  const colorPresets = {
    "Electric Blue": {
      color1: [0.0, 0.5, 1.0],
      color2: [0.0, 0.8, 1.0],
      color3: [0.2, 0.3, 1.0],
      background: [0.0, 0.05, 0.1],
    },
    "Neon Pink": {
      color1: [1.0, 0.0, 0.5],
      color2: [1.0, 0.3, 0.7],
      color3: [0.9, 0.1, 0.6],
      background: [0.1, 0.0, 0.05],
    },
    "Cyber Green": {
      color1: [0.0, 1.0, 0.3],
      color2: [0.2, 0.9, 0.1],
      color3: [0.0, 0.8, 0.2],
      background: [0.0, 0.1, 0.02],
    },
    "Golden Hour": {
      color1: [1.0, 0.7, 0.2],
      color2: [1.0, 0.9, 0.3],
      color3: [0.9, 0.6, 0.1],
      background: [0.1, 0.05, 0.0],
    },
    "Deep Purple": {
      color1: [0.6, 0.2, 1.0],
      color2: [0.8, 0.4, 0.9],
      color3: [0.4, 0.1, 0.7],
      background: [0.05, 0.0, 0.1],
    },
    "Ice White": {
      color1: [1.0, 1.0, 1.0],
      color2: [0.9, 0.95, 1.0],
      color3: [0.8, 0.9, 1.0],
      background: [0.02, 0.02, 0.05],
    },
    "Pure Monochrome": {
      color1: [1.0, 1.0, 1.0],
      color2: [1.0, 1.0, 1.0],
      color3: [1.0, 1.0, 1.0],
      background: [0.0, 0.0, 0.0],
    },
  };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform vec3 u_color3;
    uniform vec3 u_background;
    uniform float u_speed;
    uniform sampler2D u_waterTexture;
    uniform float u_waterStrength;
    uniform float u_ripple_time;
    uniform vec2 u_ripple_position;
    uniform float u_ripple_strength;
    uniform sampler2D u_textTexture;
    uniform bool u_showText;
    uniform bool u_isMonochrome;
    uniform float u_audioLow;
    uniform float u_audioMid;
    uniform float u_audioHigh;
    uniform float u_audioOverall;
    uniform float u_audioReactivity;
    
    varying vec2 vUv;

    void main() {
      vec2 res = u_resolution;
      vec2 fc = gl_FragCoord.xy;
      
      // Create aspect-corrected coordinates that stay centered regardless of zoom
      vec2 st = fc / res;
      vec2 uv = st;
      vec2 aspectCorrected = st * 2.0 - 1.0;
      aspectCorrected.x *= res.x / res.y;
      
      // Water texture coordinates
      vec2 wCoord = vec2(fc.x / res.x, fc.y / res.y);
      float waterHeight = texture2D(u_waterTexture, wCoord).r;
      float waterInfluence = clamp(waterHeight * u_waterStrength, -0.5, 0.5);
      
      // Dynamic circle radius with aspect-corrected distance
      float baseRadius = 0.9;
      float audioPulse = u_audioOverall * u_audioReactivity * 0.1;
      float waterPulse = waterInfluence * 0.3;
      float circleRadius = baseRadius + audioPulse + waterPulse;
      
      float distFromCenter = length(aspectCorrected);
      float inCircle = smoothstep(circleRadius + 0.1, circleRadius - 0.1, distFromCenter);
      
      vec4 o = vec4(0.0);
      
      if (inCircle > 0.0) {
        vec2 p = aspectCorrected * 1.1;
        
        float rippleTime = u_time - u_ripple_time;
        vec2 ripplePos = u_ripple_position * res;
        float rippleDist = distance(fc.xy, ripplePos);
        
        float clickRipple = 0.0;
        if (rippleTime < 3.0 && rippleTime > 0.0) {
          float rippleRadius = rippleTime * 150.0;
          float rippleWidth = 30.0;
          float rippleDecay = 1.0 - rippleTime / 3.0;
          clickRipple = exp(-abs(rippleDist - rippleRadius) / rippleWidth) * rippleDecay * u_ripple_strength;
        }
        
        float totalWaterInfluence = clamp((waterInfluence + clickRipple * 0.1) * u_waterStrength, -0.8, 0.8);
        float audioInfluence = (u_audioLow * 0.3 + u_audioMid * 0.4 + u_audioHigh * 0.3) * u_audioReactivity;
        
        float angle = length(p) * 4.0 + audioInfluence * 2.0;
        mat2 R = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        p *= R;
        
        float l = length(p) - 0.7 + totalWaterInfluence * 0.5 + audioInfluence * 0.2;
        float t = u_time * u_speed + totalWaterInfluence * 2.0 + audioInfluence * 1.5;
        float enhancedY = p.y + totalWaterInfluence * 0.3 + audioInfluence * 0.2;
        
        float pattern1 = 0.5 + 0.5 * tanh(0.1 / max(l / 0.1, -l) - sin(l + enhancedY * max(1.0, -l / 0.1) + t));
        float pattern2 = 0.5 + 0.5 * tanh(0.1 / max(l / 0.1, -l) - sin(l + enhancedY * max(1.0, -l / 0.1) + t + 1.0));
        float pattern3 = 0.5 + 0.5 * tanh(0.1 / max(l / 0.1, -l) - sin(l + enhancedY * max(1.0, -l / 0.1) + t + 2.0));
        
        float intensity = 1.0 + totalWaterInfluence * 0.5 + audioInfluence * 0.3;
        
        if (u_isMonochrome) {
          float mono = (pattern1 + pattern2 + pattern3) / 3.0 * intensity;
          o = vec4(mono, mono, mono, inCircle);
        } else {
          o.r = pattern1 * u_color1.r * intensity;
          o.g = pattern2 * u_color2.g * intensity;
          o.b = pattern3 * u_color3.b * intensity;
          o.a = inCircle;
        }
      }
      
      // Make background completely transparent
      vec3 bgColor = vec3(0.0);
      vec3 finalColor = bgColor;
      
      // Blend with alpha - areas outside the circle will be transparent
      finalColor = mix(finalColor, o.rgb, o.a);
      
      if (u_showText) {
        vec2 waterCoords = vec2(fc.x / res.x, fc.y / res.y);
        float step = 1.0 / res.x;
        vec2 waterGrad = clamp(vec2(
          texture2D(u_waterTexture, vec2(waterCoords.x + step, waterCoords.y)).r - 
          texture2D(u_waterTexture, vec2(waterCoords.x - step, waterCoords.y)).r,
          texture2D(u_waterTexture, vec2(waterCoords.x, waterCoords.y + step)).r - 
          texture2D(u_waterTexture, vec2(waterCoords.x, waterCoords.y - step)).r
        ) * u_waterStrength, -0.1, 0.1);
        
        vec2 textDistortedUV = uv + waterGrad * 0.15;
        vec4 textColor = texture2D(u_textTexture, textDistortedUV);
        
        if (u_isMonochrome) {
          float textLum = dot(textColor.rgb, vec3(0.299, 0.587, 0.114));
          textColor = vec4(textLum, textLum, textLum, textColor.a);
        }
        
        // Blend text with transparency
        finalColor = mix(finalColor, textColor.rgb, textColor.a);
      }
      
      // Output with alpha channel for transparency
      gl_FragColor = vec4(finalColor, o.a);
    }
  `;

  const initAudioAnalysis = () => {
    if (!audioContextRef.current && audioRef.current) {
      try {
        audioContextRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        sourceRef.current = audioContextRef.current.createMediaElementSource(
          audioRef.current,
        );
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        console.log("Web Audio API initialized successfully");
      } catch (e) {
        console.warn("Web Audio API failed to initialize:", e);
        analyserRef.current = null;
        dataArrayRef.current = null;
      }
    }
  };

  const updateAudioAnalysis = () => {
    if (
      analyserRef.current &&
      dataArrayRef.current &&
      isPlayingRef.current &&
      materialRef.current
    ) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const bassEnd = Math.floor(dataArrayRef.current.length * 0.1);
      const midEnd = Math.floor(dataArrayRef.current.length * 0.5);
      let bass = 0,
        mid = 0,
        treble = 0;

      for (let i = 0; i < bassEnd; i++) bass += dataArrayRef.current[i];
      bass = (bass / bassEnd / 255) * settings.current.bassResponse;

      for (let i = bassEnd; i < midEnd; i++) mid += dataArrayRef.current[i];
      mid = (mid / (midEnd - bassEnd) / 255) * settings.current.midResponse;

      for (let i = midEnd; i < dataArrayRef.current.length; i++)
        treble += dataArrayRef.current[i];
      treble =
        (treble / (dataArrayRef.current.length - midEnd) / 255) *
        settings.current.trebleResponse;

      const overall = (bass + mid + treble) / 3;

      audioLevels.current.bassLevel = bass;
      audioLevels.current.midLevel = mid;
      audioLevels.current.trebleLevel = treble;
      audioLevels.current.overallLevel = overall;

      if (bassMonitorRef.current) {
        bassMonitorRef.current.refresh();
        midMonitorRef.current.refresh();
        trebleMonitorRef.current.refresh();
        overallMonitorRef.current.refresh();
      }

      const smoothing = 0.8;
      materialRef.current.uniforms.u_audioLow.value =
        materialRef.current.uniforms.u_audioLow.value * smoothing +
        bass * (1 - smoothing);
      materialRef.current.uniforms.u_audioMid.value =
        materialRef.current.uniforms.u_audioMid.value * smoothing +
        mid * (1 - smoothing);
      materialRef.current.uniforms.u_audioHigh.value =
        materialRef.current.uniforms.u_audioHigh.value * smoothing +
        treble * (1 - smoothing);
      materialRef.current.uniforms.u_audioOverall.value =
        materialRef.current.uniforms.u_audioOverall.value * smoothing +
        overall * (1 - smoothing);
    }
  };

  const createTextTexture = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const width = containerSize.current.width;
    const height = containerSize.current.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    ctx.textRenderingOptimization = "optimizeQuality";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const scale = Math.max(0.4, Math.min(1.2, width / 1920));
    const paragraphSize = Math.max(16, Math.min(28, 22 * scale));
    const paragraphText = "";
    ctx.font = `400 ${paragraphSize}px "GT Standard", Arial, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const paragraphLines = paragraphText.split("\n");
    const lineHeight = paragraphSize * 1.3;
    const totalTextHeight = paragraphLines.length * lineHeight;
    const startY = height / 2 - totalTextHeight / 2 + lineHeight / 2;
    paragraphLines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      ctx.fillText(line, width / 2, y);
    });

    return canvas;
  };

  const setupTextTexture = () => {
    if (!materialRef.current) return;

    const waitForFonts = () => {
      Promise.all([
        document.fonts.load('bold 80px "GT Standard"'),
        document.fonts.load('400 24px "GT Standard"'),
      ])
        .then(() => {
          setTimeout(() => {
            const textCanvas = createTextTexture();
            if (textCanvas) {
              const textTexture = new THREE.CanvasTexture(textCanvas);
              textTexture.flipY = false;
              textTexture.generateMipmaps = false;
              textTexture.minFilter = THREE.LinearFilter;
              textTexture.magFilter = THREE.LinearFilter;
              if (materialRef.current) {
                materialRef.current.uniforms.u_textTexture.value = textTexture;
              }
            }
          }, 100);
        })
        .catch(() => {
          setTimeout(() => {
            const textCanvas = createTextTexture();
            if (textCanvas) {
              const textTexture = new THREE.CanvasTexture(textCanvas);
              textTexture.flipY = false;
              textTexture.generateMipmaps = false;
              textTexture.minFilter = THREE.LinearFilter;
              textTexture.magFilter = THREE.LinearFilter;
              if (materialRef.current) {
                materialRef.current.uniforms.u_textTexture.value = textTexture;
              }
            }
          }, 1000);
        });
    };
    waitForFonts();
  };

  const addRipple = (x: number, y: number, strength: number = 1.0) => {
    if (!waterBuffersRef.current || containerSize.current.width === 0) return;

    const { resolution, rippleRadius } = waterSettings.current;
    const normalizedX = x / containerSize.current.width;
    const normalizedY = 1.0 - y / containerSize.current.height;
    const texX = Math.floor(normalizedX * resolution);
    const texY = Math.floor(normalizedY * resolution);
    const radius = Math.max(
      rippleRadius,
      Math.floor(settings.current.rippleSize * resolution),
    );
    const rippleStrength = strength * (settings.current.impactForce / 100000);
    const radiusSquared = radius * radius;

    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        const distanceSquared = i * i + j * j;
        if (distanceSquared <= radiusSquared) {
          const posX = texX + i;
          const posY = texY + j;
          if (
            posX >= 0 &&
            posX < resolution &&
            posY >= 0 &&
            posY < resolution
          ) {
            const index = posY * resolution + posX;
            const velIndex = index * 2;
            const distance = Math.sqrt(distanceSquared);
            const falloff = 1.0 - distance / radius;
            const rippleValue =
              Math.cos((distance / radius) * Math.PI * 0.5) *
              rippleStrength *
              falloff;
            waterBuffersRef.current.previous[index] += rippleValue;
            const angle = Math.atan2(j, i);
            const velocityStrength =
              rippleValue * settings.current.spiralIntensity;
            waterBuffersRef.current.velocity[velIndex] +=
              Math.cos(angle) * velocityStrength;
            waterBuffersRef.current.velocity[velIndex + 1] +=
              Math.sin(angle) * velocityStrength;
            const swirlAngle = angle + Math.PI * 0.5;
            const swirlStrength = Math.min(velocityStrength * 0.3, 0.1);
            waterBuffersRef.current.velocity[velIndex] +=
              Math.cos(swirlAngle) * swirlStrength;
            waterBuffersRef.current.velocity[velIndex + 1] +=
              Math.sin(swirlAngle) * swirlStrength;
          }
        }
      }
    }
  };

  const updateWaterSimulation = () => {
    if (!waterBuffersRef.current || !waterTextureRef.current) return;

    const { current, previous, velocity, vorticity } = waterBuffersRef.current;
    const { damping, resolution } = waterSettings.current;
    const safeTension = Math.min(waterSettings.current.tension, 0.05);
    const velocityDissipation = settings.current.motionDecay;
    const densityDissipation = settings.current.rippleDecay;
    const vorticityInfluence = Math.min(
      Math.max(settings.current.swirlingMotion, 0.0),
      0.5,
    );

    for (let i = 0; i < resolution * resolution * 2; i++) {
      velocity[i] *= 1.0 - velocityDissipation;
    }

    for (let i = 1; i < resolution - 1; i++) {
      for (let j = 1; j < resolution - 1; j++) {
        const index = i * resolution + j;
        const left = velocity[(index - 1) * 2 + 1];
        const right = velocity[(index + 1) * 2 + 1];
        const bottom = velocity[(index - resolution) * 2];
        const top = velocity[(index + resolution) * 2];
        vorticity[index] = (right - left - (top - bottom)) * 0.5;
      }
    }

    if (vorticityInfluence > 0.001) {
      for (let i = 1; i < resolution - 1; i++) {
        for (let j = 1; j < resolution - 1; j++) {
          const index = i * resolution + j;
          const velIndex = index * 2;
          const left = Math.abs(vorticity[index - 1]);
          const right = Math.abs(vorticity[index + 1]);
          const bottom = Math.abs(vorticity[index - resolution]);
          const top = Math.abs(vorticity[index + resolution]);
          const gradX = (right - left) * 0.5;
          const gradY = (top - bottom) * 0.5;
          const length = Math.sqrt(gradX * gradX + gradY * gradY) + 1e-5;
          const safeVorticity = Math.max(-1.0, Math.min(1.0, vorticity[index]));
          const forceX =
            (gradY / length) * safeVorticity * vorticityInfluence * 0.1;
          const forceY =
            (-gradX / length) * safeVorticity * vorticityInfluence * 0.1;
          velocity[velIndex] += Math.max(-0.1, Math.min(0.1, forceX));
          velocity[velIndex + 1] += Math.max(-0.1, Math.min(0.1, forceY));
        }
      }
    }

    for (let i = 1; i < resolution - 1; i++) {
      for (let j = 1; j < resolution - 1; j++) {
        const index = i * resolution + j;
        const velIndex = index * 2;
        const top = previous[index - resolution];
        const bottom = previous[index + resolution];
        const left = previous[index - 1];
        const right = previous[index + 1];
        current[index] = (top + bottom + left + right) / 2 - current[index];
        current[index] =
          current[index] * damping + previous[index] * (1 - damping);
        current[index] += (0 - previous[index]) * safeTension;
        const velMagnitude = Math.sqrt(
          velocity[velIndex] * velocity[velIndex] +
            velocity[velIndex + 1] * velocity[velIndex + 1],
        );
        const safeVelInfluence = Math.min(
          velMagnitude * settings.current.waveHeight,
          0.1,
        );
        current[index] += safeVelInfluence;
        current[index] *= 1.0 - densityDissipation * 0.01;
        current[index] = Math.max(-2.0, Math.min(2.0, current[index]));
      }
    }

    for (let i = 0; i < resolution; i++) {
      current[i] = 0;
      current[(resolution - 1) * resolution + i] = 0;
      velocity[i * 2] = 0;
      velocity[i * 2 + 1] = 0;
      velocity[((resolution - 1) * resolution + i) * 2] = 0;
      velocity[((resolution - 1) * resolution + i) * 2 + 1] = 0;
      current[i * resolution] = 0;
      current[i * resolution + (resolution - 1)] = 0;
      velocity[i * resolution * 2] = 0;
      velocity[i * resolution * 2 + 1] = 0;
      velocity[(i * resolution + (resolution - 1)) * 2] = 0;
      velocity[(i * resolution + (resolution - 1)) * 2 + 1] = 0;
    }

    [waterBuffersRef.current.current, waterBuffersRef.current.previous] = [
      waterBuffersRef.current.previous,
      waterBuffersRef.current.current,
    ];

    waterTextureRef.current.image.data = waterBuffersRef.current.current;
    waterTextureRef.current.needsUpdate = true;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!rendererRef.current || containerSize.current.width === 0) return;
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const now = performance.now();
    if (now - mouseThrottleTime.current < 8) return;
    mouseThrottleTime.current = now;

    const dx = x - lastMousePosition.current.x;
    const dy = y - lastMousePosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const velocity = distance / 8;

    if (distance > 1) {
      const velocityInfluence = Math.min(velocity / 10, 2.0);
      const baseIntensity = Math.min(distance / 20, 1.0);
      const fluidIntensity =
        baseIntensity *
        velocityInfluence *
        waterSettings.current.mouseIntensity;
      const variation = Math.random() * 0.3 + 0.7;
      const finalIntensity = fluidIntensity * variation;
      const jitterX = x + (Math.random() - 0.5) * 3;
      const jitterY = y + (Math.random() - 0.5) * 3;
      addRipple(jitterX, jitterY, finalIntensity);
      lastMousePosition.current.x = x;
      lastMousePosition.current.y = y;
    }
  };

  const onMouseClick = (event: MouseEvent) => {
    if (
      !rendererRef.current ||
      !materialRef.current ||
      !clockRef.current ||
      containerSize.current.width === 0
    )
      return;
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    addRipple(x, y, waterSettings.current.clickIntensity);
    const clickX = x / containerSize.current.width;
    const clickY = 1.0 - y / containerSize.current.height;
    materialRef.current.uniforms.u_ripple_position.value.set(clickX, clickY);
    materialRef.current.uniforms.u_ripple_time.value =
      clockRef.current.getElapsedTime();
  };

  const onTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    if (!rendererRef.current || containerSize.current.width === 0) return;
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const now = performance.now();
    if (now - mouseThrottleTime.current < 8) return;
    mouseThrottleTime.current = now;

    const dx = x - lastMousePosition.current.x;
    const dy = y - lastMousePosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const velocity = distance / 8;

    if (distance > 1) {
      const velocityInfluence = Math.min(velocity / 10, 2.0);
      const baseIntensity = Math.min(distance / 20, 1.0);
      const fluidIntensity =
        baseIntensity *
        velocityInfluence *
        waterSettings.current.mouseIntensity;
      const variation = Math.random() * 0.3 + 0.7;
      const finalIntensity = fluidIntensity * variation;
      const jitterX = x + (Math.random() - 0.5) * 3;
      const jitterY = y + (Math.random() - 0.5) * 3;
      addRipple(jitterX, jitterY, finalIntensity);
      lastMousePosition.current.x = x;
      lastMousePosition.current.y = y;
    }
  };

  const onTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    if (
      !rendererRef.current ||
      !materialRef.current ||
      !clockRef.current ||
      containerSize.current.width === 0
    )
      return;
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    addRipple(x, y, waterSettings.current.clickIntensity);
    const clickX = x / containerSize.current.width;
    const clickY = 1.0 - y / containerSize.current.height;
    materialRef.current.uniforms.u_ripple_position.value.set(clickX, clickY);
    materialRef.current.uniforms.u_ripple_time.value =
      clockRef.current.getElapsedTime();
  };

  const togglePanel = () => {
    const paneElement = document.querySelector(".tp-dfwv") as HTMLElement;
    const helpHint = document.getElementById("helpHint");

    if (paneElement) {
      const isVisible = paneElement.style.display === "block";
      if (isVisible) {
        paneElement.style.display = "none";
        if (helpHint) helpHint.style.display = "block";
        setPanelVisible(false);
        console.log("Panel hidden");
      } else {
        paneElement.style.display = "block";
        if (helpHint) helpHint.style.display = "none";
        setPanelVisible(true);
        console.log("Panel shown");
      }
    } else {
      console.log("Pane element not found with class .tp-dfwv");
      const anyPane = document.querySelector('[class*="tp-"]') as HTMLElement;
      if (anyPane) {
        const isVisible = anyPane.style.display === "block";
        if (isVisible) {
          anyPane.style.display = "none";
          if (helpHint) helpHint.style.display = "block";
        } else {
          anyPane.style.display = "block";
          if (helpHint) helpHint.style.display = "none";
        }
      }
    }
  };

  const handleAudioToggle = async () => {
    if (!isPlayingRef.current) {
      // Starting or resuming playback
      initAudioAnalysis();
      if (audioRef.current) {
        try {
          if (
            audioContextRef.current &&
            audioContextRef.current.state === "suspended"
          ) {
            await audioContextRef.current.resume();
          }

          // Resume from current position
          await audioRef.current.play();
          isPlayingRef.current = true;
          setIsPlaying(true);
          console.log(
            "✅ Audio resumed - current position:",
            audioRef.current.currentTime,
          );
        } catch (e) {
          console.log("Audio play failed:", e);
        }
      }
    } else {
      // Pausing playback
      if (audioRef.current) {
        audioRef.current.pause();
        isPlayingRef.current = false;
        setIsPlaying(false);
        console.log("Audio paused at position:", audioRef.current.currentTime);
      }
    }
  };

  const updateSize = () => {
    if (!containerRef.current || !rendererRef.current || !materialRef.current)
      return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    if (width > 0 && height > 0) {
      containerSize.current = { width, height };

      // Get the canvas element for accurate sizing
      const canvas = rendererRef.current.domElement;
      const pixelRatio = Math.min(window.devicePixelRatio, 2);

      // Set actual pixel dimensions (important for zoom handling)
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Update renderer
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(pixelRatio);

      // Update shader resolution with actual pixel dimensions
      materialRef.current.uniforms.u_resolution.value.set(
        canvas.width,
        canvas.height,
      );
      setupTextTexture();
    }
  };

  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return;
    initializedRef.current = true;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    containerSize.current = { width, height };

    // Setup audio
    audioRef.current = new Audio();
    audioRef.current.src = "/assets/boogie.mp3";
    audioRef.current.preload = "auto";
    audioRef.current.volume = 1.0;
    audioRef.current.crossOrigin = "anonymous";
    audioRef.current.addEventListener("ended", () => {
      if (isPlayingRef.current && audioRef.current) {
        // Loop back to start when finished
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .catch((e) => console.log("Loop play failed:", e));
      }
    });
    audioRef.current.load();

    // Setup Three.js with transparency support
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

    // Enable alpha channel for transparency
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // This enables transparency
    });

    // Set clear color to fully transparent
    rendererRef.current.setClearColor(0x000000, 0);

    // Set initial canvas size properly
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    const canvas = rendererRef.current.domElement;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(pixelRatio);
    rendererRef.current.domElement.style.position = "absolute";
    rendererRef.current.domElement.style.top = "0";
    rendererRef.current.domElement.style.left = "0";
    rendererRef.current.domElement.style.zIndex = "1";

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Initialize water buffers
    const resolution = waterSettings.current.resolution;
    waterBuffersRef.current = {
      current: new Float32Array(resolution * resolution),
      previous: new Float32Array(resolution * resolution),
      velocity: new Float32Array(resolution * resolution * 2),
      vorticity: new Float32Array(resolution * resolution),
      pressure: new Float32Array(resolution * resolution),
    };

    for (let i = 0; i < resolution * resolution; i++) {
      waterBuffersRef.current.current[i] = 0.0;
      waterBuffersRef.current.previous[i] = 0.0;
      waterBuffersRef.current.velocity[i * 2] = 0.0;
      waterBuffersRef.current.velocity[i * 2 + 1] = 0.0;
      waterBuffersRef.current.vorticity[i] = 0.0;
      waterBuffersRef.current.pressure[i] = 0.0;
    }

    waterTextureRef.current = new THREE.DataTexture(
      waterBuffersRef.current.current,
      resolution,
      resolution,
      THREE.RedFormat,
      THREE.FloatType,
    );
    waterTextureRef.current.minFilter = THREE.LinearFilter;
    waterTextureRef.current.magFilter = THREE.LinearFilter;
    waterTextureRef.current.needsUpdate = true;

    // Create shader material with transparency enabled
    materialRef.current = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true, // Enable transparency
      depthWrite: false, // Prevent depth writing issues with transparent objects
      uniforms: {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(canvas.width, canvas.height) },
        u_speed: { value: settings.current.animationSpeed },
        u_color1: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        u_color2: { value: new THREE.Vector3(0.9, 0.95, 1.0) },
        u_color3: { value: new THREE.Vector3(0.8, 0.9, 1.0) },
        u_background: { value: new THREE.Vector3(0.02, 0.02, 0.05) },
        u_waterTexture: { value: waterTextureRef.current },
        u_waterStrength: { value: settings.current.waterStrength },
        u_ripple_time: { value: -10.0 },
        u_ripple_position: { value: new THREE.Vector2(0.5, 0.5) },
        u_ripple_strength: { value: settings.current.rippleStrength },
        u_textTexture: { value: null },
        u_showText: { value: settings.current.showText },
        u_isMonochrome: { value: false },
        u_audioLow: { value: 0.0 },
        u_audioMid: { value: 0.0 },
        u_audioHigh: { value: 0.0 },
        u_audioOverall: { value: 0.0 },
        u_audioReactivity: { value: settings.current.audioReactivity },
      },
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, materialRef.current);
    sceneRef.current.add(mesh);
    cameraRef.current.position.z = 1;

    // Setup Tweakpane
    paneRef.current = new Pane({ title: "Audio-Reactive Water Shader" });

    setTimeout(() => {
      const paneElement = document.querySelector(".tp-dfwv") as HTMLElement;
      if (paneElement) {
        paneElement.style.display = "none";
        console.log("Pane initially hidden");
      } else {
        const anyPane = document.querySelector('[class*="tp-"]') as HTMLElement;
        if (anyPane) {
          anyPane.style.display = "none";
          console.log("Found alternative pane element and hid it");
        }
      }
    }, 100);

    const presetBinding = paneRef.current.addBinding(
      settings.current,
      "preset",
      {
        options: Object.keys(colorPresets).reduce(
          (acc, key) => {
            acc[key] = key;
            return acc;
          },
          {} as Record<string, string>,
        ),
      },
    );
    presetBinding.on("change", (ev) => {
      const preset = colorPresets[ev.value as keyof typeof colorPresets];
      if (materialRef.current) {
        materialRef.current.uniforms.u_color1.value.fromArray(preset.color1);
        materialRef.current.uniforms.u_color2.value.fromArray(preset.color2);
        materialRef.current.uniforms.u_color3.value.fromArray(preset.color3);
        materialRef.current.uniforms.u_background.value.fromArray(
          preset.background,
        );
        const isMonochrome = ev.value === "Pure Monochrome";
        materialRef.current.uniforms.u_isMonochrome.value = isMonochrome;
      }
    });

    const animFolder = paneRef.current.addFolder({ title: "Animation" });
    animFolder
      .addBinding(settings.current, "animationSpeed", {
        min: 0.1,
        max: 3.0,
        step: 0.1,
      })
      .on("change", (ev) => {
        if (materialRef.current)
          materialRef.current.uniforms.u_speed.value = ev.value;
      });

    const audioFolder = paneRef.current.addFolder({
      title: "Audio Reactive Settings",
    });

    bassMonitorRef.current = audioFolder.addBinding(
      audioLevels.current,
      "bassLevel",
      {
        readonly: true,
        min: 0,
        max: 1,
        label: "Bass Level",
      },
    );
    midMonitorRef.current = audioFolder.addBinding(
      audioLevels.current,
      "midLevel",
      {
        readonly: true,
        min: 0,
        max: 1,
        label: "Mid Level",
      },
    );
    trebleMonitorRef.current = audioFolder.addBinding(
      audioLevels.current,
      "trebleLevel",
      {
        readonly: true,
        min: 0,
        max: 1,
        label: "Treble Level",
      },
    );
    overallMonitorRef.current = audioFolder.addBinding(
      audioLevels.current,
      "overallLevel",
      {
        readonly: true,
        min: 0,
        max: 1,
        label: "Overall Level",
      },
    );

    audioFolder
      .addBinding(settings.current, "audioReactivity", {
        min: 0.0,
        max: 3.0,
        step: 0.1,
      })
      .on("change", (ev) => {
        if (materialRef.current)
          materialRef.current.uniforms.u_audioReactivity.value = ev.value;
      });

    audioFolder.addBinding(settings.current, "bassResponse", {
      min: 0.0,
      max: 3.0,
      step: 0.1,
    });
    audioFolder.addBinding(settings.current, "midResponse", {
      min: 0.0,
      max: 3.0,
      step: 0.1,
    });
    audioFolder.addBinding(settings.current, "trebleResponse", {
      min: 0.0,
      max: 3.0,
      step: 0.1,
    });

    const waterFolder = paneRef.current.addFolder({ title: "Water Settings" });
    waterFolder
      .addBinding(settings.current, "waterStrength", {
        min: 0.0,
        max: 1.0,
        step: 0.05,
      })
      .on("change", (ev) => {
        if (materialRef.current) {
          materialRef.current.uniforms.u_waterStrength.value = ev.value;
          waterSettings.current.rippleStrength = ev.value;
        }
      });
    waterFolder
      .addBinding(settings.current, "rippleStrength", {
        min: 0.0,
        max: 1.0,
        step: 0.05,
      })
      .on("change", (ev) => {
        if (materialRef.current)
          materialRef.current.uniforms.u_ripple_strength.value = ev.value;
      });
    waterFolder
      .addBinding(settings.current, "mouseIntensity", {
        min: 0.1,
        max: 3.0,
        step: 0.1,
      })
      .on("change", (ev) => {
        waterSettings.current.mouseIntensity = ev.value;
      });
    waterFolder
      .addBinding(settings.current, "clickIntensity", {
        min: 0.5,
        max: 6.0,
        step: 0.1,
      })
      .on("change", (ev) => {
        waterSettings.current.clickIntensity = ev.value;
      });

    const textFolder = paneRef.current.addFolder({ title: "Text Display" });
    textFolder.addBinding(settings.current, "showText").on("change", (ev) => {
      if (materialRef.current)
        materialRef.current.uniforms.u_showText.value = ev.value;
    });

    const audioControlFolder = paneRef.current.addFolder({ title: "Audio" });
    audioControlFolder
      .addBinding(settings.current, "audioVolume", {
        min: 0.0,
        max: 1.0,
        step: 0.1,
      })
      .on("change", (ev) => {
        if (audioRef.current) audioRef.current.volume = ev.value;
      });

    clockRef.current = new THREE.Clock();

    // Add event listeners
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onMouseClick);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Handle zoom detection
    let zoomTimeout: NodeJS.Timeout;
    const handleZoom = () => {
      clearTimeout(zoomTimeout);
      zoomTimeout = setTimeout(() => {
        updateSize();
      }, 100);
    };

    window.addEventListener("resize", handleZoom);
    window.addEventListener("wheel", (e) => {
      if (e.ctrlKey) {
        setTimeout(handleZoom, 100);
      }
    });

    const keydownHandler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "h") {
        event.preventDefault();
        console.log("H key pressed - toggling panel");
        togglePanel();
      }
    };
    document.addEventListener("keydown", keydownHandler);

    setupTextTexture();

    const initialPreset =
      colorPresets[settings.current.preset as keyof typeof colorPresets];
    if (materialRef.current) {
      materialRef.current.uniforms.u_color1.value.fromArray(
        initialPreset.color1,
      );
      materialRef.current.uniforms.u_color2.value.fromArray(
        initialPreset.color2,
      );
      materialRef.current.uniforms.u_color3.value.fromArray(
        initialPreset.color3,
      );
      materialRef.current.uniforms.u_background.value.fromArray(
        initialPreset.background,
      );
      materialRef.current.uniforms.u_ripple_strength.value =
        settings.current.rippleStrength;
      materialRef.current.uniforms.u_waterStrength.value =
        settings.current.waterStrength;
      materialRef.current.uniforms.u_speed.value =
        settings.current.animationSpeed;
      materialRef.current.uniforms.u_audioReactivity.value =
        settings.current.audioReactivity;
      materialRef.current.uniforms.u_isMonochrome.value = false;
    }

    setTimeout(() => {
      if (containerSize.current.width > 0) {
        addRipple(
          containerSize.current.width / 2,
          containerSize.current.height / 2,
          1.5,
        );
      }
    }, 500);

    const animate = () => {
      if (clockRef.current && materialRef.current) {
        const elapsed = clockRef.current.getElapsedTime();
        materialRef.current.uniforms.u_time.value = elapsed;
        updateAudioAnalysis();
        updateWaterSimulation();
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      }
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onMouseClick);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("resize", handleZoom);
      document.removeEventListener("keydown", keydownHandler);
      if (zoomTimeout) clearTimeout(zoomTimeout);
      resizeObserver.disconnect();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (
          rendererRef.current.domElement &&
          rendererRef.current.domElement.parentNode
        ) {
          rendererRef.current.domElement.parentNode.removeChild(
            rendererRef.current.domElement,
          );
        }
      }
      if (paneRef.current) {
        paneRef.current.dispose();
      }
      initializedRef.current = false;
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "50vh" }}>
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />

      <div
        id="controls"
        style={{
          display: "flex",
          position: "absolute",
          justifyContent: isPlaying ? "flex-end" : "flex-start",
          width: 78,
          bottom: -62,
          left: 20,
          zIndex: 100,
          padding: 4,
          borderRadius: 100,
          backgroundColor: "white",
          cursor: "pointer",
          pointerEvents: "auto",
        }}
        onClick={handleAudioToggle}
      >
        <motion.div
          id="audioBtn"
          style={{
            background: "red",
            color: "white",
            borderRadius: 100,
            height: 35,
            width: 35,
          }}
          layout
          transition={{
            type: "spring",
            visualDuration: 0.2,
            bounce: 0.2,
          }}
        />
      </div>
    </div>
  );
};

export default WaterSimulation;
