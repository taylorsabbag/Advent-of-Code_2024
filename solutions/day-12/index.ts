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

/**
 * Counts corners for a cell by checking adjacent pairs of directions
 * @param grid - The input grid
 * @param currentValue - The current plant type
 * @param row - Current row
 * @param col - Current column
 * @returns Number of corners
 */
const countCorners = (
	grid: ReturnType<typeof formatInput>,
	currentValue: string,
	row: number,
	col: number,
): number => {
	let cornerCount = 0;

	// Check each pair of adjacent directions (right+down, down+left, left+up, up+right)
	for (let i = 0; i < 4; i++) {
		// Get current direction and next direction (wrapping around to 0)
		const [dx1, dy1] = directions2D[i];
		const [dx2, dy2] = directions2D[(i + 1) % 4];

		// Get the values in the L-shape pattern
		const leftCell = grid[row + dy1]?.[col + dx1];
		const rightCell = grid[row + dy2]?.[col + dx2];
		const middleCell = grid[row + dy1 + dy2]?.[col + dx1 + dx2];

		// Case 1: Both adjacent cells are different (outer corner)
		const isOuterCorner = leftCell !== currentValue && rightCell !== currentValue;

		// Case 2: Both adjacent cells match but diagonal is different (inner corner)
		const isInnerCorner = leftCell === currentValue && 
							 rightCell === currentValue && 
							 middleCell !== currentValue;

		if (isOuterCorner || isInnerCorner) {
			cornerCount++;
		}
	}

	return cornerCount;
};

/**
 * Finds the area, perimeter, and corners of a region
 * @param grid - The input grid
 * @param currentValue - The current plant type
 * @param startRow - The starting row
 * @param startCol - The starting column
 * @param visited - The set of visited coordinates
 * @returns The area, perimeter, and corners of the region
 */
const findRegion = (
	grid: ReturnType<typeof formatInput>,
	currentValue: string,
	startRow: number,
	startCol: number,
	visited: Set<string>,
): { area: number; perimeter: number; corners: number } => {
	const currentCoordinateString = convertCoordinateToString(startRow, startCol);
	visited.add(currentCoordinateString);

	let area = 1;
	let perimeter = 4;
	let corners = countCorners(grid, currentValue, startRow, startCol);

	// Check neighbors for recursion and perimeter
	for (const [row, col] of directions2D) {
		const newRow = startRow + row;
		const newCol = startCol + col;

		if (
			newRow >= 0 &&
			newRow < grid.length &&
			newCol >= 0 &&
			newCol < grid[newRow].length &&
			grid[newRow][newCol] === currentValue
		) {
			perimeter--; // Subtract 1 for each adjacent matching plot
			
			if (!visited.has(convertCoordinateToString(newRow, newCol))) {
				const result = findRegion(
					grid,
					currentValue,
					newRow,
					newCol,
					visited,
				);
				area += result.area;
				perimeter += result.perimeter;
				corners += result.corners;
			}
		}
	}

	return { area, perimeter, corners };
};

/**
 * Calculates the total price sum for a grid based on the specified calculation method
 * @param input - The input grid
 * @param calculatePrice - Function to calculate price based on region properties
 * @returns The total price sum
 */
function calculateTotalPrice(
	input: ReturnType<typeof formatInput>,
	calculatePrice: (props: { area: number; perimeter: number; corners: number }) => number
): number {
	const visited = new Set<string>();
	let priceSum = 0;

	for (let row = 0; row < input.length; row++) {
		for (let col = 0; col < input[row].length; col++) {
			const currentCoordinate = convertCoordinateToString(row, col);
			if (visited.has(currentCoordinate)) continue;

			const regionProps = findRegion(
				input,
				input[row][col],
				row,
				col,
				visited,
			);

			priceSum += calculatePrice(regionProps);
		}
	}

	return priceSum;
}

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		return calculateTotalPrice(input, ({ area, perimeter }) => area * perimeter);
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
		return calculateTotalPrice(input, ({ area, corners }) => area * corners);
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
