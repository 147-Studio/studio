import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "lenis/react";
import { useSnapshot } from "valtio";

import styles from "./style.module.scss";
import { app } from "@/valtio/app";
import { oddysseySections } from "@/config/section";
import { courses_link } from "@/config/course";

import SlideUp from "@/components/ui/slide-up";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import * as Assets from "@/assets";

const Header = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return <>{isMobile ? <Mobile /> : <Desktop />}</>;
};

export default Header;

const Mobile = () => {
  const appSnap = useSnapshot(app);
  const [navIsOpen, setNavIsOpen] = useState(false);
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          backgroundColor: "#F3F4F5",
          padding: "24px 20px",
          color: "#827E87",
          fontSize: 13,
          fontWeight: 400,
        }}
      >
        <img src="/assets/svg/star.svg" />
        <span>برای تجربه باحال‌تر، حتما سایت رو توی دسکتاپ هم ببین!</span>
      </div>
      <AnimatePresence mode="wait">
        {appSnap.registerInHeader && (
          <motion.div
            className={styles.mobile_header}
            key={"mobile_header"}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.7,
              transition: {
                opacity: {
                  duration: 0.2,
                },
                scale: { duration: 0.4 },
              },
            }}
          >
            <div className={styles.container}>
              <div className={styles.wrapper}>
                <div
                  className={`${styles.menu} ${navIsOpen ? "open" : ""}`}
                  onClick={() => setNavIsOpen(!navIsOpen)}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      // d={
                      //   navIsOpen
                      //     ? "M8 8L14.9139 14.9139"
                      //     : "M6.11133 7.63867H15.8891"
                      // }

                      animate={{
                        d: navIsOpen
                          ? "M8 8L14.9139 14.9139"
                          : "M6.11133 7.63867L15.8891 7.63867",
                      }}
                      transition={{ duration: 0.3 }}
                      stroke="black"
                      stroke-width="1.4"
                      stroke-linecap="round"
                    ></motion.path>
                    <motion.path
                      animate={{
                        d: navIsOpen
                          ? "M8 15L14.9139 8.08607"
                          : "M6.11133 14.3613L15.8891 14.3613",
                      }}
                      stroke="black"
                      stroke-width="1.4"
                      stroke-linecap="round"
                    ></motion.path>
                  </svg>
                </div>
                دوره اودیسه
              </div>
              <a id={styles.register} href={courses_link.odyssey}>
                ثبت نام
              </a>
            </div>

            <AnimatePresence mode="wait">
              {navIsOpen && (
                <motion.div
                  className={styles.nav}
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{
                    y: -30,
                    opacity: 0,
                    transition: {
                      opacity: {
                        duration: 0.2,
                      },
                      y: { duration: 0.4 },
                    },
                  }}
                >
                  {oddysseySections.map((section) => {
                    if (
                      section.slug === "hero" ||
                      section.slug === "detail" ||
                      section.slug === "portfolio"
                    )
                      return;
                    return (
                      <a
                        className={styles.nav_link}
                        href={`#${section.slug}`}
                        style={{
                          color:
                            appSnap.activeLink === section.slug
                              ? "black"
                              : "rgba(0, 0, 0, 0.4)",
                        }}
                      >
                        {section.title}
                      </a>
                    );
                  })}
                  <div
                    style={{
                      width: "100%",
                      height: 1,
                      borderBottom: "1px dashed rgba(0, 0, 0, 0.1)",
                    }}
                  ></div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ color: "rgba(0, 0, 0, 0.3)", fontSize: 14 }}>
                      دوره آنلاین طراحی رابط کاربری
                    </div>
                    <img src="/assets/img/ui.png" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {navIsOpen && (
          <motion.div
            key={"overlay"}
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Desktop = () => {
  const appSnap = useSnapshot(app);
  const header = useRef<HTMLDivElement | null>(null);

  // const lenis = useLenis();

  // const scrollToSection = (e, id) => {
  //   e.preventDefault();

  //   const el = document.querySelector(id);
  //   if (!el) return;

  //   const headerHeight = header.current?.offsetHeight || 0;

  //   lenis?.scrollTo(el, {
  //     duration: 1.2,
  //     easing: (t) => 1 - Math.pow(1 - t, 3),
  //     offset: -headerHeight,
  //   });
  // };

  return (
    <SlideUp transition={{ delay: 0.8 }}>
      <motion.header ref={header} className={styles.header}>
        <motion.div
          className={styles.container}
          layout
          transition={{
            type: "spring",
          }}
        >
          {oddysseySections.map((section) => {
            if (
              section.slug === "hero" ||
              section.slug === "detail" ||
              section.slug === "portfolio"
            )
              return;
            return (
              <motion.a
                href={`#${section.slug}`}
                className={styles.link}
                key={section.slug}
                layout
                transition={{
                  type: "spring",
                }}
                // onClick={(e) => scrollToSection(e, `#${section.slug}`)}
              >
                {appSnap.activeLink === section.slug && <Indicator />}
                {section.title}
              </motion.a>
            );
          })}
          <AnimatePresence mode="popLayout">
            {appSnap.registerInHeader && (
              <motion.a
                href={courses_link.odyssey}
                id={styles.register}
                className={styles.link}
                key={"register"}
                layout
                initial={{
                  opacity: 0,
                  scale: 0.5,
                  backgroundColor: "#00000000",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  backgroundColor: "#000000",
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                  backgroundColor: "#00000000",
                  transition: {
                    type: "spring",
                    delay: 0.17,
                    duration: 0.1,
                    opacity: {
                      duration: 0,
                    },
                  },
                }}
                transition={{
                  type: "spring",
                  delay: 0.17,
                  duration: 0.3,
                }}
              >
                ثبت نام
              </motion.a>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>
    </SlideUp>
  );
};

const Indicator = () => {
  return (
    <AnimatePresence>
      <motion.span
        layoutId="indicator"
        className={styles.indicator}
        initial={{
          opacity: 0,
        }}
        animate={{ opacity: 1 }}
        transition={{
          layout: {
            type: "spring",
            bounce: 0.2,
            duration: 0.6,
          },
        }}
      />
    </AnimatePresence>
  );
};
