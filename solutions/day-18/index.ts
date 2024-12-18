/**
 * Solution for Advent of Code 2024 - Day 18
 * @see https://adventofcode.com/2024/day/18
 */

import {
	AoCError,
	GRID_DIRECTIONS,
	convertTupleToString,
	dijkstra,
	extractDayNumber,
	getCurrentYear,
	runner as runSolution,
	timed,
} from "@utils/index.js";

const CURRENT_DAY = extractDayNumber(import.meta.url);
const CURRENT_YEAR = getCurrentYear();

const testInput = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;
const testWidth = 7;
const testHeight = 7;

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		return input.split("\n").map((line) => line.split(",").map(Number));
	} catch (error) {
		throw new AoCError(
			`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

function createGrid(width: number, height: number) {
	const grid = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => "."),
	);

	return grid;
}

function addObstacles(grid: string[][], obstacles: number[][], firstNBytes: number) {
	for (const [x, y] of obstacles.slice(0, firstNBytes)) {
		grid[y][x] = "#";
	}
}

const REAL_HEIGHT = 71;
const REAL_WIDTH = 71;

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		const grid = createGrid(REAL_WIDTH, REAL_HEIGHT);
		addObstacles(grid, input, 1024);

		const start: [number, number] = [0, 0];
		const end: [number, number] = [REAL_WIDTH - 1, REAL_HEIGHT - 1];

		const getCost = (
			current: [number, number],
			next: [number, number],
			grid: string[][],
		) => grid[next[1]][next[0]] === "#" ? Number.POSITIVE_INFINITY : 1;

		const { distances, path } = dijkstra(grid, start, end, GRID_DIRECTIONS.CARDINAL, getCost);
		
		return distances.get(convertTupleToString(...end))!;
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
 * Checks if a path exists from start to end
 * @param grid - The game grid
 * @param start - Starting coordinates
 * @param end - Ending coordinates
 * @returns Whether a path exists
 */
function hasPath(
	grid: string[][],
	start: [number, number],
	end: [number, number]
): boolean {
	const getCost = (
		current: [number, number],
		next: [number, number],
		grid: string[][]
	) => (grid[next[1]][next[0]] === "#" ? Number.POSITIVE_INFINITY : 1);

	const { distances } = dijkstra(grid, start, end, GRID_DIRECTIONS.CARDINAL, getCost);
	const endKey = convertTupleToString(...end);
	return distances.has(endKey) && distances.get(endKey)! < Number.POSITIVE_INFINITY;
}

/**
 * Solves part 2 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 2
 */
function solvePart2(input: ReturnType<typeof formatInput>): string {
	try {
		let left = 0;
		let right = input.length - 1;
		let blockingIndex = -1;

		while (left <= right) {
			const mid = Math.floor((left + right) / 2);
			const grid = createGrid(REAL_WIDTH, REAL_HEIGHT);
			addObstacles(grid, input, mid + 1);

			const start: [number, number] = [0, 0];
			const end: [number, number] = [REAL_WIDTH - 1, REAL_HEIGHT - 1];

			if (!hasPath(grid, start, end)) {
				blockingIndex = mid;
				right = mid - 1;
			} else {
				left = mid + 1;
			}
		}

		return input[blockingIndex].join(",");
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
