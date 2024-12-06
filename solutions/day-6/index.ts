/**
 * Solution for Advent of Code 2024 - Day 6
 * @see https://adventofcode.com/2024/day/6
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

const testInput = "";

const DIRECTIONS = [
	[-1, 0], // up
	[0, 1], // right
	[1, 0], // down
	[0, -1], // left
] as const;

function walkPath(grid: string[][]): string[][] {
	const startRow = grid.findIndex((row) => row.includes("^"));
	const startCol = grid[startRow].indexOf("^");
	let currentRow = startRow;
	let currentCol = startCol;
	let heading = 0;

	while (grid[currentRow]?.[currentCol]) {
		grid[currentRow][currentCol] = "X";
		const nextRow = currentRow + DIRECTIONS[heading][0];
		const nextCol = currentCol + DIRECTIONS[heading][1];

		if (grid[nextRow]?.[nextCol] !== "#") {
			currentRow = nextRow;
			currentCol = nextCol;
		} else {
			heading = (heading + 1) % 4;
		}
	}

	return grid;
}

function isLooping(obstacle: [number, number], grid: string[][]): boolean {
	const startRow = grid.findIndex((row) => row.includes("^"));
	const startCol = grid[startRow].indexOf("^");
	grid[startRow][startCol] = ".";
	grid[obstacle[0]][obstacle[1]] = "#";

	const visited = new Set<number>();
	let currentRow = startRow;
	let currentCol = startCol;
	let heading = 0;
	let loopFound = false;

	while (grid[currentRow]?.[currentCol] && !loopFound) {
		const nextRow = currentRow + DIRECTIONS[heading][0];
		const nextCol = currentCol + DIRECTIONS[heading][1];

		if (grid[nextRow]?.[nextCol] !== "#") {
			currentRow = nextRow;
			currentCol = nextCol;
		} else {
			heading = (heading + 1) % 4;
			const state = currentRow | (currentCol << 15) | (heading << 30);
			loopFound = visited.size === visited.add(state).size;
		}
	}

	grid[obstacle[0]][obstacle[1]] = ".";
	grid[startRow][startCol] = "^";

	return loopFound;
}

function getCandidates(
	grid: string[][],
): Array<{ obstacle: [number, number]; grid: string[][] }> {
	return walkPath(grid.map((row) => [...row]))
		.flatMap((row, y) => row.map((cell, x) => [cell, y, x] as const))
		.filter(([cell]) => cell === "X")
		.map(([, ...pos]) => ({
			obstacle: pos as [number, number],
			grid: grid.map((row) => [...row]),
		}));
}

function formatInput(input: string): string[][] {
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

function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		return walkPath(input.map((row) => [...row]))
			.flat()
			.filter((cell) => cell === "X").length;
	} catch (error) {
		throw new AoCError(
			`Error solving part 1: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

function solvePart2(input: ReturnType<typeof formatInput>): number {
	try {
		return getCandidates(input).filter(({ obstacle, grid }) =>
			isLooping(obstacle, grid),
		).length;
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
