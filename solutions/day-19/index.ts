/**
 * Solution for Advent of Code 2024 - Day 19
 * @see https://adventofcode.com/2024/day/19
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

const testInput = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		const [towels, designs] = input.split("\n\n");
		// Filter out any empty strings after splitting and trimming
		const towelTypes = towels
			.split(",")
			.map((t) => t.trim())
			.filter((t) => t.length > 0);
		const designPatterns = designs
			.split("\n")
			.map((d) => d.trim())
			.filter((d) => d.length > 0);

		return { towelTypes, designPatterns };
	} catch (error) {
		throw new AoCError(
			`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

function canMakePattern(
	towels: string[],
	pattern: string,
	patternIndex: number,
	path: string[] = [], // Track the towels we're using
): boolean {
	// Base case - successfully matched entire pattern
	if (patternIndex >= pattern.length) {
		console.log(`Found solution using: ${path.join(" + ")}`);
		return true;
	}

	const remaining = pattern.slice(patternIndex);
	// Try each towel
	for (const towel of towels) {
		// Check if this towel exactly matches at the current position
		if (remaining.startsWith(towel)) {
			// Try using this towel
			if (
				canMakePattern(towels, pattern, patternIndex + towel.length, [
					...path,
					towel,
				])
			) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		const { towelTypes, designPatterns } = input;

		return designPatterns.reduce((count, pattern) => {
			console.log(`\nChecking pattern: ${pattern}`);
			const possible = canMakePattern(towelTypes, pattern, 0);
			console.log(
				`Pattern ${pattern} is ${possible ? "possible" : "impossible"}`,
			);
			return count + (possible ? 1 : 0);
		}, 0);
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
		return 0;
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
