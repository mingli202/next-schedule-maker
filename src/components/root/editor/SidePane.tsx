import { signOut } from "firebase/auth";
import type { ComponentProps } from "react";
import { Button } from "src/components";
import { getAuth } from "src/integrations/firebase";
import { cn } from "src/lib/utils";

type Props = ComponentProps<"div">;

const auth = getAuth();

export function SidePane({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        "overflow-x-hidden overflow-y-hidden max-md:order-2 md:h-full md:overflow-x-auto",
        className,
      )}
      {...props}
    >
      <Button
        onClick={async () => {
          await signOut(auth);
        }}
      >
        Log out
      </Button>
    </div>
  );
}
