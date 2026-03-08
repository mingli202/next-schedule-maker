import { useCallback, useEffect, useRef } from "react";

type DragIndicatorProps = {
  onNewXPos: (xPos: number) => void;
};
export function DragIndicator({ onNewXPos }: DragIndicatorProps) {
  const isMouseDown = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isMouseDown.current || !containerRef.current) {
        return;
      }

      const x = e.clientX;

      const percent = (100 * x) / window.innerWidth;
      onNewXPos(percent);
    },
    [onNewXPos],
  );

  const onMouseUp = useCallback(() => {
    if (!isMouseDown.current) {
      return;
    }
    isMouseDown.current = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, []);

  const onMouseDown = useCallback(() => {
    isMouseDown.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <div
      className="z-30 hidden h-full w-3 items-center justify-center md:flex"
      ref={containerRef}
    >
      <button
        className="h-10 w-1/2 cursor-ew-resize rounded-full bg-slate-400"
        onMouseDown={onMouseDown}
        type="button"
      />
    </div>
  );
}
