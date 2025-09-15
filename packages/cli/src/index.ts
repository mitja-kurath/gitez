#!/usr/bin/env node
import { Command, Option, Usage, runExit } from "clipanion";
import { loadConfig, startFeature, type ActionContext } from "@gitez/core";
import { GitAdapter } from "@gitez/adapter-git";
import path from "node:path";
import process from "node:process";
import { bold, green, cyan, yellow, red } from "kleur/colors";
import enquirer from "enquirer";
const { prompt } = enquirer as unknown as { prompt: typeof import("enquirer")["prompt"] };

class StartCommand extends Command {
  static paths = [["start"], ["feature"]];
  name = Option.String({ required: false });
  dryRun = Option.Boolean("--dry-run", false, { description: "Preview only" });
  static usage: Usage = Command.Usage({
    description: "Create a new feature branch from the base branch",
    examples: [
      ["Interactive", "gitez start"],
      ["Named", "gitez start cool-thing"],
      ["Dry run", "gitez start cool-thing --dry-run"]
    ]
  });
  async execute() {
    const cwd = process.cwd();
    const config = await loadConfig(cwd);
    const ctx: ActionContext = { cwd, config, vcs: GitAdapter };
    const feature =
      this.name ||
      ((await prompt<{ name: string }>([{ type: "input", name: "name", message: "Feature name (slug):" }])).name as string);
    const result = await startFeature(ctx, { name: feature });
    if (this.dryRun) {
      this.context.stdout.write(bold(cyan("Plan:\n")));
      for (const line of result.plan.preview) this.context.stdout.write(" - " + line + "\n");
      return 0;
    }
    this.context.stdout.write(bold(green("Executing startFeature...\n")));
    try {
      await result.execute(ctx);
      this.context.stdout.write(green(`✔ Created branch feature/${feature}\n`));
      return 0;
    } catch (e: any) {
      this.context.stderr.write(red(`✖ ${e.message}\n`));
      this.context.stderr.write(yellow("Attempting undo...\n"));
      try { await result.undo(ctx); this.context.stderr.write(yellow("Undo complete.\n")); }
      catch (e2: any) { this.context.stderr.write(red(`Undo failed: ${e2.message}\n`)); }
      return 1;
    }
  }
}

class TuiCommand extends Command {
  static paths = [["tui"]];
  async execute() {
    const { runTui } = await import("@gitez/tui");
    await runTui(process.cwd());
  }
}

class Gitez extends Command {
  static paths = [Command.Default];
  async execute() {
    this.context.stdout.write(`gitez: run 'gitez start' or 'gitez tui' for the UI\n`);
  }
}

void runExit([Gitez, StartCommand, TuiCommand]);
