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
function formatInput(input: string): Position[] {
	try {
		return input.split("\n").map((line) => {
			const [x, y] = line.split(",").map(Number);
			return [x, y] as Position;
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

function createGrid(width: number, height: number) {
	const grid = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => "."),
	);

	return grid;
}

function addObstacles(
	grid: string[][],
	obstacles: number[][],
	firstNBytes: number,
) {
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
		) => (grid[next[1]][next[0]] === "#" ? Number.POSITIVE_INFINITY : 1);

		const { distances, path } = dijkstra(
			grid,
			start,
			end,
			GRID_DIRECTIONS.CARDINAL,
			getCost,
		);

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
 * Represents a position on the grid
 */
type Position = [number, number];

/**
 * Represents a set of obstacles and their edge connections
 */
type ObstacleSet = {
	positions: Set<string>;
	edges: Set<string>;
};

/**
 * Gets the edges that a position touches
 * @param pos - The position to check
 * @param width - Width of the grid
 * @param height - Height of the grid
 */
function getEdges(pos: Position, width: number, height: number): Set<string> {
	const edges = new Set<string>();
	const [x, y] = pos;

	if (x === 0) edges.add("L");
	if (x === width - 1) edges.add("R");
	if (y === 0) edges.add("T");
	if (y === height - 1) edges.add("B");

	return edges;
}

/**
 * Checks if a set of edges creates a blocking condition
 */
function isBlocking(edges: Set<string>): boolean {
	return (
		(edges.has("L") && edges.has("T")) ||
		(edges.has("L") && edges.has("R")) ||
		(edges.has("R") && edges.has("B")) ||
		(edges.has("T") && edges.has("B"))
	);
}

/**
 * Converts a position to a string key
 */
function posToKey(pos: Position): string {
	return `${pos[0]},${pos[1]}`;
}

/**
 * Checks if a position is adjacent to any position in a set (including diagonals)
 */
function isNextTo(pos: Position, positions: Set<string>): boolean {
	const [x, y] = pos;
	const neighbors: Position[] = [
		[x - 1, y - 1],
		[x - 1, y],
		[x - 1, y + 1],
		[x, y - 1],
		[x, y + 1],
		[x + 1, y - 1],
		[x + 1, y],
		[x + 1, y + 1],
	];

	return neighbors.some((n) => positions.has(posToKey(n)));
}

/**
 * Solves part 2 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 2
 */
function solvePart2(input: ReturnType<typeof formatInput>): string {
	try {
		const byteSets = new Map<string, ObstacleSet>();

		for (const byte of input) {
			// Find all sets that need to be merged
			const setsToMerge: ObstacleSet[] = [];
			const byteKey = posToKey(byte);

			for (const [key, set] of byteSets) {
				if (isNextTo(byte, set.positions)) {
					setsToMerge.push(set);
					byteSets.delete(key);
				}
			}

			// Create new set with merged data
			const newPositions = new Set<string>([byteKey]);
			const newEdges = getEdges(byte, REAL_WIDTH, REAL_HEIGHT);

			// Merge existing sets
			for (const set of setsToMerge) {
				set.positions.forEach((p) => newPositions.add(p));
				set.edges.forEach((e) => newEdges.add(e));
			}

			// Store new set
			byteSets.set(byteKey, {
				positions: newPositions,
				edges: newEdges,
			});

			// Check if this creates a blocking condition
			if (isBlocking(newEdges)) {
				return byte.join(",");
			}
		}

		throw new Error("No blocking obstacle found");
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
