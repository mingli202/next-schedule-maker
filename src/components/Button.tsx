import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  useAnimate,
} from "framer-motion";
import { LoaderCircle } from "lucide-react";
import {
  type ButtonHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from "react";
import type { RecordValues } from "src/types";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const ButtonVariant = {
  Basic: "basic",
  Special: "special",
} as const;
export type ButtonVariant = RecordValues<typeof ButtonVariant>;

type Props = {
  variant?: ButtonVariant;
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
  title,
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
      outlineColor: "var(--accent)",
      boxShadow: `0 0 1rem var(--accent)`,
    },
  };

  const ref = useRef<HTMLButtonElement>(null);
  const [scope, animate] = useAnimate();

  const [circleSize, setCircleSize] = useState<number>();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleBasicHover = useCallback(
    async (e: React.PointerEvent<HTMLButtonElement>) => {
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
    },
    [animate, scope.current],
  );

  const updateMousePosition = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const bounds = ref.current?.getBoundingClientRect();

      if (!bounds) {
        return;
      }

      const x = e.clientX - bounds.x;
      const y = e.clientY - bounds.y;
      setMousePosition({ x, y });
    },
    [],
  );

  const handleSpecialHover = useCallback(
    async (e: React.PointerEvent<HTMLButtonElement>) => {
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
    },
    [updateMousePosition],
  );

  return (
    <Tooltip delayDuration={700}>
      <TooltipTrigger asChild>
        <motion.button
          {...props}
          className={cn(
            "relative overflow-hidden rounded-lg px-2 py-1 hover:cursor-pointer",
            variant === "basic" && "bg-transparent opacity-50",
            variant === "special" && "text-accent-foreground bg-accent z-10",
            isPending &&
              "flex cursor-wait items-center justify-center hover:cursor-wait",
            disabled && "cursor-not-allowed",
            className,
          )}
          disabled={isPending || disabled}
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
            ? (pendingElement ?? (
                <LoaderCircle className="h-6 w-6 animate-spin" />
              ))
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
                    "bg-background absolute top-0 left-0 z-1 h-full w-full",
                    "overflow-hidden px-2 py-1",
                    className,
                  )}
                  style={{
                    color: "var(--accent)",
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
      </TooltipTrigger>
      {title && <TooltipContent>{title}</TooltipContent>}
    </Tooltip>
  );
}

export default Button;
