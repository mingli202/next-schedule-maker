import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { NewUpload, type UserUploadData } from "convex/types";
import { LoaderCircle } from "lucide-react";
import { type ChangeEvent, useCallback, useRef, useState } from "react";
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
import { cn } from "src/lib/utils";
import type { SectionStore } from "src/types";

type UserUploadSelectItems = Record<
  Id<"userUploads">,
  { label: string; userUpload: UserUploadData }
>;

type PdfManagerPopupProps = {
  store: SectionStore;
};
export function PdfManagerPopup({ store }: PdfManagerPopupProps) {
  const [open, setOpen] = useState(true);

  const { dataSource, setSource } = useDataSourceStore();

  const userUploads = useQuery(api.uploads.queries.getUserUploads) ?? [];

  const items: UserUploadSelectItems = userUploads.reduce((acc, upload) => {
    acc[upload.userUploadId] = {
      label: upload.displayName,
      userUpload: upload,
    };
    return acc;
  }, {} as UserUploadSelectItems);

  const handleValueChange = (value: string) => {
    let nextSource: DataSource;
    if (value === "latest") {
      nextSource = { type: "latest" };
    } else {
      const userUpload = items[value as Id<"userUploads">].userUpload;
      nextSource = {
        type: "upload",
        userUploadId: userUpload.userUploadId,
        displayName: userUpload.displayName,
        storageUrl: userUpload.storageUrl,
        semester: userUpload.semester,
      };
    }

    if (JSON.stringify(nextSource) !== JSON.stringify(dataSource)) {
      setSource(nextSource);
    }
  };

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
                dataSource.type === "latest"
                  ? "latest"
                  : dataSource.userUploadId
              }
              onValueChange={handleValueChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="latest">latest</SelectItem>
                  {Object.entries(items).map(([value, item]) => (
                    <SelectItem key={value} value={value}>
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

  const {
    msg: res,
    handleSubmit,
    isPending,
    reset,
  } = useFormState(async (e) => {
    if (!file) {
      return { type: "error", msg: "Select a pdf to parse" } as const;
    }

    const formData = new FormData(e.target);

    const url = `${import.meta.env.VITE_CONVEX_SITE_URL}/sections/parse-pdf`;
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      return {
        type: "error",
        msg: `Upload failed: ${res.statusText}`,
      } as const;
    }

    const json = await res.json();
    const newUpload = NewUpload.parse(json);
    console.log("newUpload:", newUpload);

    setFile(undefined);
    e.target.reset();
    return { type: "success", msg: "Upload successful" } as const;
  });

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      reset();
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }
      setFile(file);
    },
    [reset],
  );

  return (
    <form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
      <p>Upload a pdf to parse</p>
      <div className="flex w-full gap-2">
        <Label
          htmlFor="pdf-upload"
          className="border-border hover:border-primary/50 flex-1 rounded-md border-2 border-dashed p-4 transition hover:cursor-pointer"
        >
          {isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : file ? (
            <span className="truncate">{file.name}</span>
          ) : (
            "Select PDF"
          )}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            name="file"
            id="pdf-upload"
            onChange={handleFileInput}
            ref={fileInputRef}
          />
        </Label>
        <Button
          type="submit"
          variant={ButtonVariant.Basic}
          disabled={isPending}
        >
          Submit
        </Button>
      </div>
      {res && (
        <p
          className={cn(
            res.type === "error" ? "text-destructive" : "text-green-600",
          )}
        >
          {res.msg}
        </p>
      )}
    </form>
  );
}
