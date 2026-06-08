import { useNavigate, useSearch } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { type SubmitEvent, useCallback, useRef } from "react";
import { Field, FieldLabel } from "src/components/ui/field";
import { Input } from "src/components/ui/input";
import { useDebounce } from "src/hooks";
import { SearchBarInfo } from "./SearchBarInfo";

const activeSearchDelayMili = 200;

export function SearchBar() {
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate({ from: "/editor/search" });

  const handleChange = useDebounce(() => {
    if (!formRef.current || !activeSearch) {
      return;
    }

    formRef.current.requestSubmit();
  }, activeSearchDelayMili);

  const { q, activeSearch } = useSearch({
    from: "/editor/search",
    select: (params) => ({ q: params.q, activeSearch: params.activeSearch }),
  });

  const handleSubmit = useCallback(
    (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const inputValue = formData.get("search")?.toString();

      navigate({
        search: (prev) => ({
          ...prev,
          q: inputValue,
        }),
      });
    },
    [navigate],
  );

  return (
    <form onSubmit={handleSubmit} autoComplete="off" ref={formRef}>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="search" className="hidden">
          search
        </FieldLabel>
        <Input
          placeholder="Search..."
          type="text"
          name="search"
          id="search"
          autoComplete="off"
          onChange={handleChange}
          defaultValue={q}
        />
        <SearchBarInfo />
      </Field>
    </form>
  );
}
