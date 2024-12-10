/**
 * Solution for Advent of Code 2024 - Day 10
 * @see https://adventofcode.com/2024/day/10
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

// NOTE: Implementing memoization or early pruning turn out to be slower due to the
// overhead of maintaining the cache and checking for early exits. Even working backwards from 9
// to 0, the performance was worse than the straightforward approach.

// NOTE: This is all about reachable nines!

const testInput =
	"89010123\n78121874\n87430965\n96549874\n45678903\n32019012\n01329801\n10456732";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		return input.split("\n").map((line) => line.split("").map(Number));
	} catch (error) {
		throw new AoCError(
			`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

const START_VALUE = 0;
const END_VALUE = 9;

/**
 * Finds all valid nine positions (as strings) reachable from a given starting position
 * @param input - 2D array of numbers representing the grid
 * @param startRow - Starting row position
 * @param startCol - Starting column position
 * @returns Array of stringified nine positions
 */
function findNines(
	input: ReturnType<typeof formatInput>,
	startRow: number,
	startCol: number,
): string[] {
	const validNines: string[] = [];

	function explore(row: number, col: number, currentValue: number): void {
		if (currentValue === END_VALUE) {
			validNines.push(`${row},${col}`);
			return;
		}

		const nextValue = currentValue + 1;
		const directions = [
			[-1, 0],
			[1, 0],
			[0, -1],
			[0, 1],
		];

		for (const [dRow, dCol] of directions) {
			const newRow = row + dRow;
			const newCol = col + dCol;

			if (
				newRow >= 0 &&
				newRow < input.length &&
				newCol >= 0 &&
				newCol < input[0].length &&
				input[newRow][newCol] === nextValue
			) {
				explore(newRow, newCol, nextValue);
			}
		}
	}

	explore(startRow, startCol, input[startRow][startCol]);
	return validNines;
}

function calculateTrailheadScoreSum(
	input: ReturnType<typeof formatInput>,
	part: "1" | "2",
) {
	let trailheadScoreSum = 0;

	for (let row = 0; row < input.length; row++) {
		for (let col = 0; col < input[row].length; col++) {
			if (input[row][col] === START_VALUE) {
				trailheadScoreSum +=
					part === "1"
						? new Set(findNines(input, row, col)).size
						: findNines(input, row, col).length;
			}
		}
	}

	return trailheadScoreSum;
}

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		return calculateTrailheadScoreSum(input, "1");
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
 * @param input - Formatted input data
 * @returns Solution to part 2
 */
function solvePart2(input: ReturnType<typeof formatInput>): number {
	try {
		return calculateTrailheadScoreSum(input, "2");
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
