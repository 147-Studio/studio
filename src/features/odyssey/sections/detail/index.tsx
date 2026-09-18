import React, { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import gsap from "gsap";

import styles from "./styles.module.scss";
import * as Assets from "@/assets";

import Copy from "@/components/ui/text/copy";
import SlideUp from "@/components/ui/slide-up";
import Opacity from "@/components/ui/opacity";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const Detail = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", once: true });
  const isMobile = useMediaQuery("(max-width: 767px)");

  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mamadRef = useRef<HTMLImageElement | null>(null);
  const ahmadRef = useRef<HTMLImageElement | null>(null);
  const mamadWrapperRef = useRef<HTMLImageElement | null>(null);
  const ahmadWrapperRef = useRef<HTMLImageElement | null>(null);

  const [activeBoxes, setActiveBoxes] = React.useState<Set<number>>(
    () => new Set(),
  );
  const getRandomIndex = () => {
    const row1Indexes = details
      .map((d, i) => (d.row === 1 ? i : -1))
      .filter((i) => i !== -1);

    return row1Indexes[Math.floor(Math.random() * row1Indexes.length)];
  };

  const animate = (
    actorRef: React.RefObject<HTMLImageElement | null>,
    user: string,
  ) => {
    if (isMobile) return;
    const actor = actorRef.current;
    const index = getRandomIndex();
    const target = boxRefs.current[index];

    if (
      !actor ||
      !target ||
      !mamadWrapperRef.current ||
      !ahmadWrapperRef.current
    )
      return;

    mamadWrapperRef.current.style.pointerEvents = "none";
    ahmadWrapperRef.current.style.pointerEvents = "none";

    const mamadRect = actor.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const startX = mamadRect.left;
    const startY = mamadRect.top;

    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const isActive = activeBoxes.has(index);

    const tl = gsap.timeline({
      onComplete: () => {
        if (mamadWrapperRef.current) {
          mamadWrapperRef.current.style.pointerEvents = "auto";
        }
        if (ahmadWrapperRef.current) {
          ahmadWrapperRef.current.style.pointerEvents = "auto";
        }
      },
    });

    gsap.set([actor, target], { clearProps: "x,y,scale" });

    // 1. move
    tl.to(actor, {
      x: targetX - startX - (user === "ahmad" ? 40 : 0),
      y: targetY - startY - (user === "ahmad" ? 40 : 0),
      duration: 1,
      ease: "power2.out",
    });

    // 2. press (temporary)
    tl.to([actor, target], {
      scale: 0.85,
      duration: 0.1,
    });

    // 3. release + state toggle
    tl.add(() => {
      setActiveBoxes((prev) => {
        const next = new Set(prev);

        if (next.has(index)) next.delete(index);
        else next.add(index);

        return next;
      });

      const box = target.getElementsByClassName(`${styles.box}`);
      const title = target.getElementsByClassName(`${styles.title}`);
      const dot = target.getElementsByClassName(`${styles.dot}`);
      const img = target.getElementsByTagName("path");

      gsap.to(target, {
        borderColor: isActive
          ? "#03030314"
          : user === "mamad"
            ? "#FFC56E"
            : "#FFA0C9",
        duration: 0.2,
      });

      gsap.to(box, {
        background: isActive
          ? "#F2F2F2"
          : user === "mamad"
            ? "linear-gradient(-45deg , rgba(255, 153, 0 , .14),  rgba(255, 198, 25 , .14) )"
            : "linear-gradient(-45deg , rgba(245, 32, 124 , .12) , rgba(255, 119, 187 , .12) )",
        duration: 0.0,
      });

      gsap.to(title, {
        color: isActive ? "black" : user === "mamad" ? "#FF9900" : "#FF328B",
        duration: 0.2,
      });

      gsap.to(img, {
        fill: isActive
          ? ""
          : user === "mamad"
            ? "url(#goldGradient)"
            : "url(#pinkGradient)",
        duration: 0,
      });

      gsap.to(dot, {
        backgroundColor: isActive
          ? ""
          : user === "mamad"
            ? "#FFDAA2"
            : "#FFBFD1",
        duration: 0,
      });
    });

    // 4. restore BOTH elements scale explicitly
    tl.to([actor, target], {
      scale: 1,
      duration: 0.2,
    });

    // 5. return
    tl.to(actor, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "back.inOut(1.2)",
    });
  };

  const onMamadClick = () => animate(mamadRef, "mamad");
  const onAhmadClick = () => animate(ahmadRef, "ahmad");

  useEffect(() => {
    if (isMobile) return;
    gsap.fromTo(
      mamadWrapperRef.current,
      { y: -20 },
      {
        y: 20,
        duration: 2.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      },
    );
    gsap.fromTo(
      ahmadWrapperRef.current,
      { y: -20 },
      {
        y: 20,
        duration: 2.5,
        delay: 0.3,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      },
    );
  }, []);

  useEffect(() => {
    if (isMobile) return;
    if (isInView) {
      setTimeout(() => {
        const random = Math.floor(Math.random() * 2) + 1;
        if (random == 1) {
          animate(mamadRef, "mamad");
        } else {
          animate(ahmadRef, "ahmad");
        }
      }, 3000);
    }
  }, [isInView]);

  return (
    <motion.div className={styles.container}>
      <div className={styles.heading}>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Opacity transition={{ delay: 0.4 }}>
            <motion.img
              src="/assets/svg/frame.svg"
              style={{ width: isMobile ? "92%" : "100%" }}
            />
          </Opacity>

          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50% , -50%)",
              width: "100%",
              fontSize: isMobile ? 28 : 36,
              fontWeight: 700,
            }}
            className="center"
          >
            <Copy>
              <span> اطلاعات دوره</span>
            </Copy>
          </span>
        </div>
        <div className={styles.desc}>
          {!isMobile && (
            <>
              <Opacity>
                <motion.div
                  className={styles.mamadWrapper}
                  ref={mamadWrapperRef}
                  onClick={onMamadClick}
                >
                  <motion.div className={styles.mamad} ref={mamadRef}>
                    <img src="/assets/svg/mouse-orange.svg" />
                    <span className={styles.label}>Azad</span>
                  </motion.div>
                </motion.div>
              </Opacity>
              <Opacity>
                <motion.div
                  className={styles.ahmadWrapper}
                  ref={ahmadWrapperRef}
                  onClick={onAhmadClick}
                >
                  <motion.div className={styles.ahmad} ref={ahmadRef}>
                    <img src="/assets/svg/mouse-pink.svg" />
                    <span className={styles.label}>Sorena</span>
                  </motion.div>
                </motion.div>
              </Opacity>
            </>
          )}

          <div className={styles.subtitle}>
            <Copy delay={0.3}>
              <p>
                در دوره اودیسه کارمون رو از سطح کاملا مقدماتی شروع می کنیم و
                قراره
              </p>
              <p>ساعت ها و جلسات زیادی رو کنار هم داشته باشیم!</p>
            </Copy>
          </div>

          <div className={styles.subtitle_mobile}>
            <Copy delay={0.3}>
              <p>در دوره اودیسه کارمون رو از سطح کاملا</p>
              <p> مقدماتی شروع می کنیم و قراره ساعت‌ها</p>
              <p> و جلسات زیادی رو کنار هم</p>
              <p>داشته باشیم!</p>
            </Copy>
          </div>
        </div>
      </div>
      <div className={styles.box_container} ref={ref}>
        <div className={styles.row}>
          {details.map((detail, index) => {
            if (detail.row == 1) {
              return (
                <Box
                  key={detail.title}
                  icon={detail.icon}
                  subtitle={detail.subtitle}
                  title={detail.title}
                  index={index}
                  ref={(el) => (boxRefs.current[index] = el)}
                />
              );
            }
          })}
        </div>
      </div>
    </motion.div>
  );
};

type BoxProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  index: number;
};

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ icon, title, subtitle, index }, ref) => {
    return (
      <SlideUp transition={{ delay: 0.2 * index }}>
        <motion.div ref={ref} className={styles.box_wrapper}>
          <div className={styles.box}>
            <div className={styles.dot_wrapper}>
              <div className={styles.dot} />
              <div className={styles.dot} />
            </div>
            <div className={styles.img_wrapper}>{icon}</div>
            <div className={styles.wrapper}>
              <div className={styles.title}>{title}</div>
              <div className={styles.subtitle}>{subtitle}</div>
            </div>
            <div className={styles.dot_wrapper}>
              <div className={styles.dot} />
              <div className={styles.dot} />
            </div>
          </div>
        </motion.div>
      </SlideUp>
    );
  },
);

const details = [
  {
    row: 1,
    icon: <Assets.Person />,
    title: "مدرس",
    subtitle: "سیدفاضل موحدی",
  },
  {
    row: 1,
    icon: <Assets.Clock />,
    title: "طول دوره",
    subtitle: "25+ ساعت آموزش",
  },
  {
    row: 1,
    icon: <Assets.Board />,
    title: "تعداد جلسات",
    subtitle: "12 جلسه آنلاین",
  },
  {
    row: 1,
    icon: <Assets.Chart />,
    title: "مقدماتی",
    subtitle: "بدون نیاز به پیش زمینه",
  },
];
