import { useState, useEffect } from "react";
import { onValue, ref, update } from "firebase/database";
import { app, db } from "@/backend";
import { getAuth } from "firebase/auth";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { cn } from "@/lib";

export const Slider = () => {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const user = getAuth(app).currentUser;

    if (!user) return;

    const unsub = onValue(
      ref(db, `/public/users/${user.uid}/visible`),
      (snap) => {
        setIsVisible(snap.val());
      },
    );

    return () => {
      unsub();
    };
  }, []);

  const visibleVariants: Variants = {
    initial: {
      y: -16,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: 16,
      opacity: 0,
    },
  };

  return (
    <div
      className={cn(
        "flex w-full items-center overflow-hidden rounded-md bg-bgSecondary p-1 md:p-2",
      )}
    >
      <div
        className={`relative h-7 w-[min(30%,_15rem)] shrink-0 overflow-x-auto overflow-y-hidden text-primary md:h-10`}
      >
        <AnimatePresence>
          {isVisible ? (
            <motion.p
              className="absolute top-0 p-1 md:p-2"
              variants={visibleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              key="visible"
            >
              Visible
            </motion.p>
          ) : (
            <motion.p
              className="absolute top-0 p-1 md:p-2"
              variants={visibleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              key="invisible"
            >
              Invisible
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{
          backgroundColor: isVisible ? "#9ccddc" : "#02131d",
        }}
        animate={{
          backgroundColor: isVisible ? "#9ccddc" : "#02131d",
        }}
        className="relative w-12 cursor-pointer rounded-full p-1 md:w-16 md:p-2"
        onClick={async () => {
          const user = getAuth(app).currentUser;
          if (!user) return;

          await update(ref(db, `/public/users/${user.uid}`), {
            visible: !isVisible,
          });
        }}
      >
        <motion.div
          className="relative h-2 w-2 rounded-full md:h-4 md:w-4"
          initial={{
            backgroundColor: isVisible ? "#e2f1ff" : "#5591a9",
            x: isVisible ? "2rem" : "0rem",
          }}
          animate={{
            backgroundColor: isVisible ? "#e2f1ff" : "#5591a9",
            x: isVisible ? "2rem" : "0rem",
          }}
        />
      </motion.div>
    </div>
  );
};

export default Slider;
