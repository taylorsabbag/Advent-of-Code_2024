/**
 * Solution for Advent of Code 2024 - Day 6
 * @see https://adventofcode.com/2024/day/6
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

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		const grid = input;
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
		const guard: Vector = findStartingPosition(grid);

		function patrol(grid: string[][], startingPosition: Vector): number {
			const visited = new Set<string>();
			let { coordinate: currentCoordinate, direction: currentDirection } = startingPosition;
			
			const directions = {
				"^": { row: -1, col: 0, nextDirection: ">" },
				"v": { row: 1, col: 0, nextDirection: "<" },
				"<": { row: 0, col: -1, nextDirection: "^" },
				">": { row: 0, col: 1, nextDirection: "v" },
			};

			// Helper to convert coordinate to string for Set storage
			const coordToString = (coord: Coordinate): string => `${coord.row},${coord.col}`;
			
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

			return visited.size;
		}

		return patrol(grid, guard);
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
