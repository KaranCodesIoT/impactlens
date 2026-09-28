import { useEffect, useRef } from 'react';

/**
 * Reusable, lightweight Canvas particle-network / neural constellation animation.
 * Features:
 * - Dynamic nodes floating in 2D space with subtle velocity
 * - Distance-based proximity connecting lines with gradient alpha
 * - Subtle pulsing radar rings around "evidence focal nodes"
 * - Respects prefers-reduced-motion
 * - Retina/devicePixelRatio awareness for ultra-crisp rendering
 * - Density modes: 'low' (for cards), 'medium' (for drawers/dialogs), 'high' (for wide banners)
 */
export default function NeuralConstellationCanvas({
  density = 'medium',
  className = '',
  colorTheme = 'cyan-indigo',
  interactive = false
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    // Determine particle count based on density and area
    const divisor = density === 'low' ? 36 : density === 'medium' ? 24 : 18;
    const maxParticles = density === 'low' ? 22 : density === 'medium' ? 38 : 55;
    const particleCount = Math.max(10, Math.min(Math.floor((width * height) / (divisor * divisor)), maxParticles));

    const colors = colorTheme === 'cyan-indigo' ? [
      { r: 56, g: 189, b: 248 },   // cyan-400
      { r: 99, g: 102, b: 241 },   // indigo-500
      { r: 168, g: 85, b: 247 },   // violet-500
      { r: 59, g: 130, b: 246 }    // blue-500
    ] : [
      { r: 56, g: 189, b: 248 },
      { r: 14, g: 165, b: 233 }
    ];

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (density === 'low' ? 0.35 : 0.5),
        vy: (Math.random() - 0.5) * (density === 'low' ? 0.35 : 0.5),
        radius: Math.random() * 1.5 + 1.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        isFocalNode: i % (density === 'low' ? 5 : 6) === 0,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    const maxDistance = density === 'low' ? 85 : density === 'medium' ? 100 : 120;
    let time = 0;

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      // Proximity connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (density === 'low' ? 0.38 : 0.32);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${particles[i].color.r}, ${particles[i].color.g}, ${particles[i].color.b}, ${alpha})`;
            ctx.lineWidth = density === 'low' ? 0.9 : 0.8;
            ctx.stroke();
          }
        }
      }

      // Nodes and focal radar pulses
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        // Draw focal radar aura
        if (p.isFocalNode) {
          const pulse = Math.sin(time + p.pulsePhase);
          const outerRadius = p.radius + 5 + pulse * 3;
          const auraAlpha = Math.max(0.08, 0.25 + pulse * 0.15);

          ctx.beginPath();
          ctx.arc(p.x, p.y, outerRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${auraAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw core particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
        ctx.shadowColor = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
        ctx.shadowBlur = p.isFocalNode ? 7 : 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [density, colorTheme]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
