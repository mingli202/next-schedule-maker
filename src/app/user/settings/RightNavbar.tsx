"use client";

import { app } from "@/backend";
import { cn } from "@/lib";
import { Button } from "@/ui";
import { getAuth, signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HTMLAttributes } from "react";

const Card = ({
  currentPath,
  href,
  children,
}: {
  currentPath: string;
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-md p-1.5 transition max-md:text-sm md:p-2",
        currentPath === href && "bg-secondary font-bold",
      )}
    >
      {children}
    </Link>
  );
};

type Props = HTMLAttributes<HTMLDivElement>;

const RightNavbar = ({ className, ...props }: Props) => {
  const path = usePathname();

  return (
    <div
      className={cn("flex h-fit md:h-full md:flex-col md:p-2", className)}
      {...props}
    >
      <Card href="/user/settings/profile" currentPath={path}>
        Profile
      </Card>
      <Card href="/user/settings/schedules" currentPath={path}>
        Schedules
      </Card>
      <Card href="/user/settings/other" currentPath={path}>
        Other
      </Card>

      <div className="basis-full bg-transparent" />

      <Button
        variant="special"
        className="shrink-0 max-md:p-1.5 max-md:text-sm"
        onClick={async () => {
          const auth = getAuth(app);
          if (!auth) return;
          await signOut(auth);
        }}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default RightNavbar;
