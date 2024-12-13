/**
 * Solution for Advent of Code 2024 - Day 13
 * @see https://adventofcode.com/2024/day/13
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
	"Button A: X+94, Y+34\nButton B: X+22, Y+67\nPrize: X=8400, Y=5400\n\nButton A: X+26, Y+66\nButton B: X+67, Y+21\nPrize: X=12748, Y=12176\n\nButton A: X+17, Y+86\nButton B: X+84, Y+37\nPrize: X=7870, Y=6450\n\nButton A: X+69, Y+23\nButton B: X+27, Y+71\nPrize: X=18641, Y=10279";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		// In order, split sets of instructions into arrays,
		// split sets of instructions into instructions,
		// extract the values from the buttons and prize instructions,
		// extract the x and y values from the buttons and prize instructions.
		// Should return [ { buttonA: { x: 94, y: 34 }, buttonB: { x: 22, y: 67 }, prize: { x: 8400, y: 5400 } }, ... ]
		return input
			.split("\n\n")
			.map((line) => line.split("\n"))
			.map(([buttonA, buttonB, prize]) => ({
				buttonA: buttonA
					.split(":")[1]
					.split(", ")
					.map((value) => value.split("+")[1]),
				buttonB: buttonB
					.split(":")[1]
					.split(", ")
					.map((value) => value.split("+")[1]),
				prize: prize
					.split(":")[1]
					.split(", ")
					.map((value) => value.split("=")[1]),
			}))
			.map(({ buttonA, buttonB, prize }) => ({
				buttonA: { x: buttonA[0], y: buttonA[1] },
				buttonB: { x: buttonB[0], y: buttonB[1] },
				prize: { x: prize[0], y: prize[1] },
			}));
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
 * Checks if the prize coordinates can be reached using button combinations
 * and calculates the minimum number of button presses needed.
 * Uses Cramer's Rule to solve the system of linear equations:
 * ```
 * xA * a + xB * b = xP + constant  (X-axis)
 * yA * a + yB * b = yP + constant  (Y-axis)
 * ```
 * Where:
 * - a, b are the number of A and B button presses
 * - xA, yA are the X,Y movements from button A
 * - xB, yB are the X,Y movements from button B
 * - xP, yP are the prize coordinates
 * - constant is 0 for part 1, 10000000000000 for part 2
 * 
 * Solution exists if determinant (xA * yB - xB * yA) ≠ 0 and
 * resulting a, b values are non-negative integers.
 * @param xA - X coordinate of button A
 * @param xB - X coordinate of button B
 * @param yA - Y coordinate of button A
 * @param yB - Y coordinate of button B
 * @param xP - X coordinate of the prize
 * @param yP - Y coordinate of the prize
 * @param constant - Constant value to add to the target coordinates
 * @returns Object containing whether it's possible and the minimum button presses needed
 */
function calculateButtonPresses(
	xA: number,
	xB: number,
	yA: number,
	yB: number,
	xP: number,
	yP: number,
	constant = 0,
): { possible: boolean; pressesA: number; pressesB: number } {
	const result = { possible: false, pressesA: 0, pressesB: 0 };

	// Adjust target coordinates with constant
	const targetX = xP + constant;
	const targetY = yP + constant;

	// Create coefficient matrix for the system of equations
	const det = xA * yB - xB * yA;

	if (det === 0) {
		return result;
	}

	// Solve for pressesA and pressesB
	const pressesA = (targetX * yB - xB * targetY) / det;
	const pressesB = (xA * targetY - targetX * yA) / det;

	// Check if solution is valid (positive integers)
	if (
		pressesA >= 0 &&
		pressesB >= 0 &&
		Math.floor(pressesA) === pressesA &&
		Math.floor(pressesB) === pressesB
	) {
		result.possible = true;
		result.pressesA = pressesA;
		result.pressesB = pressesB;
	}

	return result;
}

/**
 * Calculates the token cost based on the button presses
 * @param input - Formatted input data
 * @param constant - Constant value to add to the target coordinates
 * @returns Total token cost
 */
function calculateTokenCost(
	input: ReturnType<typeof formatInput>,
	constant = 0,
) {
	let tokenCost = 0;

	for (const { buttonA, buttonB, prize } of input) {
		const { x: xA, y: yA } = buttonA;
		const { x: xB, y: yB } = buttonB;
		const { x: xP, y: yP } = prize;

		const { possible, pressesA, pressesB } = calculateButtonPresses(
			Number(xA),
			Number(xB),
			Number(yA),
			Number(yB),
			Number(xP),
			Number(yP),
			constant,
		);

		if (possible) {
			tokenCost += pressesA * 3;
			tokenCost += pressesB * 1;
		}
	}

	return tokenCost;
}

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		return calculateTokenCost(input);
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
		return calculateTokenCost(input, 10000000000000);
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
