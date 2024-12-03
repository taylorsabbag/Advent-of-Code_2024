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
	const endpoint = `${BASE_URL}/${year}/day/${day}/input`;

	try {
		const response = await fetch(endpoint, {
			headers: {
				Cookie: `session=${SESSION}`,
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status} at URL: ${endpoint}`);
		}

		return response.text();
	} catch (error) {
		throw new Error(
			`Failed to fetch puzzle input from URL: ${endpoint}. Error: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}
