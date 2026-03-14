import { useSearch } from "@tanstack/react-router";
import { useSectionStore } from "src/lib/store/section";

export default function PreviewHover() {
  const previewSectionId = useSearch({
    strict: false,
    select: (s) => s.previewSectionId,
  });

  if (previewSectionId === undefined || previewSectionId < 0) return null;

  return <PreviewHoverInner previewSectionId={previewSectionId} />;
}

type PreviewHoverInnerProps = {
  previewSectionId: number;
};
function PreviewHoverInner({ previewSectionId }: PreviewHoverInnerProps) {
  const { sectionsById } = useSectionStore();
  const section = sectionsById[previewSectionId];

  if (!section) return null;

  return (
    <div className="absolute top-0 left-0 z-10 grid h-full w-full grid-cols-5 grid-rows-[repeat(20,1fr)] bg-transparent">
      {section.viewData.map((times) => {
        const [d, [start, end]] = Object.entries(times)[0];
        return (
          <div
            key={`${section.code}-${d}-${section.section}-hover`}
            className="z-10 overflow-hidden rounded-md border-[3px] bg-white p-1 text-[8px] leading-2.5 text-black opacity-50 md:text-[14px] md:leading-3.5"
            style={{
              gridColumn: d,
              gridRowStart: start,
              gridRowEnd: end,
            }}
          >
            <p className="line-clamp-2 font-bold">{section.title}</p>
            <p className="mt-1 line-clamp-1">{section.code}</p>
            <p>{section.section}</p>
            <p className="mt-1 line-clamp-2">{section.leclabs[0]?.prof}</p>
          </div>
        );
      })}
    </div>
  );
}
