import { useSnapshot } from "valtio";
import { AnimatePresence } from "motion/react";

import Inner from "@/components/layout/Inner";
import Section from "@/components/layout/section";
import Header from "@/features/odyssey/layout/header";
import Footer from "@/features/odyssey/layout/footer";
import PreLoader from "@/components/ui/preloader/index2";

import { Hero } from "@/features/odyssey/sections/hero";
import { Detail } from "@/features/odyssey/sections/detail";
import { Introduction } from "@/features/odyssey/sections/introduction";
import { Chapters } from "@/features/odyssey/sections/chapters";
import { Portfolio } from "@/features/odyssey/sections/portfolio";
import { FAQ } from "@/features/odyssey/sections/faq";
import Payment from "@/features/odyssey/sections/payment";

import { app, setLoaded } from "@/valtio/app";

const Odyssey = () => {
  const appSnap = useSnapshot(app);
  return (
    <>
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          setLoaded(true);
        }}
      >
        {appSnap.isPreloader && <PreLoader course="UI Design" />}
      </AnimatePresence>

      {appSnap.loaded && (
        <>
          <Header />
          <Inner>
            <Section section="hero">
              <Hero />
            </Section>

            <Section section="detail">
              <Detail />
            </Section>

            <Section section={"introduction"}>
              <Introduction />
            </Section>

            <Section
              section={"chapters"}
              full={true}
              style={{ scrollMarginTop: 60 }}
            >
              <Chapters />
            </Section>

            <Section section={"portfolio"}>
              <Portfolio />
            </Section>

            <Section section="payment" style={{ scrollMarginTop: 80 }}>
              <Payment />
            </Section>

            <Section section={"faq"} style={{ scrollMarginTop: 60 }}>
              <FAQ />
            </Section>
          </Inner>
          <Footer />
        </>
      )}
    </>
  );
};

export default Odyssey;
