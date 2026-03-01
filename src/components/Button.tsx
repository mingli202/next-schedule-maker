"use client";

import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  useAnimate,
} from "framer-motion";
import { type ButtonHTMLAttributes, useRef, useState } from "react";
import cn from "@/lib/cn";
import { LoaderCircle } from "lucide-react";

type Props = {
  variant?: "basic" | "special";
} & {
  disableBgEffect?: boolean;
  disableScaleEffect?: boolean;
  isPending?: boolean;
  pendingElement?: React.ReactNode;
} & HTMLMotionProps<"button"> &
  ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
  className,
  children,
  variant,
  disableBgEffect,
  disableScaleEffect,
  isPending,
  pendingElement,
  disabled,
  ...props
}: Props) {
  const yellow = "#facc15";
  const hoverVariants = {
    // basic animation for non important text

    basic: {
      scale: disableScaleEffect ? 1 : 1.01,
      opacity: 1,
    },
    // for important buttons
    special: {
      scale: disableScaleEffect ? 1 : 1.01,
      outlineColor: yellow,
      boxShadow: `0 0 1rem ${yellow}`,
    },
  };

  const ref = useRef<HTMLButtonElement>(null);
  const [scope, animate] = useAnimate();

  const [circleSize, setCircleSize] = useState<number>();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleBasicHover = async (e: React.PointerEvent<HTMLButtonElement>) => {
    const styles = {
      opacity: [0.3, 0],
      scale: [0, 3],
    };

    const bounds = ref.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    const offset = bounds.width / 2;
    const x = e.clientX - bounds.x - offset;
    const y = e.clientY - bounds.y - offset;

    await animate(
      scope.current,
      { x: [x], y: [y], ...styles },
      {
        duration: 0.5,
        times: [0, 1],
      },
    );
  };

  const handleSpecialHover = async (
    e: React.PointerEvent<HTMLButtonElement>,
  ) => {
    updateMousePosition(e);
    const bounds = ref.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    const x = e.clientX - bounds.x;
    const y = e.clientY - bounds.y;

    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(bounds.width - x, y),
      Math.hypot(x, bounds.height - y),
      Math.hypot(bounds.width - x, bounds.height - y),
    );

    setCircleSize(maxDistance * 2);
  };

  const updateMousePosition = (e: React.PointerEvent<HTMLButtonElement>) => {
    const bounds = ref.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    const x = e.clientX - bounds.x;
    const y = e.clientY - bounds.y;
    setMousePosition({ x, y });
  };

  return (
    <motion.button
      {...props}
      className={cn(
        "relative overflow-hidden rounded-lg p-2 hover:cursor-pointer",
        variant === "basic" && "bg-transparent opacity-50",
        variant === "special" && "text-bg-primary z-10 bg-yellow-400",
        isPending &&
          "flex cursor-wait items-center justify-center hover:cursor-wait",
        disabled && "cursor-not-allowed",
        className,
      )}
      disabled={isPending && disabled}
      style={
        {
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
        } as React.CSSProperties
      }
      whileHover={variant}
      whileTap={{
        scale: 1,
      }}
      variants={hoverVariants}
      ref={ref}
      onPointerUp={async (e) => {
        if (disableBgEffect) return;
        handleBasicHover(e);
      }}
      onPointerEnter={async (e) => {
        if (disableBgEffect) return;
        handleSpecialHover(e);
      }}
      onPointerLeave={async (e) => {
        if (disableBgEffect) return;
        updateMousePosition(e);
        setCircleSize(undefined);
      }}
    >
      {isPending
        ? (pendingElement ?? <LoaderCircle className="h-6 w-6 animate-spin" />)
        : children}

      {variant === "basic" && (
        <motion.div
          ref={scope}
          className={cn(
            "absolute top-0 left-0 z-1 aspect-square w-full rounded-full bg-white opacity-1",
          )}
        />
      )}
      {variant === "special" && (
        <AnimatePresence>
          {circleSize !== undefined && (
            <motion.div
              ref={scope}
              className={cn(
                "bg-bg-primary absolute top-0 left-0 z-1 h-full w-full",
                "overflow-hidden p-2",
                className,
              )}
              style={{
                color: yellow,
              }}
              initial={{
                clipPath: "circle(0px at var(--mouse-x) var(--mouse-y))",
              }}
              animate={{
                clipPath: `circle(${circleSize}px at var(--mouse-x) var(--mouse-y))`,
              }}
              exit={{
                clipPath: "circle(0px at var(--mouse-x) var(--mouse-y))",
              }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.button>
  );
}

export default Button;
