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

const testInput =
	"....#.....\n.........#\n..........\n..#.......\n.......#..\n..........\n.#..^.....\n........#.\n#.........\n......#...";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
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

type Coordinate = {
	row: number;
	col: number;
};

type Vector = {
	coordinate: Coordinate;
	direction: "^" | "v" | "<" | ">";
};

const findStartingPosition = (grid: string[][]) => {
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			const cell = grid[row][col];
			if (cell === "^" || cell === "v" || cell === "<" || cell === ">") {
				return {
					coordinate: { row, col },
					direction: cell as "^" | "v" | "<" | ">",
				};
			}
		}
	}
	throw new AoCError("No starting position found", CURRENT_DAY, 1);
};

const directions = {
	"^": { row: -1, col: 0, nextDirection: ">" },
	v: { row: 1, col: 0, nextDirection: "<" },
	"<": { row: 0, col: -1, nextDirection: "^" },
	">": { row: 0, col: 1, nextDirection: "v" },
};

// Helper to convert coordinate to string for Set storage
const coordToString = (coord: Coordinate): string =>
	`${coord.row},${coord.col}`;

function patrol(grid: string[][], startingPosition: Vector): Set<string> {
	const visited = new Set<string>();
	let { coordinate: currentCoordinate, direction: currentDirection } =
		startingPosition;

	while (true) {
		// Add current position to visited set
		visited.add(coordToString(currentCoordinate));

		const { row, col, nextDirection } = directions[currentDirection];
		const nextCoordinate = {
			row: currentCoordinate.row + row,
			col: currentCoordinate.col + col,
		};

		// Check if next position is valid
		if (!grid[nextCoordinate.row]?.[nextCoordinate.col]) {
			break;
		}

		if (grid[nextCoordinate.row][nextCoordinate.col] === "#") {
			currentDirection = nextDirection as "^" | "v" | "<" | ">";
			continue;
		}

		currentCoordinate = nextCoordinate;
	}

	return visited;
}

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		const grid = input;
		const guard = findStartingPosition(grid);

		return patrol(grid, guard).size;
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
		const grid = input;
		const startPos = findStartingPosition(grid);

		// Convert our direction system to match the original solution
		const dirToIndex = {
			"^": 0, // Up
			">": 1, // Right
			v: 2, // Down
			"<": 3, // Left
		} as const;

		// Track visited positions with direction
		const visited = new Set<string>();
		visited.add(
			`${startPos.coordinate.row}_${startPos.coordinate.col}_${dirToIndex[startPos.direction]}`,
		);
		const visitedList = [
			`${startPos.coordinate.row}_${startPos.coordinate.col}_${dirToIndex[startPos.direction]}`,
		];

		function walkPath(
			row: number,
			col: number,
			dir: number,
			visited: Set<string>,
		): boolean {
			while (true) {
				let nextRow = row;
				let nextCol = col;

				// Calculate next position based on direction
				switch (dir) {
					case 0:
						nextRow--;
						break; // Up
					case 1:
						nextCol++;
						break; // Right
					case 2:
						nextRow++;
						break; // Down
					case 3:
						nextCol--;
						break; // Left
				}

				// Gone off grid
				if (
					nextRow < 0 ||
					nextRow >= grid.length ||
					nextCol < 0 ||
					nextCol >= grid[0].length
				) {
					break;
				}

				// Found a cycle
				if (visited.has(`${nextRow}_${nextCol}_${dir}`)) {
					return true;
				}

				// Hit an obstacle
				if (grid[nextRow][nextCol] === "#") {
					dir = (dir + 1) % 4; // Turn right
				} else {
					row = nextRow;
					col = nextCol;
					visited.add(`${row}_${col}_${dir}`);
					visitedList.push(`${row}_${col}_${dir}`);
				}
			}
			return false;
		}

		// Initial walk
		walkPath(
			startPos.coordinate.row,
			startPos.coordinate.col,
			dirToIndex[startPos.direction],
			visited,
		);

		const candidates = new Set<string>();

		// Walk backwards through visited positions
		for (let i = visitedList.length - 1; i > 0; i--) {
			const [row, col, dir] = visitedList[i].split("_").map(Number);

			// Skip if this was the starting position
			if (grid[row][col] === "^") continue;

			// Temporarily place obstacle
			const originalValue = grid[row][col];
			grid[row][col] = "#";

			// Get previous position
			const [prevRow, prevCol, prevDir] = visitedList[i - 1]
				.split("_")
				.map(Number);

			// Create new visited set up to this point
			const newVisited = new Set(visitedList.slice(0, i));

			// Skip if we would have hit this spot earlier
			if ([0, 1, 2, 3].some((d) => newVisited.has(`${row}_${col}_${d}`))) {
				grid[row][col] = originalValue;
				continue;
			}

			// Check if this creates a cycle
			const hasCycle = walkPath(prevRow, prevCol, prevDir, newVisited);

			// Restore original value
			grid[row][col] = originalValue;

			if (hasCycle) {
				candidates.add(`${row}_${col}`);
			}
		}

		return candidates.size;
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
