import { type SubmitEvent, useState } from "react";

/**
 * Custom hook that mimics the behavior of the built-in `useActionState` hook.
 * However, this one is for handling form submissions instead of actions because actions reset the form and it's terrible UX.
 * @param submitHandler - The handler function that handles the form submission. e.preventDefault() is already called.
 * @returns The error message, the handleSubmit function, and the isPending state.
 * */
export default function useFormState(
  submitHandler: (
    e: SubmitEvent<HTMLFormElement>,
  ) => Promise<string | undefined | null>,
) {
  const [message, setMessage] = useState<string | undefined | null>();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    if (isPending) {
      return;
    }
    setIsPending(true);
    e.preventDefault();
    setMessage(await submitHandler(e));
    setIsPending(false);
  }

  return [message, handleSubmit, isPending] as const;
}
