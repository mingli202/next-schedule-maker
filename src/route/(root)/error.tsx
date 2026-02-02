"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};
function Error({ error, reset }: Props) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className="flex h-[100dvh] w-[100dvw] flex-col items-center justify-center">
      <h1 className="font-heading text-3xl font-bold">
        Something went wrong :(
      </h1>
      <p>{error.message}</p>
      <button className="underline" onClick={() => reset()}>
        Try Again
      </button>
      <div className="text-center">
        Want to fix it yourself? Consider contributing!{" "}
        <Link
          className="text-primary underline"
          href="https://github.com/mingli202/next-schedule-maker?tab=readme-ov-file#contributing"
        >
          README
        </Link>
      </div>
    </div>
  );
}

export default Error;
