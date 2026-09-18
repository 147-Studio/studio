import { useState } from "react";
import styles from "./styles.module.scss";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Copy from "@/components/ui/text/copy";
import SlideUp from "@/components/ui/slide-up";
import * as Assets from "@/assets";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const Chapters = () => {
  const [openIndex, setOpenIndex] = useState(-1);
  const isMobile = useMediaQuery("(max-width: 767px)");
  return (
    <div className={styles.container}>
      {!isMobile && (
        <div className={styles.dot_wrapper}>
          <div className={styles.dot} />
          <div className={styles.dot} />
        </div>
      )}

      <div className={styles.heading_wrapper}>
        <span className={`${styles.heading1} center`}>
          <Copy>
            <span>سرفصل‌های دوره</span>
          </Copy>
          {!isMobile && (
            <SlideUp>
              <motion.img
                className={styles.en}
                src="/assets/img/odyssey-course.webp"
              />
            </SlideUp>
          )}
        </span>
        <span className={styles.heading2}>
          <Copy delay={0.2}>
            <span>طراحی رابط کاربری </span>
          </Copy>
          <Copy delay={0.3}>
            <span>اودیـسه</span>
          </Copy>
        </span>
        <Copy delay={0.4}>
          <span className={`${styles.heading3} center`}>
            آنچه با هم می‌آموزیم
          </span>
        </Copy>
      </div>
      <div className={styles.chapters_wrapper}>
        {!isMobile && (
          <div className={styles.fake}>
            <span className={styles.vertical1}>UICOURSE</span>
          </div>
        )}

        <motion.div className={styles.chapters}>
          {list.map((item, index) => {
            const isOpen = index === openIndex;
            const className = [
              styles.chapter_wrapper,
              styles[getRadiusClass(index, openIndex, list.length)],
            ].join(" ");

            return (
              <Chapter
                key={item.season}
                item={item}
                className={className}
                isOpen={isOpen}
                setOpen={() => {
                  setOpenIndex(openIndex == index ? -1 : index);
                }}
                isMobile={isMobile}
              />
            );
          })}
        </motion.div>

        {!isMobile && (
          <div className={styles.fake}>
            <span className={styles.vertical2}>ODYSSEY</span>
          </div>
        )}
      </div>

      {!isMobile && (
        <div className={styles.dot_wrapper}>
          <div className={styles.dot} />
          <div className={styles.dot} />
        </div>
      )}
    </div>
  );
};

const Chapter = ({
  item,
  isOpen,
  className,
  setOpen,
  isMobile,
}: {
  item: (typeof list)[number];
  isOpen: boolean;
  className: string;
  setOpen: any;
  isMobile: boolean;
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        height: isOpen ? "auto" : isMobile ? 78 : 96,
        marginBlock: isOpen ? 10 : 0,
      }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      style={{ willChange: "height , marginBlock" }}
      onClick={setOpen}
    >
      <motion.div className={styles.chapter} transition={{ type: "spring" }}>
        <motion.div className={styles.trigger} style={{ transform: "none" }}>
          <div
            className={`${styles.icon} ${styles[item.id]} ${isOpen ? styles.open : ""}`}
          >
            {item.icon}
          </div>
          <span
            className={styles.season}
            style={{ color: isOpen ? "#1765EC" : "#00000080" }}
          >
            {item.season}
            {isMobile && " :"}
          </span>
          {!isMobile && <span className={styles.divider} />}
          <span
            className={styles.title}
            style={{ color: isOpen ? "#1765EC" : "black" }}
          >
            {item.title}
          </span>
          <motion.img
            className={styles.arrow}
            src="/assets/svg/down.svg"
            animate={{ rotate: isOpen ? 180 : 0 }}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              className={styles.content}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  delay: 0.15,
                  duration: 0.2,
                },
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.15,
                },
              }}
            >
              <ul>
                {item.subtitles.map((item) => (
                  <li key={item.text}>
                    {item.text}
                    {/* <span>{item.practical ? "عملی" : "تئوری"}</span> */}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const getRadiusClass = (index: number, openIndex: number, length: number) => {
  const hasOpen = openIndex !== -1;

  if (!hasOpen) {
    if (index === 0) return "idleFirst";
    if (index === length - 1) return "idleLast";
    return "flat";
  }

  const isOpen = index === openIndex;
  const isAbove = index === openIndex - 1;
  const isBelow = index === openIndex + 1;
  const isFirst = index === 0;
  const isLast = index === length - 1;

  if (isOpen) return "open";

  if ((isAbove && isFirst) || (isBelow && isLast)) return "allRounded";

  if (isFirst) return "idleFirst";
  if (isLast) return "idleLast";

  if (isAbove) return "above";
  if (isBelow) return "below";

  return "flat";
};

const list = [
  {
    id: "book",
    icon: <Assets.Book />,
    season: "فصل 1",
    title: "مقدمات و آشنایی با UI",
    subtitles: [
      {
        text: "طراحی رابط کاربری چیست؟",
        practical: true,
      },
      {
        text: "کاربرد و اهمیت رابط کاربری",
        practical: true,
      },
      {
        text: "نگاهی به UX",
        practical: true,
      },
    ],
  },
  {
    id: "figma",
    icon: <Assets.Figma />,
    season: "فصل 2",
    title: "آموزش مقدماتی فیگما",
    subtitles: [
      {
        text: "مقدمه و معرفی نرم‌افزار",
        practical: true,
      },
      {
        text: "نحوه نصب و راه اندازی",
        practical: true,
      },
      {
        text: "آشنایی با محیط نرم‌افزار فیگما",
        practical: true,
      },
      {
        text: "یادگیری پنل ابزارها، لایه‌ها و ویژگی‌ها",
        practical: true,
      },
    ],
  },
  {
    id: "layout",
    icon: <Assets.Layout />,
    season: "فصل 3",
    title: "آموزش تکمیلی فیگما",
    subtitles: [
      {
        text: "آموزش Auto Layout",
        practical: true,
      },
      {
        text: "آموزش ساخت  Component و Variant",
        practical: true,
      },
      {
        text: "آشنایی با کامیونیتی و پلاگین‌های فیگما",
        practical: true,
      },
      {
        text: "آشنایی با سبک‌های طراحی",
        practical: true,
      },
      {
        text: "مینی پروژه طراحی اپ",
        practical: true,
      },
    ],
  },
  {
    id: "picture",
    icon: <Assets.Picture />,
    season: "فصل 4",
    title: "مفاهیم و اصول طراحی بصری",
    subtitles: [
      {
        text: "بررسی قوانین گشتالت و کاربرد آن در طراحی رابط کاربری",
        practical: true,
      },
      {
        text: "سلسله مراتب بصری",
        practical: true,
      },
      {
        text: "رنگ شناسی",
        practical: true,
      },
      {
        text: "زنگ تفریح! (بررسی برخی از آثار هنری از جمله فیلم‌ها و نقاشی‌های کلاسیک)",
        practical: true,
      },
    ],
  },
  {
    id: "pen",
    icon: <Assets.Pen />,
    season: "فصل 5",
    title: "اصول طراحی UI",
    subtitles: [
      {
        text: "تایپوگرافی",
        practical: true,
      },
      {
        text: "رنگ‌ها",
        practical: true,
      },
      {
        text: "سایه‌ها و افکت‌ها",
        practical: true,
      },
      {
        text: "فاصله گذاری",
        practical: true,
      },
      {
        text: "آیکن‌گرافی",
        practical: true,
      },
    ],
  },
  {
    id: "component",
    icon: <Assets.Component />,
    season: "فصل 6",
    title: "آشنایی با عناصر رابط کاربری",
    subtitles: [
      {
        text: "معرفی بیش از 20 عنصر رابط کاربری شامل دکمه، کارت، چک باکس و...",
        practical: true,
      },
      {
        text: "مینی پروژه طراحی داشبورد کاربری",
        practical: true,
      },
    ],
  },
  {
    id: "broom",
    icon: <Assets.Broom />,
    season: "فصل 7",
    title: "استایل گاید و وایرفریم",
    subtitles: [
      {
        text: "آشنایی با استایل گاید و کاربرد آن",
        practical: true,
      },
      {
        text: "ذخیره انواع استایل‌ها",
        practical: true,
      },
      {
        text: "وایرفریم چیست؟",
        practical: true,
      },
      {
        text: "انواع وایرفریم",
        practical: true,
      },
      {
        text: "مسیر گردش کاربر (Userflow)",
        practical: true,
      },
    ],
  },
  {
    id: "device",
    icon: <Assets.Device />,
    season: "فصل 8",
    title: "واکنشگرایی (ریسپانسیو)",
    subtitles: [
      {
        text: "طراحی واکنشگرا چیست؟",
        practical: true,
      },
      {
        text: "آشنایی با نقطه شکست",
        practical: true,
      },
      {
        text: "آموزش ریسپانسیو",
        practical: true,
      },
    ],
  },
  {
    id: "atomic",
    icon: <Assets.Atomic />,
    season: "فصل 9",
    title: "طراحی اتمی و دیزاین سیستم",
    subtitles: [
      {
        text: "مفهوم طراحی اتمی",
        practical: true,
      },
      {
        text: "معرفی دیزان سیستم و کاربرد آن",
        practical: true,
      },
      {
        text: "ساخت Variables در فیگما",
        practical: true,
      },
      {
        text: "تفاوت استایل گاید، Ui Kit و دیزاین سیستم",
        practical: true,
      },
    ],
  },
  {
    id: "clipboard",
    icon: <Assets.Clipboard />,
    season: "فصل 10",
    title: "نکات تکمیلی",
    subtitles: [
      {
        text: "ایده‌یابی و درست کردن مودبرد",
        practical: true,
      },
      {
        text: "موکاپ و پرزنت طرح",
        practical: true,
      },
      {
        text: "آشنایی با پروتوتایپ",
        practical: true,
      },
      {
        text: "خروجی و Hands-Off",
        practical: true,
      },
    ],
  },
  {
    id: "shop",
    icon: <Assets.Shop />,
    season: "فصل 11",
    title: "پروژه طراحی سایت فروشگاهی",
    subtitles: [
      {
        text: "ایده‌پردازی و طرح اولیه",
        practical: true,
      },
      {
        text: "طراحی صفحه اصلی فروشگاه",
        practical: true,
      },
      {
        text: "ریسپانسیو صفحه",
        practical: true,
      },
    ],
  },
];
