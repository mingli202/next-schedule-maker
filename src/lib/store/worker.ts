import type {
  WorkerMessage,
  WorkerMessageType,
  WorkerResponseMap,
} from "src/types/worker";

let worker: Worker | null = null;

/**
 * Get instance of the web worker
 * @returns the worker if called in browser, undefined otherwise
 * */
export function getWorker() {
  if (typeof window === "undefined") {
    return;
  }

  if (!worker) {
    worker = new Worker(new URL("../../workers/myWorker.ts", import.meta.url), {
      type: "module",
    });
  }

  return worker;
}

/**
 * Send a message to the worker
 * */
export function postWorkerMessage(message: WorkerMessage) {
  getWorker()?.postMessage(message);
}

/**
 * Listens to incoming worker message
 * @returns callback to detach message handler
 * */
export function onWorkerMessage<T extends WorkerMessageType>(
  handler: (event: MessageEvent<WorkerResponseMap[T]>) => void,
) {
  const w = getWorker();

  if (!w) {
    return () => {};
  }

  w.addEventListener("message", handler);

  return () => {
    w.removeEventListener("message", handler);
  };
}

/**
 * Terminate current instance of worker
 * */
export function terminateWorker() {
  worker?.terminate();
  worker = null;
}
