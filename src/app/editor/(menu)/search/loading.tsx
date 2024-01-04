"use client";

import { motion } from "framer-motion";

const Loading = () => {
  return (
    <motion.div
      className="basis-full overflow-hidden rounded-md"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: 0.5 }}
      transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.5 }}
    >
      <div className="h-8 w-full rounded-md bg-secondary" />
      <div className="mt-2 flex w-full flex-col gap-2 overflow-hidden">
        {[...Array(5).keys()].map((i) => (
          <div key={i} className="box-border rounded-md bg-bgSecondary p-2">
            <p className="my-2 box-border h-5 w-3/4 rounded-full bg-slate" />
            <div className="mt-2 flex w-full flex-col gap-2 rounded-md bg-secondary p-2">
              <p className="h-4 w-1/4 rounded-full bg-slate" />
              {[...Array(2).keys()].map((j) => (
                <p key={j} className="h-4 w-full rounded-full bg-slate" />
              ))}
            </div>
            <div className="mt-2 flex w-full flex-col gap-2 rounded-md bg-secondary p-2">
              <p className="h-4 w-1/4 rounded-full bg-slate" />
              {[...Array(2).keys()].map((j) => (
                <p key={j} className="h-4 w-full rounded-full bg-slate" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Loading;
