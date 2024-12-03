/**
 * Solution for Advent of Code 2024 - Day 2
 * @see https://adventofcode.com/2024/day/2
 */

import { runner as runSolution } from "../../utils/index.js";

const CURRENT_DAY = 2;
if (!process.env.CURRENT_YEAR)
	throw new Error("CURRENT_YEAR environment variable is not set");
const CURRENT_YEAR = Number.parseInt(process.env.CURRENT_YEAR);

const testInput =
	"7 6 4 2 1\n1 2 7 8 9\n9 7 6 2 1\n1 3 2 4 5\n8 6 4 4 1\n1 3 6 7 9";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		const reports = input
			.trim()
			.split("\n")
			.map((report) => report.split(" ").map(Number));
		return { reports };
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
		const { reports } = input;
		let safeCount = 0;
		for (let j = 0; j < reports.length; j++) {
			const report = reports[j];
			let isSafe = true;
			const isAcceptableDiff = (diff: number) =>
				Math.abs(diff) < 4 && Math.abs(diff) > 0;
			let wasIncreasing = false;
			for (let i = 1; i < report.length; i++) {
				const diff = report[i] - report[i - 1];
				const isIncreasing = diff > 0;
				const isDecreasing = diff < 0;

				if (!isAcceptableDiff(diff)) {
					isSafe = false;
					break;
				}
				if (isDecreasing && wasIncreasing) {
					isSafe = false;
					break;
				}
				if (isIncreasing && !wasIncreasing && i > 1) {
					isSafe = false;
					break;
				}
				wasIncreasing = isIncreasing;
			}
			if (isSafe) safeCount++;
		}
		return safeCount;
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
		// TODO: Implement solution for part 2
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
	solvePuzzle1,
	solvePuzzle2,
);
