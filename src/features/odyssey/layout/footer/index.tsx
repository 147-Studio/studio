import { cursor } from "@/App";
import styles from "./styles.module.scss";

import * as Buttons from "@/components/ui/buttons";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// const config = {
//   smoothig: 0.1,
//   movementThreshold: 0.01,
//   sizeFromSpeed: 0.2,
//   expandMultiplier: 2,
//   expandTime: 2,
//   expandEase: "power1.inOut",
//   dissolveStart: 2,
//   dissolveTime: 3,
//   dissolveEase: "power3.in",
// };

const Footer = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  // useEffect(() => {
  //   const footer = document.querySelector(
  //     `.${styles.footer}`,
  //   ) as HTMLElement | null;
  //   const smudgeSVG = document.querySelector(
  //     ".smudge-revealer",
  //   ) as SVGSVGElement | null;
  //   const smudgeContainer = document.querySelector(
  //     ".smudge-blobs",
  //   ) as SVGGElement | null;

  //   if (!footer || !smudgeSVG || !smudgeContainer) return;

  //   const pointer = { x: 0, y: 0 };
  //   const smoothPointer = { x: 0, y: 0 };
  //   let hasStarted = false;

  //   const onPointerMove = (x: number, y: number) => {
  //     if (!hasStarted) hasStarted = true;
  //     pointer.x = x;
  //     pointer.y = y;
  //   };

  //   footer.addEventListener("mousemove", (e: MouseEvent) =>
  //     onPointerMove(e.pageX, e.pageY),
  //   );
  //   footer.addEventListener(
  //     "touchstart",
  //     (e: TouchEvent) => {
  //       e.preventDefault();
  //       onPointerMove(e.touches[0].pageX, e.touches[0].pageY);
  //     },
  //     { passive: false },
  //   );
  //   footer.addEventListener(
  //     "touchmove",
  //     (e: TouchEvent) => {
  //       e.preventDefault();
  //       onPointerMove(e.touches[0].pageX, e.touches[0].pageY);
  //     },
  //     { passive: false },
  //   );

  //   const matchSVGToViewport = () => {
  //     smudgeSVG.setAttribute("width", window.innerWidth.toString());
  //     smudgeSVG.setAttribute("height", window.innerHeight.toString());
  //   };
  //   matchSVGToViewport();
  //   window.addEventListener("resize", matchSVGToViewport);

  //   function stampSmudgeAt(x: number, y: number, radius: number) {
  //     const circle = document.createElementNS(
  //       "http://www.w3.org/2000/svg",
  //       "circle",
  //     );
  //     circle.setAttribute("cx", x.toString());
  //     circle.setAttribute("cy", y.toString());
  //     circle.setAttribute("r", radius.toString());
  //     circle.setAttribute("fill", "#fff");
  //     smudgeContainer?.prepend(circle);

  //     const animatedRadius = { current: radius };

  //     const timeline = gsap.timeline({
  //       onUpdate() {
  //         circle.setAttribute(
  //           "r",
  //           Math.max(0, animatedRadius.current).toString(),
  //         );
  //       },
  //       onComplete() {
  //         circle.remove();
  //       },
  //     });

  //     timeline.to(animatedRadius, {
  //       current: radius * config.expandMultiplier,
  //       duration: config.expandTime,
  //       ease: config.expandEase,
  //     });
  //     timeline.to(
  //       animatedRadius,
  //       {
  //         current: 0,
  //         duration: config.dissolveTime,
  //         ease: config.dissolveEase,
  //       },
  //       config.dissolveStart,
  //     );
  //   }

  //   const update = () => {
  //     if (hasStarted) {
  //       smoothPointer.x += (pointer.x - smoothPointer.x) * config.smoothig;
  //       smoothPointer.y += (pointer.y - smoothPointer.y) * config.smoothig;

  //       const speed = Math.hypot(
  //         pointer.x - smoothPointer.x,
  //         pointer.y - smoothPointer.y,
  //       );

  //       if (speed > config.movementThreshold) {
  //         stampSmudgeAt(
  //           smoothPointer.x,
  //           smoothPointer.y,
  //           speed * config.sizeFromSpeed,
  //         );
  //       }
  //     }
  //     requestAnimationFrame(update);
  //   };

  //   requestAnimationFrame(update);
  // }, []);
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.title}> وقتشه اولین قدم رو برداری</div>
          <div className={styles.desc}>
            طراحی رابط کاربری فقط یادگیری یک نرم‌افزار نیست؛ بلکه ترکیبی از
            خلاقیت، اصول طراحی و توجه به جزئیاتیه که تجربه بهتری رو برای کاربران
            رقم می‌زنه. در دوره اودیسه، یادگیری فیگما و مفاهیم UI رو از پایه
            آغاز می‌کنیم و قدم به قدم در کنار یادگیری اصولی، آموخته‌های خودمون
            رو در عمل هم به کار می‌گیریم.
          </div>
          {!isMobile && (
            <div style={{ marginTop: "auto" }}>
              <Buttons.Magnet padding={0} disabled={false} magnetStrength={5}>
                <p
                  className="cb-btn_cta "
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => {
                    cursor.addState("-pointer3");
                    cursor.addState("-exclusion");
                  }}
                  onMouseLeave={() => {
                    cursor.removeState("-pointer3");
                    cursor.removeState("-exclusion");
                  }}
                >
                  <span
                    className="cb-btn_cta-title"
                    style={{
                      translate: "none",
                      rotate: "none",
                      scale: "none",
                      willChange: "auto",
                      transform: "translate(0px, 0%)",
                    }}
                  >
                    <span data-text="به جمع ما بپیوندید!">
                      به جمع ما بپیوندید!
                    </span>
                  </span>
                </p>
              </Buttons.Magnet>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
