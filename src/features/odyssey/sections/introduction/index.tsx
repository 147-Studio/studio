import {
  forwardRef,
  HTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

import styles from "./styles.module.scss";
import TextRotate, { TextRotateRef } from "@/components/ui/text/text-rotate";
import Copy from "@/components/ui/text/copy";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const steps = [
  "مفاهیم اولیه",
  "آموزش فیگما",
  "اصول طراحی بصری",
  "مباحث تکمیلی و پروژه",
  "به مقصد رسیدید!",
];

export const Introduction = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return <>{isMobile ? <Mobile /> : <Desktop />}</>;
};

const Mobile = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingBottom: "3rem",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <Copy delay={0.3}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>معرفی دوره</div>
      </Copy>
      <div style={{ fontSize: 16, color: "rgba(0,0,0,.5)" }}>
        <Copy delay={0.4}>
          <p>اسکار وایلدر جایی گفته است فقط آدم‌های </p>
          <p>سطحی‌اند که بر مبنای ظواهر داوری نمی‌کنند. شاید </p>
          <p>این جمله در نگاه اول کمی اغراق آمیز به نظر برسد.</p>
          <p>اما این حقیقت را یادآوری می‌کند که احتمالا تمام</p>
          <p>ایده‌های بصری و چالش‌های حل مسئله در نهایت بر</p>
          <p>اساس خروجی کار شما قضاوت خواهد شد. </p>
          <p>بنابراین امروزه که سایت‌ها و اپلیکیشن‌ها بیش از </p>
          <p>هر زمان دیگری در زندگی ما گسترده شده‌اند، </p>
          <p>طراحی محصولات دیجیتال باکیفیت بیش از پیش</p>
          <p>اهمیت پیدا کرده است. درست در همین نقطه است</p>
          <p>که ضرورت طراحی رابط کاربری مشخص می‌شود.</p>
          <p> پس اگر به خلق یک طرح بصری و تعاملی برای سایت</p>
          <p>یا اپلیکیشن، با چاشنی حل مسئله علاقه‌مند هستید،</p>
          <p>این دوره جذاب برای شماست!</p>
          <p> ما در دوره اودیسه یادگیری طراحی رابط کاربری را از </p>
          <p>سطح کاملا مقدماتی شروع می‌کنیم. در این مسیر </p>
          <p>ابتدا با مفاهیم پایه رابط کاربری آشنا می‌شویم و کار</p>
          <p> با نرم افزار فیگما را یاد می‌گیریم. در کنار آموزش</p>
          <p> ابزارها، به سراغ اصول طراحی بصری می‌رویم و </p>
          <p>موضوعاتی مثل سلسله مراتب بصری، رنگ‌ها، </p>
          <p>تایپوگرافی را بررسی می‌کنیم. در ادامه با مباحثی</p>
          <p>مثل استایل گاید، طراحی واکنش‌گرا و ساختاردهی </p>
          <p>صحیح صفحات آشنا می‌شویم تا کم‌کم تصویر </p>
          <p>کامل‌تری از فرآیند طراحی یک محصول دیجیتال </p>
          <p>داشته باشیم. بین فصل‌ها هم چند پروژه داریم تا </p>
          <p>ببینیم چطور می‌توانیم چیزهایی را که یاد گرفته‌ایم</p>
          <p> در پروژه‌های واقعی به کار بگیریم.</p>
        </Copy>
      </div>
    </div>
  );
};

const Desktop = () => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  const container = useRef(null);
  const progressBar = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: scroll } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scroll, [0, 0.15], [-200, 0]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const p = Math.round(latest * 100);
    setProgress(p);
    if (p < 40) {
      setStep(0);
    } else if (p > 40 && p < 60) {
      setStep(1);
    } else if (p > 60 && p < 85) {
      setStep(2);
    } else if (p > 85 && p < 100) {
      setStep(3);
    } else if (p == 100) {
      setStep(4);
    }
  });

  const filler = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const fillerBackground = useTransform(
    scrollYProgress,
    [0, 1],
    ["#109CFF", "#0DCA88"],
  );

  return (
    <motion.div className={styles.container} ref={container} style={{ y }}>
      <div className={styles.spacing}></div>
      <div className={styles.sticky_wrapper}>
        <div className={styles.sticky}>
          <div className={styles.content}>
            <div className={styles.right}>
              <Copy delay={0.3}>
                <div className={styles.title}>معرفی دوره</div>
              </Copy>
              <div className={styles.desc}>
                <Copy delay={0.4}>
                  <p>
                    اسکار وایلدر جایی گفته است فقط آدم‌های سطحی‌اند که بر مبنای
                    ظواهر داوری
                  </p>
                  <p>
                    نمی‌کنند. شاید این جمله در نگاه اول کمی اغراق آمیز به نظر
                    برسد. اما این حقیقت را
                  </p>
                  <p>
                    یادآوری می‌کند که احتمالا تمام ایده‌های بصری و چالش‌های حل
                    مسئله در نهایت بر{" "}
                  </p>
                  <p>
                    اساس خروجی کار شما قضاوت خواهد شد. بنابراین امروزه که
                    سایت‌ها و اپلیکیشن‌ها
                  </p>
                  <p>
                    بیش از هر زمان دیگری در زندگی ما گسترده شده‌اند، طراحی
                    محصولات دیجیتال{" "}
                  </p>
                  <p>
                    باکیفیت بیش از پیش اهمیت پیدا کرده است. درست در همین نقطه
                    است که ضرورت
                  </p>
                  <p>
                    طراحی رابط کاربری مشخص می‌شود. پس اگر به خلق یک طرح بصری و
                    تعاملی جذاب{" "}
                  </p>
                  <p>
                    برای سایت یا اپلیکیشن، با چاشنی حل مسئله علاقه‌مند هستید،
                    این دوره برای{" "}
                  </p>
                  <p>شماست!</p>
                  <p>
                    {" "}
                    ما در دوره اودیسه یادگیری طراحی رابط کاربری را از سطح کاملا
                    مقدماتی شروع{" "}
                  </p>
                  <p>
                    می‌کنیم. در این مسیر ابتدا با مفاهیم پایه رابط کاربری آشنا
                    می‌شویم و کار با نرم{" "}
                  </p>
                  <p>
                    افزار فیگما را یاد می‌گیریم. در کنار آموزش ابزارها، به سراغ
                    اصول طراحی بصری{" "}
                  </p>
                  <p>
                    می‌رویم و موضوعاتی مثل سلسله مراتب بصری، رنگ‌ها، تایپوگرافی
                    را بررسی می‌کنیم.
                  </p>
                  <p>
                    در ادامه با مباحثی مثل استایل گاید، طراحی واکنش‌گرا و
                    ساختاردهی صحیح صفحات{" "}
                  </p>
                  <p>
                    آشنا می‌شویم تا کم‌کم تصویر کامل‌تری از فرآیند طراحی یک
                    محصول دیجیتال داشته{" "}
                  </p>
                  <p>
                    باشیم. بین فصل‌ها هم چند پروژه داریم تا ببینیم چطور
                    می‌توانیم چیزهایی را که
                  </p>
                  <p>یاد گرفته‌ایم در پروژه‌های واقعی به کار بگیریم.</p>
                </Copy>
              </div>
            </div>
            <div className={styles.left}>
              <div
                className={styles.card_wrapper}
                style={{
                  background:
                    step == 4
                      ? "linear-gradient(-56deg , #E6F8EE , #D9F0F6"
                      : "linear-gradient(-56deg ,  rgba(251, 243, 230 , .9) , #D9E8F6",
                }}
              >
                <div className={styles.card}>
                  <div className={styles.first_row}>
                    <div
                      className={styles.number}
                      style={{ color: step == 4 ? "#0DCA88" : "#8EA6BC" }}
                    >
                      {progress}%
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.25,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={styles.title}
                      >
                        {steps[step]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className={styles.second_row}>
                    <div className={styles.progress} ref={progressBar}>
                      <ProgressIndicator
                        ref={progressBar}
                        fillerBackground={fillerBackground}
                        progress={progress}
                        style={{ position: "absolute", top: -15 }}
                      />
                      <motion.div
                        className={styles.filler}
                        style={{
                          width: filler,
                          backgroundColor: fillerBackground,
                        }}
                      ></motion.div>

                      <ProgressIndicator
                        ref={progressBar}
                        fillerBackground={fillerBackground}
                        progress={progress}
                        style={{ position: "absolute", top: 15 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <motion.div
                style={{
                  display: "flex",
                  flexDirection: "column",

                  gap: 12,
                  position: "relative",
                  width: "100%",
                }}
              >
                <motion.div
                  style={{
                    display: "flex",
                    gap: 12,

                    position: "relative",
                    width: "100%",
                    height: 64,
                  }}
                >
                  <Comp1 scroll={scrollYProgress} />
                  <Comp2 scroll={scrollYProgress} />
                  <Comp3 scroll={scrollYProgress} />
                </motion.div>
                <motion.div
                  style={{
                    display: "flex",
                    gap: 12,
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <Comp4 scroll={scrollYProgress} />
                  <Comp5 scroll={scrollYProgress} />
                </motion.div>
                <motion.div
                  style={{
                    display: "flex",
                    gap: 12,
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <motion.div
                    style={{
                      display: "flex",
                      gap: 12,
                      position: "absolute",
                      width: "100%",
                    }}
                  >
                    <LayoutGroup>
                      <Comp6 scroll={scrollYProgress} />
                      <Comp7 scroll={scrollYProgress} />
                    </LayoutGroup>
                  </motion.div>
                  <motion.div
                    style={{
                      display: "flex",
                      gap: 12,
                      position: "absolute",
                      width: "100%",
                    }}
                    layout
                  >
                    <LayoutGroup>
                      <Comp8 scroll={scrollYProgress} />
                      <Comp9 scroll={scrollYProgress} />
                    </LayoutGroup>
                  </motion.div>
                  <motion.div
                    style={{
                      display: "flex",
                      gap: 12,
                      position: "absolute",
                      width: "100%",
                    }}
                    layout
                  >
                    <Comp10 scroll={scrollYProgress} />
                    <Comp11 scroll={scrollYProgress} />
                    <Comp12 scroll={scrollYProgress} />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
type ProgressIndicatorProps = {
  fillerBackground: MotionValue<string>;
  progress: number;
} & HTMLAttributes<HTMLOrSVGElement>;

const START = 4;
const GAP = 5;

export const ProgressIndicator = forwardRef<
  HTMLDivElement,
  ProgressIndicatorProps
>(({ fillerBackground, progress, style, ...rest }, ref) => {
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  useEffect(() => {
    if (!ref || typeof ref === "function") return;

    const el = ref.current;
    if (!el) return;

    const resize = () => {
      setProgressBarWidth(el.offsetWidth);
    };

    resize();

    const observer = new ResizeObserver(() => resize());
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref]);

  const dynamicPaths = useMemo(() => {
    if (!progressBarWidth) return [];

    const usableWidth = progressBarWidth - START * 2;

    const count = Math.floor(usableWidth / GAP);

    if (count < 2) return [];

    const actualGap = usableWidth / (count - 1);

    return Array.from({ length: count }, (_, i) => {
      const x = START + i * actualGap;

      const isFirst = i === 0;
      const isLast = i === count - 1;

      const isBig = isFirst || isLast || i % 14 === 0;

      return {
        d: `M${x} 6.5V${isBig ? 0.5 : 3.5}`,
        big: isBig,
      };
    });
  }, [progressBarWidth]);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <svg
        width="100%"
        height="7"
        viewBox={`0 0 ${progressBarWidth} 7`}
        fill="none"
        style={{ ...style }}
        {...rest}
      >
        {dynamicPaths.map((p, i) => {
          const active = (dynamicPaths.length * progress) / 100;

          return (
            <motion.path
              key={i}
              d={p.d}
              stroke={i >= active ? "gray" : fillerBackground}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
});

const Comp1 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const position = useTransform(scroll, [0.06, 0.12], [30, 0], {
    clamp: true,
  });

  const opacity = useTransform(scroll, [0.06, 0.07, 0.4, 0.51], [0, 1, 1, 0], {
    clamp: true,
  });

  const scale = useTransform(scroll, [0.38, 0.39], [1, 0], {
    clamp: true,
  });

  return (
    <motion.img
      src="/assets/svg/flash.svg"
      style={{
        x: position,
        opacity: opacity,
        scale: scale,
        position: "absolute",
      }}
      transition={{
        transform: {
          ease: "easeIn",
        },
      }}
    ></motion.img>
  );
};

const Comp2 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const scale = useTransform(scroll, [0.39, 0.41], [0, 1], {
    clamp: true,
  });

  return (
    <motion.img
      src="/assets/svg/figma.svg"
      style={{
        scale: scale,
        position: "absolute",
      }}
    ></motion.img>
  );
};

const Comp3 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const steps = [
    "آشنایی با رابط کاربری",
    "نرم افزار و اصول طراحی",
    "قدم نهایی!",
  ];

  const ref = useRef<TextRotateRef>(null);

  const stepRef = useRef(0);

  useMotionValueEvent(scroll, "change", (latest) => {
    const p = Math.round(latest * 100);

    let nextStep = 0;

    if (p < 40) nextStep = 0;
    else if (p < 85) nextStep = 1;
    else nextStep = 2;

    if (stepRef.current !== nextStep) {
      stepRef.current = nextStep;
      ref.current?.jumpTo(nextStep);
    }
  });

  const position = useTransform(scroll, [0.14, 0.17], [120, 76], {
    clamp: true,
  });

  const opacity = useTransform(
    scroll,
    [0.14, 0.15, 1],
    [0, 1, 1], // 👈 keep it 1 forever after 0.17
    { clamp: true },
  );

  return (
    <LayoutGroup>
      <motion.span
        style={{
          x: position,
          opacity: opacity,
          position: "absolute",
          background: "linear-gradient(0deg, #353B45, #505B6C)",
          border: "1px solid white",
          color: "white",
          borderRadius: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "18px 32px",
        }}
        layout="size"
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        <TextRotate
          ref={ref}
          texts={steps}
          splitBy="lines"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          auto={false}
        />
      </motion.span>
    </LayoutGroup>
  );
};

const Comp4 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const positionX = useTransform(scroll, [0.19, 0.22], [30, 0], {
    clamp: true,
  });

  const opacity = useTransform(scroll, [0.19, 0.22, 0.35, 0.36], [0, 1, 1, 0], {
    clamp: true,
  });

  return (
    <motion.div
      style={{
        x: positionX,
        opacity: opacity,
        color: "rgba( 0 , 0 , 0 , .6)",
        border: "1px solid rgba( 0 , 0 , 0 , .12)",
        borderRadius: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "18px 32px",
      }}
    >
      تاریخچه
    </motion.div>
  );
};

const Comp5 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const position = useTransform(scroll, [0.24, 0.27], [20, 0], {
    clamp: true,
  });

  const opacity = useTransform(scroll, [0.24, 0.27, 0.35, 0.36], [0, 1, 1, 0], {
    clamp: true,
  });

  return (
    <motion.div
      style={{
        x: position,
        opacity: opacity,
        color: "rgba( 0 , 0 , 0 , .6)",
        border: "1px solid rgba( 0 , 0 , 0 , .12)",
        borderRadius: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "18px 32px",
      }}
    >
      کاربرد و اهمیت
    </motion.div>
  );
};

const Comp6 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const steps = ["یادگیری پنل", "ریسپانسیو"];

  const ref = useRef<TextRotateRef>(null);

  useMotionValueEvent(scroll, "change", (latest) => {
    const p = Math.round(latest * 100);

    if (ref.current) {
      if (p < 72) {
        ref.current.jumpTo(0);
      } else if (p > 72 && p < 80) {
        ref.current.jumpTo(1);
      } else if (p > 80 && p < 100) {
        ref.current.jumpTo(2);
      }
    }
  });

  const positionX = useTransform(scroll, [0.27, 0.3], [30, 0], {
    clamp: true,
  });

  const positionY = useTransform(scroll, [0, 0.34, 0.38], [0, 0, -76], {
    clamp: true,
  });

  const opacity = useTransform(scroll, [0.27, 0.3, 0.88, 0.93], [0, 1, 1, 0], {
    clamp: true,
  });

  return (
    <LayoutGroup>
      <motion.div
        style={{
          x: positionX,
          y: positionY,
          opacity: opacity,
          color: "rgba( 0 , 0 , 0 , .6)",
          border: "1px solid rgba( 0 , 0 , 0 , .12)",
          borderRadius: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "18px 32px",
          backgroundColor: "white",
          zIndex: 5,
        }}
        layout
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        <TextRotate
          ref={ref}
          texts={steps}
          splitBy="lines"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          auto={false}
        />
      </motion.div>
    </LayoutGroup>
  );
};

const Comp7 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const steps = ["نصب و راه اندازی", "قوانین گشتالت", "استایل گاید"];

  const ref = useRef<TextRotateRef>(null);

  useMotionValueEvent(scroll, "change", (latest) => {
    const p = Math.round(latest * 100);

    if (ref.current) {
      if (p < 54) {
        ref.current.jumpTo(0);
      } else if (p > 54 && p < 80) {
        ref.current.jumpTo(1);
      } else if (p > 80 && p < 100) {
        ref.current.jumpTo(2);
      }
    }
  });
  const positionX = useTransform(scroll, [0.3, 0.33], [20, 0], {
    clamp: true,
  });
  const positionY = useTransform(scroll, [0, 0.36, 0.38], [0, 0, -76], {
    clamp: true,
  });

  const opacity = useTransform(scroll, [0.3, 0.33, 0.88, 0.93], [0, 1, 1, 0], {
    clamp: true,
  });

  return (
    <LayoutGroup>
      <motion.div
        style={{
          x: positionX,
          y: positionY,
          opacity: opacity,
          color: "rgba( 0 , 0 , 0 , .6)",
          border: "1px solid rgba( 0 , 0 , 0 , .12)",
          borderRadius: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "18px 32px",
          backgroundColor: "white",
          zIndex: 5,
        }}
        layout
        transition={{
          layout: {
            type: "spring",
            damping: 30,
            stiffness: 400,
          },
          transform: {
            ease: "anticipate",
          },
        }}
      >
        <TextRotate
          ref={ref}
          texts={steps}
          splitBy="lines"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          auto={false}
        />
      </motion.div>
    </LayoutGroup>
  );
};

const Comp8 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const steps = ["اوتو لیوت", "رنگ شناسی", "ایده یابی"];

  const ref = useRef<TextRotateRef>(null);

  useMotionValueEvent(scroll, "change", (latest) => {
    const p = Math.round(latest * 100);

    if (ref.current) {
      if (p < 60) {
        ref.current.jumpTo(0);
      } else if (p > 60 && p < 80) {
        ref.current.jumpTo(1);
      } else if (p > 80 && p < 100) {
        ref.current.jumpTo(2);
      }
    }
  });
  const positionX = useTransform(scroll, [0.42, 0.45], [30, 0], {
    clamp: true,
  });

  const positionY = useTransform(scroll, [0, 0.88, 0.93], [0, 0, -76], {
    clamp: true,
  });
  const opacity = useTransform(scroll, [0.42, 0.45, 1], [0, 1, 1], {
    clamp: true,
  });

  return (
    <LayoutGroup>
      <motion.div
        style={{
          x: positionX,
          y: positionY,
          opacity: opacity,
          color: "rgba( 0 , 0 , 0 , .6)",
          border: "1px solid rgba( 0 , 0 , 0 , .12)",
          borderRadius: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "18px 32px",
          backgroundColor: "white",
          zIndex: 5,
        }}
        layout
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        <TextRotate
          ref={ref}
          texts={steps}
          splitBy="lines"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          auto={false}
        />
      </motion.div>
    </LayoutGroup>
  );
};

const Comp9 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const steps = ["کامپوننت و ورینت", "سلسه مراتب بصری", "طراحی سایت"];

  const ref = useRef<TextRotateRef>(null);

  useMotionValueEvent(scroll, "change", (latest) => {
    const p = Math.round(latest * 100);

    if (ref.current) {
      if (p < 66) {
        ref.current.jumpTo(0);
      } else if (p > 66 && p < 80) {
        ref.current.jumpTo(1);
      } else if (p > 80 && p < 100) {
        ref.current.jumpTo(2);
      }
    }
  });

  const positionX = useTransform(scroll, [0.47, 0.5], [20, 0], {
    clamp: true,
  });

  const positionY = useTransform(scroll, [0, 0.9, 0.93], [0, 0, -76], {
    clamp: true,
  });

  const opacity = useTransform(scroll, [0.47, 0.5, 1], [0, 1, 1], {
    clamp: true,
  });

  return (
    <LayoutGroup>
      <motion.div
        style={{
          x: positionX,
          y: positionY,
          opacity: opacity,
          color: "rgba( 0 , 0 , 0 , .6)",
          border: "1px solid rgba( 0 , 0 , 0 , .12)",
          borderRadius: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "18px 32px",
          backgroundColor: "white",
          zIndex: 5,
        }}
        layout
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        <TextRotate
          ref={ref}
          texts={steps}
          splitBy="lines"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          auto={false}
        />
      </motion.div>
    </LayoutGroup>
  );
};

const Comp10 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const opacity = useTransform(scroll, [0.93, 1], [0, 1], {
    clamp: true,
  });

  return <motion.img style={{ opacity }} src="/assets/svg/smile-1.svg" />;
};

const Comp11 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const opacity = useTransform(scroll, [0.95, 1], [0, 1], {
    clamp: true,
  });

  return <motion.img style={{ opacity }} src="/assets/svg/smile-2.svg" />;
};

const Comp12 = ({ scroll }: { scroll: MotionValue<number> }) => {
  const opacity = useTransform(scroll, [0.97, 1], [0, 1], {
    clamp: true,
  });

  return <motion.img style={{ opacity }} src="/assets/svg/smile-3.svg" />;
};
