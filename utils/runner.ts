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
		const rawInput = testInput ?? (await getInput(year, day));
		const formattedInput = formatInput(rawInput);

		const solution1 = solvePart1(formattedInput);
		console.log("Solution 1:", solution1);
		// const isCorrect1 = await checkAnswer(year, day, solution1.toString(), 1);
		// console.log("Is correct 1:", isCorrect1);

		const solution2 = solvePart2(formattedInput);
		console.log("Solution 2:", solution2);
		// const isCorrect2 = await checkAnswer(year, day, solution2.toString(), 2);
		// console.log("Is correct 2:", isCorrect2);
	} catch (error) {
		console.error(
			"Error:",
			error instanceof Error ? error.message : "Unknown error",
		);
		process.exit(1);
	}
}
