import { cn } from "@/lib";
import { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement>;

const FriendsPreview = ({ className, ...props }: Props) => {
  return (
    <div className={cn(className)} {...props}>
      Preview of your friends
    </div>
  );
};

export default FriendsPreview;
