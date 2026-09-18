import { AnimatePresence } from "motion/react";
import { useRoutes } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import MouseFollower from "mouse-follower";
import gsap from "gsap";

import SvgDefs from "@/components/ui/svg-filters/defs";
import { routes } from "./routes";
import Lenis from "@/components/layout/lenis";
import { useMediaQuery } from "./hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger, SplitText);
MouseFollower.registerGSAP(gsap);

export const cursor = new MouseFollower();

function App() {
  const content = useRoutes(routes);
  const isMobile = useMediaQuery("(max-width: 767px)");
  if (isMobile) {
    cursor.destroy();
  }
  return (
    <Lenis>
      <SvgDefs />
      <main>
        <AnimatePresence mode="wait">{content}</AnimatePresence>
      </main>
    </Lenis>
  );
}

export default App;
