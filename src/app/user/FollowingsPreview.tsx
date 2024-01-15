"use client";

import { cn } from "@/lib";
import Link from "next/link";
import { HTMLAttributes, useContext } from "react";
import { FollowingsContext } from "./Context";
import { Button } from "@/ui";

type Props = HTMLAttributes<HTMLDivElement>;

const FollowingsPreview = ({ className, ...props }: Props) => {
  const followings = useContext(FollowingsContext);

  return (
    <div
      className={cn("flex flex-col gap-2 overflow-hidden", className)}
      {...props}
    >
      <Link href="/user/followings" className="w-full shrink-0">
        <h2 className="text-2xl font-bold">Followings</h2>
      </Link>
      {followings ? (
        followings.map((usr, i) => <div key={i}>{usr}</div>)
      ) : (
        <div>
          <p>You don{"'"}t follow any user. Click to find a user!</p>
          <Link href="/user/search">
            <Button variant="special">Search Users</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FollowingsPreview;
