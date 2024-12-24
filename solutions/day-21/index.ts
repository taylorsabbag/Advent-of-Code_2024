/**
 * Solution for Advent of Code 2024 - Day 21
 * @see https://adventofcode.com/2024/day/N
 */

import {
	AoCError,
	GRID_DIRECTIONS,
	type Grid,
	bfs,
	extractDayNumber,
	findPositions,
	getCurrentYear,
	runner as runSolution,
	timed,
} from "@utils/index.js";

const CURRENT_DAY = extractDayNumber(import.meta.url);
const CURRENT_YEAR = getCurrentYear();

const testInput = `029A
980A
179A
456A
379A`;

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		return input.split("\n").map((seq) => seq.split(""));
	} catch (error) {
		throw new AoCError(
			`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

const NUM_CHARS = 11;

const LUT3: number[] = [
	1, 25, 12, 19, 26, 13, 20, 27, 14, 21, 10, 21, 1, 10, 11, 12, 19, 20, 13, 20,
	21, 22, 16, 18, 1, 10, 21, 12, 19, 22, 13, 20, 17, 21, 19, 18, 1, 22, 21, 12,
	23, 22, 13, 16, 22, 16, 17, 18, 1, 10, 11, 12, 19, 20, 23, 17, 21, 16, 17, 18,
	1, 10, 21, 12, 19, 18, 22, 22, 21, 16, 19, 18, 1, 22, 21, 12, 17, 23, 17, 18,
	19, 16, 17, 18, 1, 10, 11, 24, 18, 22, 17, 18, 21, 16, 17, 18, 1, 10, 19, 23,
	23, 22, 17, 22, 21, 16, 19, 18, 1, 18, 18, 26, 21, 12, 27, 22, 13, 28, 23, 14,
	1,
];

const LUT26: bigint[] = [
	1n,
	31420065369n,
	14752615084n,
	24095973437n,
	31420065370n,
	14752615085n,
	24095973438n,
	31420065371n,
	14752615086n,
	24095973439n,
	14287938116n,
	27052881363n,
	1n,
	14287938116n,
	14287938117n,
	14752615084n,
	24095973437n,
	24095973438n,
	14752615085n,
	24095973438n,
	24095973439n,
	27052881364n,
	20790420654n,
	22411052532n,
	1n,
	14287938116n,
	28154654777n,
	14752615084n,
	24095973437n,
	28154654778n,
	14752615085n,
	24095973438n,
	22778092491n,
	27622800565n,
	22411052533n,
	22411052532n,
	1n,
	28154654778n,
	28154654777n,
	14752615084n,
	28154654779n,
	28154654778n,
	14752615085n,
	20790420654n,
	27052881364n,
	20790420654n,
	22778092491n,
	22778092492n,
	1n,
	14287938116n,
	14287938117n,
	14752615084n,
	24095973437n,
	24095973438n,
	27052881365n,
	20790420655n,
	27622800565n,
	20790420654n,
	22778092491n,
	22411052532n,
	1n,
	14287938116n,
	28154654777n,
	14752615084n,
	24095973437n,
	22778092492n,
	27622800566n,
	27622800566n,
	27622800565n,
	20790420654n,
	22411052533n,
	22411052532n,
	1n,
	28154654778n,
	28154654777n,
	14752615084n,
	20790420655n,
	27052881365n,
	20790420655n,
	22778092492n,
	22778092493n,
	20790420654n,
	22778092491n,
	22778092492n,
	1n,
	14287938116n,
	14287938117n,
	27052881366n,
	20790420656n,
	27622800566n,
	20790420655n,
	22778092492n,
	27622800565n,
	20790420654n,
	22778092491n,
	22411052532n,
	1n,
	14287938116n,
	22778092493n,
	27622800567n,
	27622800567n,
	27622800566n,
	20790420655n,
	27622800566n,
	27622800565n,
	20790420654n,
	22411052533n,
	22411052532n,
	1n,
	20790420656n,
	22411052532n,
	31420065370n,
	28154654777n,
	14752615084n,
	31420065371n,
	28154654778n,
	14752615085n,
	31420065372n,
	28154654779n,
	14752615086n,
	1n,
];

/**
 * Encodes a character into a numeric value
 * @param char - Character to encode
 * @returns Encoded numeric value
 */
function encode(char: string): number {
	const o = char.charCodeAt(0);
	return (o % 16) + Math.floor(o / 64) * 9;
}

/**
 * Solves both parts of the puzzle using matrix operations
 * @param input - Array of input sequences
 * @returns Tuple of [part1 solution, part2 solution]
 */
function solveOptimized(input: string[][]): [number, bigint] {
	// Filter out empty sequences
	const validSequences = input.filter((seq) => seq.length > 0);

	// Initialize counts with BigInts
	const counts = new Array(NUM_CHARS * NUM_CHARS).fill(0n);

	for (const sequence of validSequences) {
		const seq = sequence.join("");
		// Add validation for the input format
		if (!seq || seq.length === 0) {
			throw new Error("Invalid input sequence: empty string");
		}

		// Ensure we have a valid number before the last character
		const numStr = seq.slice(0, -1);
		if (!/^\d+$/.test(numStr)) {
			throw new Error(`Invalid number format in sequence: ${seq}`);
		}

		const numVal = BigInt(numStr);

		const chars = ["A", ...seq];
		for (let i = 0; i < chars.length - 1; i++) {
			const c = encode(chars[i]);
			const cn = encode(chars[i + 1]);
			const index = c * NUM_CHARS + cn;

			// Validate index is within bounds
			if (index >= counts.length) {
				throw new Error(`Index out of bounds: ${index} for sequence ${seq}`);
			}

			counts[index] += numVal;
		}
	}

	// Calculate part 1 using LUT3
	const part1 = Number(
		counts.reduce((sum, count, i) => {
			if (i >= LUT3.length) {
				throw new Error(`LUT3 index out of bounds: ${i}`);
			}
			return sum + count * BigInt(LUT3[i]);
		}, 0n),
	);

	// Calculate part 2 using LUT26
	const part2 = counts.reduce((sum, count, i) => {
		if (i >= LUT26.length) {
			throw new Error(`LUT26 index out of bounds: ${i}`);
		}
		return sum + count * LUT26[i];
	}, 0n);

	return [part1, part2];
}

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Part 1 solution
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		return solveOptimized(input)[0];
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
		return Number(solveOptimized(input)[1]);
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
	testInput,
);
