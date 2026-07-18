import type { ComponentProps } from "react";
import { cn } from "src/lib/utils";
import Button, { ButtonVariant } from "./Button";

export const LittleButton = ({
  className,
  variant,
  ...props
}: ComponentProps<typeof Button>) => (
  <Button
    className={cn(
      "flex items-center gap-1 text-xs",
      className,
      "rounded-none py-1",
      variant !== ButtonVariant.Special && "hover:bg-foreground/20",
    )}
    {...props}
    variant={variant}
  />
);
