import { cursor } from "@/App";
import React from "react";
import styles from "./styles.module.css";

const Cuberto = ({ text }: { text: string }) => {
  return (
    <a
      className={styles["cb-btn_cta"]}
      style={{ pointerEvents: "auto" }}
      onMouseEnter={() => {
        cursor.addState("-pointer");
        cursor.addState("-exclusion");
      }}
      onMouseLeave={() => {
        cursor.removeState("-pointer");
        cursor.removeState("-exclusion");
      }}
    >
      <span
        className={styles["cb-btn_cta-border"]}
        style={{
          translate: "none",
          rotate: "none",
          scale: "none",
          willChange: "auto",
          transform: "translate(0px, 0px)",
          opacity: 1,
        }}
      ></span>
      <span className={styles["cb-btn_cta-ripple"]}>
        <span></span>
      </span>
      <span
        className={styles["cb-btn_cta-title"]}
        style={{
          translate: "none",
          rotate: "none",
          scale: "none",
          willChange: "auto",
          transform: "translate(0px, 0%)",
        }}
      >
        <span data-text={text}>{text}</span>
      </span>
    </a>
  );
};

export default Cuberto;
