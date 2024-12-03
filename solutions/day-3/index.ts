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

enum InstructionType {
	Do = "do",
	Dont = "dont",
	Mul = "mul",
}

interface MulInstruction {
	shouldExecute: boolean;
	x: number;
	y: number;
}

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string): MulInstruction[] {
	try {
		if (typeof input !== "string") {
			throw new Error("Input must be a string");
		}

		const pattern = /(?:do\(\)|don't\(\)|mul\((\d+),(\d+)\))/g;
		const results: MulInstruction[] = [];
		let shouldExec = true;
		let match: RegExpExecArray | null;

		while (true) {
			match = pattern.exec(input);
			if (match === null) break;

			const [full, x, y] = match;

			if (full === "do()") {
				shouldExec = true;
			} else if (full === "don't()") {
				shouldExec = false;
			} else if (x && y) {
				results.push({
					shouldExecute: shouldExec,
					x: Number(x),
					y: Number(y),
				});
			}
		}

		return results;
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
function solvePart1(input: MulInstruction[]): number {
	try {
		let sum = 0;
		for (const { x, y } of input) {
			sum += x * y;
		}
		return sum;
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
function solvePart2(input: MulInstruction[]): number {
	try {
		let sum = 0;
		for (const { shouldExecute, x, y } of input) {
			if (shouldExecute) {
				sum += x * y;
			}
		}
		return sum;
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
	timed(solvePart1),
	timed(solvePart2),
);
