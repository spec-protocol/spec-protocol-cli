import figlet from "figlet";
import gradient from "gradient-string";
import chalk from "chalk";
import stringWidth from "string-width";

const LOGO_TEXT = "AISP";
const SUBTITLE = "AI Spec Protocol — Assisted Specification";
const HINT = "Run 'spec-protocol --help' for usage information";

function centerLine(text: string, width: number): string {
  const textWidth = stringWidth(text);
  if (textWidth >= width) return text;
  const pad = Math.max(0, Math.floor((width - textWidth) / 2));
  return " ".repeat(pad) + text;
}

function centerBlock(lines: string[], width: number): string[] {
  return lines.map((line) => centerLine(line, width));
}

function renderLogo(): string {
  try {
    return figlet.textSync(LOGO_TEXT, {
      font: "ANSI Shadow",
      horizontalLayout: "fitted",
    });
  } catch {
    return figlet.textSync(LOGO_TEXT, { font: "Standard" });
  }
}

export function printBanner(options?: { hint?: boolean }): void {
  const cols = process.stdout.columns || 80;
  const showHint = options?.hint !== false;

  console.log("");
  const rawLogo = renderLogo();
  const gradientFn = gradient(["#5B9BD5", "#9DC3E6", "#FFFFFF"]);
  const logoLines = rawLogo.split("\n").map((line) => gradientFn(line));
  centerBlock(logoLines, cols).forEach((line) => console.log(line));

  console.log("");
  console.log(
    centerLine(chalk.hex("#E8A838").italic(SUBTITLE), cols),
  );

  if (showHint) {
    console.log("");
    console.log(centerLine(chalk.gray(HINT), cols));
    console.log("");
  }
}
