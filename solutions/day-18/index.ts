/**
 * Solution for Advent of Code 2024 - Day 18
 * @see https://adventofcode.com/2024/day/18
 */

import {
	AoCError,
	convertTupleToString,
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
 * Solves part 1 of the puzzle using BFS
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		// Create and initialize the grid with obstacles
		const grid = createGrid(REAL_WIDTH, REAL_HEIGHT);
		addObstacles(grid, input, 1024);

		// Initialize BFS queue with start position and distance
		const queue: [number, number, number][] = [[0, 0, 0]]; // [x, y, distance]
		const visited = new Set<string>();
		const target: [number, number] = [REAL_WIDTH - 1, REAL_HEIGHT - 1];

		// Process queue
		while (queue.length > 0) {
			const [x, y, distance] = queue.shift()!;
			const key = `${x},${y}`;

			// Skip if already visited
			if (visited.has(key)) continue;
			visited.add(key);

			// Check if we reached the target
			if (x === target[0] && y === target[1]) {
				return distance;
			}

			// Check all four directions
			const neighbors: [number, number][] = [
				[x, y - 1], // up
				[x + 1, y], // right
				[x, y + 1], // down
				[x - 1, y], // left
			];

			// Add valid neighbors to queue
			for (const [nx, ny] of neighbors) {
				// Skip if out of bounds
				if (nx < 0 || nx >= REAL_WIDTH || ny < 0 || ny >= REAL_HEIGHT) {
					continue;
				}

				// Skip if obstacle or already visited
				if (grid[ny][nx] === "#" || visited.has(`${nx},${ny}`)) {
					continue;
				}

				// Add to queue with increased distance
				queue.push([nx, ny, distance + 1]);
			}
		}

		throw new Error("No path found to target");
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
 * Solves part 2 using a time-based BFS approach
 * @param input - Formatted input data
 * @returns Solution to part 2
 */
function solvePart2(input: ReturnType<typeof formatInput>): string {
	try {
		// Step 1: Construct time matrix T[r][c]
		const T = Array.from({ length: REAL_HEIGHT }, () =>
			Array(REAL_WIDTH).fill(input.length),
		);

		// Fill T with drop times
		for (let i = 0; i < input.length; i++) {
			const [x, y] = input[i];
			if (
				x === undefined ||
				y === undefined ||
				x < 0 ||
				y < 0 ||
				x >= REAL_WIDTH ||
				y >= REAL_HEIGHT
			) {
				continue;
			}
			T[y][x] = i;
		}

		// Step 2: Initialize k+1 queues (0 to k inclusive)
		const k = input.length;

		// Step 3: Push destination to Q[k], using same end position as part 1
		const Q: Position[][] = new Array(k + 1);
		for (let i = 0; i <= k; i++) {
			Q[i] = [];
		}
		Q[k].push([REAL_WIDTH - 1, REAL_HEIGHT - 1]); // Fixed end position

		// Track visited positions
		const visited = new Set<string>();

		// Step 4: Process queues from t=k down to 0
		for (let t = k; t >= 0; t--) {
			while (Q[t].length > 0) {
				const current = Q[t].shift()!;
				const key = convertTupleToString(current);

				if (visited.has(key)) continue;
				visited.add(key);

				// Check if we reached (0,0)
				if (current[0] === 0 && current[1] === 0) {
					return input[t].join(",");
				}

				// Check all four neighbors
				const [x, y] = current;
				const neighbors: Position[] = [
					[x, y - 1], // up
					[x + 1, y], // right
					[x, y + 1], // down
					[x - 1, y], // left
				];

				for (const [nx, ny] of neighbors) {
					// Skip if out of bounds, using same bounds as part 1
					if (nx < 0 || nx >= REAL_WIDTH || ny < 0 || ny >= REAL_HEIGHT) {
						continue;
					}

					const neighborKey = convertTupleToString([nx, ny]);
					if (visited.has(neighborKey)) continue;

					const dropTime = T[ny][nx];
					if (dropTime >= t) {
						Q[t].push([nx, ny]);
					} else {
						Q[dropTime].push([nx, ny]);
					}
				}
			}
		}

		throw new Error("No solution found");
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
