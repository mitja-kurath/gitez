import React from "react";
import { render } from "ink";
import App from "./app";

export async function runTui(cwd: string) {
  const { unmount, waitUntilExit } = render(<App cwd={cwd} />);
  await waitUntilExit();
  unmount();
}