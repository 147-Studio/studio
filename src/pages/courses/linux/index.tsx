import Header from "@/features/odyssey/layout/header";
import Inner from "@/components/layout/Inner";
import Footer from "@/features/odyssey/layout/footer";
import Hero from "@/features/linux/sections/hero";
import TerminalWrapper from "@/components/ui/terminal";
import { useState } from "react";

const Linux = () => {
  return (
    <>
      <Header />
      <TerminalWrapper />
      <Inner>
        <Hero />
      </Inner>
      <Footer />
    </>
  );
};

export default Linux;
