import ReactLenis, { LenisRef } from "lenis/react";
import React, { useEffect, useRef } from "react";

const Lenis = ({ children }: { children: React.ReactNode }) => {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.04,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
};

export default Lenis;
