"use client";

import { Button } from "@/ui";
import {
  faFileDownload,
  faHome,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Variants, motion } from "framer-motion";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { ScheduleClassesContext } from "../../ScheduleContext";
import download from "./download";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/backend";

const BottomMenu = () => {
  const currentClasses = useContext(ScheduleClassesContext);

  const [path, setPath] = useState("/");

  const [vw, setvw] = useState<number>(0);

  useEffect(() => {
    setvw(window.innerWidth);

    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setPath("/user");
      } else {
        setPath("/");
      }
    });

    return () => unsubscribe();
  }, []);

  const menuVariants: Variants = {
    initial: {
      opacity: 0.5,
    },
    hover: {
      opacity: 1,
    },
  };

  const buttonVariants: Variants = {
    initial: {
      x: "100%",
      opacity: 0,
    },
    hover: {
      x: "0",
      opacity: 1,
    },
  };

  return (
    <div className="flex w-full shrink-0 items-center justify-between gap-2 bg-bgPrimary p-2">
      <Link href="/editor/settings" title="reset everything">
        <Button variant="basic">Reset URL</Button>
      </Link>

      <motion.div
        className="flex shrink-0 items-center gap-4"
        whileHover={vw > 768 ? "hover" : ""}
        initial={vw > 768 ? "initial" : ""}
        variants={menuVariants}
      >
        <motion.div
          variants={buttonVariants}
          title="download current schedule as Excel"
          onClick={() => {
            download(currentClasses);
          }}
        >
          <Button variant="basic" className="p-0" diasableBgEffect>
            <FontAwesomeIcon icon={faFileDownload} className="h-4" />
          </Button>
        </motion.div>

        <motion.div variants={buttonVariants} title="home">
          <Link href={path}>
            <Button variant="basic" className="p-0" diasableBgEffect>
              <FontAwesomeIcon icon={faHome} className="h-4" />
            </Button>
          </Link>
        </motion.div>

        <FontAwesomeIcon icon={faList} className="h-4" />
      </motion.div>
    </div>
  );
};

export default BottomMenu;
