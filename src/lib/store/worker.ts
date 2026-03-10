import type { WorkerMessage, WorkerResponse } from "src/types/worker";

class MyWorker {
  constructor(private _worker: Worker) {}

  public postMessage(message: WorkerMessage) {
    this._worker.postMessage(message);
  }

  public onWorkerMessage(
    handler: (event: MessageEvent<WorkerResponse>) => void,
  ) {
    this._worker.addEventListener("message", handler);

    return () => {
      this._worker.removeEventListener("message", handler);
    };
  }

  public terminateWorker() {
    this._worker?.terminate();
    this._worker;
  }
}

let worker: MyWorker | null = null;

/**
 * Get instance of the web worker
 * @returns the worker if called in browser, undefined otherwise
 * */
export function getWorker() {
  if (typeof window === "undefined") {
    return;
  }

  if (!worker) {
    const aWorker = new Worker(
      new URL("../../workers/myWorker.ts", import.meta.url),
      {
        type: "module",
      },
    );
    worker = new MyWorker(aWorker);
  }

  return worker;
}

/**
 * Listens to incoming worker message
 * @returns callback to detach message handler
 * */
export function onWorkerMessage(
  handler: (event: MessageEvent<WorkerResponse>) => void,
) {
  const w = getWorker();

  if (!w) {
    return;
  }

  w.addEventListener("message", handler);

  return () => {
    w.removeEventListener("message", handler);
  };
}

/**
 * Terminate current instance of worker
 * */
