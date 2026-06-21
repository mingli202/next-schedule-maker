import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ComponentProps, useCallback, useRef } from "react";
import { View } from "src/components";
import {
  DragIndicator,
  SidePane,
  StatusFooter,
} from "src/components/root/editor";
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
    <div className="relative flex w-screen flex-col overflow-hidden text-sm md:h-screen md:text-base">
      <div className="flex max-md:flex-col md:flex-1">
        <SidePane
          className="max-w-dvh p-2 max-md:h-[93vh] md:basis-1/3"
          ref={menuRef}
        />
        <DragIndicator onNewXPos={onNewXPost} />
        <ViewWrapper className="max-md:h-[70vh] md:basis-2/3" ref={viewRef} />
      </div>
      <StatusFooter />
    </div>
  );
}

function ViewWrapper({ ...props }: ComponentProps<"div">) {
  const sections = Route.useSearch({ select: (s) => s.sections });
  const navigate = useNavigate();

  const onRemoveSectionClicked = useCallback(
    (sectionId: string) => {
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
