export type ActionStep = {
  title: string;
  cmd?: string[];
  run: (ctx: ActionContext) => Promise<void>;
  undo?: (ctx: ActionContext) => Promise<void>;
};
export type ActionPlan = { name: string; steps: ActionStep[]; preview: string[] };
export type ActionResult = {
  plan: ActionPlan;
  execute: (ctx: ActionContext) => Promise<void>;
  undo: (ctx: ActionContext) => Promise<void>;
};
export type Config = { defaultBase: string; branchingModel: "trunk" | "githubFlow"; branchPrefix: string };
export type ActionContext = { cwd: string; vcs: VCS; config: Config; env?: Record<string, string> };
export interface VCS {
  getCurrentBranch(cwd: string): Promise<string>;
  fetch(cwd: string): Promise<void>;
  checkout(cwd: string, branch: string, create?: boolean): Promise<void>;
  revParse(cwd: string, rev: string): Promise<string>;
  isClean(cwd: string): Promise<boolean>;
  setUpstream(cwd: string, branch: string, upstream: string): Promise<void>;
}
