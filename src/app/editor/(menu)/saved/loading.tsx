"use client";
import { motion } from "framer-motion";

function Loading() {
  return (
    <motion.div
      className="overflow-hidden"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: 0.5 }}
      transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] gap-1 md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-md bg-bgSecondary p-1"
            >
              <div className="h-20 rounded-md bg-slate" />
              <div className="h-4 rounded-full bg-slate/50" />
            </div>
          ))}
        <div className="col-span-full h-0 bg-transparent" />
      </div>
    </motion.div>
  );
}

export default Loading;
