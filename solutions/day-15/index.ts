/**
 * Solution for Advent of Code 2024 - Day 15
 * @see https://adventofcode.com/2024/day/15
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
	"##########\n#..O..O.O#\n#......O.#\n#.OO..O.O#\n#..O@..O.#\n#O#..O...#\n#O..O..O.#\n#.OO.O.OO#\n#....O...#\n##########\n\n<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		const [gridRaw, instructionsRaw] = input.split("\n\n");
		const grid = gridRaw.split("\n").map((line) => line.split(""));
		const instructions = instructionsRaw.split("\n").flatMap((line) => line.split(""));
		return { grid, instructions };
	} catch (error) {
		throw new AoCError(
			`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

const DIRECTIONS = {
	"^": [-1, 0],
	v: [1, 0],
	">": [0, 1],
	"<": [0, -1],
};

const BOX_CHAR = "O";
const ROBOT_CHAR = "@";
const EMPTY_CHAR = ".";
const WALL_CHAR = "#";
const BOX_CHARS = ["[", "]"];

/**
 * Moves the robot and pushes any boxes ("O") in its path, modifying the input grid
 * @param grid - 2D array representing the maze
 * @param direction - Direction of movement (^, v, <, >)
 * @param position - Current position [row, col] that will be updated
 */
const moveRobotAndPushO = (
	grid: string[][],
	direction: keyof typeof DIRECTIONS,
	position: [number, number]
): void => {
	const [x, y] = position;
	const [dx, dy] = DIRECTIONS[direction];
	const [newX, newY] = [x + dx, y + dy];

	// If we hit a wall, don't move
	if (grid[newX][newY] === WALL_CHAR) {
		return;
	}

	// Look ahead to check if there's a wall blocking the line of boxes
	let checkX = newX;
	let checkY = newY;
	let boxCount = 0;

	// Count boxes and check for blocking wall
	while (grid[checkX][checkY] === BOX_CHAR) {
		boxCount++;
		checkX += dx;
		checkY += dy;

		if (grid[checkX][checkY] === WALL_CHAR) {
			return; // Can't push if there's a wall at the end
		}
	}

	// If we can move, update all positions
	if (boxCount > 0) {
		// Move all boxes one space, starting from the furthest box
		for (let i = 0; i < boxCount; i++) {
			const boxX = newX + (boxCount - 1 - i) * dx;
			const boxY = newY + (boxCount - 1 - i) * dy;
			const targetX = boxX + dx;
			const targetY = boxY + dy;
			grid[boxX][boxY] = EMPTY_CHAR; // Clear the original box position
			grid[targetX][targetY] = BOX_CHAR; // Place the box in its new position
		}
	}

	// Move robot
	grid[newX][newY] = ROBOT_CHAR;
	grid[x][y] = EMPTY_CHAR;
	
	// Update position array directly
	position[0] = newX;
	position[1] = newY;
};

const findRobot = (grid: string[][]): [number, number] | null => {
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (grid[i][j] === "@") {
				return [i, j];
			}
		}
	}
	return null;
};

function calculateBoxGPSCoordSum(grid: string[][]) {
	const boxPositions = [];
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (grid[i][j] === BOX_CHAR) {
				boxPositions.push([i * 100, j]);
			}
		}
	}
	return boxPositions.reduce((sum, [x, y]) => sum + x + y, 0);
}

const doubleEverything = (grid: string[][]) => {
	return grid.flatMap((row) => row.map((cell) => {
		if (cell !== ROBOT_CHAR && cell !== BOX_CHAR) {
			return [cell, cell];
		}
		return cell === ROBOT_CHAR ? ROBOT_CHAR : BOX_CHARS;
	}));
};

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		const { grid, instructions } = input;
		const position = findRobot(grid);
		if (!position) {
			throw new Error("Robot not found");
		}

		for (const instruction of instructions) {
			const direction = instruction as keyof typeof DIRECTIONS;
			moveRobotAndPushO(grid, direction, position);
		}

		return calculateBoxGPSCoordSum(grid);
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
		const { grid, instructions } = input;
		const doubleGrid = doubleEverything(grid);
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
