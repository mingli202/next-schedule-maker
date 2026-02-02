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
              className="bg-bg-secondary flex flex-col gap-2 rounded-md p-1"
            >
              <div className="bg-slate h-20 rounded-md" />
              <div className="bg-slate/50 h-4 rounded-full" />
            </div>
          ))}
        <div className="col-span-full h-0 bg-transparent" />
      </div>
    </motion.div>
  );
}

export default Loading;
