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
): { area: number; perimeter: number; boundaries: Array<Set<string>> } => {
	const currentCoordinateString = convertCoordinateToString(startRow, startCol);
	visited.add(currentCoordinateString);

	let area = 1;
	let perimeter = 0;
	// Track boundaries in each direction (up, right, down, left)
	const boundaries = [new Set<string>(), new Set<string>(), new Set<string>(), new Set<string>()];

	for (let i = 0; i < directions2D.length; i++) {
		const [row, col] = directions2D[i];
		const newRow = startRow + row;
		const newCol = startCol + col;

		if (
			newRow < 0 ||
			newRow >= grid.length ||
			newCol < 0 ||
			newCol >= grid[newRow].length
		) {
			perimeter++;
			boundaries[i].add(currentCoordinateString);
			continue;
		}

		const newCoordinateString = convertCoordinateToString(newRow, newCol);
		const newValue = grid[newRow][newCol];

		if (newValue !== currentValue) {
			perimeter++;
			boundaries[i].add(currentCoordinateString);
		} else if (!visited.has(newCoordinateString)) {
			const result = findRegion(
				grid,
				currentValue,
				newRow,
				newCol,
				visited,
			);
			
			area += result.area;
			perimeter += result.perimeter;

			// Merge boundary sets
			for (let j = 0; j < 4; j++) {
				result.boundaries[j].forEach(coord => boundaries[j].add(coord));
			}
		}
	}

	return { area, perimeter, boundaries };
};

function countConnectedComponents(boundary: Set<string>, grid: ReturnType<typeof formatInput>): number {
	if (boundary.size === 0) return 0;
	
	const visited = new Set<string>();
	let components = 0;

	for (const coord of boundary) {
		if (visited.has(coord)) continue;
		
		// Start a new component
		components++;
		const stack = [coord];
		visited.add(coord);

		while (stack.length > 0) {
			const current = stack.pop()!;
			const [row, col] = convertStringToCoordinate(current);

			// Check adjacent cells in the boundary
			for (const [dRow, dCol] of directions2D) {
				const newRow = row + dRow;
				const newCol = col + dCol;
				const newCoord = convertCoordinateToString(newRow, newCol);
				
				if (boundary.has(newCoord) && !visited.has(newCoord)) {
					stack.push(newCoord);
					visited.add(newCoord);
				}
			}
		}
	}

	return components;
}

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
				const currentValue = input[row][col];
				const { area, perimeter } = findRegion(
					input,
					currentValue,
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
		const visited = new Set<string>();
		let priceSum = 0;

		for (let row = 0; row < input.length; row++) {
			for (let col = 0; col < input[row].length; col++) {
				const currentCoordinate = convertCoordinateToString(row, col);
				if (visited.has(currentCoordinate)) continue;
				
				const currentValue = input[row][col];
				const { area, boundaries } = findRegion(
					input,
					currentValue,
					row,
					col,
					visited,
				);
				
				// Count connected components in each direction's boundary
				const sharedSides = boundaries.reduce((sum, boundary) => 
					sum + countConnectedComponents(boundary, input), 0);
				
				priceSum += area * sharedSides;
			}
		}

		return priceSum;
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
