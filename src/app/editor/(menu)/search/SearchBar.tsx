"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialValue = searchParams.get("q") ?? "";

  const isLiveSearch = searchParams.get("liveSearch");

  const search = (formData: FormData) => {
    const searchInput = formData.get("search")!.toString();

    const url = new URL(window.location.href);
    url.searchParams.set("q", searchInput);
    router.push(`/editor/search?${url.searchParams}`);
  };

  return (
    <form action={search} autoComplete="off">
      <label htmlFor="search" className="hidden">
        search
      </label>
      <input
        className="w-full shrink-0 rounded-md bg-secondary p-1 outline-none placeholder:italic"
        placeholder="Search..."
        type="text"
        name="search"
        id="search"
        autoComplete="off"
        defaultValue={initialValue}
        onChange={(e) => {
          if (isLiveSearch !== "true") return;

          const urlParams = new URL(window.location.href);
          urlParams.searchParams.set("q", e.target.value);
          router.push(`/editor/search?${urlParams.searchParams}`);
        }}
      />
    </form>
  );
};

export default SearchBar;
