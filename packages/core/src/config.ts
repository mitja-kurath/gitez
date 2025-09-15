import { cosmiconfig } from "cosmiconfig";
import { z } from "zod";
import type { Config } from "./types.js";
const ConfigSchema = z.object({
  defaultBase: z.string().default("main"),
  branchingModel: z.enum(["trunk", "githubFlow"]).default("trunk"),
  branchPrefix: z.string().default("feature")
});
export async function loadConfig(cwd: string): Promise<Config> {
  const explorer = cosmiconfig("gitez", {
    searchPlaces: ["package.json", ".gitez.json", ".gitezrc", ".gitezrc.json"]
  });
  const result = await explorer.search(cwd);
  const data = result?.config ?? {};
  return ConfigSchema.parse(data);
}
