import { motion, useInView } from "motion/react";
import { useId, useRef, useState } from "react";

export default function CardV1({ img }: { img: string }) {
  const ref = useRef(null);
  const id = useId();

  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <defs>
          <mask id={id}>
            <motion.rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx="16"
              ry="16"
              fill="white"
              initial={{ scale: 0, rotate: -20 }}
              animate={{
                scale: isInView ? 1 : 0,
                rotate: isInView ? 0 : -20,
              }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                transformOrigin: "50% 50%",
              }}
            />
          </mask>
        </defs>

        <image
          href={img}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          mask={`url(#${id})`}
        />
      </svg>

      {/* keeps natural masonry height */}
      <img
        src={img}
        alt=""
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          visibility: "hidden",
        }}
      />
    </div>
  );
}

// import { motion, useInView } from "motion/react";
// import { useId, useRef } from "react";

// const CardV1 = ({ img }: { img: string }) => {
//   const ref = useRef(null);
//   const maskId = useId();
//   const isInView = useInView(ref, {
//     once: true,
//     amount: 0.2,
//   });

//   return (
//     <div
//       ref={ref}
//       style={{
//         width: "100%",
//         height: "100%",
//       }}
//     >
//       <svg viewBox="0 0 519 605" xmlns="http://www.w3.org/2000/svg">
//         <mask id={maskId}>
//           <motion.rect
//             x="0"
//             y="0"
//             width="100%"
//             height="100%"
//             rx="16"
//             ry="16"
//             fill="white"
//             initial={{ opacity: 0 }}
//             animate={{
//               scale: isInView ? 1 : 0,
//               opacity: isInView ? 1 : 0.3,
//               rotate: isInView ? 0 : -15,
//             }}
//             transition={{
//               duration: 1.2,
//               ease: [0.22, 1, 0.36, 1],
//             }}
//             style={{
//               transformOrigin: "348px 239px",
//               transformBox: "fill-box",
//             }}
//           />
//         </mask>

//         <image
//           href={img}
//           width="100%"
//           height="100%"
//           mask={`url(#${maskId})`}
//           preserveAspectRatio="xMidYMid slice"
//         />
//       </svg>
//     </div>
//   );
// };

// export default CardV1;
