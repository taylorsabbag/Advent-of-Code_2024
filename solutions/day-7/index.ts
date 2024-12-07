/**
 * Solution for Advent of Code 2024 - Day 7
 * @see https://adventofcode.com/2024/day/7
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
	"190: 10 19\n3267: 81 40 27\n83: 17 5\n156: 15 6\n7290: 6 8 6 15\n161011: 16 10 13\n192: 17 8 14\n21037: 9 7 18 13\n292: 11 6 16 20";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		return input
			.split("\n")
			.filter((line) => line.includes(":")) // Filter out invalid lines
			.map((line) => {
				const [result, operandsStr] = line.split(":");
				if (!result || !operandsStr) {
					throw new Error(`Invalid line format: ${line}`);
				}
				return {
					result: Number(result.trim()),
					operands: operandsStr
						.trim()
						.split(" ")
						.filter((op) => op.length > 0) // Filter out empty strings
						.map(Number),
				};
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

const possibleOperators = {
	"+": (a: number, b: number) => a + b,
	"*": (a: number, b: number) => a * b,
	"||": (a: number, b: number) => Number(`${a}${b}`),
} as const;

/**
 * Sums all reachable results from the input
 * @param input - Formatted input data
 * @param allowedOperators - Allowed operators
 * @returns Sum of all reachable results
 */
const sumReachable = (
	input: { result: number; operands: number[] }[],
	allowedOperators: Array<keyof typeof possibleOperators> = ["+", "*"],
) => {
	/**
	 * Recursively checks if target is reachable using remaining numbers
	 */
	const isReachable = (target: number, nums: number[]): boolean => {
		// Base case: single number
		if (nums.length === 1) {
			return target === nums[0];
		}

		const lastNum = nums[nums.length - 1];
		const remainingNums = nums.slice(0, -1);

		if (
			allowedOperators.includes("+") &&
			target >= lastNum &&
			isReachable(target - lastNum, remainingNums)
		) {
			return true;
		}

		if (
			allowedOperators.includes("*") &&
			target % lastNum === 0 &&
			isReachable(target / lastNum, remainingNums)
		) {
			return true;
		}

		if (allowedOperators.includes("||")) {
			const targetStr = target.toString();
			const numStr = lastNum.toString();
			if (targetStr.endsWith(numStr) && targetStr !== numStr) {
				const remaining = Number(targetStr.slice(0, -numStr.length));
				if (isReachable(remaining, remainingNums)) {
					return true;
				}
			}
		}

		return false;
	};

	return input.reduce(
		(sum, { result, operands }) =>
			sum + (isReachable(result, operands) ? result : 0),
		0,
	);
};

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		return sumReachable(input, ["+", "*"]);
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
		return sumReachable(input, ["+", "*", "||"]);
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
