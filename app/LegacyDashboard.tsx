"use client";

import { useEffect, useState } from "react";

const LEGACY_ASSETS = [
  "/legacy/vendor/xlsx.full.min.js",
  "/legacy/ozon-rates-default.js",
  "/legacy/vendor/pdf.min.js",
  "/legacy/dashboard.js",
];

let legacyScriptsPromise: Promise<void> | undefined;

function loadLegacyScripts() {
  if (!legacyScriptsPromise) {
    legacyScriptsPromise = (async () => {
      for (const src of LEGACY_ASSETS) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`无法加载资源：${src}`));
          document.head.appendChild(script);
        });
      }
    })();
  }
  return legacyScriptsPromise;
}

export default function LegacyDashboard({
  markup,
  stylesheet,
}: {
  markup: string;
  stylesheet: string;
}) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!document.querySelector('style[data-legacy-dashboard="true"]')) {
      const style = document.createElement("style");
      style.dataset.legacyDashboard = "true";
      style.textContent = stylesheet;
      document.head.appendChild(style);
    }

    void loadLegacyScripts().catch((bootError: unknown) => {
      setError(bootError instanceof Error ? bootError.message : "页面初始化失败。");
    });
  }, [stylesheet]);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      {error ? (
        <main className="migration-error" role="alert">
          <h1>经营数据台暂时无法打开</h1>
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            重新加载
          </button>
        </main>
      ) : null}
    </>
  );
}
