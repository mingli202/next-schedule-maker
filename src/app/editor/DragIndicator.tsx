"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DragIndicator = () => {
  const [vw, setVW] = useState(0);
  const [menu, setMenu] = useState<HTMLElement | null>(null);
  const [view, setView] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setVW(window.innerWidth);
    setMenu(document.getElementById("menu"));
    setView(document.getElementById("view"));
  }, []);

  return (
    <motion.div
      className="z-30 hidden h-[calc(100%-1rem)] w-2 cursor-ew-resize items-center justify-center md:flex"
      onPan={(_, info) => {
        const x = info.point.x;
        const menuWidth = `${x}px`;
        const viewWidth = `${vw - x}px`;

        if (!menu || !view) return;

        menu.style.flexBasis = menuWidth;
        view.style.flexBasis = viewWidth;
      }}
    >
      <div className="h-10 w-1/2 rounded-full bg-slate" />
    </motion.div>
  );
};

export default DragIndicator;
