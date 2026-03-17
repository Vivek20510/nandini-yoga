import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");

function parseEnvFile(content) {
  const parsed = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    parsed[key] = value;
  }

  return parsed;
}

async function loadLocalEnv() {
  const envFiles = [".env", ".env.local"];
  const loaded = {};

  for (const fileName of envFiles) {
    const filePath = path.join(projectRoot, fileName);

    try {
      const file = await readFile(filePath, "utf8");
      Object.assign(loaded, parseEnvFile(file));
    } catch {
      // Ignore missing env files.
    }
  }

  return { ...loaded, ...process.env };
}

function xmlEscape(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchBlogUrls(env, siteUrl) {
  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
    return [];
  }

  try {
    const app = initializeApp(firebaseConfig, "seo-sitemap");
    const db = getFirestore(app);
    const snapshot = await getDocs(query(collection(db, "posts"), orderBy("date", "desc")));

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const publishedAt = data?.date?.toDate?.();

      return {
        loc: `${siteUrl}/blog/${doc.id}`,
        lastmod: publishedAt instanceof Date ? publishedAt.toISOString() : new Date().toISOString(),
      };
    });
  } catch (error) {
    console.warn("Unable to fetch blog posts for sitemap generation:", error.message);
    return [];
  }
}

async function main() {
  const env = await loadLocalEnv();
  const siteUrl = (env.VITE_SITE_URL || "https://nandini-yoga.vercel.app").replace(/\/$/, "");
  const generatedAt = new Date().toISOString();

  const staticRoutes = [
    { loc: `${siteUrl}/`, lastmod: generatedAt },
    { loc: `${siteUrl}/about`, lastmod: generatedAt },
    { loc: `${siteUrl}/contact`, lastmod: generatedAt },
    { loc: `${siteUrl}/blog`, lastmod: generatedAt },
    { loc: `${siteUrl}/gallery`, lastmod: generatedAt },
  ];

  const blogRoutes = await fetchBlogUrls(env, siteUrl);
  const urls = [...staticRoutes, ...blogRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${xmlEscape(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}/sitemap.xml
`;

  await mkdir(distDir, { recursive: true });
  await writeFile(path.join(distDir, "sitemap.xml"), sitemap, "utf8");
  await writeFile(path.join(distDir, "robots.txt"), robots, "utf8");
}

main().catch((error) => {
  console.error("Failed to generate SEO assets:", error);
  process.exitCode = 1;
});
