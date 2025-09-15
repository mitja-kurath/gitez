import type { ActionContext, ActionResult, ActionStep } from "../types.js";

export type StartFeatureOptions = { name: string };

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "");
}

export async function startFeature(
  ctx: ActionContext,
  opts: StartFeatureOptions
): Promise<ActionResult> {
  const { vcs, cwd, config } = ctx;
  const base = config.defaultBase;
  const cleanName = slugify(opts.name || "");
  if (!cleanName) {
    throw new Error("Feature name is required.");
  }
  const branchName = `${config.branchPrefix}/${cleanName}`;

  const preview: string[] = [
    `Ensure clean working tree`,
    `Fetch origin`,
    `Checkout ${base}`,
    `Create and switch to ${branchName}`,
    `Set upstream to origin/${branchName}`
  ];

  const steps: ActionStep[] = [
    {
      title: "Validate clean tree",
      run: async () => {
        if (!(await vcs.isClean(cwd))) {
          throw new Error(
            "Working tree not clean. Commit or stash before starting a feature."
          );
        }
      }
    },
    { title: "Fetch origin", run: async () => vcs.fetch(cwd) },
    { title: `Checkout ${base}`, run: async () => vcs.checkout(cwd, base, false) },
    {
      title: `Create ${branchName}`,
      run: async () => vcs.checkout(cwd, branchName, true),
      undo: async () => vcs.checkout(cwd, base, false)
    },
    {
      title: "Set upstream",
      run: async () => vcs.setUpstream(cwd, branchName, `origin/${branchName}`)
    }
  ];

  const execute = async () => {
    for (const step of steps) await step.run(ctx);
  };
  const undo = async () => {
    for (const step of steps.slice().reverse()) {
      if (step.undo) await step.undo(ctx);
    }
  };

  return {
    plan: { name: "startFeature", steps, preview },
    execute,
    undo
  };
}