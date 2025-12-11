const fs = require("fs");
const path = require("path");

const SUPABASE_URL =
  "https://pgjrfwogbwhclkvgqedi.supabase.co/storage/v1/object/public/media/";

function fixFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !filePath.includes("node_modules") &&
      !filePath.includes(".git")
    ) {
      fixFiles(filePath);
    } else if (
      file.endsWith(".tsx") ||
      file.endsWith(".ts") ||
      file.endsWith(".jsx") ||
      file.endsWith(".js") ||
      file.endsWith(".css")
    ) {
      let content = fs.readFileSync(filePath, "utf8");
      const original = content;

      content = content.replace(
        /["']\/attached_assets\/([^"']+)["']/g,
        `"${SUPABASE_URL}$1"`,
      );
      content = content.replace(
        /url\(\/attached_assets\/([^)]+)\)/g,
        `url(${SUPABASE_URL}$1)`,
      );

      if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log("Fixed:", filePath);
      }
    }
  }
}

// Search all common folders
fixFiles("./client");
fixFiles("./src");
fixFiles("./app");
fixFiles("./pages");
fixFiles("./components");
fixFiles("./public");
fixFiles("./styles");
console.log("Done!");
