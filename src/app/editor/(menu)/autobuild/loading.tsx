"use client";

import { motion } from "framer-motion";

function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0.1 }}
      animate={{ opacity: 0.5 }}
      transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
      className="flex flex-col gap-2"
    >
      {Array(7)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="w-full grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-2 rounded-md bg-bgSecondary p-2"
          >
            <div className="h-[10rem] w-full rounded-md bg-slate" />
            <div className="mt-2 flex flex-col gap-2">
              {Array(6)
                .fill(0)
                .map((_, k) => (
                  <div
                    key={k}
                    className="flex h-5 w-full rounded-full bg-slate"
                  ></div>
                ))}
            </div>
          </div>
        ))}
    </motion.div>
  );
}

export default Loading;
