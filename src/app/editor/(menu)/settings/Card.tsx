"use client";

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";

type CardProps = {
  title: string;
  desc: string;
  param: string;
};
const Card = ({ title, desc, param }: CardProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get(param);

  return (
    <div className="flex shrink-0 justify-between gap-2 rounded-md bg-bgSecondary p-2">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="opacity-90">{desc}</p>
      </div>
      <div className="flex shrink-0 items-center justify-center">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary transition hover:bg-third"
          onClick={() => {
            const url = new URL(window.location.href);

            if (q === "true") {
              url.searchParams.delete(param);
            } else {
              url.searchParams.set(param, "true");
            }

            router.push(`/editor/settings?${url.searchParams}`);
          }}
        >
          {q === "true" && (
            <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
