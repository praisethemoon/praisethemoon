'use client';

import { useEffect, useRef } from 'react';

const VIRTUAL_W = 480;
const VIRTUAL_H = 270;

export default function MoonScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroyed = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const PIXI = await import('pixi.js');
      if (destroyed || !containerRef.current) return;

      const { Application, Container, Graphics } = PIXI;

      const application = new Application();
      await application.init({
        resizeTo: containerRef.current,
        backgroundColor: 0x070912,
        antialias: false,
        resolution: 1,
        autoDensity: false,
      });
      if (destroyed) {
        application.destroy(true, { children: true });
        return;
      }

      containerRef.current.appendChild(application.canvas);
      const canvas = application.canvas as HTMLCanvasElement;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      canvas.style.imageRendering = 'pixelated';

      // World container — drawn at virtual resolution, scaled to viewport.
      const world = new Container();
      application.stage.addChild(world);

      // Layers back → front
      const skyLayer = new Container();
      const starsLayer = new Container();
      const moonLayer = new Container();
      const cloudsLayer = new Container();
      const farTreesLayer = new Container();
      const hillLayer = new Container();
      const ruinsLayer = new Container();
      const grassLayer = new Container();
      const wandererLayer = new Container();
      world.addChild(
        skyLayer,
        starsLayer,
        moonLayer,
        cloudsLayer,
        farTreesLayer,
        hillLayer,
        ruinsLayer,
        grassLayer,
        wandererLayer,
      );

      // ---------- Sky gradient (banded for that pixel look)
      const sky = new Graphics();
      const bands = 14;
      for (let i = 0; i < bands; i++) {
        const t = i / (bands - 1);
        const r = Math.round(0x06 + (0x1a - 0x06) * t);
        const g = Math.round(0x08 + (0x1f - 0x08) * t);
        const b = Math.round(0x1a + (0x3a - 0x1a) * t);
        const color = (r << 16) | (g << 8) | b;
        sky.rect(0, Math.floor((VIRTUAL_H / bands) * i), VIRTUAL_W, Math.ceil(VIRTUAL_H / bands) + 1).fill(color);
      }
      skyLayer.addChild(sky);

      // ---------- Stars
      type Star = { x: number; y: number; baseAlpha: number; phase: number; speed: number };
      const stars: Star[] = [];
      const starCount = 160;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.floor(Math.random() * VIRTUAL_W),
          y: Math.floor(Math.random() * VIRTUAL_H * 0.72),
          baseAlpha: 0.35 + Math.random() * 0.65,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 1.6,
        });
      }
      const starGfx = new Graphics();
      starsLayer.addChild(starGfx);

      // ---------- Shooting stars
      type Shooter = {
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
        maxLife: number;
        trail: { x: number; y: number }[];
      };
      const shooters: Shooter[] = [];

      // ---------- Moon
      const moonContainer = new Container();
      const moonRadius = 30;
      moonContainer.position.set(VIRTUAL_W - 115, 70);

      const halo = new Graphics();
      for (let i = 7; i >= 1; i--) {
        halo.circle(0, 0, moonRadius + i * 7).fill({ color: 0xfff8d6, alpha: 0.025 + (7 - i) * 0.008 });
      }
      moonContainer.addChild(halo);

      const moonBody = new Graphics();
      moonBody.circle(0, 0, moonRadius).fill(0xeae3c2);
      const craters: { x: number; y: number; r: number }[] = [
        { x: -10, y: -6, r: 4 },
        { x: 7, y: 4, r: 5 },
        { x: -3, y: 11, r: 3 },
        { x: 13, y: -10, r: 2 },
        { x: -14, y: 7, r: 2 },
        { x: 2, y: -12, r: 2 },
      ];
      for (const c of craters) {
        moonBody.circle(c.x, c.y, c.r).fill(0xc9c1a3);
      }
      moonBody.circle(8, 0, moonRadius).fill({ color: 0x0a0e1f, alpha: 0.16 });
      moonContainer.addChild(moonBody);
      moonLayer.addChild(moonContainer);

      // ---------- Clouds (procedural shapes — each cloud is unique)
      type Cloud = {
        x: number;
        y: number;
        w: number;
        speed: number;
        alpha: number;
        block: number;
        pattern: number[];
      };

      // Smooth-random cloud silhouette: bell-curve base height with jitter,
      // so clouds tend to bulge in the middle and taper at the ends.
      const generateCloudPattern = (length: number, maxHeight: number): number[] => {
        const pattern: number[] = [];
        let prev = 1;
        for (let i = 0; i < length; i++) {
          const t = length > 1 ? i / (length - 1) : 0.5;
          const bell = Math.sin(t * Math.PI) * maxHeight;
          const jitter = (Math.random() - 0.5) * 1.8;
          // Bias toward continuity with previous column for a smoother top edge.
          const target = Math.max(1, Math.round(bell + jitter));
          const smoothed = Math.max(1, Math.round(prev * 0.4 + target * 0.6));
          pattern.push(smoothed);
          prev = smoothed;
        }
        return pattern;
      };

      const clouds: Cloud[] = [];
      const cloudCount = 6;
      for (let i = 0; i < cloudCount; i++) {
        const length = 6 + Math.floor(Math.random() * 16); // 6..21 cells
        const maxHeight = 2 + Math.random() * 3; // 2..5 cells tall
        const block = 2 + Math.floor(Math.random() * 3); // 2, 3 or 4 px per cell
        const pattern = generateCloudPattern(length, maxHeight);
        clouds.push({
          x: Math.random() * VIRTUAL_W,
          y: 25 + Math.random() * 75,
          w: pattern.length * block,
          speed: 0.04 + Math.random() * 0.05,
          alpha: 0.13 + Math.random() * 0.2,
          block,
          pattern,
        });
      }
      const cloudGfx = new Graphics();
      cloudsLayer.addChild(cloudGfx);

      const drawCloud = (g: InstanceType<typeof Graphics>, c: Cloud) => {
        for (let i = 0; i < c.pattern.length; i++) {
          const h = c.pattern[i];
          for (let j = 0; j < h; j++) {
            g.rect(
              Math.floor(c.x + i * c.block),
              Math.floor(c.y - j * c.block),
              c.block,
              c.block,
            ).fill({ color: 0x9aa7c7, alpha: c.alpha });
          }
        }
      };

      // ---------- Hill silhouette (compute curve once, reuse for grass/wanderer)
      const hillTopBase = VIRTUAL_H - 78;
      const hillTopAt = (x: number) => {
        const t = Math.max(0, Math.min(1, x / VIRTUAL_W));
        return hillTopBase - Math.sin(t * Math.PI * 0.9 + 0.2) * 30 - Math.sin(t * 8) * 1.2;
      };

      // ---------- Distant tree skyline (just behind the hill horizon-ish, at lower band)
      const farTrees = new Graphics();
      let px = 0;
      while (px < VIRTUAL_W) {
        const treeW = 3 + Math.floor(Math.random() * 4);
        const treeH = 6 + Math.floor(Math.random() * 12);
        const baseY = Math.floor(hillTopAt(px)) - 2;
        for (let r = 0; r < treeH; r++) {
          const w = Math.max(1, Math.floor(treeW * (1 - r / treeH)));
          farTrees.rect(
            px + Math.floor((treeW - w) / 2),
            baseY - r,
            w,
            1,
          ).fill({ color: 0x070a16, alpha: 0.9 });
        }
        px += treeW + Math.floor(Math.random() * 2);
      }
      farTreesLayer.addChild(farTrees);

      // ---------- Hill
      const hill = new Graphics();
      hill.moveTo(0, VIRTUAL_H);
      for (let x = 0; x <= VIRTUAL_W; x += 1) {
        hill.lineTo(x, Math.floor(hillTopAt(x)));
      }
      hill.lineTo(VIRTUAL_W, VIRTUAL_H);
      hill.lineTo(0, VIRTUAL_H);
      hill.fill(0x000000);
      hillLayer.addChild(hill);

      // ---------- Ancient ruins (silhouettes rising from the hilltop)
      const ruins = new Graphics();

      // Deterministic 1D pseudo-noise so silhouettes are stable across renders
      const hash01 = (n: number) => {
        const s = Math.sin(n * 12.9898) * 43758.5453;
        return s - Math.floor(s);
      };

      const drawCrumbledPillar = (
        g: InstanceType<typeof Graphics>,
        cx: number,
        baseY: number,
        height: number,
        width: number,
        jaggedness: number,
        seed: number,
      ) => {
        const left = cx - Math.floor(width / 2);
        for (let c = 0; c < width; c++) {
          const noise = hash01(seed + c * 7.31);
          const colHeight = Math.max(
            Math.floor(height * 0.55),
            Math.floor(height - noise * jaggedness),
          );
          for (let r = 0; r < colHeight; r++) {
            g.rect(left + c, baseY - r, 1, 1).fill(0x000000);
          }
        }
      };

      const drawBrokenArch = (
        g: InstanceType<typeof Graphics>,
        cx: number,
        baseY: number,
        pillarH: number,
        spanHalf: number,
        pillarW: number,
        seed: number,
      ) => {
        drawCrumbledPillar(g, cx - spanHalf, baseY, pillarH, pillarW, 3, seed);
        drawCrumbledPillar(g, cx + spanHalf, baseY, pillarH, pillarW, 3, seed + 100);
        // Partial lintel sitting on top of the two pillars, with a broken gap in the middle
        const lintelY = baseY - pillarH;
        const lintelH = 2;
        const halfW = Math.floor(pillarW / 2);
        for (let dx = -spanHalf - halfW; dx <= spanHalf + halfW; dx++) {
          if (Math.abs(dx) < spanHalf - 1) {
            const skipNoise = hash01(seed + 200 + dx * 3.7);
            if (skipNoise < 0.55) continue; // broken section
          }
          for (let r = 0; r < lintelH; r++) {
            g.rect(cx + dx, lintelY - 1 + r, 1, 1).fill(0x000000);
          }
        }
      };

      const drawCrumbledObelisk = (
        g: InstanceType<typeof Graphics>,
        cx: number,
        baseY: number,
        height: number,
        baseW: number,
        topW: number,
        seed: number,
      ) => {
        for (let r = 0; r < height; r++) {
          const t = r / height;
          const widthHere = Math.max(topW, Math.round(baseW - (baseW - topW) * t));
          // jagged top quarter
          if (r > height * 0.75) {
            const noise = hash01(seed + r * 5.13);
            if (noise < 0.45) continue;
          }
          g.rect(cx - Math.floor(widthHere / 2), baseY - r, widthHere, 1).fill(0x000000);
        }
      };

      // Placement (wanderer is around x=202; place ruins to his right and one small to his far left)
      drawCrumbledPillar(ruins, 330, Math.floor(hillTopAt(330)), 36, 5, 5, 1);
      drawBrokenArch(ruins, 395, Math.floor(hillTopAt(395)), 20, 8, 3, 11);
      drawCrumbledObelisk(ruins, 280, Math.floor(hillTopAt(280)), 26, 5, 2, 17);
      drawCrumbledPillar(ruins, 90, Math.floor(hillTopAt(90)), 22, 4, 4, 23);
      ruinsLayer.addChild(ruins);

      // ---------- Grass tufts (sway in wind)
      type Tuft = { x: number; y: number; phase: number; h: number };
      const tufts: Tuft[] = [];
      for (let i = 0; i < 60; i++) {
        const x = Math.floor(Math.random() * VIRTUAL_W);
        const y = Math.floor(hillTopAt(x));
        tufts.push({ x, y, phase: Math.random() * Math.PI * 2, h: 1 + Math.floor(Math.random() * 2) });
      }
      const grassGfx = new Graphics();
      grassLayer.addChild(grassGfx);

      // ---------- Wanderer silhouette on hilltop (hooded figure + flowing cape)
      const wanderer = new Graphics();
      const wandererX = Math.floor(VIRTUAL_W * 0.42);
      const wandererY = Math.floor(hillTopAt(wandererX));

      // Body silhouette pattern (5 wide × 13 tall). 'X' = pixel, '.' = empty.
      const WANDERER_BODY = [
        '..X..', // hood tip
        '.XXX.', // hood
        '.XXX.', // head
        '.XXX.', // head / neck
        'XXXXX', // shoulders (broad)
        '.XXX.', // chest
        '.XXX.', // torso
        '.XXX.', // torso
        '.XXX.', // waist
        '.X.X.', // legs separating
        '.X.X.', // legs
        '.X.X.', // legs
        '.X.X.', // feet
      ];

      const drawWanderer = (g: InstanceType<typeof Graphics>, phase: number) => {
        g.clear();
        const cx = wandererX - 2;
        const cy = wandererY - WANDERER_BODY.length;

        // Body
        for (let r = 0; r < WANDERER_BODY.length; r++) {
          const row = WANDERER_BODY[r];
          for (let c = 0; c < row.length; c++) {
            if (row[c] === 'X') {
              g.rect(cx + c, cy + r, 1, 1).fill(0x000000);
            }
          }
        }

        // Cape — anchors at the left shoulder, flows backward and waves in the wind.
        // 'phase' is a raw time phase; per-segment offset shifts the wave along the cape.
        const capeOriginX = cx;
        const capeOriginY = cy + 4;
        const capeLen = 9;
        for (let i = 0; i < capeLen; i++) {
          const segPhase = phase * 1.7 + i * 0.55;
          const sway = Math.sin(segPhase) * 1.5;
          const segX = capeOriginX - i + Math.round(sway);
          const segY = capeOriginY + Math.round(i * 0.75);
          g.rect(segX, segY, 2, 1).fill(0x000000);
          if (i > 1) {
            // bottom edge of cape thickens as it drapes
            g.rect(segX, segY + 1, 1, 1).fill(0x000000);
          }
        }
      };
      drawWanderer(wanderer, 0);
      wandererLayer.addChild(wanderer);

      // ---------- Resize/scale to viewport (cover-fit)
      const resize = () => {
        if (!containerRef.current) return;
        const vw = containerRef.current.clientWidth;
        const vh = containerRef.current.clientHeight;
        application.renderer.resize(vw, vh);
        const scale = Math.max(vw / VIRTUAL_W, vh / VIRTUAL_H);
        world.scale.set(scale);
        const drawnW = VIRTUAL_W * scale;
        const drawnH = VIRTUAL_H * scale;
        world.position.set((vw - drawnW) / 2, (vh - drawnH) / 2);
      };
      resize();
      window.addEventListener('resize', resize);

      // ---------- Animation
      let t = 0;
      const onTick = (ticker: { deltaMS: number }) => {
        const dt = ticker.deltaMS / 16.6667;
        t += dt;

        // Stars twinkle (redrawn each frame; also hosts shooting-star pixels)
        starGfx.clear();
        for (const s of stars) {
          const a = s.baseAlpha * (0.55 + 0.45 * Math.sin(t * 0.03 * s.speed + s.phase));
          starGfx.rect(s.x, s.y, 1, 1).fill({ color: 0xe8e6d8, alpha: a });
        }

        // Spawn shooting stars rarely
        if (Math.random() < 0.0045) {
          shooters.push({
            x: Math.random() * VIRTUAL_W * 0.7,
            y: Math.random() * VIRTUAL_H * 0.4,
            vx: 1.6 + Math.random() * 1.4,
            vy: 0.5 + Math.random() * 0.5,
            life: 0,
            maxLife: 45 + Math.random() * 30,
            trail: [],
          });
        }
        for (let i = shooters.length - 1; i >= 0; i--) {
          const sh = shooters[i];
          sh.x += sh.vx * dt;
          sh.y += sh.vy * dt;
          sh.life += dt;
          sh.trail.unshift({ x: sh.x, y: sh.y });
          if (sh.trail.length > 16) sh.trail.pop();
          for (let j = 0; j < sh.trail.length; j++) {
            const tp = sh.trail[j];
            const fade = 1 - j / sh.trail.length;
            const lifeFade = Math.max(0, 1 - sh.life / sh.maxLife);
            starGfx.rect(Math.floor(tp.x), Math.floor(tp.y), 1, 1).fill({
              color: 0xfff8d6,
              alpha: fade * lifeFade,
            });
          }
          if (sh.life > sh.maxLife || sh.x > VIRTUAL_W || sh.y > VIRTUAL_H) {
            shooters.splice(i, 1);
          }
        }

        // Clouds drift
        cloudGfx.clear();
        for (const c of clouds) {
          c.x += c.speed * dt;
          if (c.x > VIRTUAL_W + c.w) c.x = -c.w;
          drawCloud(cloudGfx, c);
        }

        // Grass sway
        grassGfx.clear();
        for (const tuft of tufts) {
          const sway = Math.sin(t * 0.045 + tuft.phase) * 1.1;
          for (let r = 0; r < tuft.h; r++) {
            grassGfx.rect(
              Math.floor(tuft.x + sway * ((r + 1) / tuft.h)),
              tuft.y - r,
              1,
              1,
            ).fill(0x0d1124);
          }
        }

        // Wanderer cape sway (raw time phase; sway computed per-segment inside)
        drawWanderer(wanderer, t * 0.04);
      };
      application.ticker.add(onTick);

      // Pause when tab is hidden
      const onVisibility = () => {
        if (document.hidden) application.ticker.stop();
        else application.ticker.start();
      };
      document.addEventListener('visibilitychange', onVisibility);

      cleanup = () => {
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', onVisibility);
        application.ticker.remove(onTick);
        application.destroy(true, { children: true });
      };
    })();

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      aria-hidden="true"
    />
  );
}
