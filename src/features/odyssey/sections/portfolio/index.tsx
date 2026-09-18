import { motion } from "motion/react";

import styles from "./styles.module.scss";
import { cursor } from "@/App";

import * as Cards from "@/components/ui/cards";
import SlideUp from "@/components/ui/slide-up";
import Copy from "@/components/ui/text/copy";

import CircularText from "@/components/ui/text/circular-text";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const Portfolio = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <Copy delay={0.2}>
          <span className={styles.subtitle}>
            بخشی از نمونه کارهای مدرس دوره
          </span>
        </Copy>
        <div className={styles.wrapper}>
          {!isMobile && (
            <SlideUp>
              <motion.div className={styles.circular}>
                <CircularText
                  text="UIDESIGN - UIDESIGN - UIDESIGN - "
                  spinDuration={0}
                  radius={0}
                />
                <div className={styles.globe_wrapper}>
                  <Globe />
                </div>
              </motion.div>
            </SlideUp>
          )}

          <div className={styles.title_wrapper}>
            <Copy>
              <span className={styles.title}>پورتفولیو مدرس</span>
            </Copy>
            <SlideUp>
              <motion.img
                src="/assets/img/portfolio.webp"
                className={styles.en}
              />
            </SlideUp>
          </div>
        </div>
      </div>

      <div className={styles.portfolio}>
        <div
          className={`${styles.items} ${styles.right}`}
          style={{ zIndex: 10 }}
        >
          <List side="right" />
        </div>
        <div
          className={`${styles.items} ${styles.left}`}
          style={{ zIndex: 10 }}
        >
          <List side="left" />
        </div>
      </div>
    </div>
  );
};

const List = ({ side }: { side: Side }) => {
  const handleMouseEnter = () => {
    cursor.setSkewing(3);
  };

  const handleMouseLeave = () => {
    cursor.removeSkewing();
  };

  return (
    <>
      {list.map((item) => {
        if (item.side === side) {
          return (
            <div
              key={item.image}
              className={styles.item}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              data-cursor-text={item.hover}
            >
              <Cards.V1 img={item.image} />
              <SlideUp>
                <motion.p className={styles.title_wrapper}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.divider}></span>
                  <span className={styles.desc}>{item.desc}</span>
                </motion.p>
              </SlideUp>
            </div>
          );
        }
      })}
    </>
  );
};

const Globe = () => {
  return (
    <div className="globe">
      <div className="globe-wrap">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle-hor"></div>
        <div className="circle-hor-middle"></div>
      </div>
    </div>
  );
};

const list = [
  {
    image: "/assets/img/greenporodo.webp",
    title: "گرین پرودو",
    hover: "گرین پرودو",
    desc: "وبسایت فروشگاهی کالای دیجیتال و لوازم جانبی",
    side: "right",
  },
  {
    image: "/assets/img/nora.webp",
    title: "نورا مدیتیشن",
    hover: "نورا مدیتیشن",
    desc: "اپلیکیشن مدیتیشن",
    side: "right",
  },
  {
    image: "/assets/img/ucon.webp",
    title: "پک آیکن UCON ",
    hover: "UCON",
    desc: "پلاگین فیگما شامل مجموعه‌ای با بیش از 7000 آیکن",
    side: "right",
  },
  {
    image: "/assets/img/eyelar.webp",
    title: "آیلار",
    hover: "آیلار",
    desc: "وبسایت فروشگاهی کلینیک چشم و عینک",
    side: "left",
  },
  {
    image: "/assets/img/grc.webp",
    title: "پلتفرم GRC Pro ",
    hover: "GRC Pro ",
    desc: "سامانه مدیریت ریسک",
    side: "left",
  },
  {
    image: "/assets/img/pixelate.webp",
    title: "Pixelate",
    hover: "Pixelate",
    desc: "پلاگین فیگما برای پیکسلی کردن تصاویر",
    side: "left",
  },
] as const;

type Side = (typeof list)[number]["side"];
