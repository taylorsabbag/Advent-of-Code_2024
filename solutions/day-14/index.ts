/**
 * Solution for Advent of Code 2024 - Day 14
 * @see https://adventofcode.com/2024/day/14
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
	"p=0,4 v=3,-3\np=6,3 v=-1,-3\np=10,3 v=-1,2\np=2,0 v=2,-1\np=0,0 v=1,3\np=3,0 v=-2,-2\np=7,6 v=-1,-3\np=3,0 v=-1,-2\np=9,3 v=2,3\np=7,3 v=-1,2\np=2,4 v=2,-3\np=9,5 v=-3,-3";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		return input.split("\n").map((line) => {
			const [position, velocity] = line.split(" ");
			const [px, py] = position.split("=")[1].split(",").map(Number);
			const [vx, vy] = velocity.split("=")[1].split(",").map(Number);
			return { px, py, vx, vy };
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

/**
 * Calculates positions of all robots at time t
 * @param t - Time step
 * @returns Array of [x,y] positions
 */
function simulate(
	t: number,
	robots: { px: number; py: number; vx: number; vy: number }[],
): [number, number][] {
	return robots.map((robot) => {
		const x =
			(((robot.px + t * robot.vx) % GRID_WIDTH) + GRID_WIDTH) % GRID_WIDTH;
		const y =
			(((robot.py + t * robot.vy) % GRID_HEIGHT) + GRID_HEIGHT) % GRID_HEIGHT;
		return [x, y];
	});
}

const GRID_WIDTH = 101;
const GRID_HEIGHT = 103;

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		const robots = simulate(100, [...input]);

		const quadrantDefinitions: Record<string, { x: number[]; y: number[] }> = {
			topLeft: {
				x: [0, Math.floor(GRID_WIDTH / 2)],
				y: [0, Math.floor(GRID_HEIGHT / 2)],
			},
			topRight: {
				x: [Math.ceil(GRID_WIDTH / 2), GRID_WIDTH],
				y: [0, Math.floor(GRID_HEIGHT / 2)],
			},
			bottomLeft: {
				x: [0, Math.floor(GRID_WIDTH / 2)],
				y: [Math.ceil(GRID_HEIGHT / 2), GRID_HEIGHT],
			},
			bottomRight: {
				x: [Math.ceil(GRID_WIDTH / 2), GRID_WIDTH],
				y: [Math.ceil(GRID_HEIGHT / 2), GRID_HEIGHT],
			},
		};

		const quadrants = [];
		for (const { x, y } of Object.values(quadrantDefinitions)) {
			const robotsPerQuadrant = robots.filter(
				(robot) =>
					robot[0] >= x[0] &&
					robot[0] < x[1] &&
					robot[1] >= y[0] &&
					robot[1] < y[1],
			);
			quadrants.push(robotsPerQuadrant.length);
		}

		const safetyFactor = quadrants.reduce((a, b) => a * b, 1);
		return safetyFactor;
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
 * Solves part 2 of the puzzle using Chinese Remainder Theorem
 * @param input - Formatted input data
 * @returns Solution to part 2
 */
function solvePart2(input: ReturnType<typeof formatInput>): number {
	try {
		const robots = [...input];

		/**
		 * Calculates variance of an array of numbers
		 * @param numbers - Array of numbers
		 * @returns Variance
		 */
		function variance(numbers: number[]): number {
			const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
			return (
				numbers.reduce((acc, val) => acc + (val - mean) ** 2, 0) /
				numbers.length
			);
		}

		// Find minimum variance points
		let bestTimeX = 0;
		let bestVarX = 10 * 100; // Initial high variance
		let bestTimeY = 0;
		let bestVarY = 10 * 1000; // Initial high variance

		// Search for minimum variance in both dimensions
		const maxTime = Math.max(GRID_WIDTH, GRID_HEIGHT);
		for (let t = 0; t < maxTime; t++) {
			const positions = simulate(t, robots);
			const xPositions = positions.map((p) => p[0]);
			const yPositions = positions.map((p) => p[1]);

			const xVar = variance(xPositions);
			const yVar = variance(yPositions);

			if (xVar < bestVarX) {
				bestTimeX = t;
				bestVarX = xVar;
			}

			if (yVar < bestVarY) {
				bestTimeY = t;
				bestVarY = yVar;
			}
		}

		/**
		 * Calculates modular multiplicative inverse
		 * @param a - Number to find inverse for
		 * @param m - Modulus
		 * @returns Modular multiplicative inverse
		 */
		function modInverse(a: number, m: number): number {
			const normalizedA = ((a % m) + m) % m;
			for (let x = 1; x < m; x++) {
				if ((normalizedA * x) % m === 1) {
					return x;
				}
			}
			throw new Error("Modular multiplicative inverse does not exist");
		}

		// Apply Chinese Remainder Theorem
		const wInverse = modInverse(GRID_WIDTH, GRID_HEIGHT);
		const result =
			bestTimeX +
			((((wInverse * (bestTimeY - bestTimeX)) % GRID_HEIGHT) + GRID_HEIGHT) %
				GRID_HEIGHT) *
				GRID_WIDTH;

		return result;
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
