import { readFile } from "node:fs/promises";
import path from "node:path";
import LegacyDashboard from "./LegacyDashboard";

export default async function HomePage() {
  const legacyRoot = path.join(process.cwd(), "public", "legacy");
  try {
    const [markup, stylesheet] = await Promise.all([
      readFile(path.join(legacyRoot, "body.html"), "utf8"),
      readFile(path.join(legacyRoot, "dashboard.css"), "utf8"),
    ]);

    return <LegacyDashboard markup={markup} stylesheet={stylesheet} />;
  } catch (error) {
    // Keep deployments available while the legacy dashboard files are missing.
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }

    return (
      <main className="migration-error" role="alert">
        <h1>经营数据台暂时无法打开</h1>
        <p>部署内容缺少旧版页面文件，请将 public/legacy 文件夹加入项目后重新部署。</p>
      </main>
    );
  }
}
