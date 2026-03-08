import { useNavigate } from "@tanstack/react-router";
import { type SubmitEvent, useCallback, useRef } from "react";
import { Field, FieldLabel } from "src/components/ui/field";
import { Input } from "src/components/ui/input";

export function SearchBar() {
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate({ from: "/editor/search" });

  const handleSubmit = useCallback(
    (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const inputValue = formData.get("search")?.toString();

      navigate({
        search: (prev) => ({
          ...prev,
          q: inputValue ?? prev.q,
        }),
      });
    },
    [navigate],
  );

  return (
    <form onSubmit={handleSubmit} autoComplete="off" ref={formRef}>
      <Field>
        <FieldLabel htmlFor="search" className="hidden">
          search
        </FieldLabel>
        <Input
          placeholder="Search..."
          type="text"
          name="search"
          id="search"
          autoComplete="off"
          onChange={() => {
            if (!formRef) {
              return;
            }

            formRef.current?.requestSubmit();
          }}
        />
      </Field>
    </form>
  );
}
