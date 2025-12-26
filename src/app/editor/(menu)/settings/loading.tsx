"use client";

import { motion } from "framer-motion";

function Loading() {
  return (
    <motion.div
      className="relative flex h-full w-full flex-col gap-2 overflow-hidden rounded-md p-2"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: 0.5 }}
      transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
    >
      <div className="bg-slate h-6 w-1/3 rounded-full" />
      {[...Array(3).keys()].map((i) => (
        <div
          key={i}
          className="bg-bg-secondary flex flex-col gap-2 rounded-md p-2"
        >
          <div className="bg-slate h-5 w-1/2 rounded-full" />
          <div className="bg-slate/90 h-4 rounded-full" />
          <div className="bg-slate/90 h-4 rounded-full" />
          <div className="bg-slate/90 h-4 rounded-full" />
        </div>
      ))}
    </motion.div>
  );
}

export default Loading;
