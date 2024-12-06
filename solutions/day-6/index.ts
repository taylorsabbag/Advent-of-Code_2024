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
		
		// Get the original patrol path using our existing function
		const originalPath = patrol(grid, startPos);

		// Check all empty spaces adjacent to the path
		const potentialSpots = new Set<string>();
		let result = 0;

		originalPath.forEach(posStr => {
			const [row, col] = posStr.split(",").map(Number);
			
			// Check all adjacent positions
			for (const dir of Object.keys(directions) as Array<keyof typeof directions>) {
				const adjacentPos = {
					row: row + directions[dir].row,
					col: col + directions[dir].col,
				};
				
				if (
					grid[adjacentPos.row]?.[adjacentPos.col] === "." &&
					!potentialSpots.has(coordToString(adjacentPos))
				) {
					potentialSpots.add(coordToString(adjacentPos));
					
					// Test if placing an obstacle here creates a loop
					const testGrid = grid.map(row => [...row]);
					testGrid[adjacentPos.row][adjacentPos.col] = "#";
					
					const visited = new Set<string>();
					let testPos = { ...startPos };
					let steps = 0;
					let foundLoop = false;
					
					while (true) {
						const posWithDir = `${coordToString(testPos.coordinate)},${testPos.direction}`;
						
						// If we've seen this exact position and direction before, it's a loop
						if (visited.has(posWithDir)) {
							foundLoop = true;
							break;
						}
						
						if (steps > grid.length * grid[0].length * 4) {
							// If we've taken too many steps without finding a loop or boundary,
							// assume it's a loop
							foundLoop = true;
							break;
						}
						
						visited.add(posWithDir);
						const { row, col, nextDirection } = directions[testPos.direction];
						const nextPos = {
							row: testPos.coordinate.row + row,
							col: testPos.coordinate.col + col,
						};
						
						// If we hit a boundary, it's not a loop
						if (!testGrid[nextPos.row]?.[nextPos.col]) break;
						
						if (testGrid[nextPos.row][nextPos.col] === "#") {
							testPos.direction = nextDirection as keyof typeof directions;
						} else {
							testPos.coordinate = nextPos;
						}
						
						steps++;
					}
					
					if (foundLoop) result++;
				}
			}
		});

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
