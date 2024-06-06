"use client";

import Link from "next/link";
import { Button } from "@/ui";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/backend";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, Variants, motion } from "framer-motion";

function Navbar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [path, setPath] = useState("/login");
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setPath("/user");
      } else {
        setPath("/login");
      }
    });
    setWindowWidth(window.innerWidth);

    return () => unsubscribe();
  }, []);

  return (
    <div
      className={twMerge(
        className,
        "z-50 box-border flex flex-col gap-4 bg-bgPrimary bg-opacity-50 p-4 backdrop-blur-lg backdrop-filter",
      )}
    >
      <div className="flex items-center justify-between">
        <Link href="/" className="flex h-[40px] items-center gap-4">
          <Image src="/assets/logo.png" alt="Logo" width={36} height={36} />
          <span className="font-heading text-lg md:text-3xl">
            Dream Builder
          </span>
        </Link>

        {windowWidth && windowWidth >= 768 ? (
          <div className="flex gap-6">
            <Link href="#about">
              <Button variant="basic">About</Button>
            </Link>

            <Link href="#features">
              <Button variant="basic">Features</Button>
            </Link>

            <Link href="#contact">
              <Button variant="basic">Contact</Button>
            </Link>

            <Link href={path}>
              <Button variant="special">Login</Button>
            </Link>
          </div>
        ) : (
          <Button
            variant="basic"
            className="flex items-center justify-center"
            onClick={() => {
              setIsOpen(!isOpen);

              const fn = () => {
                setIsOpen(false);
                document.body.removeEventListener("click", fn);
              };

              document.body.addEventListener("click", fn);
            }}
          >
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </Button>
        )}
      </div>
      <MobileNavBar isOpen={isOpen} path={path} />
    </div>
  );
}

type MobileNavBarProps = {
  isOpen: boolean;
  path: string;
};
function MobileNavBar({ isOpen, path }: MobileNavBarProps) {
  const variants: Variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const linkVariants: Variants = {
    initial: {
      opacity: 0,
      y: "-100%",
    },
    animate: {
      opacity: 1,
      y: " 0%",
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div variants={variants} initial="initial" animate="animate">
          <div className="flex w-full justify-between">
            <motion.div variants={linkVariants}>
              <Link href="#about">
                <Button variant="basic">About</Button>
              </Link>
            </motion.div>

            <motion.div variants={linkVariants}>
              <Link href="#features">
                <Button variant="basic">Features</Button>
              </Link>
            </motion.div>

            <motion.div variants={linkVariants}>
              <Link href="#contact">
                <Button variant="basic">Contact</Button>
              </Link>
            </motion.div>

            <motion.div variants={linkVariants}>
              <Link href={path}>
                <Button variant="special">Login</Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Navbar;
