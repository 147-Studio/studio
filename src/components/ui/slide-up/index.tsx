import { mainEase } from "@/config/ease";
import { Transition, useInView } from "motion/react";

import React, { ReactElement, useRef } from "react";

type Props = {
  children: ReactElement;
  transition?: Transition;
  active?: boolean;
};

function mergeRefs(...refs: any[]) {
  return (node: any) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(node);
      } else {
        ref.current = node;
      }
    });
  };
}

const SlideUp = ({ children, transition, active = true }: Props) => {
  const localRef = useRef(null);

  const isInView = useInView(localRef, {
    once: true,
    amount: 0.2,
    margin: "-10% 0px -10% 0px",
  });

  const shouldAnimate = isInView && active;

  return React.cloneElement(children, {
    ref: mergeRefs(localRef, (children as any).ref),

    initial: {
      y: 20,
      opacity: 0,
      ...(children.props.initial || {}),
    },

    animate: {
      y: shouldAnimate ? 0 : 20,
      opacity: shouldAnimate ? 1 : 0,
      ...(children.props.animate || {}),
    },

    transition: {
      duration: 1,
      ease: mainEase,
      ...transition,
      ...(children.props.transition || {}),
    },
  });
};

export default SlideUp;
