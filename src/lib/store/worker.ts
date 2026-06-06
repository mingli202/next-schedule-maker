import type {
  WorkerMessage,
  WorkerResponse,
  WorkerResponseOf,
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
export function onWorkerMessage<T extends WorkerResponse["type"]>(
  type: T,
  handler: (event: WorkerResponseOf<T>) => void,
) {
  const w = getWorker();

  if (!w) {
    return () => {};
  }

  const f = (e: MessageEvent<WorkerResponse>) => {
    if (!isWorkerResponseOfType(e, type)) {
      return;
    }

    handler(e.data);
  };

  w.addEventListener("message", f);

  return () => {
    w.removeEventListener("message", f);
  };
}

/**
 * Terminate current instance of worker
 * */
export function terminateWorker() {
  worker?.terminate();
  worker = null;
}

function isWorkerResponseOfType<T extends WorkerResponse["type"]>(
  event: MessageEvent<WorkerResponse>,
  type: T,
): event is MessageEvent<WorkerResponseOf<T>> {
  return event.data.type === type;
}
