import { useSearch } from "@tanstack/react-router";
import { useSectionStore } from "src/lib/store/section";
import type { Code } from "src/types/autobuild";
import type { SavedSection } from "src/types/schedule";
import PageLoading from "@/components/PageLoading";
import generate from "./generate";

type Props = {
  setGeneratedSchedules: React.Dispatch<React.SetStateAction<SavedSection[][]>>;
  codes: Code[];
  setIsBuilding: React.Dispatch<
    React.SetStateAction<"form" | "building" | "complete">
  >;
  useCurrent: boolean;
  dayOff: string[];
  time: [string, string];
};

function Loader({
  setGeneratedSchedules,
  codes,
  setIsBuilding,
  useCurrent,
  dayOff,
  time,
}: Props) {
  const { sectionsById } = useSectionStore();

  const sections = useSearch({
    from: "/editor/autobuild",
    select: (s) => s.sections,
  });

  generate(codes, sections, useCurrent, dayOff, time, sectionsById)
    .then((res) => {
      setGeneratedSchedules(res);
      setIsBuilding("complete");
    })
    .catch((err) => console.log(err));

  return <PageLoading />;
}

export default Loader;
