"use client";

import { motion } from "framer-motion";

const Loading = () => {
  return (
    <motion.div
      className="relative flex h-full w-full flex-col gap-2 overflow-hidden rounded-md p-2"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: 0.5 }}
      transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
    >
      <div className="h-6 w-1/3 rounded-full bg-slate" />
      {[...Array(3).keys()].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-md bg-bgSecondary p-2"
        >
          <div className="h-5 w-1/2 rounded-full bg-slate" />
          <div className="h-4 rounded-full bg-slate/90" />
          <div className="h-4 rounded-full bg-slate/90" />
          <div className="h-4 rounded-full bg-slate/90" />
        </div>
      ))}
    </motion.div>
  );
};

export default Loading;
