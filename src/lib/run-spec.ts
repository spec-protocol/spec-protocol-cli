import { spawn } from "node:child_process";
import type { ProtocolConfig } from "./config.js";

const SPEC_KIT_INSTALL_URL =
  "https://github.com/github/spec-kit#-specify-cli-reference";

export function runSpecKit(
  config: ProtocolConfig,
  inputFilePath: string,
): Promise<number> {
  const { command, args } = config.specKit;
  const childArgs = [...args, inputFilePath];

  return new Promise((resolve, reject) => {
    const child = spawn(command, childArgs, {
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "ENOENT") {
        reject(
          new Error(
            `Command "${command}" not found in PATH.\n` +
              `Install Spec-Kit Specify CLI: ${SPEC_KIT_INSTALL_URL}\n` +
              `Or adjust specKit.command in .spec-protocol/config.json`,
          ),
        );
        return;
      }
      reject(err);
    });

    child.on("close", (code) => {
      resolve(code ?? 1);
    });
  });
}
