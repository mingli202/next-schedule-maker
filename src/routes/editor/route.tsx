import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ComponentProps, useCallback, useRef } from "react";
import { View } from "src/components";
import { DragIndicator, SidePane } from "src/components/root/editor";
import ReleaseNotes from "src/components/root/editor/ReleaseNotes";
import { EditorInViewParams } from "@/types/schedule";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Editor" },
      {
        name: "description",
        content:
          "John Abbott College (JAC) Dream Schedule Builder Editor. A visual interface to add and generate schedules that fits your needs.",
      },
    ],
  }),
  validateSearch: EditorInViewParams,
  component: RouteComponent,
});

function RouteComponent() {
  const menuRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  const onNewXPost = useCallback((percent: number) => {
    if (!menuRef.current || !viewRef.current) {
      return;
    }

    menuRef.current.style.flexBasis = `${percent}%`;
    viewRef.current.style.flexBasis = `${100 - percent}%`;
  }, []);

  return (
    <div className="text-text relative box-border flex w-screen overflow-hidden p-2 text-sm max-md:flex-col md:h-dvh md:text-base">
      <SidePane
        className="min-h-0 max-w-dvh max-md:h-screen md:basis-1/3"
        ref={menuRef}
      />
      <DragIndicator onNewXPos={onNewXPost} />
      <ViewWrapper
        className="min-h-0 max-md:h-[70dvh] md:basis-2/3"
        ref={viewRef}
      />
      <ReleaseNotes />
    </div>
  );
}

function ViewWrapper(props: ComponentProps<"div">) {
  const sections = Route.useSearch({ select: (s) => s.sections });
  const navigate = useNavigate();

  const onRemoveSectionClicked = useCallback(
    (sectionId: number) => {
      navigate({
        to: ".",
        search: (prev) => ({
          ...prev,
          sections: (prev.sections ?? []).filter(
            (s) => s.sectionId !== sectionId,
          ),
        }),
      });
    },
    [navigate],
  );

  return (
    <View
      savedSections={sections}
      onRemoveSectionClicked={onRemoveSectionClicked}
      {...props}
    />
  );
}
