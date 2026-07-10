import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// Unmount any rendered React tree between tests. Guarded by a DOM check so this
// shared setup stays a no-op in the node-environment (pure-logic) tests.
afterEach(async () => {
  if (typeof document !== "undefined") {
    const { cleanup } = await import("@testing-library/react");
    cleanup();
  }
});
