"use client";

import { Variants, motion } from "framer-motion";

function PageLoading() {
  const children: Variants = {
    initial: {
      rotateY: 0,
      z: 0,
      backgroundColor: "#062c43",
    },
    animate: {
      rotateY: 180,
      z: [0, -5, 0],
      backgroundColor: ["#062c43", "#9ccddc", "#062c43"],
    },
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <motion.div
        className="grid grid-cols-3 grid-rows-3 gap-2"
        style={{ perspective: 100 }}
      >
        {[...Array(9).keys()].map((i) => (
          <motion.div
            key={i}
            className="h-8 w-8 rounded-sm bg-bgSecondary"
            variants={children}
            initial="initial"
            animate="animate"
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 0.7,
              delay: i * 0.05,
              repeatDelay: 8 * 0.05 + 1,
            }}
          />
        ))}
      </motion.div>

      <p>Loading...</p>
    </div>
  );
}

export default PageLoading;
