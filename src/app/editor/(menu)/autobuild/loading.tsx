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
            className="bg-bg-secondary w-full grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-2 rounded-md p-2"
          >
            <div className="bg-slate h-[10rem] w-full rounded-md" />
            <div className="mt-2 flex flex-col gap-2">
              {Array(6)
                .fill(0)
                .map((_, k) => (
                  <div
                    key={k}
                    className="bg-slate/50 flex h-5 w-full rounded-full"
                  ></div>
                ))}
            </div>
          </div>
        ))}
    </motion.div>
  );
}

export default Loading;
