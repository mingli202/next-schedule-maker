import {
  type SubmitEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Custom hook that mimics the behavior of the built-in `useActionState` hook.
 * However, this one is for handling form submissions instead of actions because actions reset the form and it's terrible UX.
 * @param submitHandler - The handler function that handles the form submission. e.preventDefault() is already called.
 * @returns The message returned by the submit handler, the handleSubmit function, the isPending state, and a reset function that resets the message to nothing
 * */
export function useFormState<T>(
  submitHandler: (
    e: SubmitEvent<HTMLFormElement>,
  ) => Promise<T | undefined | null>,
) {
  const [message, setMessage] = useState<T | undefined | null>();
  const [isPending, setIsPending] = useState(false);

  const _isPending = useRef(false);
  const submitHandlerRef = useRef(submitHandler);

  useEffect(() => {
    submitHandlerRef.current = submitHandler;
  }, [submitHandler]);

  const handleSubmit = useCallback(async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (_isPending.current) {
      return;
    }
    _isPending.current = true;
    setIsPending(true);
    setMessage(await submitHandlerRef.current(e));
    _isPending.current = false;
    setIsPending(false);
  }, []);

  const reset = useCallback(() => setMessage(undefined), []);

  return { msg: message, handleSubmit, isPending, reset } as const;
}
