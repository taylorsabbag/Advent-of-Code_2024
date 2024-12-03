import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Get the directory path of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve the cache directory path relative to the project root
const CACHE_DIR = path.resolve(__dirname, "../.cache");

/**
 * Retrieves cached input for a specific day
 * @param year - The year of the puzzle
 * @param day - The day of the puzzle
 * @returns Cached input or null if not found
 */
export async function getCachedInput(
	year: number,
	day: number,
): Promise<string | null> {
	try {
		const cachePath = path.join(CACHE_DIR, `${year}-${day}.txt`);
		return await fs.readFile(cachePath, "utf-8");
	} catch {
		return null;
	}
}

/**
 * Caches input for a specific day
 * @param year - The year of the puzzle
 * @param day - The day of the puzzle
 * @param input - The input to cache
 */
export async function cacheInput(
	year: number,
	day: number,
	input: string,
): Promise<void> {
	try {
		await fs.mkdir(CACHE_DIR, { recursive: true });
		const cachePath = path.join(CACHE_DIR, `${year}-${day}.txt`);
		await fs.writeFile(cachePath, input);
	} catch (error) {
		console.warn(
			`Failed to cache input for day ${day}: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
	}
}
