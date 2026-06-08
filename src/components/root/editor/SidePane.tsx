import { Outlet } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { cn } from "src/lib/utils";
import { MenuNavBar } from "./MenuNavBar";

type Props = ComponentProps<"div">;

export function SidePane({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col gap-2 overflow-hidden max-md:order-2 md:h-full",
        className,
      )}
      {...props}
    >
      <MenuNavBar />
      <Outlet />
    </div>
  );
}
