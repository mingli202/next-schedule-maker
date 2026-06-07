import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import Button from "src/components/Button";
import { getColorFromIndex } from "src/lib/colors";
import { useSectionStore } from "src/lib/store/section";

export function CurrentScheduleSectionsLegend() {
  const sections = useSearch({
    from: "/editor/saved",
    select: (s) => s.sections,
  });
  const navigate = useNavigate({ from: "/editor/saved" });
  const { sectionsById } = useSectionStore();

  const clearSections = useCallback(() => {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        sections: [],
      }),
    });
  }, [navigate]);

  const removeSection = useCallback(
    (sectionId: number) => {
      navigate({
        to: ".",
        search: (prev) => ({
          ...prev,
          sections: prev.sections.filter(
            (section) => section.sectionId !== sectionId,
          ),
        }),
      });
    },
    [navigate],
  );

  return (
    <div className="shrink-0 basis-1/3 overflow-x-hidden overflow-y-auto">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-1 text-sm">
        <div className="bg-bg-secondary col-span-full flex h-fit gap-2 rounded-md p-2">
          <p className="basis-full">Course Count: {sections.length}</p>

          <Button
            className="shrink-0 p-0"
            disableBgEffect
            variant="basic"
            onClick={clearSections}
          >
            Clear
          </Button>
        </div>

        {sections.map(({ sectionId, colorIndex }) => {
          const cl = sectionsById.get(sectionId);

          if (!cl) {
            return null;
          }

          const { bgColor, textColor } = getColorFromIndex(colorIndex);

          return (
            <button
              type="button"
              key={`schedule indicator ${cl.id}`}
              className="w-full cursor-pointer rounded-md p-1 text-left"
              style={{
                backgroundColor: bgColor,
                color: textColor,
              }}
              onClick={() => removeSection(sectionId)}
            >
              <p className="font-bold">
                {cl.code} {cl.leclabs[0]?.title ?? ""}
              </p>
              <p>
                {cl.section} {cl.leclabs[0]?.prof ?? ""}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
