import { useEffect, useState } from "react";
import gsap from "gsap";
import "./style.css";

const CELL_SIZE = 36;

export const DotGrid2 = () => {
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const calculateGrid = () => {
      const cols = Math.ceil(window.innerWidth / CELL_SIZE);
      const rows = Math.ceil(window.innerHeight / CELL_SIZE);

      setGrid({ cols, rows });
    };

    calculateGrid();

    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, []);

  useEffect(() => {
    window.addEventListener("click", handleDotClick);
    return () => window.removeEventListener("click", handleDotClick);
  }, [grid]);

  const handleDotClick = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;
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

    tl.to(".grid2 .dot-point", {
      opacity: 1,
      // scale: 1.35,
      // y: -15,
      duration: 0.5,
      ease: "power2.out",
      stagger: {
        grid: [grid.rows, grid.cols],
        from: index,
        amount: 3,
      },
    });

    tl.to(
      ".grid2 .dot-point",
      {
        opacity: 0,
        // scale: 1,
        // y: 0,

        duration: (i) => {
          const d = getDistance(i, index, grid.cols);

          // normalize 0 → 1
          const t = d / maxDist;

          // invert so center = fast
          const inverted = 1 - t;

          // map to duration range
          return 0.5 + (1 - inverted) * 3.5;
          // center ≈ 0.5s, outer ≈ 4s
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

  const dots: any[] = [];
  let index = 0;
  for (let i = 0; i < grid.rows; i++) {
    for (let j = 0; j < grid.cols; j++) {
      dots.push(
        <div
          className="dot-wrapper"
          data-index={index}
          key={index}
          // onClick={handleDotClick}
        >
          <div className="dot-point" data-index={index} />
        </div>,
      );
      index++;
    }
  }

  return (
    <div
      className="grid2"
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
      }}
    >
      {dots}
    </div>
  );
};
