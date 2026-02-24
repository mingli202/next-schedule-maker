"use client";

import { motion } from "framer-motion";

function Loading() {
  return (
    <motion.div
      className="basis-full overflow-hidden rounded-md"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: 0.5 }}
      transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
    >
      <div className="bg-secondary h-8 w-full rounded-md" />
      <div className="mt-2 flex w-full flex-col gap-2 overflow-hidden">
        {[...Array(5).keys()].map((i) => (
          <div key={i} className="bg-bg-secondary box-border rounded-md p-2">
            <p className="bg-slate my-2 box-border h-5 w-3/4 rounded-full" />
            <div className="bg-secondary mt-2 flex w-full flex-col gap-2 rounded-md p-2">
              <p className="bg-slate h-4 w-1/4 rounded-full" />
              {[...Array(2).keys()].map((j) => (
                <p key={j} className="bg-slate h-4 w-full rounded-full" />
              ))}
            </div>
            <div className="bg-secondary mt-2 flex w-full flex-col gap-2 rounded-md p-2">
              <p className="bg-slate h-4 w-1/4 rounded-full" />
              {[...Array(2).keys()].map((j) => (
                <p key={j} className="bg-slate h-4 w-full rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Loading;
