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
import { useContext } from "react";
import { ScheduleClassesContext } from "../../ScheduleContext";
import download from "./download";

const BottomMenu = () => {
  const currentClasses = useContext(ScheduleClassesContext);

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
    <div className="absolute bottom-0 left-0 flex w-full justify-between gap-2 bg-bgPrimary p-2">
      <Link href="/editor/settings" title="reset everything">
        <Button variant="basic">Reset URL</Button>
      </Link>

      <motion.div
        className="flex items-center gap-4"
        whileHover="hover"
        initial="initial"
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
          <Link href="/">
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
