"use client";

import { cn } from "@/lib";
import { Button } from "@/ui";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { HTMLAttributes, useEffect, useRef, useState } from "react";

type Props = HTMLAttributes<HTMLDivElement>;

const Search = ({ className, ...props }: Props) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null!);
  const [inputQuery, setInputQuery] = useState("");

  const action = (formdata: FormData) => {
    const search = formdata.get("q")?.toString();

    const url = new URL(window.location.href);

    if (!search) {
      url.searchParams.delete("q");
    } else {
      url.searchParams.set("q", search);
    }

    router.push("/user/search?" + url.searchParams);
  };

  useEffect(() => {
    const id = setTimeout(() => formRef.current.requestSubmit(), 300);
    return () => clearTimeout(id);
  }, [inputQuery]);

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <h2 className="shrink-0 font-heading text-3xl">Search Users</h2>
      <form
        className="flex w-full shrink-0 gap-2"
        action={action}
        ref={formRef}
      >
        <input
          className="basis-full rounded-md border border-third bg-bgPrimary p-2 outline-none placeholder:italic focus:border-primary focus:bg-bgSecondary"
          name="q"
          id="q"
          type="text"
          placeholder="Search by username, email or uid"
          onChange={(e) => {
            setInputQuery(e.target.value);
          }}
        />
        <Button variant="special" className="shrink-0" type="submit">
          <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default Search;
