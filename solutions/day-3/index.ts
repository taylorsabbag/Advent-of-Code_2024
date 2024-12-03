/**
 * Solution for Advent of Code 2024 - Day 3
 * @see https://adventofcode.com/2024/day/3
 */

import {
	runner as runSolution,
	extractDayNumber,
	getCurrentYear,
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
		throw new Error(
			`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`,
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
		return 0;
	} catch (error) {
		throw new Error(
			`Error solving puzzle 1: ${error instanceof Error ? error.message : "Unknown error"}`,
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
		throw new Error(
			`Error solving puzzle 2: ${error instanceof Error ? error.message : "Unknown error"}`,
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
