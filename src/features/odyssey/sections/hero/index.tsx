import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useSnapshot } from "valtio";

import styles from "./styles.module.scss";

import { IconGroup } from "@/features/odyssey/components/icongroup";
import { courses_link } from "@/config/course";

import * as Buttons from "@/components/ui/buttons";
import SlideUp from "@/components/ui/slide-up";
import Copy from "@/components/ui/text/copy";

import * as Assets from "@/assets";
import { app } from "@/valtio/app";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const Hero = () => {
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({});
  const isMobile = useMediaQuery("(max-width: 767px)");
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const p = Math.round(latest * 100);
    setProgress(p);
  });
  return (
    <div className={styles.container}>
      <div className={styles.title_wrapper}>
        <SlideUp>
          <motion.img
            className={styles.figma}
            src="/assets/img/figma.png"
            alt="figma"
            loading="eager"
          />
        </SlideUp>
        <SlideUp>
          <motion.img
            className={styles.project}
            src="/assets/img/project.webp"
            alt="project_base"
            loading="eager"
          />
        </SlideUp>

        <div className={styles.title}>
          <Copy>
            <span> دوره آنلاین آموزش</span>
          </Copy>
        </div>
        <div className={styles.title}>
          <Copy delay={0.3}>
            <span>طراحی رابط کاربری اودیسه</span>
          </Copy>
        </div>
      </div>
      <div className={styles.subtitle}>
        <Copy delay={0.5}>
          <p>توی این دوره قراره سفری داشته باشیم به دنیای طراحی رابط کاربری</p>
          <p>
            نرم افزار فیگما رو با هم یاد بگیریم و با انجام پروژه های عملی سطح
            مهارت های
          </p>
          <p>خودمون را بالاتر ببریم!</p>
        </Copy>
      </div>
      <div className={styles.subtitle_mobile}>
        <Copy delay={0.5}>
          <p>توی این دوره قراره سفری داشته باشیم </p>
          <p>به دنیای طراحی رابط کاربری. نرم افزار فیگما رو</p>
          <p>با هم یاد بگیریم و با انجام پروژه های عملی </p>
          <p>سطح مهارت های خودمون را</p>
          <p>بالاتر ببریم!</p>
        </Copy>
      </div>
      <SlideUp transition={{ delay: 0.7 }}>
        <motion.div>
          <Buttons.V1 link={courses_link.odyssey}>
            <Assets.Crown />
          </Buttons.V1>
        </motion.div>
      </SlideUp>
      <SlideUp>
        <motion.div
          className={styles.icongroup_wrapper}
          transition={{ delay: 1.3 }}
        >
          <IconGroup
            group1={isMobile ? mobileGroup1 : group1}
            group2={isMobile ? mobileGroup2 : group2}
            progress={progress}
          />
        </motion.div>
      </SlideUp>
    </div>
  );
};

const group1 = [
  "/assets/img/5.png",
  "/assets/img/4.png",
  "/assets/img/3.png",
  "/assets/img/2.png",
  "/assets/img/1.png",
];
const group2 = [
  "/assets/img/1.png",
  "/assets/img/3.png",
  "/assets/img/5.png",
  "/assets/img/4.png",
  "/assets/img/2.png",
];
const mobileGroup1 = [
  "/assets/img/3.png",
  "/assets/img/6.png",
  "/assets/img/5.png",
  "/assets/img/4.png",
];
const mobileGroup2 = [
  "/assets/img/5.png",
  "/assets/img/3.png",
  "/assets/img/4.png",
  "/assets/img/6.png",
];
