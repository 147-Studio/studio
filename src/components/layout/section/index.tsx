import { useRef, useEffect, HTMLAttributes } from "react";
import { useInView } from "framer-motion";

import { setActiveLink, setRegisterInHeader } from "@/valtio/app";
import { OddysseyPageSection } from "@/config/section";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type Props = {
  section: OddysseyPageSection;
  children: React.ReactNode;
  full?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export default function Section({
  section,
  children,
  full,
  style,
  ...rest
}: Props) {
  const ref = useRef(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isInView = useInView(ref, {
    margin: "-50% 0px -50% 0px",
  });

  useEffect(() => {
    if (isInView) {
      setActiveLink(section);
      if (section === "hero" || (section === "payment" && !isMobile)) {
        setRegisterInHeader(false);
      } else {
        setRegisterInHeader(true);
      }
    }
  }, [isInView]);

  return (
    <section
      id={section}
      ref={ref}
      style={{
        maxWidth: full ? "100%" : 1250,
        width: "100%",
        ...style,
      }}
    >
      {children}
    </section>
  );
}
