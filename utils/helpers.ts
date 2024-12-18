import { AoCError } from "@/utils/index.js";

/**
 * Creates a 2D grid from a string input
 * @param input - String representing a grid with newline separators
 * @returns 2D array of characters
 */
export const formatGrid = (input: string) => {
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

/**
 * Represents a node in the pathfinding graph
 */
type DijkstraNode = {
	position: [number, number];
	cost: number;
};

/**
 * Custom type for the cost calculation function
 */
type CostFunction<T> = (
	current: [number, number],
	next: [number, number],
	grid: T[][]
) => number;

/**
 * Implements Dijkstra's algorithm for pathfinding on a 2D grid
 * @param grid - The 2D grid to navigate
 * @param start - Starting position as [row, col]
 * @param end - Target position as [row, col]
 * @param directions - Array of direction vectors to use for navigation
 * @param getCost - Function to calculate cost between positions
 * @returns Object containing distances to all reachable positions and the optimal path to the end
 * @throws {Error} If start or end positions are out of bounds
 */
export const dijkstra = <T>(
	grid: T[][],
	start: [number, number],
	end: [number, number],
	directions: readonly (readonly [number, number])[],
	getCost: CostFunction<T>
): {
	distances: Map<string, number>;
	path: [number, number][];
} => {
	if (!isInBounds(grid, start[0], start[1]) || !isInBounds(grid, end[0], end[1])) {
		throw new Error("Start or end position is out of bounds");
	}

	const distances = new Map<string, number>();
	const previous = new Map<string, [number, number]>();
	const unvisited = new Set<string>();
	
	// Initialize distances
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[0].length; col++) {
			const pos = convertTupleToString(row, col);
			distances.set(pos, Infinity);
			unvisited.add(pos);
		}
	}
	
	distances.set(convertTupleToString(...start), 0);
	
	while (unvisited.size > 0) {
		// Find unvisited node with minimum distance
		let minDistance = Infinity;
		let current = "";
		
		for (const pos of unvisited) {
			const distance = distances.get(pos) ?? Infinity;
			if (distance < minDistance) {
				minDistance = distance;
				current = pos;
			}
		}
		
		if (current === "" || minDistance === Infinity) {
			break; // No reachable nodes left
		}
		
		if (current === convertTupleToString(...end)) {
			break; // Reached the target
		}
		
		unvisited.delete(current);
		const [currentRow, currentCol] = convertStringToTuple(current, COORDINATE_CONVERTERS.NUMBER);
		
		// Check all neighbors
		for (const [dRow, dCol] of directions) {
			const newRow = currentRow + dRow;
			const newCol = currentCol + dCol;
			
			if (!isInBounds(grid, newRow, newCol)) {
				continue;
			}
			
			const neighbor = convertTupleToString(newRow, newCol);
			if (!unvisited.has(neighbor)) {
				continue;
			}
			
			const cost = getCost(
				[currentRow, currentCol],
				[newRow, newCol],
				grid
			);
			const newDistance = (distances.get(current) ?? Infinity) + cost;
			
			if (newDistance < (distances.get(neighbor) ?? Infinity)) {
				distances.set(neighbor, newDistance);
				previous.set(neighbor, [currentRow, currentCol]);
			}
		}
	}
	
	// Reconstruct path
	const path: [number, number][] = [];
	let current = convertTupleToString(...end);
	
	while (current !== convertTupleToString(...start)) {
		const pos = convertStringToTuple(current, COORDINATE_CONVERTERS.NUMBER);
		path.unshift(pos);
		
		const prev = previous.get(current);
		if (!prev) break; // No path exists
		current = convertTupleToString(...prev);
	}
	path.unshift(start);
	
	return { distances, path };
};

