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
				buttonA: buttonA.split(":")[1].split(", ").map((value) => value.split("+")[1]),
				buttonB: buttonB.split(":")[1].split(", ").map((value) => value.split("+")[1]),
				prize: prize.split(":")[1].split(", ").map((value) => value.split("=")[1]),
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
 * and calculates the minimum number of button presses needed
 * @returns Object containing whether it's possible and the minimum button presses needed
 */
function calculateButtonPresses(
    xA: number,
    xB: number,
    yA: number,
    yB: number,
    xP: number,
    yP: number
): { possible: boolean; pressesA: number; pressesB: number } {
    // Initialize result
    const result = { possible: false, pressesA: 0, pressesB: 0 };
    
    // Check if either button alone reaches the target
    if ((xA === 0 && yA === 0) || (xB === 0 && yB === 0)) {
        return result;
    }

    // Try combinations up to 100 presses for each button
    for (let pressA = 0; pressA <= 100; pressA++) {
        for (let pressB = 0; pressB <= 100; pressB++) {
            const totalX = (xA * pressA + xB * pressB);
            const totalY = (yA * pressA + yB * pressB);
            
            if (totalX === xP && totalY === yP) {
                result.possible = true;
                result.pressesA = pressA;
                result.pressesB = pressB;
                return result;
            }
        }
    }

    return result;
}

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		let tokenCost = 0

		for (const { buttonA, buttonB, prize } of input) {
			const { x: xA, y: yA } = buttonA;
			const { x: xB, y: yB } = buttonB;
			const { x: xP, y: yP } = prize;

			const { possible, pressesA, pressesB } = calculateButtonPresses(Number(xA), Number(xB), Number(yA), Number(yB), Number(xP), Number(yP));

			if (possible) {
				tokenCost += pressesA * 3
				tokenCost += pressesB * 1
			}
		}

		return tokenCost;
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
);
