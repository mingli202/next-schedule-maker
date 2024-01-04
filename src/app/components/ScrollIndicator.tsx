import styles from "./styles.module.css";
import { twMerge } from "tailwind-merge";

function ScrollIndicator() {
  return (
    <div className="absolute bottom-2 flex w-full flex-col items-center justify-center opacity-80">
      <svg
        className="h-7 w-12"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0 0L50 25 100 0"
          className={twMerge("fill-none stroke-slate", styles.path1)}
        />
        <path
          d="M0 0L50 25 100 0"
          className={twMerge("fill-none stroke-slate", styles.path2)}
        />
      </svg>
    </div>
  );
}

export default ScrollIndicator;
