import { execa } from "execa";
import type { VCS } from "@gitez/core";

async function runGit(
  cwd: string,
  args: string[],
  opts?: { timeoutMs?: number }
): Promise<string> {
  const { timeoutMs = 60_000 } = opts ?? {};
  const { stdout } = await execa("git", args, {
    cwd,
    timeout: timeoutMs,
    windowsHide: true
  });
  return (stdout ?? "").toString().trim();
}

export const GitAdapter: VCS = {
  async getCurrentBranch(cwd: string): Promise<string> {
    return runGit(cwd, ["rev-parse", "--abbrev-ref", "HEAD"]);
  },

  async fetch(cwd: string): Promise<void> {
    await runGit(cwd, ["fetch", "--prune"]);
  },

  async checkout(cwd: string, branch: string, create: boolean = false): Promise<void> {
    if (create) {
      await runGit(cwd, ["checkout", "-b", branch]);
    } else {
      await runGit(cwd, ["checkout", branch]);
    }
  },

  async revParse(cwd: string, rev: string): Promise<string> {
    return runGit(cwd, ["rev-parse", rev]);
  },

  async isClean(cwd: string): Promise<boolean> {
    const out = await runGit(cwd, ["status", "--porcelain"]);
    return out.length === 0;
    // Alternatively, you can use --porcelain=v1 -z for robust parsing later
  },

  async setUpstream(cwd: string, branch: string, upstream: string): Promise<void> {
    try {
      await runGit(cwd, ["push", "-u", "origin", branch]);
    } catch {
      await runGit(cwd, ["branch", "--set-upstream-to", upstream, branch]);
    }
  }
};