import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { useMemo, useState } from "react";
import { Button } from "src/components";
import { ButtonVariant } from "src/components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Textarea } from "src/components/ui/textarea";
import { useFormState } from "src/hooks";

type FeedbackDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MAX_FEEDBACK_LENGTH = 3000;

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const submitFeedback = useMutation(api.feedback.mutations.submitFeedback);

  const [feedback, setFeedback] = useState("");
  const [isSent, setIsSent] = useState(false);

  const charsRemaining = useMemo(
    () => MAX_FEEDBACK_LENGTH - feedback.length,
    [feedback.length],
  );

  const resetForm = () => {
    setFeedback("");
    setIsSent(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  const [error, handleSubmit, isPending] = useFormState(async (e) => {
    setIsSent(false);
    const formData = new FormData(e.target);

    const trimmedFeedback = feedback.trim();
    if (!trimmedFeedback) {
      return "Please add your feedback before sending.";
    }

    const contactInfo = formData.get("contact-info")?.toString();

    try {
      await submitFeedback({
        feedback: trimmedFeedback,
        contactInfo,
      });
      setFeedback("");
      setIsSent(true);
      e.target.reset();
    } catch {
      return "Failed to send feedback. Please try again.";
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share feedback</DialogTitle>
          <DialogDescription className="text-left">
            Tell me what feature you would like to see and what should be
            improved. Your feedback is anonymized unless you provide a contact
            info. So don't hold back, I won't come after you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-info">Contact info (optional)</Label>
            <Input
              id="contact-info"
              name="contact-info"
              placeholder="name@example.com or 514-586-1268"
              onChange={() => {
                if (isSent) {
                  setIsSent(false);
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback-message">Feedback</Label>
            <Textarea
              id="feedback-message"
              value={feedback}
              maxLength={MAX_FEEDBACK_LENGTH}
              onChange={(event) => {
                if (isSent) {
                  setIsSent(false);
                }
                return setFeedback(event.target.value);
              }}
              placeholder="Share your feedback..."
              className="min-h-32"
            />
            <p className="text-muted-foreground text-xs">
              {charsRemaining} characters remaining
            </p>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          {isSent && (
            <p className="text-sm text-green-600">Feedback sent. Thank you.</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant={ButtonVariant.Basic}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={ButtonVariant.Special}
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Send feedback"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
