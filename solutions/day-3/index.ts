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
		// Create type for our return value
		type Instruction = [boolean, number, number];
		
		// First, find all instructions (do, don't, and mul) in order
		const instructionPattern = /(?:do\(\)|don't\(\)|mul\((?<x>\d+),(?<y>\d+)\))/g;
		const instructions = Array.from(input.matchAll(instructionPattern));
		
		const results: Instruction[] = [];
		let shouldExec = true; // Default to true if no do/don't is found
		
		for (const instruction of instructions) {
			const match = instruction[0];
			
			if (match === "do()") {
				shouldExec = true;
				continue;
			}
			
			if (match === "don't()") {
				shouldExec = false;
				continue;
			}
			
			// Must be a mul instruction
			const mulMatch = match.match(/mul\((?<x>\d+),(?<y>\d+)\)/);
			if (!mulMatch?.groups) {
				throw new Error("Failed to extract numbers from mul instruction");
			}
			
			const { x, y } = mulMatch.groups;
			results.push([shouldExec, Number(x), Number(y)]);
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
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		const instructions = input!;
		return instructions.reduce((acc, [_shouldExec, x, y]) => acc + (x * y), 0);
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
function solvePart2(input: ReturnType<typeof formatInput>): number {
	try {
		const instructions = input!;
		return instructions.reduce((acc, [shouldExec, x, y]) => acc + (shouldExec ? x * y : 0), 0);
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
