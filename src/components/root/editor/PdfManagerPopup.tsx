import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { LittleButton } from "src/components/LittleButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import type { SectionStore } from "src/types";

type PdfManagerPopupProps = {
  store: SectionStore;
};
export function PdfManagerPopup({ store }: PdfManagerPopupProps) {
  const [open, setOpen] = useState(false);

  const selectPdf = useMutation({});

  return (
    <>
      <LittleButton onClick={() => setOpen(true)}>
        {store.semester}
        <span className="hidden md:block"> ({store.filename})</span>
      </LittleButton>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Data source</DialogTitle>
            <DialogDescription>
              Set the source of the data used for the sections.
            </DialogDescription>
          </DialogHeader>
          <div></div>
        </DialogContent>
      </Dialog>
    </>
  );
}
