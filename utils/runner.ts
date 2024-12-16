import { getInput } from "@utils/index.js";

/**
 * Runs the solution for a specific day of Advent of Code
 * @param year - The year of the puzzle
 * @param day - The day of the puzzle
 * @param formatInput - Function to format the raw input
 * @param solvePart1 - Function to solve part 1
 * @param solvePart2 - Function to solve part 2
 * @param testInput - Optional test input
 */
export default async function runSolution<T>(
	year: number,
	day: number,
	formatInput: (input: string) => T,
	solvePart1: (input: T) => number | string,
	solvePart2: (input: T) => number | string,
	testInput?: string,
): Promise<void> {
	try {
		// Check for --test flag in command line arguments
		const useTest = process.argv.includes("--test");
		
		// Only use testInput if both testInput is provided and --test flag is present
		const rawInput = useTest && testInput ? testInput : await getInput(year, day);
		const formattedInput = formatInput(rawInput);

		if (useTest) {
			console.log("Running with test input...");
		}

		const solution1 = solvePart1(formattedInput);
		console.log("Solution 1:", solution1);

		const solution2 = solvePart2(formattedInput);
		console.log("Solution 2:", solution2);
	} catch (error) {
		console.error(
			"Error:",
			error instanceof Error ? error.message : "Unknown error",
		);
		process.exit(1);
	}
}
