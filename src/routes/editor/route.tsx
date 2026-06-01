import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ComponentProps, useCallback, useRef } from "react";
import { View } from "src/components";
import { DragIndicator, SidePane } from "src/components/root/editor";
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
    <div className="text-text box-border flex w-screen overflow-x-hidden overflow-y-auto p-2 text-sm max-md:flex-col md:h-screen md:overflow-hidden md:text-base">
      <SidePane className="basis-1/3" ref={menuRef} />
      <DragIndicator onNewXPos={onNewXPost} />
      <ViewWrapper className="basis-2/3" ref={viewRef} />
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
