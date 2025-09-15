import { execa } from "execa";
import type { VCS } from "@gitez/core";

async function runGit(
  cwd: string,
  args: string[],
  opts?: { timeoutMs?: number; ignoreError?: boolean }
): Promise<string> {
  const { timeoutMs = 60_000, ignoreError = false } = opts ?? {};
  try {
    const { stdout } = await execa("git", args, {
      cwd,
      timeout: timeoutMs,
      windowsHide: true
    });
    return (stdout ?? "").toString().trim();
  } catch (e) {
    if (ignoreError) return "";
    throw e;
  }
}

export const GitAdapter: VCS = {
  async getCurrentBranch(cwd: string): Promise<string> {
    return runGit(cwd, ["rev-parse", "--abbrev-ref", "HEAD"]);
  },

  async fetch(cwd: string): Promise<void> {
    await runGit(cwd, ["fetch", "--prune"]);
  },

  async checkout(
    cwd: string,
    branch: string,
    create: boolean = false
  ): Promise<void> {
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
  },

  async setUpstream(
    cwd: string,
    branch: string,
    upstream: string
  ): Promise<void> {
    try {
      await runGit(cwd, ["push", "-u", "origin", branch]);
    } catch {
      // Fallback for older git versions or different configs
      await runGit(cwd, ["branch", "--set-upstream-to", upstream, branch]);
    }
  },

  async hasRemote(cwd: string, name: string): Promise<boolean> {
    const out = await runGit(cwd, ["remote"]);
    return out.split("\n").includes(name);
  },

  async hasBranch(cwd: string, name: string): Promise<boolean> {
    // Use --list to check. It returns the branch name if it exists, or empty if not.
    const out = await runGit(cwd, ["branch", "--list", name], {
      ignoreError: true
    });
    return out.trim().length > 0;
  }
};