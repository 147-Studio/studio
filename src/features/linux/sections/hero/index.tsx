import React from "react";
import styles from "./styles.module.scss";

import InteractiveTerminal from "@/features/linux/components/terminal";
import { Rocket } from "lucide-react";

const Hero = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "50%", height: "56%" }} data-lenis-prevent-wheel>
        <InteractiveTerminal
          command="deploy --production"
          autoExecute
          variant="dark"
          icon={<Rocket className="mr-2 text-blue-400" />}
          steps={[
            "Initializing deployment pipeline...",
            "Running pre-deployment checks...",
            "Building application assets...",
            "Running test suite...",
            "Optimizing build size...",
            "Provisioning cloud resources...",
            "Deploying to production servers...",
          ]}
          finalMessage={`
  ✅ DEPLOYMENT SUCCESSFUL!
  
  Application deployed to: https://nyxui.com/
  Build version: 1.0.42
  Deployment ID: d8f72b3e-9c1a-4f8b-b98c-7f2e9e1fcb5a
  Deployment time: 2m 43s
  
  All systems operational. Monitoring dashboard available at /admin/metrics
                `}
          stepDelay={800}
          className={styles.terminal}
        />
      </div>
    </div>
  );
};

export default Hero;
