import { motion } from "motion/react";
import { slide, opacity, perspective } from "./anim";
import styles from "./style.module.scss";

const anim = (variants) => {
  return {
    initial: "initial",
    animate: "enter",
    exit: "exit",
    variants,
  };
};

export default function Inner({ children }) {
  return (
    <div className={styles.inner}>
      <motion.div className={styles.slide} {...anim(slide)} />
      <motion.div className={styles.page} {...anim(perspective)}>
        <motion.div className={styles.content} {...anim(opacity)}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
