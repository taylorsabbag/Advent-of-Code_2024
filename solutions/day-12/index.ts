/**
 * Solution for Advent of Code 2024 - Day 12
 * @see https://adventofcode.com/2024/day/12
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
	"RRRRIICCFF\nRRRRIICCCF\nVVRRRCCFFF\nVVRCCCJFFF\nVVVVCJJCFE\nVVIVCCJJEE\nVVIIICJJEE\nMIIIIIJJEE\nMIIISIJEEE\nMMMISSJEEE";

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

const convertCoordinateToString = (row: number, col: number) => {
	return `${row},${col}`;
};

const convertStringToCoordinate = (coordinate: string) => {
	const [row, col] = coordinate.split(",").map(Number);
	return [row, col];
};

const directions2D = [
	[0, 1],
	[1, 0],
	[0, -1],
	[-1, 0],
];

const findRegion = (
	grid: ReturnType<typeof formatInput>,
	currentValue: string,
	startRow: number,
	startCol: number,
	visited: Set<string>,
): { area: number; perimeter: number } => {
	const currentCoordinateString = convertCoordinateToString(startRow, startCol);
	visited.add(currentCoordinateString);

	let area = 1;
	let perimeter = 0;

	for (const [row, col] of directions2D) {
		const newRow = startRow + row;
		const newCol = startCol + col;

		// Check bounds and increment perimeter if out of bounds
		if (
			newRow < 0 ||
			newRow >= grid.length ||
			newCol < 0 ||
			newCol >= grid[newRow].length
		) {
			perimeter++;
			continue;
		}

		const newCoordinateString = convertCoordinateToString(newRow, newCol);
		// Only check unvisited cells for area expansion
		if (!visited.has(newCoordinateString)) {
			const newValue = grid[newRow][newCol];
			if (newValue === currentValue) {
				const { area: subArea, perimeter: subPerimeter } = findRegion(
					grid,
					currentValue,
					newRow,
					newCol,
					visited,
				);
				area += subArea;
				perimeter += subPerimeter;
			}
		}
		
		// Always check for perimeter, even for visited cells
		if (grid[newRow][newCol] !== currentValue) {
			perimeter++;
		}
	}

	return { area, perimeter };
};

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		const visited = new Set<string>();
		let priceSum = 0;

		for (let row = 0; row < input.length; row++) {
			for (let col = 0; col < input[row].length; col++) {
				const currentCoordinate = convertCoordinateToString(row, col);
				if (visited.has(currentCoordinate)) continue;
				const { area, perimeter } = findRegion(
					input,
					input[row][col],
					row,
					col,
					visited,
				);
				priceSum += area * perimeter;
			}
		}

		return priceSum;
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
	testInput, // 1206
);
