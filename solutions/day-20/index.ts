/**
 * Solution for Advent of Code 2024 - Day 20
 * @see https://adventofcode.com/2024/day/20
 */

import {
	AoCError,
	GRID_DIRECTIONS,
	extractDayNumber,
	formatGrid,
	getCurrentYear,
	runner as runSolution,
	timed,
	bfs,
	HEURISTICS,
	findPositions,
	type Grid,
} from "@utils/index.js";

const CURRENT_DAY = extractDayNumber(import.meta.url);
const CURRENT_YEAR = getCurrentYear();

const testInput = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		return formatGrid(input);
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
 * Find cheats using BFS to get the path first
 * @param grid - The grid to search
 * @param minSave - The minimum number of steps to save
 * @param maxCheat - The maximum number of steps to cheat
 * @returns The number of cheats found
 */
function findCheats(grid: Grid<string>, minSave: number, maxCheat: number): number {
	const { start, end } = findPositions(grid, "S", "E");
	
	// Use BFS to find the path
	const path = bfs(
		grid,
		start,
		end,
		GRID_DIRECTIONS.CARDINAL,
		(current, next) => grid[next[0]]?.[next[1]] !== "#"
	);
	
	let cheats = 0;
	
	// Only look at positions that could be the start of a valid cheat
	for (let i = 0; i < path.length - minSave; i++) {
		// Get the slice of positions that are at least minSave steps ahead
		const futurePositions = path.slice(i + minSave);
		
		// Check each future position against our current position
		for (let j = 0; j < futurePositions.length; j++) {
			const distance = HEURISTICS.MANHATTAN(path[i], futurePositions[j]);
			
			// The key difference: j represents steps from the minSave point
			if (distance <= maxCheat && distance <= j) {
				cheats++;
			}
		}
	}
	
	return cheats;
}

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: Grid<string>): number {
	try {
		return findCheats(input, 100, 2);
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
function solvePart2(input: Grid<string>): number {
	try {
		return findCheats(input, 100, 20);
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
