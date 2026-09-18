import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { motion, useInView, Variants } from "motion/react";

import useScrollDirection from "@/hooks/useScrollDirection";
import Copy from "@/components/ui/text/copy";
import SlideUp from "@/components/ui/slide-up";

export const FAQ = () => {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <Copy delay={0.2}>
          <span className={styles.subtitle}>تو بپرس، ما جواب می‌دیم!</span>
        </Copy>
        <Copy>
          <span className={styles.title}>سوالات متداول</span>
        </Copy>
        <SlideUp>
          <motion.img src="/assets/img/faq.webp" />
        </SlideUp>
      </div>
      <div className={styles.items}>
        {list.map((item) => (
          <Item item={item} key={item.question} />
        ))}
      </div>
    </div>
  );
};

const Item = ({ item }: { item: (typeof list)[number] }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(ref, {});

  const direction = useScrollDirection();

  const prevInView = useRef(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const isBelowViewport = rect.top > window.innerHeight;

    // ENTER (only when scrolling down)
    if (!prevInView.current && isInView && direction === "down") {
      setShouldAnimate(true);
    }

    // RESET only if it exited from bottom
    if (!isInView && isBelowViewport) {
      setShouldAnimate(false);
    }

    prevInView.current = isInView;
  }, [isInView, direction]);

  return (
    <motion.div
      ref={ref}
      className={styles.item}
      initial="initial"
      animate={shouldAnimate ? "enter" : "initial"}
    >
      <Question question={item.question} />
      <Answer answer={item.answer} />
    </motion.div>
  );
};

const Question = ({ question }: { question: string }) => {
  return (
    <motion.span className={styles.question_wrapper}>
      <motion.span className={styles.question} variants={slide}>
        {question}
      </motion.span>
      <motion.span className={styles.bg} variants={questionVariants} />
    </motion.span>
  );
};

const Answer = ({ answer }: { answer: string }) => {
  return (
    <motion.span className={styles.answer} variants={answerVariants}>
      <motion.span variants={opacity}>{answer}</motion.span>
    </motion.span>
  );
};

const questionVariants: Variants = {
  initial: {
    width: 0,
    opacity: 0,
  },
  enter: {
    width: "100%",
    opacity: 1,
    transition: { duration: 1, type: "spring", delay: 0.3 },
  },
};

const answerVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  enter: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 0.6,
      ease: "circInOut",
    },
  },
};

const slide: Variants = {
  initial: {
    x: 200,
    opacity: 0,
  },
  enter: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, type: "spring", delay: 0.4 },
  },
};

const opacity: Variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: { type: "spring", delay: 0.4 },
  },
};

const list = [
  {
    question: "شرکت در دوره اودیسه نیاز به پیش نیاز\n خاصی داره؟",
    answer:
      "خیر. دوره اودیسه از مباحث کاملاً مقدماتی شروع می‌شه و برای افرادی طراحی شده که هیچ آشنایی قبلی با طراحی رابط کاربری یا نرم افزار فیگما ندارند. بنابراین برای شروع این دوره به پیش نیاز خاصی نیاز ندارید.",
  },
  {
    question: "دوره فقط به صورت تئوری هست یا عملی و پروژه محوره؟",
    answer:
     "در طول دوره علاوه بر یادگیری مفاهیم و اصول طراحی رابط کاربری و کار با نرم افزار فیگما، چند پروژه عملی رو با هم انجام می‌دیم. هدف اینکه بتونیم مفاهیمی که یاد گرفتیم رو در عمل به کار بگیریم و با روند طراحی یک رابط کاربری بیشتر آشنا شیم.",
  },
  {
    question: "شیوه برگزاری کلاس چطوره؟",
    answer:
      "کلاس ها به صورت آنلاین میشه. البته اگر به هر دلیلی نتونستید در یکی از جلسات حضور داشته باشید، جای نگرانی نیست؛ ویدئوی ضبط شده جلسات در اختیار شما قرار می‌گیره و می‌توانید هر زمان که خواستید اون رو مشاهده کنید.",
  },
  {
    question: "چطور از زمان برگزاری جلسات مطلعه بشیم؟",
    answer:
     "پس از ثبت نام و تکمیل ظرفیت دوره، تاریخ و ساعت دقیق برگزاری جلسات در داشبورد شما قرار می‌گیره. همچنین با عضویت در گروه دوره و دسترسی به تقویم گروهی، می‌تونید از زمان برگزاری جلسات و تغییرات احتمالی آن مطلع بشید.",
  },
  {
    question: "آیا بعد از دوره هم می تونم به ویدئوها دسترسی داشته باشم؟",
    answer:
      "بله. تمام جلسات دوره ضبط میشه و هر زمان که بخواید می‌تونید ویدئوهای کلاس‌ها رو دانلود و مشاهده کنید.",
  },
  {
    question: "قراره تو این دوره برنامه نویسی هم کار کنیم؟",
    answer:
      "خیر. تمرکز این دوره روی طراحی رابط کاربری و کار با نرم افزار فیگماست و وارد مباحث برنامه نویسی نخواهیم شد.",
  },
  {
    question: "پس برنامه نویسی کجای این فرآیند قرار می‌گیره؟",
    answer:
      "طراحی رابط کاربری و برنامه نویسی دو مرحله متفاوت از ساخت یک محصول دیجیتال هستند. در این دوره ما روی طراحی رابط کاربری تمرکز می‌کنیم و خروجی کار رو در فیگما طراحی خواهیم کرد. پس از اون، این طرح می‌تونه توسط برنامه نویس‌ها به سایت یا اپلیکیشن واقعی تبدیل بشه.",
  },
  {
    question: "حالا دوره رو چطور میشه تهیه کرد؟",
    answer:
    "ثبت نام دوره در بازه زمان مشخصی انجام میشه. پس از شروع ثبت نام، کافیه دوره رو به سبد خرید اضافه کنید و پس از تکمیل فرآیند پرداخت، ثبت نام‌تون رو نهایی کنید. پس از ثبت نام هم تمام اطلاعات مربوط به دوره، زمان برگزاری جلسات و اطلاع رسانی‌های بعدی از طریق داشبورد کاربری و گروه تلگرامی دوره در اختیار شما قرار می‌گیره.",
  },
];
