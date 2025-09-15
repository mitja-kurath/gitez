import React, { useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { loadConfig, startFeature, type ActionContext } from "@gitez/core";
import { GitAdapter } from "@gitez/adapter-git";

function useQuit() {
  const { exit } = useApp();
  useInput((input, key) => { if (key.escape || (key.ctrl && input === "c")) exit(); });
}

export default function App({ cwd }: { cwd: string }) {
  useQuit();
  const [stage, setStage] = useState<"input" | "running" | "done" | "error">("input");
  const [name, setName] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useInput((input, key) => {
    if (stage !== "input") return;
    if (key.return) run();
    else if (key.backspace || key.delete) setName((s) => s.slice(0, -1));
    else if (input) setName((s) => s + input);
  });

  async function run() {
    setStage("running");
    try {
      const config = await loadConfig(cwd);
      const ctx: ActionContext = { cwd, config, vcs: GitAdapter };
      const result = await startFeature(ctx, { name });
      setLog(result.plan.preview);
      await result.execute(ctx);
      setStage("done");
    } catch (e: any) {
      setErr(e.message);
      setStage("error");
    }
  }

  return (
    <Box flexDirection="column">
      {stage === "input" && (<><Text>Start Feature — type a branch name and press Enter (ESC to quit)</Text><Text>feature/{name}</Text></>)}
      {stage === "running" && (<><Text>Executing…</Text>{log.map((l, i) => (<Text key={i}>- {l}</Text>))}</>)}
      {stage === "done" && (<Text color="green">✔ Created branch feature/{name}</Text>)}
      {stage === "error" && (<Text color="red">✖ {err}</Text>)}
    </Box>
  );
}
