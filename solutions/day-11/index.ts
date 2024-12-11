/**
 * Solution for Advent of Code 2024 - Day 11
 * @see https://adventofcode.com/2024/day/11
 */

import {
	AoCError,
	extractDayNumber,
	getCurrentYear,
	runner as runSolution,
	timed,
} from "@utils/index.js";

const CURRENT_DAY = extractDayNumber(import.meta.url);
const CURRENT_YEAR = getCurrentYear();

const testInput = "125 17";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		return input.split(" ").map(Number);
	} catch (error) {
		throw new AoCError(
			`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

const memoize = new Map<string, number>();

const count = (currentNum: number, depth: number): number => {
	const key = `${currentNum},${depth}`;
	if (memoize.has(key)) {
		return memoize.get(key)!;
	}

	// Base cases
	if (depth === 0) return 1;
	if (currentNum === 0) return count(1, depth - 1);

	// Calculate number of digits
	const length = Math.floor(Math.log10(currentNum)) + 1;

	let result: number;
	if (length % 2) {
		// Odd number of digits: multiply by 2024
		result = count(currentNum * 2024, depth - 1);
	} else {
		// Even number of digits: split in half
		const power = 10 ** Math.floor(length / 2);
		result = count(Math.floor(currentNum / power), depth - 1) + 
				count(currentNum % power, depth - 1);
	}

	memoize.set(key, result);
	return result;
};

/**
 * Solves part 1 of the puzzle
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		return input.reduce((sum, num) => sum + count(num, 25), 0);
	} catch (error) {
		throw new AoCError(
			`Error solving part 1: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

/**
 * Solves part 2 of the puzzle
 */
function solvePart2(input: ReturnType<typeof formatInput>): number {
	try {
		return input.reduce((sum, num) => sum + count(num, 75), 0);
	} catch (error) {
		throw new AoCError(
			`Error solving part 2: ${error instanceof Error ? error.message : "Unknown error"}`,
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
	timed(solvePart1),
	timed(solvePart2),
);
