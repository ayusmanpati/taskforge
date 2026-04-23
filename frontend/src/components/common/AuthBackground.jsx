import React, { useEffect, useRef } from "react";

export function AuthBackground({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    const parent = canvas.closest("#authScr");
    const motionReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const DOT_GAP = motionReduced ? 34 : 28;
    const DOT_R = motionReduced ? 1.2 : 1.5;
    const SPOT_COUNT = motionReduced ? 2 : 3;
    const FOLLOW_EASE = motionReduced ? 0.05 : 0.08;

    const bounds = { w: 0, h: 0 };
    const target = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    let rafId = 0;
    let frame = 0;
    let points = [];
    let spots = [];

    const palette = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        return {
          bg: "#0f0f10",
          dot: "rgba(255,255,255,0.13)",
          dotLit: "rgba(107,132,240,0.95)",
          spotA: "rgba(59,91,219,0.22)",
          spotB: "rgba(107,132,240,0.14)",
          spotC: "rgba(139,92,246,0.12)",
          cursorSpot: "rgba(107,132,240,0.28)",
          cursorOuter: "rgba(59,91,219,0.08)",
        };
      }

      return {
        bg: "#f7f7f5",
        dot: "rgba(24,24,27,0.12)",
        dotLit: "rgba(59,91,219,0.85)",
        spotA: "rgba(59,91,219,0.10)",
        spotB: "rgba(107,132,240,0.07)",
        spotC: "rgba(139,92,246,0.06)",
        cursorSpot: "rgba(59,91,219,0.13)",
        cursorOuter: "rgba(107,132,240,0.05)",
      };
    };

    const rebuildPoints = () => {
      const cols = Math.ceil(bounds.w / DOT_GAP) + 2;
      const rows = Math.ceil(bounds.h / DOT_GAP) + 2;
      const offX = (bounds.w % DOT_GAP) / 2;
      const offY = (bounds.h % DOT_GAP) / 2;
      const next = [];

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          next.push({ x: offX + c * DOT_GAP, y: offY + r * DOT_GAP });
        }
      }

      points = next;
    };

    const rebuildSpots = () => {
      spots = Array.from({ length: SPOT_COUNT }, (_, i) => ({
        x: Math.random() * bounds.w,
        y: Math.random() * bounds.h,
        r: Math.random() * 240 + 200,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        phase: (i / SPOT_COUNT) * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

      bounds.w = rect.width;
      bounds.h = rect.height;

      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      target.x = rect.width / 2;
      target.y = rect.height / 2;
      mouse.x = rect.width / 2;
      mouse.y = rect.height / 2;

      rebuildPoints();
      rebuildSpots();
    };

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
    };

    const onLeave = () => {
      target.x = bounds.w / 2;
      target.y = bounds.h / 2;
    };

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      frame += 1;

      mouse.x += (target.x - mouse.x) * FOLLOW_EASE;
      mouse.y += (target.y - mouse.y) * FOLLOW_EASE;

      const t = frame * 0.008;
      const colors = palette();

      ctx.clearRect(0, 0, bounds.w, bounds.h);

      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, bounds.w, bounds.h);

      const blobs = [colors.spotA, colors.spotB, colors.spotC];
      spots.forEach((spot, index) => {
        spot.x += spot.vx;
        spot.y += spot.vy;

        if (spot.x < -spot.r) spot.x = bounds.w + spot.r;
        if (spot.x > bounds.w + spot.r) spot.x = -spot.r;
        if (spot.y < -spot.r) spot.y = bounds.h + spot.r;
        if (spot.y > bounds.h + spot.r) spot.y = -spot.r;

        const pulse = 1 + 0.12 * Math.sin(t * 0.9 + spot.phase);
        const radius = spot.r * pulse;
        const gradient = ctx.createRadialGradient(
          spot.x,
          spot.y,
          0,
          spot.x,
          spot.y,
          radius,
        );
        gradient.addColorStop(0, blobs[index % blobs.length]);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      const glow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        180,
      );
      glow.addColorStop(0, colors.cursorSpot);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, bounds.w, bounds.h);

      const outerGlow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        380,
      );
      outerGlow.addColorStop(0, colors.cursorOuter);
      outerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, bounds.w, bounds.h);

      for (const point of points) {
        const dist = Math.hypot(point.x - mouse.x, point.y - mouse.y);
        const prox = Math.max(0, 1 - dist / 220);
        const scale = 1 + prox * 2.2;

        if (prox > 0) {
          ctx.save();
          ctx.globalAlpha = 0.13 + prox * 0.87;
          ctx.fillStyle = colors.dotLit;
          ctx.beginPath();
          ctx.arc(point.x, point.y, DOT_R * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = colors.dot;
          ctx.beginPath();
          ctx.arc(point.x, point.y, DOT_R, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    resize();
    draw();

    if (parent) {
      parent.addEventListener("mousemove", onMove, { passive: true });
      parent.addEventListener("mouseleave", onLeave, { passive: true });
    }

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      if (parent) {
        parent.removeEventListener("mousemove", onMove);
        parent.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [active]);

  return <canvas id="authBgCanvas" ref={canvasRef} />;
}
