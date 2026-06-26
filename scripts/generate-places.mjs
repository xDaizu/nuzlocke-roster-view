#!/usr/bin/env node
/**
 * Generate a places list (locations) for a given Pokémon region from PokeAPI.
 *
 * PokeAPI exposes locations per *region*, not per version-group, so a region's
 * full location set is shared across all games set in that region (e.g. Hoenn
 * is shared by RSE / Emerald / ORAS). There is no API field to isolate the
 * locations of a single game, so the region's full set is the best available
 * approximation for any game in it.
 *
 * Output shape matches src/data/places_es.json exactly:
 *   [ { "id": "<kebab-case location name>", "nombre": "<Spanish name>" }, ... ]
 *
 * Usage:
 *   node scripts/generate-places.mjs --region <region> --out <path> [--lang <code>]
 *
 * Examples:
 *   node scripts/generate-places.mjs --region hoenn  --out src/data/oras/places_es.json
 *   node scripts/generate-places.mjs --region sinnoh --out src/data/dp/places_es.json
 *
 * Requires Node 18+ (native global fetch).
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const API = "https://pokeapi.co/api/v2";
const CONCURRENCY = 8;

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

function parseArgs(argv) {
  const args = { lang: "es" };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key === "--region") args.region = argv[++i];
    else if (key === "--out") args.out = argv[++i];
    else if (key === "--lang") args.lang = argv[++i];
    else throw new Error(`Unknown argument: ${key}`);
  }
  if (!args.region) throw new Error("Missing required --region <region>");
  if (!args.out) throw new Error("Missing required --out <path>");
  return args;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/** Title-case a kebab-case id as a last-resort display name. */
function titleCase(name) {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Pick the localized name from a PokeAPI `names[]` array, with fallbacks. */
function pickName(detail, lang) {
  const names = detail.names ?? [];
  const exact = names.find((n) => n.language?.name === lang);
  if (exact?.name) return { nombre: exact.name, fallback: null };

  // For Spanish, fall back to the Latin-American variant before title-casing.
  if (lang === "es") {
    const es419 = names.find((n) => n.language?.name === "es-419");
    if (es419?.name) return { nombre: es419.name, fallback: "es-419" };
  }

  return { nombre: titleCase(detail.name), fallback: "title-case" };
}

/** Run an array of items through a worker with bounded concurrency. */
async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function runner() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runner));
  return results;
}

async function main() {
  const { region, out, lang } = parseArgs(process.argv.slice(2));
  const outPath = isAbsolute(out) ? out : resolve(REPO_ROOT, out);

  console.log(`Fetching "${region}" region locations...`);
  const regionData = await fetchJson(`${API}/region/${region}/`);
  const locations = regionData.locations ?? [];
  if (locations.length === 0) {
    throw new Error(`Region "${region}" returned no locations.`);
  }
  console.log(`Found ${locations.length} locations. Fetching details...`);

  const fallbacks = [];
  const entries = await mapLimit(locations, CONCURRENCY, async (loc) => {
    const detail = await fetchJson(loc.url);
    const { nombre, fallback } = pickName(detail, lang);
    if (fallback) fallbacks.push(`${loc.name} (${fallback}): "${nombre}"`);
    return { id: loc.name, nombre };
  });

  // Serialize matching src/data/places_es.json: one object per line, 4-space indent.
  const body = entries.map((e) => `    ${JSON.stringify(e)}`).join(",\n");
  const json = `[\n${body}\n]\n`;

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, json, "utf8");

  console.log(`\nWrote ${entries.length} entries to ${outPath}`);
  if (fallbacks.length) {
    console.log(`\n${fallbacks.length} entries lacked a "${lang}" name (used fallback):`);
    for (const f of fallbacks) console.log(`  - ${f}`);
  } else {
    console.log(`All entries have a native "${lang}" name.`);
  }
  console.log(
    `\nNote: this is the full "${region}" region set; PokeAPI cannot isolate the ` +
      "locations of a single game within a region.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
