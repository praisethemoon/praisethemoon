'use client';

import { useEffect, useRef } from 'react';

const VIRTUAL_W = 480;
const VIRTUAL_H = 180;

export default function MoonSky() {
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

      const world = new Container();
      application.stage.addChild(world);

      const skyLayer = new Container();
      const starsLayer = new Container();
      const moonLayer = new Container();
      const cloudsLayer = new Container();
      world.addChild(skyLayer, starsLayer, moonLayer, cloudsLayer);

      // ---------- Sky gradient: from soft night-blue at top to page bg at bottom,
      // so the hero merges visually into the dark page below it.
      const sky = new Graphics();
      const bands = 12;
      const topColor = { r: 0x0a, g: 0x12, b: 0x28 };
      const botColor = { r: 0x07, g: 0x09, b: 0x12 };
      for (let i = 0; i < bands; i++) {
        const t = i / (bands - 1);
        const r = Math.round(topColor.r + (botColor.r - topColor.r) * t);
        const g = Math.round(topColor.g + (botColor.g - topColor.g) * t);
        const b = Math.round(topColor.b + (botColor.b - topColor.b) * t);
        const color = (r << 16) | (g << 8) | b;
        sky.rect(
          0,
          Math.floor((VIRTUAL_H / bands) * i),
          VIRTUAL_W,
          Math.ceil(VIRTUAL_H / bands) + 1,
        ).fill(color);
      }
      skyLayer.addChild(sky);

      // ---------- Stars
      type Star = { x: number; y: number; baseAlpha: number; phase: number; speed: number };
      const stars: Star[] = [];
      const starCount = 110;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.floor(Math.random() * VIRTUAL_W),
          // bias toward upper area where they read better
          y: Math.floor(Math.pow(Math.random(), 1.3) * VIRTUAL_H * 0.85),
          baseAlpha: 0.35 + Math.random() * 0.6,
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

      // ---------- Moon (top-right)
      const moonContainer = new Container();
      const moonRadius = 22;
      moonContainer.position.set(VIRTUAL_W - 90, 75);

      const halo = new Graphics();
      for (let i = 6; i >= 1; i--) {
        halo.circle(0, 0, moonRadius + i * 6).fill({
          color: 0xfff8d6,
          alpha: 0.025 + (6 - i) * 0.008,
        });
      }
      moonContainer.addChild(halo);

      const moonBody = new Graphics();
      moonBody.circle(0, 0, moonRadius).fill(0xeae3c2);
      const craters: { x: number; y: number; r: number }[] = [
        { x: -8, y: -4, r: 3 },
        { x: 5, y: 3, r: 4 },
        { x: -2, y: 8, r: 2 },
        { x: 10, y: -7, r: 2 },
        { x: -10, y: 5, r: 2 },
      ];
      for (const c of craters) {
        moonBody.circle(c.x, c.y, c.r).fill(0xc9c1a3);
      }
      moonBody.circle(7, 0, moonRadius).fill({ color: 0x0a0e1f, alpha: 0.16 });
      moonContainer.addChild(moonBody);
      moonLayer.addChild(moonContainer);

      // ---------- Clouds (procedural — same generator approach as MoonScene)
      type Cloud = {
        x: number;
        y: number;
        w: number;
        speed: number;
        alpha: number;
        block: number;
        pattern: number[];
      };

      const generateCloudPattern = (length: number, maxHeight: number): number[] => {
        const pattern: number[] = [];
        let prev = 1;
        for (let i = 0; i < length; i++) {
          const t = length > 1 ? i / (length - 1) : 0.5;
          const bell = Math.sin(t * Math.PI) * maxHeight;
          const jitter = (Math.random() - 0.5) * 1.8;
          const target = Math.max(1, Math.round(bell + jitter));
          const smoothed = Math.max(1, Math.round(prev * 0.4 + target * 0.6));
          pattern.push(smoothed);
          prev = smoothed;
        }
        return pattern;
      };

      const clouds: Cloud[] = [];
      const cloudCount = 4;
      for (let i = 0; i < cloudCount; i++) {
        const length = 6 + Math.floor(Math.random() * 14);
        const maxHeight = 2 + Math.random() * 2.5;
        const block = 2 + Math.floor(Math.random() * 3);
        const pattern = generateCloudPattern(length, maxHeight);
        clouds.push({
          x: Math.random() * VIRTUAL_W,
          y: 35 + Math.random() * (VIRTUAL_H * 0.55),
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

      // ---------- Resize/scale (cover-fit)
      const resize = () => {
        if (!containerRef.current) return;
        const vw = containerRef.current.clientWidth;
        const vh = containerRef.current.clientHeight;
        if (vw === 0 || vh === 0) return;
        application.renderer.resize(vw, vh);
        const scale = Math.max(vw / VIRTUAL_W, vh / VIRTUAL_H);
        world.scale.set(scale);
        const drawnW = VIRTUAL_W * scale;
        const drawnH = VIRTUAL_H * scale;
        world.position.set((vw - drawnW) / 2, (vh - drawnH) / 2);
      };
      resize();
      window.addEventListener('resize', resize);

      // ---------- Ticker
      let t = 0;
      const onTick = (ticker: { deltaMS: number }) => {
        const dt = ticker.deltaMS / 16.6667;
        t += dt;

        starGfx.clear();
        for (const s of stars) {
          const a = s.baseAlpha * (0.55 + 0.45 * Math.sin(t * 0.03 * s.speed + s.phase));
          starGfx.rect(s.x, s.y, 1, 1).fill({ color: 0xe8e6d8, alpha: a });
        }

        if (Math.random() < 0.0045) {
          shooters.push({
            x: Math.random() * VIRTUAL_W * 0.7,
            y: Math.random() * VIRTUAL_H * 0.45,
            vx: 1.6 + Math.random() * 1.4,
            vy: 0.5 + Math.random() * 0.5,
            life: 0,
            maxLife: 40 + Math.random() * 25,
            trail: [],
          });
        }
        for (let i = shooters.length - 1; i >= 0; i--) {
          const sh = shooters[i];
          sh.x += sh.vx * dt;
          sh.y += sh.vy * dt;
          sh.life += dt;
          sh.trail.unshift({ x: sh.x, y: sh.y });
          if (sh.trail.length > 14) sh.trail.pop();
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

        cloudGfx.clear();
        for (const c of clouds) {
          c.x += c.speed * dt;
          if (c.x > VIRTUAL_W + c.w) c.x = -c.w;
          drawCloud(cloudGfx, c);
        }
      };
      application.ticker.add(onTick);

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
