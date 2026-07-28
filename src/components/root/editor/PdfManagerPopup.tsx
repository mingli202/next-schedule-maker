import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { LoaderCircle } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Button, { ButtonVariant } from "src/components/Button";
import { LittleButton } from "src/components/LittleButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { Label } from "src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { useFormState } from "src/hooks";
import { type DataSource, useDataSourceStore } from "src/lib/store/data-source";
import type { SectionStore } from "src/types";
import { GlobalAllSections } from "src/types/generated";

type PdfManagerPopupProps = {
  store: SectionStore;
};
export function PdfManagerPopup({ store }: PdfManagerPopupProps) {
  const [open, setOpen] = useState(true);

  const { dataSource, setSource } = useDataSourceStore();

  const userUploads = useQuery(api.uploads.queries.getUserUploads) ?? [];

  const items: { label: string; value: string }[] = [
    { label: "latest", value: "latest" },
    ...userUploads.map(
      (upload) =>
        ({
          label: `upload ${upload.displayName ?? upload.uploadId.slice(0, 6)}`,
          value: upload.uploadId,
        }) as const,
    ),
  ];

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
          <div className="flex flex-col gap-4">
            <Select
              defaultValue={
                dataSource.type === "latest" ? "latest" : dataSource.id
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <UploadPdf />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function UploadPdf() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [err, setError] = useState<string>();

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      setIsUploading(false);
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }
      setFile(file);
    },
    [],
  );

  async function handleAction(formData: FormData) {
    const url = `${import.meta.env.VITE_BACKEND_URL}/sections/parse-pdf`;
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      setError(`Upload failed: ${res.statusText}`);
      return;
    }

    const json = await res.json();
    const globalAllSections = GlobalAllSections.parse(json);
    console.log("globalAllSections:", globalAllSections);
  }

  useEffect(() => {
    const f = () => setIsUploading(false);
    fileInputRef.current?.addEventListener("cancel", f);

    return () => {
      fileInputRef.current?.removeEventListener("cancel", f);
    };
  }, []);

  return (
    <form
      className="flex w-full gap-2"
      action={handleAction}
      method="POST"
      encType="multipart/form-data"
    >
      <Label
        htmlFor="pdf-upload"
        className="flex-1 rounded-md border-2 border-dashed p-4"
        onClick={() => {
          if (isUploading) {
            return;
          }
          setIsUploading(true);
        }}
      >
        {isUploading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : file ? (
          file.name
        ) : (
          "Upload PDF"
        )}
        <input
          type="file"
          accept="application/pdf"
          onClick={() => {}}
          className="hidden"
          name="file"
          id="pdf-upload"
          onChange={handleFileInput}
          ref={fileInputRef}
        />
      </Label>
      <Button type="submit" variant={ButtonVariant.Basic}>
        Submit
      </Button>
    </form>
  );
}
