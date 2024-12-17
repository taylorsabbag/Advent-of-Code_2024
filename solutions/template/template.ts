/**
 * Solution for Advent of Code 2024 - Day N
 * @see https://adventofcode.com/2024/day/N
 */

import {
	AoCError,
	createSolutionWrapper,
	extractDayNumber,
	getCurrentYear,
	runner as runSolution,
	timed,
} from "@utils/index.js";

const CURRENT_DAY = extractDayNumber(import.meta.url);
const CURRENT_YEAR = getCurrentYear();

const testInput = "";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		return 0;
	} catch (error) {
		throw new AoCError(
			`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 * @throws AoCError if solution cannot be found
 */
const solvePart1 = createSolutionWrapper<
	ReturnType<typeof formatInput>,
	number
>(
	CURRENT_DAY,
	1,
	"solving part 1",
)((input) => {
	// Your solution logic here
	return 0;
});

/**
 * Solves part 2 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 2
 * @throws AoCError if solution cannot be found
 */
const solvePart2 = createSolutionWrapper<
	ReturnType<typeof formatInput>,
	number
>(
	CURRENT_DAY,
	2,
	"solving part 2",
)((input) => {
	// Your solution logic here
	return 0;
});


runSolution(
	CURRENT_YEAR,
	CURRENT_DAY,
	formatInput,
	timed(solvePart1),
	timed(solvePart2),
	testInput,
);
