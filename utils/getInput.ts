import { getCachedInput, cacheInput } from "@utils/cache.js";

const BASE_URL = "https://adventofcode.com";
const SESSION = process.env.AOC_SESSION;

if (!SESSION) {
	throw new Error("AOC_SESSION environment variable is not set");
}

/**
 * Fetches the input for a specific Advent of Code puzzle
 * @param year - The year of the puzzle
 * @param day - The day of the puzzle
 * @returns Promise containing the puzzle input as a string
 * @throws Error if the fetch fails or if SESSION is not set
 */
export default async function getInput(
	year: number,
	day: number,
): Promise<string> {
	// Try to get cached input first
	const cached = await getCachedInput(year, day);
	if (cached) {
		console.log(`Using cached input for day ${day}`);
		return cached;
	}

	// If no cache, fetch from API
	console.log(`Fetching input for day ${day}`);
	const endpoint = `${BASE_URL}/${year}/day/${day}/input`;

	try {
		const response = await fetch(endpoint, {
			headers: {
				Cookie: `session=${SESSION}`,
			},
		});

		if (!response.ok) {
			throw new Error(
				`HTTP error! status: ${response.status} at URL: ${endpoint}`,
			);
		}

		const input = await response.text();

		// Cache the fetched input
		await cacheInput(year, day, input);

		return input;
	} catch (error) {
		throw new Error(
			`Failed to fetch puzzle input from URL: ${endpoint}. Error: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
	}
}
