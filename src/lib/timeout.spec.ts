import { expect } from "bun:test";
import { given, then, when } from "./test-util";
import { newPromiseWithTimout } from "./timeout";

given("a promise with a timeout", () => {
  when("promises times out", () => {
    then("promise body should not run", async () => {
      // Arrange
      let didRun = false;
      let didCatch = false;

      // Act
      await newPromiseWithTimout<string>((timeout, resolve) => {
        // some long executing code
        setTimeout(() => {
          if (!timeout.isTimedOut) {
            resolve("value");
            didRun = true;
          }
        }, 200);
      }, 100).catch(() => (didCatch = true));

      // Assert
      expect(didRun).toBeFalse();
      expect(didCatch).toBeTrue();
    });
  });

  when("promise finishes before timeout", () => {
    then("the timeout should have been cleared and got value", async () => {
      // Arrange
      let didRun = false;
      let didCatch = false;

      // Act
      const val = await newPromiseWithTimout<string>((_, resolve) => {
        // some long executing code
        setTimeout(() => {
          resolve("value");
          didRun = true;
        }, 100);
      }, 200).catch(() => (didCatch = true));

      // Assert
      expect(didRun).toBeTrue();
      expect(val).toBe("value");
      expect(didCatch).toBeFalse();
    });
  });
});
