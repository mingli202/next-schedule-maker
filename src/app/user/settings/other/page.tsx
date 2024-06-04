"use client";

import { cn } from "@/lib";
import { Button } from "@/ui";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import DeleteModal from "./DeleteModal";

function Page() {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <div
        className={cn(
          "relative flex h-full w-full flex-col gap-2 rounded-md bg-black/30 p-3 shadow-[rgba(156,205,220,0.24)_0px_3px_8px]",
        )}
      >
        <div className="shrink-0">
          <h1 className="font-heading text-xl md:text-3xl">Other</h1>
          <p className={cn("text-xs text-text/70 md:text-sm")}>
            Some other stuff you might be interested in
          </p>
        </div>
        <div className="h-0.5 w-full shrink-0 rounded-full bg-third/50" />

        <div
          className={cn(
            "flex items-center justify-between p-1 md:p-2",
            "flex-col"
              .split(" ")
              .map((c) => "max-md:" + c)
              .join(" "),
          )}
        >
          <div>
            <h2 className="text-base md:text-xl">Delete Account</h2>
            <p className={cn("text-xs text-text/70 md:text-sm")}>
              If you no long have any use for your account, consider deleting it
              to free up space in the database.
            </p>
          </div>
          <Button
            variant="basic"
            onClick={() => {
              setShowDelete(true);
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showDelete && <DeleteModal setShowDelete={setShowDelete} />}
      </AnimatePresence>
    </>
  );
}

export default Page;
