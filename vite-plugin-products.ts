import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * A termékek forrása a `content/termekek/*.json` (ezeket az admin felület szerkeszti).
 * Ez a plugin build közben egy `virtual:products` modult állít elő belőlük:
 * – az elkelt (sold) és a hibás tételeket kihagyja (figyelmeztetéssel, a build nem áll le),
 * – csak a ténylegesen használt képeket importálja (?product → reszponzív WebP).
 */

const VIRTUAL_ID = "virtual:products";
const RESOLVED_ID = "\0" + VIRTUAL_ID;
const CATEGORIES = ["medalok", "fulbevalok", "karkotok", "brossok", "szettek", "rez-ekszerek"];
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;

interface RawProduct {
  id?: string;
  name?: string;
  category?: string;
  price?: number | string;
  image?: string;
  sold?: boolean;
  colors?: unknown;
  [key: string]: unknown;
}

export function productsPlugin(options: { root: string; contentDir: string }): Plugin {
  const contentDir = path.resolve(options.root, options.contentDir);

  function generate(warn: (msg: string) => void) {
    const files = fs.existsSync(contentDir)
      ? fs.readdirSync(contentDir).filter((f) => f.toLowerCase().endsWith(".json")).sort()
      : [];

    const imports: string[] = [];
    const entries: string[] = [];
    const seen = new Set<string>();
    let sold = 0;

    for (const file of files) {
      const where = `content/termekek/${file}`;
      let p: RawProduct;
      try {
        p = JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf8"));
      } catch (e) {
        warn(`${where}: hibás JSON, kihagyva (${(e as Error).message})`);
        continue;
      }
      if (p.sold) {
        sold++;
        continue;
      }

      const id = String(p.id ?? path.basename(file, ".json")).trim().toLowerCase();
      const price = Number(p.price);
      const problems: string[] = [];
      if (!p.name || !String(p.name).trim()) problems.push("hiányzik a név");
      if (!CATEGORIES.includes(String(p.category))) problems.push(`ismeretlen kategória: ${p.category}`);
      if (!Number.isFinite(price) || price <= 0) problems.push("hiányzik vagy hibás az ár");
      if (seen.has(id)) problems.push(`ismétlődő azonosító: ${id}`);

      const imagePath = p.image ? path.join(options.root, String(p.image).replace(/^\/+/, "")) : "";
      if (!p.image) problems.push("hiányzik a kép");
      else if (!IMAGE_EXT.test(imagePath)) problems.push(`nem támogatott képformátum: ${p.image} (JPG, PNG vagy WebP kell)`);
      else if (!fs.existsSync(imagePath)) problems.push(`a kép nem található: ${p.image}`);

      if (problems.length) {
        warn(`${where}: kihagyva — ${problems.join("; ")}`);
        continue;
      }
      seen.add(id);

      const imgVar = `img${imports.length}`;
      imports.push(`import ${imgVar} from ${JSON.stringify(imagePath.split(path.sep).join("/") + "?product")};`);
      const data = {
        ...p,
        id,
        price,
        colors: Array.isArray(p.colors) ? p.colors.map(String).filter(Boolean) : [],
      };
      delete (data as RawProduct).image;
      delete (data as RawProduct).sold;
      entries.push(`{ ...${JSON.stringify(data)}, image: ${imgVar} }`);
    }

    return {
      code: `${imports.join("\n")}\nexport default [\n${entries.join(",\n")}\n];\nexport const soldCount = ${sold};\n`,
      count: entries.length,
      sold,
    };
  }

  return {
    name: "klara-products",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id !== RESOLVED_ID) return;
      if (fs.existsSync(contentDir)) {
        for (const f of fs.readdirSync(contentDir)) this.addWatchFile(path.join(contentDir, f));
      }
      const result = generate((msg) => this.warn(msg));
      this.info?.(`${result.count} termék betöltve, ${result.sold} elkelt (rejtett)`);
      return result.code;
    },
    configureServer(server) {
      server.watcher.add(contentDir);
      const reload = (file: string) => {
        if (!file.startsWith(contentDir)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", reload);
      server.watcher.on("change", reload);
      server.watcher.on("unlink", reload);
    },
  };
}
