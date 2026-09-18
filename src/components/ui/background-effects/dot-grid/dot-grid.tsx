import gsap from "gsap";
import "./style.css";

const GRID_WIDTH = 60;
const GRID_HEIGH = 60;

export const DotGrid = () => {
  const dots: any[] = [];
  let index = 0;

  const handleDotClick = (e: any) => {
    const index = Number(e.target.dataset.index);

    const tl = gsap.timeline();

    tl.to(".dot-point", {
      opacity: 1,
      scale: 1.35,
      y: -20,
      duration: 0.5,
      ease: "sine.out",
      stagger: {
        grid: [GRID_HEIGH, GRID_WIDTH],
        from: index,
        amount: 2,
      },
    });

    tl.to(
      ".dot-point",
      {
        scale: 1,
        y: 0,
        opacity: 0.2,
        duration: 2,
        ease: "sine.inOut",
        stagger: {
          grid: [GRID_HEIGH, GRID_WIDTH],
          from: index,
          amount: 2,
        },
      },

      0.5,
    ); // start right after first phase
  };

  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_HEIGH; j++) {
      dots.push(
        <div
          className="dot-wrapper"
          data-index={index}
          key={`${i} - ${j}`}
          onClick={handleDotClick}
        >
          <div className="dot-point" data-index={index} />
        </div>,
      );
      index++;
    }
  }

  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${GRID_WIDTH} , 1fr)`,
      }}
      className="grid w-fit"
    >
      {dots}
    </div>
  );
};
