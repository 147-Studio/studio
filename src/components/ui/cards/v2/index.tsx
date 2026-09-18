import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import styles from "./styles.module.scss";

const CardV2 = ({ img }: { img: string }) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => {
      window.dispatchEvent(new Event("resize"));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.preview_main}>
      <motion.div className={styles.preview_media} style={{ y }}>
        <picture>
          <img src={img}></img>
        </picture>
      </motion.div>
    </div>
  );
};

export default CardV2;
