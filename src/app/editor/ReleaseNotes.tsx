"use client";

import { motion } from "framer-motion";

export default function ReleaseNotes() {
  const version = "Fall2025 June 3 Classes PDF v1";

  return (
    <motion.div className="bot-0 absolute top-0 z-[9999] flex h-[100vh] w-[100vw] items-center justify-center bg-bgPrimary/50 backdrop-blur-md backdrop-filter">
      <div className="flex flex-col gap-4 rounded-md border-[5px] border-solid border-primary bg-bgPrimary p-4">
        <div>
          <h1 className="text-3xl">What{"'"}s new in Fall2025</h1>
          <p>Current version: {version}</p>
        </div>
      </div>
    </motion.div>
  );
}
