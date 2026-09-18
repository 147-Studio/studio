import { useEffect, useState } from "react";
import { motion, Variants } from "motion/react";
import { opacity, slideUp } from "./anim";
import { setIsPreloader } from "@/valtio/app";
import styles from "./styles.module.scss";
import { Course, course_list } from "@/config/course";

export default function PreLoader({ course }: { course: Course }) {
  const words = [
    "آکادمی 147",
    ...course_list.filter((item) => item !== course),
  ];
  const [index, setIndex] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  const [showFinalWord, setShowFinalWord] = useState(false);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (showFinalWord) {
      setTimeout(() => {
        setIsPreloader(false);
      }, 1000);

      return;
    }

    const delay = index === 0 ? 1500 : 150;

    const timeout = setTimeout(() => {
      setIndex((prev) => {
        // first word only once
        if (prev === 0) return 1;

        // reached last word
        if (prev === words.length - 1) {
          setLoopCount((count) => {
            const nextCount = count + 1;

            if (nextCount >= 2) {
              setShowFinalWord(true);
            }

            return nextCount;
          });

          return 1;
        }

        return prev + 1;
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [index, showFinalWord]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height + 300} 0 ${
    dimension.height
  }  L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

  const curve: Variants = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className={styles.introduction}
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            variants={opacity}
            initial="initial"
            animate="enter"
            className="en"
          >
            {!showFinalWord && index > 0 && <span></span>}

            {showFinalWord ? course : words[index]}
          </motion.p>
          <svg>
            <motion.path
              variants={curve}
              initial="initial"
              exit="exit"
            ></motion.path>
          </svg>
        </>
      )}
    </motion.div>
  );
}
