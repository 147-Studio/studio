import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./style.css";

const CELL_SIZE = 36;

export const DotGrid3 = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });

  // ✅ observe container size
  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;

      const cols = Math.ceil(rect.width / CELL_SIZE);
      const rows = Math.ceil(rect.height / CELL_SIZE);

      setGrid({ cols, rows });
    });

    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [containerRef.current]);

  useEffect(() => {
    window.addEventListener("click", handleDotClick);
    return () => window.removeEventListener("click", handleDotClick);
  }, [grid]);

  const handleDotClick = (e: any) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // ✅ FIX: relative to container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    const index = row * grid.cols + col;

    const getDistance = (i, center, cols) => {
      const x1 = i % cols;
      const y1 = Math.floor(i / cols);

      const x2 = center % cols;
      const y2 = Math.floor(center / cols);

      const dx = x1 - x2;
      const dy = y1 - y2;

      return Math.sqrt(dx * dx + dy * dy);
    };

    const maxDist = Math.sqrt(grid.cols ** 2 + grid.rows ** 2);

    const tl = gsap.timeline();

    tl.to(".grid3 .dot-point", {
      opacity: 1,
      scale: 1.35,
      y: -15,
      duration: 0.5,
      ease: "power2.out",
      stagger: {
        grid: [grid.rows, grid.cols],
        from: index,
        amount: 3,
      },
    });

    tl.to(
      ".grid3 .dot-point",
      {
        opacity: 0.3,
        scale: 1,
        y: 0,
        duration: (i) => {
          const d = getDistance(i, index, grid.cols);
          const t = d / maxDist;
          return 0.5 + t * 3.5;
        },
        ease: "power2.out",
        stagger: {
          grid: [grid.rows, grid.cols],
          from: index,
          amount: 3,
        },
      },
      0.1,
    );
  };

  // ✅ generate grid
  const dots: any[] = [];
  let index = 0;

  for (let i = 0; i < grid.rows; i++) {
    for (let j = 0; j < grid.cols; j++) {
      dots.push(
        <div className="dot-wrapper" key={index}>
          <div className="dot-point" />
        </div>,
      );
      index++;
    }
  }

  return (
    <div
      ref={containerRef}
      className="grid3"
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
      }}
    >
      {dots}
    </div>
  );
};
