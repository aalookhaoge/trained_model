import { useEffect } from "react";

/**
 * Wires up all the imperative DOM behaviors from the original SignSetu HTML:
 * custom cursor, edge glow, navbar scroll, scroll reveal, about word reveal,
 * waveform bars, API tree draw, service-card glow, FAQ accordion (handled in component),
 * smooth scroll, squares background, 3D orbit, animated hero words, scroll-card
 * showcase, and tilted-card 3D hover. Behavior is preserved verbatim.
 */
export function useSignSetuEffects() {
  useEffect(() => {
    document.documentElement.classList.add("signsetu-html");

    const cleanups: Array<() => void> = [];

    // ---------- CUSTOM CURSOR ----------
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dot) { dot.style.left = mx + "px"; dot.style.top = my + "px"; }
    };
    document.addEventListener("mousemove", onMove);
    let rafCursor = 0;
    const animRing = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
      rafCursor = requestAnimationFrame(animRing);
    };
    animRing();
    const root = document.querySelector(".signsetu-root") as HTMLElement | null;
    const hoverEls = document.querySelectorAll<HTMLElement>(
      ".signsetu-root a, .signsetu-root button, .service-card, .feature-card, .faq-q"
    );
    const onEnter = () => root?.classList.add("cursor-hover");
    const onLeave = () => root?.classList.remove("cursor-hover");
    hoverEls.forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    cleanups.push(() => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafCursor);
      hoverEls.forEach(el => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    });

    // ---------- EDGE GLOW + NAVBAR SCROLL ----------
    const edgeGlow = document.getElementById("edgeGlow");
    const navbar = document.getElementById("navbar");
    let edgeTimer: number | undefined;
    const onScrollEdge = () => {
      edgeGlow?.classList.add("show");
      window.clearTimeout(edgeTimer);
      edgeTimer = window.setTimeout(() => edgeGlow?.classList.remove("show"), 600);
      navbar?.classList.toggle("scrolled", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScrollEdge, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScrollEdge));

    // ---------- SCROLL REVEAL ----------
    const revealObs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            revealObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".fade-up").forEach(el => revealObs.observe(el));
    document
      .querySelectorAll(".services-cards,.features-grid,.test-grid,.team-grid,.features-small-grid")
      .forEach(grid => {
        grid.querySelectorAll<HTMLElement>(".fade-up").forEach((card, i) => {
          card.style.transitionDelay = i * 0.09 + "s";
        });
      });
    cleanups.push(() => revealObs.disconnect());

    // ---------- ABOUT WORD REVEAL ----------
    const aboutContainer = document.getElementById("about-text");
    if (aboutContainer && !aboutContainer.dataset.built) {
      aboutContainer.dataset.built = "1";
      (aboutContainer.getAttribute("data-text") || "").split(/\s+/).forEach(word => {
        const span = document.createElement("span");
        span.className = "word";
        span.textContent = word;
        aboutContainer.appendChild(span);
      });
      const section = document.getElementById("about");
      let ticking = false;
      const revealWords = () => {
        if (!section) { ticking = false; return; }
        const rect = section.getBoundingClientRect();
        const wH = window.innerHeight;
        const norm = Math.max(0, Math.min(1, ((1 - ((rect.top + rect.height / 2) / wH)) + 0.15) / 0.75));
        const all = aboutContainer.querySelectorAll(".word");
        const cnt = Math.floor(norm * all.length);
        all.forEach((s, i) => s.classList.toggle("lit", i < cnt));
        ticking = false;
      };
      const onScrollAbout = () => {
        if (!ticking) { requestAnimationFrame(revealWords); ticking = true; }
      };
      window.addEventListener("scroll", onScrollAbout, { passive: true });
      revealWords();
      cleanups.push(() => window.removeEventListener("scroll", onScrollAbout));
    }

    // ---------- WAVEFORM ----------
    const wf = document.getElementById("waveform");
    if (wf && !wf.dataset.built) {
      wf.dataset.built = "1";
      for (let i = 0; i < 32; i++) {
        const b = document.createElement("div");
        b.className = "bar";
        b.style.height = (8 + Math.random() * 22) + "px";
        b.style.animationDelay = (Math.random() * 1.2).toFixed(2) + "s";
        b.style.animationDuration = (0.8 + Math.random() * 0.8).toFixed(2) + "s";
        wf.appendChild(b);
      }
    }

    // ---------- API TREE ----------
    const apiTree = document.getElementById("apiTree");
    let apiObs: IntersectionObserver | null = null;
    if (apiTree) {
      apiObs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) apiTree.classList.add("animate"); }),
        { threshold: 0.5 }
      );
      apiObs.observe(apiTree);
    }
    cleanups.push(() => apiObs?.disconnect());

    // ---------- SERVICE CARD GLOW ----------
    const serviceCards = document.querySelectorAll<HTMLElement>(".service-card");
    const svcMoveHandlers: Array<[HTMLElement, (e: MouseEvent) => void]> = [];
    serviceCards.forEach(card => {
      const h = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      };
      card.addEventListener("mousemove", h);
      svcMoveHandlers.push([card, h]);
    });
    cleanups.push(() => svcMoveHandlers.forEach(([c, h]) => c.removeEventListener("mousemove", h)));

    // ---------- SMOOTH SCROLL ----------
    const anchors = document.querySelectorAll<HTMLAnchorElement>('.signsetu-root a[href^="#"]');
    const anchorHandlers: Array<[HTMLAnchorElement, (e: Event) => void]> = [];
    anchors.forEach(a => {
      const h = (e: Event) => {
        const tgt = document.querySelector(a.getAttribute("href") || "");
        if (tgt) { e.preventDefault(); (tgt as HTMLElement).scrollIntoView({ behavior: "smooth" }); }
      };
      a.addEventListener("click", h);
      anchorHandlers.push([a, h]);
    });
    cleanups.push(() => anchorHandlers.forEach(([a, h]) => a.removeEventListener("click", h)));

    // ---------- SQUARES BACKGROUND ----------
    const canvas = document.getElementById("squares-bg") as HTMLCanvasElement | null;
    let rafSquares = 0;
    if (canvas) {
      const ctx = canvas.getContext("2d")!;
      const squareSize = 40;
      const speed = 0.5;
      const borderColor = "rgba(255,255,255,0.04)";
      const hoverFillColor = "rgba(124,58,237,0.08)";
      const gridOffset = { x: 0, y: 0 };
      let hoveredSquare: { x: number; y: number } | null = null;
      const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();
      const onMoveSq = (e: MouseEvent) => {
        hoveredSquare = {
          x: Math.floor((e.clientX + (gridOffset.x % squareSize)) / squareSize),
          y: Math.floor((e.clientY + (gridOffset.y % squareSize)) / squareSize),
        };
      };
      const onLeaveSq = () => (hoveredSquare = null);
      document.addEventListener("mousemove", onMoveSq);
      document.addEventListener("mouseleave", onLeaveSq);
      const drawGrid = () => {
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const startX = Math.floor(gridOffset.x / squareSize) * squareSize;
        const startY = Math.floor(gridOffset.y / squareSize) * squareSize;
        ctx.lineWidth = 0.5;
        for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
          for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
            const sX = x - (gridOffset.x % squareSize);
            const sY = y - (gridOffset.y % squareSize);
            const gX = Math.floor((x - startX) / squareSize);
            const gY = Math.floor((y - startY) / squareSize);
            if (hoveredSquare && gX === hoveredSquare.x && gY === hoveredSquare.y) {
              ctx.fillStyle = hoverFillColor;
              ctx.fillRect(sX, sY, squareSize, squareSize);
            }
            ctx.strokeStyle = borderColor;
            ctx.strokeRect(sX, sY, squareSize, squareSize);
          }
        }
        const g = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2,
          Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
        );
        g.addColorStop(0, "rgba(10,10,10,0)");
        g.addColorStop(1, "rgba(10,10,10,0.85)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };
      const update = () => {
        gridOffset.x = (gridOffset.x - speed + squareSize) % squareSize;
        gridOffset.y = (gridOffset.y - speed + squareSize) % squareSize;
        drawGrid();
        rafSquares = requestAnimationFrame(update);
      };
      update();
      cleanups.push(() => {
        cancelAnimationFrame(rafSquares);
        window.removeEventListener("resize", resizeCanvas);
        document.removeEventListener("mousemove", onMoveSq);
        document.removeEventListener("mouseleave", onLeaveSq);
      });
    }

    // ---------- 3D ORBIT ----------
    const wrap = document.getElementById("orbit3d");
    const scene = document.getElementById("orbitScene");
    let rafOrbit = 0;
    if (wrap && scene) {
      const images = [
        "https://images.pexels.com/photos/9017429/pexels-photo-9017429.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        "https://i.pinimg.com/1200x/c8/82/39/c88239acd35d0f03fc95525460387c3d.jpg",
        "https://i.pinimg.com/236x/e7/2e/7e/e72e7e58e5ecaf078aca793622525e1e.jpg",
        "https://i.pinimg.com/736x/59/d1/8e/59d18ec5470290bc08c1e4f192e16b2e.jpg",
        "https://i.pinimg.com/1200x/73/81/c4/7381c42782c06f3791a3a5fe63654e7f.jpg",
        "https://i.pinimg.com/736x/a0/e5/2f/a0e52fa709ca079a4aaecfcf703717dc.jpg",
        "https://i.pinimg.com/736x/25/f3/92/25f3929269a5688931b2bda19ea09efd.jpg",
        "https://i.pinimg.com/736x/78/13/a3/7813a322bc7e8bc5a63fa67b98e5c836.jpg",
        "https://i.pinimg.com/1200x/8f/5f/89/8f5f896508f42bb64297b036cd8bad6a.jpg",
        "https://i.pinimg.com/736x/c9/ef/65/c9ef65c9ede7d244f420d9f02c0e5726.jpg",
      ];
      const N = images.length;
      // Reset on remount
      wrap.innerHTML = "";
      const cards = images.map(src => {
        const el = document.createElement("div");
        el.className = "orbit-card-3d";
        const img = document.createElement("img");
        img.src = src; img.alt = "SignSetu";
        el.appendChild(img);
        wrap.appendChild(el);
        return el;
      });
      const angleOffsets = cards.map((_, i) => (i / N) * Math.PI * 2);
      let time = 0;
      const SPEED = 0.004;
      let paused = false;
      const getOrbitParams = () => {
        const W = (scene as HTMLElement).offsetWidth;
        const H = (scene as HTMLElement).offsetHeight;
        const cx = W / 2;
        const cy = H * 0.48;
        const rx = Math.min(W * 0.42, 500);
        const ry = rx * 0.38;
        return { cx, cy, rx, ry, W, H };
      };
      const render = () => {
        const { cx, cy, rx, ry } = getOrbitParams();
        cards.forEach((card, i) => {
          const angle = angleOffsets[i] + time;
          const x = cx + rx * Math.cos(angle);
          const y = cy + ry * Math.sin(angle);
          const depth = (Math.sin(angle) + 1) / 2;
          const minScale = 0.45, maxScale = 1.15;
          const scale = minScale + depth * (maxScale - minScale);
          const baseSize = 115;
          const size = baseSize * scale;
          const opacity = 0.35 + depth * 0.65;
          const zIndex = Math.round(depth * 100);
          const shadowBlur = 10 + depth * 40;
          const shadowAlpha = 0.2 + depth * 0.5;
          card.style.width = size + "px";
          card.style.height = size + "px";
          card.style.left = (x - size / 2) + "px";
          card.style.top = (y - size / 2) + "px";
          card.style.opacity = opacity.toFixed(3);
          card.style.zIndex = String(zIndex);
          card.style.transform = `rotate(0deg)`;
          card.style.boxShadow = `0 ${shadowBlur}px ${shadowBlur * 1.5}px rgba(0,0,0,${shadowAlpha.toFixed(2)})`;
          card.style.borderRadius = "20px";
        });
        if (!paused) time += SPEED;
        rafOrbit = requestAnimationFrame(render);
      };
      const onPause = () => (paused = true);
      const onResume = () => (paused = false);
      wrap.addEventListener("mouseenter", onPause);
      wrap.addEventListener("mouseleave", onResume);
      render();
      cleanups.push(() => {
        cancelAnimationFrame(rafOrbit);
        wrap.removeEventListener("mouseenter", onPause);
        wrap.removeEventListener("mouseleave", onResume);
        wrap.innerHTML = "";
      });
    }

    // ---------- ANIMATED HERO WORDS ----------
    const words = document.querySelectorAll<HTMLElement>(".anim-word");
    let wordsInterval: number | undefined;
    if (words.length) {
      let idx = 0;
      words[0].classList.add("active");
      wordsInterval = window.setInterval(() => {
        const cur = words[idx];
        const next = words[(idx + 1) % words.length];
        words.forEach(w => (w.className = "anim-word"));
        cur.classList.add("prev");
        next.classList.add("active");
        idx = (idx + 1) % words.length;
      }, 2500);
    }
    cleanups.push(() => { if (wordsInterval) window.clearInterval(wordsInterval); });

    // ---------- CONTAINER SCROLL ANIMATION ----------
    const container = document.getElementById("scroll-animation");
    const card = document.getElementById("scroll-card");
    const header = document.querySelector(".scroll-header") as HTMLElement | null;
    if (container && card && header) {
      let isMobile = window.innerWidth <= 768;
      let scaleDims: [number, number] = isMobile ? [0.7, 0.9] : [1.05, 1];
      const updateScroll = () => {
        const rect = container.getBoundingClientRect();
        const wH = window.innerHeight;
        const p = Math.max(0, Math.min(1, 1 - rect.top / wH));
        card.style.transform = `rotateX(${20 - 20 * p}deg) scale(${scaleDims[0] + (scaleDims[1] - scaleDims[0]) * p})`;
        header.style.transform = `translateY(${-100 * p}px)`;
      };
      const onScrollSC = () => requestAnimationFrame(updateScroll);
      const onResizeSC = () => {
        isMobile = window.innerWidth <= 768;
        scaleDims = isMobile ? [0.7, 0.9] : [1.05, 1];
      };
      window.addEventListener("scroll", onScrollSC, { passive: true });
      window.addEventListener("resize", onResizeSC);
      updateScroll();
      cleanups.push(() => {
        window.removeEventListener("scroll", onScrollSC);
        window.removeEventListener("resize", onResizeSC);
      });
    }

    // ---------- TILTED CARD 3D HOVER ----------
    const tiltSelectors = [".feature-card", ".feat-small", ".service-card", ".team-card", ".test-card"];
    const tiltHandlers: Array<{ el: HTMLElement; m: (e: MouseEvent) => void; en: () => void; lv: () => void; }> = [];
    document.querySelectorAll<HTMLElement>(tiltSelectors.join(",")).forEach(c => {
      let tRX = 0, tRY = 0, tS = 1, cRX = 0, cRY = 0, cS = 1, isHov = false, afId = 0;
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      const anim = () => {
        cRX = lerp(cRX, tRX, 0.1); cRY = lerp(cRY, tRY, 0.1); cS = lerp(cS, tS, 0.1);
        c.style.transform = `perspective(1200px) scale(${cS}) rotateX(${cRX}deg) rotateY(${cRY}deg)`;
        if (!isHov && Math.abs(cRX) < 0.01 && Math.abs(cRY) < 0.01) return;
        afId = requestAnimationFrame(anim);
      };
      const m = (e: MouseEvent) => {
        const r = c.getBoundingClientRect();
        tRX = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -10;
        tRY = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 10;
      };
      const en = () => { isHov = true; tS = 1.03; cancelAnimationFrame(afId); anim(); };
      const lv = () => { isHov = false; tRX = 0; tRY = 0; tS = 1; cancelAnimationFrame(afId); anim(); };
      c.addEventListener("mousemove", m);
      c.addEventListener("mouseenter", en);
      c.addEventListener("mouseleave", lv);
      tiltHandlers.push({ el: c, m, en, lv });
    });
    cleanups.push(() => tiltHandlers.forEach(({ el, m, en, lv }) => {
      el.removeEventListener("mousemove", m);
      el.removeEventListener("mouseenter", en);
      el.removeEventListener("mouseleave", lv);
    }));

    return () => {
      document.documentElement.classList.remove("signsetu-html");
      cleanups.forEach(fn => { try { fn(); } catch { /* ignore */ } });
    };
  }, []);
}
