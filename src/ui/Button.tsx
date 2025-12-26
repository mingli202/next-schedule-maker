"use client";

import { twMerge } from "tailwind-merge";
import { ButtonHTMLAttributes, useRef } from "react";
import { HTMLMotionProps, motion, useAnimate } from "framer-motion";
import { usePathname } from "next/navigation";

type Props = {
  variant?: "basic" | "special";
  targetPath?: string;
} & {
  disableBgEffect?: boolean;
  disableScaleEffect?: boolean;
} & HTMLMotionProps<"button"> &
  ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
  className,
  children,
  variant,
  disableBgEffect,
  disableScaleEffect,
  targetPath,
  ...props
}: Props) {
  const hoverVariants = {
    // basic animation for non important text
    basic: {
      scale: disableScaleEffect ? 1 : 1.01,
      opacity: 1,
    },
    // for important buttons
    special: {
      scale: disableScaleEffect ? 1 : 1.01,
      color: "#facc15",
      outlineColor: "#facc15",
      boxShadow: "0 0 1rem #facc15",
    },
  };
  const currentPath = usePathname();

  const ref = useRef<HTMLButtonElement>(null!);
  const [scope, animate] = useAnimate();

  const expandingCircle = async (
    e: React.PointerEvent<HTMLButtonElement>,
    buttonVariant: "basic" | "special",
    out?: boolean,
  ) => {
    if (variant !== buttonVariant) return;

    const styles = {
      basic: {
        opacity: [0.3, 0],
        scale: [0, 3],
      },
      special: {
        scale: out ? [3, 0] : [0, 3],
      },
      path: {},
    };

    const bounds = ref.current.getBoundingClientRect();

    const offset = bounds.width / 2;
    const x = e.clientX - bounds.x - offset;
    const y = e.clientY - bounds.y - offset;

    await animate(
      scope.current,
      { x: [x], y: [y], ...styles[buttonVariant] },
      {
        duration: 0.5,
        times: [0, 1],
      },
    );
  };

  return (
    <motion.button
      {...props}
      className={twMerge(
        "relative overflow-hidden rounded-lg p-2",
        variant === "basic" && "bg-transparent opacity-50",
        variant === "special" && "text-bg-primary z-10 bg-yellow-400",
        className,
      )}
      animate={{
        opacity: currentPath === targetPath ? 1 : undefined,
      }}
      whileHover={variant}
      whileTap={{
        scale: 1,
      }}
      variants={hoverVariants}
      ref={ref}
      onPointerUp={async (e) => {
        if (disableBgEffect) return;
        expandingCircle(e, "basic");
      }}
      onPointerEnter={async (e) => {
        if (disableBgEffect) return;
        expandingCircle(e, "special");
      }}
      onPointerLeave={async (e) => {
        if (disableBgEffect) return;
        expandingCircle(e, "special", true);
      }}
    >
      {children}

      <motion.div
        ref={scope}
        className={twMerge(
          "absolute top-0 left-0 z-[-1] aspect-square w-full scale-0 rounded-full bg-white opacity-1",
          variant === "special" && "bg-bg-primary",
        )}
      />
    </motion.button>
  );
}

export default Button;
