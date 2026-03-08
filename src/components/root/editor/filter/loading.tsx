"use client";

import { motion } from "framer-motion";

function Loading() {
  return (
    <motion.div
      className="flex basis-full flex-col gap-2 overflow-hidden rounded-md"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: 0.5 }}
      transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
    >
      {[...Array(4).keys()].map((i) => (
        <div
          key={i}
          className="bg-bg-secondary flex flex-col gap-2 rounded-md p-2"
        >
          <div className="bg-text h-4 w-1/5 rounded-full" />
          <div className="bg-background h-10 rounded-md" />
        </div>
      ))}

      <div className="flex gap-2">
        <div className="bg-bg-secondary flex basis-1/2 flex-col gap-2 rounded-md p-2">
          <div className="bg-text h-4 w-1/3 rounded-full" />
          <div className="bg-background h-10 rounded-md" />
        </div>
        <div className="bg-bg-secondary flex basis-1/2 flex-col gap-2 rounded-md p-2">
          <div className="bg-text h-4 w-1/3 rounded-full" />
          <div className="bg-background h-10 rounded-md" />
        </div>
      </div>

      <div className="bg-bg-secondary flex flex-col gap-2 rounded-md p-2">
        <div className="bg-text h-4 w-1/5 rounded-full" />
        <div className="bg-background h-10 rounded-md" />
      </div>

      <div className="bg-bg-secondary flex flex-col gap-2 rounded-md p-2">
        <div className="bg-text h-4 w-1/5 rounded-full" />
        <div className="bg-background h-10 rounded-md" />
      </div>
    </motion.div>
  );
}

export default Loading;
