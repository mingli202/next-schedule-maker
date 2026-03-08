import { Outlet } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { cn } from "src/lib/utils";
import { MenuNavBar } from "./MenuNavBar";

type Props = ComponentProps<"div">;

export function SidePane({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        "overflow-x-hidden overflow-y-hidden max-md:order-2 md:h-full md:overflow-x-auto",
        className,
      )}
      {...props}
    >
      <MenuNavBar />
      <Outlet />
    </div>
  );
}
