import { readFile } from "node:fs/promises";
import path from "node:path";
import LegacyDashboard from "./LegacyDashboard";

export default async function HomePage() {
  const legacyRoot = path.join(process.cwd(), "public", "legacy");
  const [markup, stylesheet] = await Promise.all([
    readFile(path.join(legacyRoot, "body.html"), "utf8"),
    readFile(path.join(legacyRoot, "dashboard.css"), "utf8"),
  ]);

  return <LegacyDashboard markup={markup} stylesheet={stylesheet} />;
}
