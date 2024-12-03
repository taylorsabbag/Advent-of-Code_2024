/**
 * Solution for Advent of Code 2024 - Day 3
 * @see https://adventofcode.com/2024/day/3
 */

import {
	runner as runSolution,
	extractDayNumber,
	getCurrentYear,
	timed,
	AoCError,
} from "@utils/index.js";

const CURRENT_DAY = extractDayNumber(import.meta.url);
const CURRENT_YEAR = getCurrentYear();

const testInput =
	"xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		const matches = input.match(
			// Match for all mul(x,y)
			/mul\((?<x>\d+),(?<y>\d+)\)/g,
		);
		return matches?.map((match) => {
			const [_, x, y] = match.match(/mul\((?<x>\d+),(?<y>\d+)\)/)!.slice(1);
			return [Number(x), Number(y)];
		});
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
 */
function solvePuzzle1(input: ReturnType<typeof formatInput>): number {
	try {
		const mulPairs = input!;
		return mulPairs.reduce((acc, [x, y]) => acc + (x * y), 0);
	} catch (error) {
		throw new AoCError(
			`Error solving puzzle 1: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

/**
 * Solves part 2 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 2
 */
function solvePuzzle2(input: ReturnType<typeof formatInput>): number {
	try {
		return 0;
	} catch (error) {
		throw new AoCError(
			`Error solving puzzle 2: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			2,
			error instanceof Error ? error : undefined,
		);
	}
}

runSolution(
	CURRENT_YEAR,
	CURRENT_DAY,
	formatInput,
	timed(solvePuzzle1),
	timed(solvePuzzle2),
);
