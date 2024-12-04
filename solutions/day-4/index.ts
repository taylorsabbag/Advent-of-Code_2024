/**
 * Solution for Advent of Code 2024 - Day 4
 * @see https://adventofcode.com/2024/day/4
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

const testInput =
	"MMMSXXMASM\nMSAMXMSMSA\nAMXSXMAAMM\nMSAMASMSMX\nXMASAMXAMM\nXXAMMXXAMA\nSMSMSASXSS\nSAXAMASAAA\nMAMMMXMMMM\nMXMXAXMASX";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		return input.split("\n").map((line) => line.split(""));
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
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		const targetWords = ["XMAS", "SAMX"];
		const directions = [
			{ row: 0, col: 1 }, // right
			{ row: 0, col: -1 }, // left
			{ row: 1, col: 0 }, // down
			{ row: -1, col: 0 }, // up
			{ row: 1, col: 1 }, // diagonal down-right
			{ row: -1, col: -1 }, // diagonal up-left
			{ row: 1, col: -1 }, // diagonal down-left
			{ row: -1, col: 1 }, // diagonal up-right
		];

		/**
		 * Gets a word at the given position and direction
		 */
		function getWord(
			startRow: number,
			startCol: number,
			direction: { row: number; col: number },
		): string[] | null {
			const word: string[] = [];

			for (let i = 0; i < 4; i++) {
				const row = startRow + direction.row * i;
				const col = startCol + direction.col * i;

				if (
					row < 0 ||
					row >= input.length ||
					col < 0 ||
					col >= input[0].length
				) {
					return null;
				}

				word.push(input[row][col]);
			}

			const wordStr = word.join("");
			if (targetWords.includes(wordStr)) {
				return word;
			}

			return null;
		}

		// First find all words
		const words: Array<{
			row: number;
			col: number;
			direction: { row: number; col: number };
		}> = [];

		// Check each position in the grid
		for (let row = 0; row < input.length; row++) {
			for (let col = 0; col < input[0].length; col++) {
				for (const dir of directions) {
					const word = getWord(row, col, dir);
					if (word) {
						words.push({ row, col, direction: dir });
					}
				}
			}
		}

		return words.length / 2;
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
		function isValidPattern(centerRow: number, centerCol: number): boolean {
			if (input[centerRow][centerCol] !== "A") return false;

			// Get the letters in both diagonals
			const diagonal1 = [
				input[centerRow - 1][centerCol - 1], // top-left
				input[centerRow + 1][centerCol + 1], // bottom-right
			];
			const diagonal2 = [
				input[centerRow - 1][centerCol + 1], // top-right
				input[centerRow + 1][centerCol - 1], // bottom-left
			];

			// Check for valid combinations:
			// MAS/SAM in either direction on both diagonals
			const isValid =
				// M-S or S-M on diagonal 1
				((diagonal1[0] === "M" && diagonal1[1] === "S") ||
					(diagonal1[0] === "S" && diagonal1[1] === "M")) &&
				// M-S or S-M on diagonal 2
				((diagonal2[0] === "M" && diagonal2[1] === "S") ||
					(diagonal2[0] === "S" && diagonal2[1] === "M"));

			return isValid;
		}

		let count = 0;
		// Check each position as potential center of X
		for (let row = 1; row < input.length - 1; row++) {
			for (let col = 1; col < input[0].length - 1; col++) {
				if (isValidPattern(row, col)) {
					count++;
				}
			}
		}

		return count;
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
