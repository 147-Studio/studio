import { useEffect, useRef } from "react";
import gsap from "gsap";

import styles from "./styles.module.scss";

type Props = {
  children: React.ReactNode;
  link: string;
};

const ButtonV1 = ({ children, link }: Props) => {
  const colorsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    colorsRef.current.forEach((el) => {
      animateRandom(el);
    });
  }, []);

  const animateRandom = (el) => {
    gsap.to(el, {
      xPercent: gsap.utils.random(-100, 100),
      yPercent: gsap.utils.random(-100, 100),
      duration: 0,
      ease: "none",
      onComplete: () => {
        setTimeout(() => {
          animateRandom(el);
        }, 1500);
      },
    });
  };

  return (
    <a
      href={link}
      className={`${styles["visible"]} ${styles["button-gradient"]}`}
    >
      <div className={styles["btn-content"]}> {children} ثبت نام در دوره </div>
      <div className={styles["gradient-0"]}></div>
      <div className={styles["gradient-1"]}></div>
      <div className={styles["glass"]}></div>
      <div className={styles["gradient-2"]}>
        {[1, 2, 3, 4, 5, 6].map((i, idx) => (
          <div
            key={i}
            className={`${styles[`color-${i}`]}  ${styles["color"]}`}
            ref={(el) => (colorsRef.current[idx] = el as HTMLDivElement)}
          />
        ))}
      </div>
    </a>
  );
};

export default ButtonV1;
