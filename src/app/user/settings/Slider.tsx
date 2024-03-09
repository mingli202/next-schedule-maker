import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { onValue, ref, update } from "firebase/database";
import { app, db } from "@/backend";
import { getAuth } from "firebase/auth";
import { AnimatePresence, Variants, motion } from "framer-motion";

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
    <div className={styles.card}>
      <div
        className={`relative h-10 w-[min(30%,_15rem)] shrink-0 overflow-x-auto overflow-y-hidden text-primary`}
      >
        <AnimatePresence>
          {isVisible ? (
            <motion.p
              className="absolute top-0 p-2"
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
              className="absolute top-0 p-2"
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
        className="relative w-16 cursor-pointer rounded-full p-2"
        onClick={async () => {
          const user = getAuth(app).currentUser;
          if (!user) return;

          await update(ref(db, `/public/users/${user.uid}`), {
            visible: !isVisible,
          });
        }}
      >
        <motion.div
          className="relative h-4 w-4 rounded-full"
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
