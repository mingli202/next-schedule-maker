import { type SubmitEvent, useRef, useState } from "react";

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
  const _isPending = useRef(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (_isPending.current) {
      return;
    }
    _isPending.current = true;
    setIsPending(true);
    setMessage(await submitHandler(e));
    _isPending.current = false;
    setIsPending(false);
  }

  return [message, handleSubmit, isPending] as const;
}
