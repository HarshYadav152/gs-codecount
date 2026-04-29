import fs from "fs";
import fg from "fast-glob";
import cliProgress from "cli-progress";

export async function countLines(extensions) {
  const patterns = extensions.map(ext => `**/*.${ext}`);

  const files = await fg(patterns, {
    ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**"]
  });

  if (files.length === 0) {
    return { result: {}, total: 0 };
  }

  // Initialize the progress bar
  const bar = new cliProgress.SingleBar({
    format: 'Counting [{bar}] {percentage}% | {value}/{total} Files',
  }, cliProgress.Presets.shades_classic);

  bar.start(files.length, 0);

  const result = {};
  let total = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split("\n").length;

    const ext = file.split(".").pop();

    result[ext] = (result[ext] || 0) + lines;
    total += lines;

    // Increment the progress bar for each file processed
    bar.increment();
  }

  // Stop the progress bar when done
  bar.stop();

  return { result, total };
}