import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./styles.module.scss";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface Props {
  group1: string[];
  group2: string[];
  progress: number;
}

const ease: gsap.EaseString = "circ.inOut";

export const IconGroup = ({ group1, group2, progress }: Props) => {
  const items1Ref = useRef<HTMLImageElement[]>([]);
  const items2Ref = useRef<HTMLImageElement[]>([]);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const phaseRef = useRef(0);

  const runningRef = useRef(false);
  const pausedRef = useRef(false);

  const order = isMobile ? [0, 1, 2, 3] : [3, 2, 1, 0, 4];

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const timelineToPromise = (cb: (tl: gsap.core.Timeline) => void) =>
    new Promise<void>((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => resolve(),
      });

      cb(tl);
    });

  const transitions = [
    () =>
      timelineToPromise((tl) => {
        tl.to(
          order.map((i) => items1Ref.current[i]),
          {
            scale: 0,
            duration: 0.5,
            ease,
            stagger: 0.1,
          },
        );

        tl.to(
          order.map((i) => items2Ref.current[i]),
          {
            scale: 1,
            duration: 0.5,
            ease,
            stagger: 0.1,
          },
          "-=0.6",
        );
      }),

    () =>
      timelineToPromise((tl) => {
        tl.to(
          order.map((i) => items2Ref.current[i]),
          {
            scale: 0,
            duration: 0.5,
            ease,
            stagger: 0.1,
          },
        );

        tl.to(
          order.map((i) => items1Ref.current[i]),
          {
            scale: 1,
            duration: 0.5,
            ease,
            stagger: 0.1,
          },
          "-=0.6",
        );
      }),
  ];

  const animateTransition = async () => {
    const currentPhase = phaseRef.current;

    await transitions[currentPhase]();

    phaseRef.current = (currentPhase + 1) % transitions.length;
  };

  const loop = async () => {
    if (runningRef.current) return;

    runningRef.current = true;

    while (runningRef.current) {
      if (pausedRef.current) {
        await sleep(100);
        continue;
      }

      await animateTransition();

      await sleep(2000);
    }
  };

  useEffect(() => {
    gsap.set(items1Ref.current, {
      scale: 1,
      transformOrigin: "center center",
    });

    gsap.set(items2Ref.current, {
      scale: 0,
      transformOrigin: "center center",
    });

    loop();

    return () => {
      runningRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (progress < 3) {
      pausedRef.current = false;
    } else {
      pausedRef.current = true;
    }
  }, [progress]);

  return (
    <>
      <div className={`${styles.group}  ${styles.group1}`}>
        {group1.map((img, index) => {
          return (
            <img
              key={index}
              src={img}
              ref={(el) => {
                if (el) {
                  items1Ref.current[index] = el;
                }
              }}
              loading="eager"
            />
          );
        })}
      </div>

      <div className={`${styles.group} ${styles.group2}`}>
        {group2.map((img, index) => {
          return (
            <img
              key={index}
              src={img}
              ref={(el) => {
                if (el) {
                  items2Ref.current[index] = el;
                }
              }}
              loading="eager"
            />
          );
        })}
      </div>
    </>
  );
};

// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import styles from "./styles.module.scss";

// interface props {
//   group1: string[];
//   group2: string[];
//   progress: number;
// }

// const ease: gsap.EaseString = "circ.inOut";

// export const IconGroup = ({ group1, group2, progress }: props) => {
//   const isRunningRef = useRef(false);
//   const timeoutRef = useRef<number | null>(null);

//   const animate = () => {
//     if (!isRunningRef.current) return;

//     const tl = gsap.timeline({
//       onComplete: () => {
//         if (!isRunningRef.current) return;

//         timeoutRef.current = setTimeout(() => {
//           animate();
//         }, 2000);
//       },
//     });

//     const items1 = gsap.utils.toArray(".group1 img");
//     const items2 = gsap.utils.toArray(`.${styles.group2} img`);

//     const order = [1, 2, 3, 4, 0];

//     tl.to(
//       order.map((i) => items1[i]),
//       {
//         scale: 0,
//         duration: 0.5,
//         ease: ease,
//         stagger: 0.1,
//       },
//     );

//     tl.to(
//       order.map((i) => items2[i]),
//       {
//         scale: 1,
//         duration: 0.5,
//         ease: ease,
//         stagger: 0.1,
//       },
//       "-=0.6",
//     );

//     tl.to({}, { duration: 2 });

//     tl.to(
//       order.map((i) => items2[i]),
//       {
//         scale: 0,
//         duration: 0.5,
//         ease: ease,
//         stagger: 0.1,
//       },
//     );

//     tl.to(
//       order.map((i) => items1[i]),
//       {
//         scale: 1,
//         duration: 0.5,
//         ease: ease,
//         stagger: 0.1,
//       },
//       "-=0.6",
//     );
//   };

//   useEffect(() => {
//     if (progress < 3) {
//       if (isRunningRef.current) return;

//       isRunningRef.current = true;
//       timeoutRef.current = setTimeout(animate, 2000);
//     } else {
//       isRunningRef.current = false;

//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//         timeoutRef.current = null;
//       }
//     }
//   }, [progress]);

//   return (
//     <>
//       <div className={`${styles.group} group1`}>
//         {group1.map((img, index) => {
//           return <img src={img} key={index} />;
//         })}
//       </div>
//       <div className={`${styles.group} ${styles.group2}`}>
//         {group2.map((img, index) => {
//           return <img key={index} src={img} />;
//         })}
//       </div>
//     </>
//   );
// };

// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import styles from "./styles.module.scss";
// import { motion, MotionValue, useSpring, useTransform } from "motion/react";
// import { animate } from "motion";

// interface props {
//   group1: string[];
//   group2: string[];
//   progress: number;
//   scroll: MotionValue<number>;
// }

// const ease: gsap.EaseString = "circ.inOut";

// export const IconGroup = ({ group1, group2, progress, scroll }: props) => {
//   const tlRef = useRef<gsap.core.Timeline | null>(null);
//   const isRunningRef = useRef(false);
//   const timeoutRef = useRef<number | null>(null);

//   const animate = () => {
//     if (!isRunningRef.current) return;

//     const tl = gsap.timeline({
//       onComplete: () => {
//         if (!isRunningRef.current) return;

//         timeoutRef.current = setTimeout(() => {
//           animate();
//         }, 2000);
//       },
//     });

//     tlRef.current = tl;

//     const items1 = gsap.utils.toArray(".group1 img");
//     const items2 = gsap.utils.toArray(`.${styles.group2} img`);

//     const order = [1, 2, 3, 4, 0];

//     tl.to(
//       order.map((i) => items1[i]),
//       {
//         scale: 0,
//         duration: 0.5,
//         ease: ease,
//         stagger: 0.1,
//       },
//     );

//     tl.to(
//       order.map((i) => items2[i]),
//       {
//         scale: 1,
//         duration: 0.5,
//         ease: ease,
//         stagger: 0.1,
//       },
//       "-=0.6",
//     );

//     tl.to({}, { duration: 2 });

//     if (isRunningRef.current) {
//       tl.to(
//         order.map((i) => items2[i]),
//         {
//           scale: 0,
//           duration: 0.5,
//           ease: ease,
//           stagger: 0.1,
//         },
//       );
//     }

//     tl.to(
//       order.map((i) => items1[i]),
//       {
//         scale: 1,
//         duration: 0.5,
//         ease: ease,
//         stagger: 0.1,
//       },
//       "-=0.6",
//     );
//   };

//   useEffect(() => {
//     if (progress === 0) {
//       if (isRunningRef.current) return;

//       isRunningRef.current = true;
//       timeoutRef.current = setTimeout(animate, 2000);
//     } else {
//       // 👇 only stop future loops
//       isRunningRef.current = false;

//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//         timeoutRef.current = null;
//       }

//       // if (finalTween.current) {
//       //   finalTween.current.kill();
//       // }
//     }
//   }, [progress]);

//   const scale = useTransform(scroll, [0.5, 0.8], [1, 0.8]);
//   const s = useSpring(scale);

//   const opacity = useTransform(scroll, [0.5, 0.8], [1, 0]);
//   const o = useSpring(opacity);

//   return (
//     <motion.div style={{ scale: s, opacity: o }}>
//       <div className={`${styles.group} group1`}>
//         {group1.map((img, index) => {
//           const start = index * 0.05;
//           const end = 0.3 + index * 0.05;

//           const position = useTransform(scroll, [start, end], [0, -200]);
//           const y = useSpring(position);

//           return (
//             <motion.div key={index} style={{ y }}>
//               <img src={img} />
//             </motion.div>
//           );
//         })}
//       </div>
//       <div className={`${styles.group} ${styles.group2}`}>
//         {group2.map((img, index) => {
//           const start = index * 0.05;
//           const end = 0.3 + index * 0.05;

//           const position = useTransform(scroll, [start, end], [0, -200]);
//           const y = useSpring(position);

//           return (
//             <motion.div key={index} style={{ y }}>
//               <img src={img} />
//             </motion.div>
//           );
//         })}
//       </div>
//     </motion.div>
//   );
// };
