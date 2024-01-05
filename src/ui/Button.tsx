"use client";

import { twMerge } from "tailwind-merge";
import { ButtonHTMLAttributes, useCallback } from "react";
import { HTMLMotionProps, motion, useAnimate } from "framer-motion";
import useMeasure from "react-use-measure";

type Props = {
  variant?: "basic" | "special" | "compact";
  diasableBgEffect?: boolean;
} & HTMLMotionProps<"button"> &
  ButtonHTMLAttributes<HTMLButtonElement>;

const variants = {
  // basic animation for non important text
  basic: {
    scale: 1.05,
    opacity: 1,
    // backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  // for important buttons
  special: {
    scale: 1.05,
    color: "#facc15",
    outlineColor: "#facc15",
    boxShadow: "0 0 1rem #facc15",
  },
  // for when there is little space
  compact: {},
};

function Button({
  className,
  children,
  variant,
  diasableBgEffect,
  ...props
}: Props) {
  const [ref, bounds] = useMeasure();
  const [scope, animate] = useAnimate();

  const expandingCircle = useCallback(
    async (
      e: React.PointerEvent<HTMLButtonElement>,
      buttonVariant: "basic" | "special" | "compact",
      out?: boolean,
    ) => {
      if (variant !== buttonVariant) return;

      const styles = {
        basic: {
          opacity: [0.3, 0],
          scale: [0, 3],
        },
        special: {
          // opacity: out ? [1, 0] : [1, 1],
          scale: out ? [3, 0] : [0, 3],
        },
        compact: {},
      };

      const offset = bounds.width / 2;
      const x = e.pageX - bounds.left - offset;
      const y = e.pageY - bounds.top - offset;

      await animate(
        scope.current,
        { x: [x], y: [y], ...styles[buttonVariant] },
        {
          duration: 0.5,
          times: [0, 1],
        },
      );
    },
    [animate, bounds, scope, variant],
  );

  return (
    <motion.button
      {...props}
      className={twMerge(
        "relative overflow-hidden rounded-lg p-2",
        variant === "basic" && "bg-transparent opacity-50",
        variant === "special" && "z-10 bg-yellow-400 text-bgPrimary",
        className,
      )}
      whileHover={variant}
      whileTap={{
        scale: 1,
      }}
      variants={variants}
      ref={ref}
      onPointerUp={async (e) => {
        if (diasableBgEffect) return;
        expandingCircle(e, "basic");
      }}
      onPointerEnter={async (e) => {
        if (diasableBgEffect) return;
        expandingCircle(e, "special");
      }}
      onPointerLeave={async (e) => {
        if (diasableBgEffect) return;
        expandingCircle(e, "special", true);
      }}
    >
      {children}

      <motion.div
        ref={scope}
        className={twMerge(
          "opacity-1 absolute left-0 top-0 z-[-1] aspect-square w-full scale-0 rounded-full bg-white",
          variant === "special" && "bg-bgPrimary",
        )}
      />
    </motion.button>
  );
}

export default Button;
