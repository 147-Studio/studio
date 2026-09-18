import React, { useState } from "react";
import { useRef } from "react";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Copy({ children, animateOnScroll = true, delay = 0 }) {
  const [ready, setReady] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const containerRef = useRef(null);
  const elementRef = useRef([]);
  const splitRef = useRef([]);
  const lines = useRef([]);

  useGSAP(
    async () => {
      await document.fonts.ready;
      if (!containerRef.current) return;

      splitRef.current = [];
      elementRef.current = [];
      lines.current = [];

      let elements = [];

      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      elements.forEach((element) => {
        elementRef.current.push(element);

        const split = SplitText.create(element, {
          type: "lines",
          mask: "lines",
          linesClass: "line++",
        });

        splitRef.current.push(split);

        const computedStyle = window.getComputedStyle(element);
        const textIndent = computedStyle.textIndent;

        if (textIndent && textIndent !== "0px") {
          if (split.lines.length > 0) {
            split.lines[0].style.paddingLeft = textIndent;
          }
          element.style.textIndent = "0";
        }

        lines.current.push(...split.lines);
      });

      gsap.set(lines.current, { y: "100%" });

      const aniamtionProps = {
        y: "0%",
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay: delay,
      };

      if (animateOnScroll) {
        gsap.to(lines.current, {
          ...aniamtionProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: isMobile ? "top bottom" : "top 80%",
            once: true,
          },
        });
      } else {
        gsap.to(lines.current, aniamtionProps);
      }

      setReady(true);
      return () => {
        splitRef.current.forEach((split) => {
          if (split) {
            split.revert();
          }
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay],
    },
  );

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, {
      ref: containerRef,
      className: `${children.props.className ?? ""} ${
        ready ? "" : "copy-hidden"
      }`,
    });
  }

  return (
    <div
      ref={containerRef}
      data-copy-wrapper="true"
      className={!ready ? "copy-hidden" : ""}
    >
      {children}
    </div>
  );
}
