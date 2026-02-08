import { useQuery } from "@tanstack/react-query";
import { getSectionSectionsSectionIdGet } from "@/client";
import { Section } from "@/types/generated";

export function useSection(sectionId: number) {
  const res = useQuery({
    queryKey: ["section", sectionId],
    queryFn: async () => {
      const res = await getSectionSectionsSectionIdGet({
        path: { section_id: sectionId },
      });

      if (res.error) {
        throw new Error(JSON.stringify(res.error.detail));
      }

      return Section.parse(res.data);
    },
    staleTime: Infinity,
  });

  if (res.isError) {
    console.trace(`Section ${sectionId} failed to load. Error ${res.error}`);
  }

  return res;
}
