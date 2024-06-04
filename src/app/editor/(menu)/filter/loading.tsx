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
          className="flex flex-col gap-2 rounded-md bg-bgSecondary p-2"
        >
          <div className="h-4 w-1/5 rounded-full bg-text" />
          <div className="h-10 rounded-md bg-bgPrimary" />
        </div>
      ))}

      <div className="flex gap-2">
        <div className="flex basis-1/2 flex-col gap-2 rounded-md bg-bgSecondary p-2">
          <div className="h-4 w-1/3 rounded-full bg-text" />
          <div className="h-10 rounded-md bg-bgPrimary" />
        </div>
        <div className="flex basis-1/2 flex-col gap-2 rounded-md bg-bgSecondary p-2">
          <div className="h-4 w-1/3 rounded-full bg-text" />
          <div className="h-10 rounded-md bg-bgPrimary" />
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-md bg-bgSecondary p-2">
        <div className="h-4 w-1/5 rounded-full bg-text" />
        <div className="h-10 rounded-md bg-bgPrimary" />
      </div>

      <div className="flex flex-col gap-2 rounded-md bg-bgSecondary p-2">
        <div className="h-4 w-1/5 rounded-full bg-text" />
        <div className="h-10 rounded-md bg-bgPrimary" />
      </div>
    </motion.div>
  );
}

export default Loading;
