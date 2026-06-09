<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

defineOptions({
  name: 'AppWaveBackground',
});

const canvasRef = ref<HTMLCanvasElement | null>(null);

// Конфигурация анимации
const CONFIG = {
  amp: 40, // Амплитуда деформации волн
  nscale: 7, // Крупность волн
  persp: 0.01, // Сила перспективы
  lerpK: 0.08, // Сглаживание поверхности
  radius: 265, // Радиус интерактивного фонарика мыши (px)
  intensity: 1, // Интенсивность фонарика
  sz: 11, // Размер символов (px)
  cdepth: 0, // Глубина цвета
  bg: '#faf9f9', // Переменная --color-neutral-75
  fg: '#a3a3a3', // Переменная --color-neutral-400
};

interface WavePoint {
  sx: number;
  sy: number;
  z: number;
  dn: number;
  boost: number;
  ch: string;
}

// Переменные окружения анимации
let animationFrameId: number | null = null;
const mouse = { x: -9999, y: -9999, inside: false };
let W = 0;
let H = 0;
let grid: string[][] = [];
let zCurrent: number[][] = [];
let zTarget: number[][] = [];
let flipTimer: number[][] = [];
let COLS_N = 0;
let ROWS_N = 0;

const WEIGHTED = ['0', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1', ':', ':'];
const randChar = () => WEIGHTED[Math.floor(Math.random() * WEIGHTED.length)] ?? '0';

// ─── МАТЕМАТИКА SIMPLEX NOISE С ПОЛНОЙ ТИПИЗАЦИЕЙ ─────────
const p: number[] = [];
for (let i = 0; i < 256; i++) p[i] = i;
for (let i = 255; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  const pi = p[i] ?? i;
  const pj = p[j] ?? j;
  p[i] = pj;
  p[j] = pi;
}
const perm = new Uint8Array(512);
for (let i = 0; i < 512; i++) perm[i] = p[i & 255] ?? 0;
const G2 = 0.2113248654;

// Разрешаем undefined для пустых слотов модуляции
const g2: ([number, number] | undefined)[] = [, [-1, 1], [1, -1], [-1, -1], , [-1, 0], , [0, -1]];

const dot = (g: [number, number] | undefined, x: number, y: number) => {
  const g0 = g?.[0] ?? 0;
  const g1 = g?.[1] ?? 0;
  return g0 * x + g1 * y;
};

const simplexNoise = (xin: number, yin: number) => {
  const s = (xin + yin) * 0.3660254;
  const i = Math.floor(xin + s);
  const j = Math.floor(yin + s);
  const t0 = (i + j) * G2;
  const x0 = xin - (i - t0);
  const y0 = yin - (j - t0);
  const i1 = x0 > y0 ? 1 : 0;
  const j1 = 1 - i1;
  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;
  const ii = i & 255;
  const jj = j & 255;

  const c = (gi: number, x: number, y: number) => {
    let t = 0.5 - x * x - y * y;
    if (t < 0) return 0;
    t *= t;
    const gradient = g2[gi % 8];
    return t * t * dot(gradient, x, y);
  };

  const idx0 = perm[ii + (perm[jj] ?? 0)] ?? 0;
  const idx1 = perm[ii + i1 + (perm[jj + j1] ?? 0)] ?? 0;
  const idx2 = perm[ii + 1 + (perm[jj + 1] ?? 0)] ?? 0;

  return 70 * (c(idx0, x0, y0) + c(idx1, x1, y1) + c(idx2, x2, y2));
};

// ─── РЕНДЕРИНГ И СЕТКА ────────────────────────────────────
const buildGrid = (DPR: number) => {
  COLS_N = Math.ceil(W / DPR / (CONFIG.sz * 0.6)) + 2;
  ROWS_N = Math.ceil(H / DPR / (CONFIG.sz * 1.15)) + 2;
  grid = [];
  zCurrent = [];
  zTarget = [];
  flipTimer = [];

  for (let r = 0; r < ROWS_N; r++) {
    grid[r] = [];
    zCurrent[r] = [];
    zTarget[r] = [];
    flipTimer[r] = [];
    const gridR = grid[r];
    const zCurrentR = zCurrent[r];
    const zTargetR = zTarget[r];
    const flipTimerR = flipTimer[r];

    if (gridR && zCurrentR && zTargetR && flipTimerR) {
      for (let c = 0; c < COLS_N; c++) {
        gridR[c] = randChar();
        zCurrentR[c] = 0;
        zTargetR[c] = 0;
        flipTimerR[c] = Math.random() * 3000;
      }
    }
  }

  const ns = CONFIG.nscale / 500;
  for (let ri = 0; ri < ROWS_N; ri++) {
    const zCurrentR = zCurrent[ri];
    const zTargetR = zTarget[ri];
    if (zCurrentR && zTargetR) {
      for (let ci = 0; ci < COLS_N; ci++) {
        const nx = ci * ns;
        const ny = ri * ns;
        const z =
          (simplexNoise(nx, ny) +
            simplexNoise(nx * 1.8 + 4, ny * 1.8 + 3) * 0.45 +
            simplexNoise(nx * 0.5 + 8, ny * 0.5 + 7) * 0.25) *
          CONFIG.amp;
        zCurrentR[ci] = z;
        zTargetR[ci] = z;
      }
    }
  }
};

const hex2rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16) || 0,
  parseInt(hex.slice(3, 5), 16) || 0,
  parseInt(hex.slice(5, 7), 16) || 0,
];

const getColor = (dn: number, boost: number) => {
  const [fgR, fgG, fgB] = hex2rgb(CONFIG.fg);
  const [bgR, bgG, bgB] = hex2rgb(CONFIG.bg);
  const base = dn * (0.4 + (CONFIG.cdepth / 100) * 0.6) + ((100 - CONFIG.cdepth) / 100) * 0.05;
  const sharpBoost = Math.pow(boost, 0.6) * CONFIG.intensity;
  const m = Math.min(1, base * (1 - sharpBoost * 0.5) + sharpBoost);
  return `rgb(${Math.round(bgR + (fgR - bgR) * m)},${Math.round(bgG + (fgG - bgG) * m)},${Math.round(bgB + (fgB - bgB) * m)})`;
};

const onMouseMove = (e: MouseEvent) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.inside = true;
};
const onMouseLeave = () => {
  mouse.inside = false;
};

const onResize = () => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.width = window.innerWidth * DPR;
  H = canvas.height = window.innerHeight * DPR;
  buildGrid(DPR);
};

onMounted(() => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (window.innerWidth < 768) {
    ctx.fillStyle = CONFIG.bg;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = CONFIG.fg;
    ctx.font = `11px monospace`;
    ctx.fillText('01:001::01', 24, 36);
    return;
  }

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  window.addEventListener('resize', onResize);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseleave', onMouseLeave);

  onResize();

  const draw = (t: number) => {
    const CW = W / DPR;
    const CH = H / DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = CONFIG.bg;
    ctx.fillRect(0, 0, CW, CH);

    const charW = CONFIG.sz * 0.6;
    const charH = CONFIG.sz * 1.15;
    const startX = -CW / 2;
    const startY = -CH / 2;
    const ns = CONFIG.nscale / 500;
    const r2 = CONFIG.radius * CONFIG.radius;
    const points: WavePoint[] = [];

    for (let ri = 0; ri < ROWS_N; ri++) {
      const flipTimerR = flipTimer[ri];
      const gridR = grid[ri];
      const zTargetR = zTarget[ri];
      const zCurrentR = zCurrent[ri];

      if (flipTimerR && gridR && zTargetR && zCurrentR) {
        for (let ci = 0; ci < COLS_N; ci++) {
          const baseX = startX + ci * charW;
          const baseY = startY + ri * charH;
          const screenX = CW / 2 + baseX;
          const screenY = CH / 2 + baseY;
          const dx = screenX - mouse.x;
          const dy = screenY - mouse.y;
          const distNorm = (dx * dx + dy * dy) / r2;
          const boost = mouse.inside ? Math.exp(-distNorm * 4.5) : 0;

          const fTimer = flipTimerR[ci] ?? 0;
          if (boost > 0.04) {
            const interval = 40 + (600 - 40) * Math.pow(1 - boost, 2);
            if (t - fTimer > interval) {
              flipTimerR[ci] = t + Math.random() * interval;
              gridR[ci] = randChar();
            }
          }

          const nx = ci * ns;
          const ny = ri * ns;
          zTargetR[ci] =
            (simplexNoise(nx, ny) +
              simplexNoise(nx * 1.8 + 4, ny * 1.8 + 3) * 0.45 +
              simplexNoise(nx * 0.5 + 8, ny * 0.5 + 7) * 0.25) *
            CONFIG.amp;

          const zCur = zCurrentR[ci] ?? 0;
          const zTar = zTargetR[ci] ?? 0;
          zCurrentR[ci] = zCur + (zTar - zCur) * CONFIG.lerpK;

          const z = zCurrentR[ci] ?? 0;
          const CAM = 600;
          const dz = CAM + z * CONFIG.persp * 4;
          const sc = dz > 0 ? CAM / dz : 1;
          const distFromCenter = Math.sqrt(baseX * baseX + baseY * baseY);
          const maxDist = Math.sqrt((CW / 2) * (CW / 2) + (CH / 2) * (CH / 2));
          const edgeFade = Math.max(0, 1 - Math.pow(distFromCenter / maxDist, 1.5));
          const sx = CW / 2 + baseX * (1 + (sc - 1) * edgeFade);
          const sy = CH / 2 + baseY * (1 + (sc - 1) * edgeFade);

          const zRange = CONFIG.amp * 1.7;
          const dn = Math.max(0, Math.min(1, (z + zRange / 2) / zRange));

          points.push({ sx, sy, z, dn, boost, ch: gridR[ci] ?? '0' });
        }
      }
    }

    points.sort((a, b) => a.z - b.z);
    ctx.font = `${CONFIG.sz}px monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (const pt of points) {
      ctx.fillStyle = getColor(pt.dn, pt.boost);
      ctx.setTransform(DPR, 0, 0, DPR, pt.sx * DPR, pt.sy * DPR);
      ctx.fillText(pt.ch, 0, 0);
    }

    animationFrameId = requestAnimationFrame(draw);
  };

  animationFrameId = requestAnimationFrame(draw);
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseleave', onMouseLeave);
});
</script>

<template>
  <div
    class="fixed inset-0 w-full h-full overflow-hidden select-none pointer-events-none bg-(--color-neutral-75)"
  >
    <canvas ref="canvasRef" class="block w-full h-full" />
  </div>
</template>
