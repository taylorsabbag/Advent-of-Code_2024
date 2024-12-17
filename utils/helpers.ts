import { AoCError } from "@/utils/index.js";

/**
 * Creates a 2D grid from a string input
 * @param input - String representing a grid with newline separators
 * @returns 2D array of characters
 */
export const createGrid = (input: string) => {
	return input.split("\n").map((line) => line.split(""));
};

/**
 * Converts a tuple of values into a string representation
 * @param values - Tuple of values to convert
 * @returns String representation of the tuple
 */
export const convertTupleToString = <T extends readonly unknown[]>(
	...values: T
): string => {
	return values.join(",");
};

/**
 * Converts a string representation back into a tuple of values
 * @param str - String to convert
 * @param converters - Array of conversion functions for each value
 * @returns Tuple of converted values
 * @throws {TypeError} If the number of values doesn't match the number of converters
 */
export const convertStringToTuple = <T extends unknown[]>(
	str: string,
	converters: { [K in keyof T]: (value: string) => T[K] },
): T => {
	const values = str.split(",");

	if (values.length !== converters.length) {
		throw new TypeError(
			`Mismatch between number of values (${values.length}) and converters (${converters.length})`,
		);
	}

	return values.map((value, index) => converters[index](value)) as T;
};

// Common converter arrays for coordinates
export const COORDINATE_CONVERTERS = {
	NUMBER: [Number, Number] as [(str: string) => number, (str: string) => number],
};

/**
 * Standard directional vectors for 2D grid navigation
 */
export const GRID_DIRECTIONS = {
	CARDINAL: [
		[0, 1], // right
		[1, 0], // down
		[0, -1], // left
		[-1, 0], // up
	] as const,

	DIAGONAL: [
		[1, 1], // down-right
		[1, -1], // down-left
		[-1, 1], // up-right
		[-1, -1], // up-left
	] as const,

	ALL: [
		[0, 1],
		[1, 0],
		[0, -1],
		[-1, 0], // cardinal
		[1, 1],
		[1, -1],
		[-1, 1],
		[-1, -1], // diagonal
	] as const,
};

/**
 * Checks if a position is within grid bounds
 * @param grid - The 2D grid to check against
 * @param row - Row position
 * @param col - Column position
 * @returns Whether the position is valid
 */
export const isInBounds = <T>(
	grid: T[][],
	row: number,
	col: number,
): boolean => {
	return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
};

/**
 * Creates a solution wrapper with standardized error handling
 * @param day - Current day number
 * @param part - Puzzle part (1 or 2)
 * @param description - Optional description of what the solution does
 * @returns Higher-order function that wraps the solution with error handling
 */
export const createSolutionWrapper = <T, R>(
	day: number,
	part: 1 | 2,
	description?: string,
) => {
	return (solutionFn: (input: T) => R) => {
		return (input: T): R => {
			try {
				return solutionFn(input);
			} catch (error) {
				throw new AoCError(
					`Error ${description ? `${description}: ` : ""}${error instanceof Error ? error.message : "Unknown error"}`,
					day,
					part,
					error instanceof Error ? error : undefined,
				);
			}
		};
	};
};
