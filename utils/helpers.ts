import { AoCError } from "@/utils/index.js";

// ===== Grid Formatting and Basic Operations =====

/**
 * Creates a 2D grid from a string input
 * @param input - String representing a grid with newline separators
 * @returns 2D array of characters
 */
export const formatGrid = (input: string) => {
	return input.split("\n").map((line) => line.split(""));
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

// ===== Coordinate and Tuple Handling =====

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
	NUMBER: [Number, Number] as [
		(str: string) => number,
		(str: string) => number,
	],
};

// ===== Grid Navigation Constants =====

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

// ===== Pathfinding Algorithms and Related Types =====

/**
 * Custom type for the cost calculation function
 */
type CostFunction<T> = (
	current: [number, number],
	next: [number, number],
	grid: T[][],
) => number;

/**
 * Custom type for the heuristic calculation function
 */
type HeuristicFunction = (
	current: [number, number],
	end: [number, number]
) => number;

/**
 * Common heuristic functions for pathfinding algorithms
 */
export const HEURISTICS = {
	/**
	 * Manhattan distance heuristic
	 * Best for grids that allow only cardinal movements (no diagonals)
	 */
	MANHATTAN: ((current: [number, number], end: [number, number]): number => {
		return Math.abs(current[0] - end[0]) + Math.abs(current[1] - end[1]);
	}) satisfies HeuristicFunction,

	/**
	 * Euclidean distance heuristic
	 * Best for grids that allow movement in any direction
	 */
	EUCLIDEAN: ((current: [number, number], end: [number, number]): number => {
		const dx = current[0] - end[0];
		const dy = current[1] - end[1];
		return Math.sqrt(dx * dx + dy * dy);
	}) satisfies HeuristicFunction,

	/**
	 * Chebyshev distance heuristic
	 * Best for grids that allow diagonal movement with cost equal to cardinal movement
	 */
	CHEBYSHEV: ((current: [number, number], end: [number, number]): number => {
		const dx = Math.abs(current[0] - end[0]);
		const dy = Math.abs(current[1] - end[1]);
		return Math.max(dx, dy);
	}) satisfies HeuristicFunction,

	/**
	 * Octile distance heuristic
	 * Best for grids that allow diagonal movement with cost = sqrt(2) * cardinal movement
	 */
	OCTILE: ((current: [number, number], end: [number, number]): number => {
		const dx = Math.abs(current[0] - end[0]);
		const dy = Math.abs(current[1] - end[1]);
		const SQRT2_MINUS_1 = Math.SQRT2 - 1;
		return dx > dy 
			? dx + SQRT2_MINUS_1 * dy 
			: dy + SQRT2_MINUS_1 * dx;
	}) satisfies HeuristicFunction,
} as const;

/**
 * Implements Dijkstra's algorithm for pathfinding on a 2D grid
 */
export const dijkstra = <T>(
	grid: T[][],
	start: [number, number],
	end: [number, number],
	directions: readonly (readonly [number, number])[],
	getCost: CostFunction<T>,
): {
	distances: Map<string, number>;
	path: [number, number][];
} => {
	if (
		!isInBounds(grid, start[0], start[1]) ||
		!isInBounds(grid, end[0], end[1])
	) {
		throw new Error("Start or end position is out of bounds");
	}

	const distances = new Map<string, number>();
	const previous = new Map<string, [number, number]>();
	const unvisited = new Set<string>();

	// Initialize distances
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[0].length; col++) {
			const pos = convertTupleToString(row, col);
			distances.set(pos, Number.POSITIVE_INFINITY);
			unvisited.add(pos);
		}
	}

	distances.set(convertTupleToString(...start), 0);

	while (unvisited.size > 0) {
		// Find unvisited node with minimum distance
		let minDistance = Number.POSITIVE_INFINITY;
		let current = "";

		for (const pos of unvisited) {
			const distance = distances.get(pos) ?? Number.POSITIVE_INFINITY;
			if (distance < minDistance) {
				minDistance = distance;
				current = pos;
			}
		}

		if (current === "" || minDistance === Number.POSITIVE_INFINITY) {
			break; // No reachable nodes left
		}

		if (current === convertTupleToString(...end)) {
			break; // Reached the target
		}

		unvisited.delete(current);
		const [currentRow, currentCol] = convertStringToTuple(
			current,
			COORDINATE_CONVERTERS.NUMBER,
		);

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

			const cost = getCost([currentRow, currentCol], [newRow, newCol], grid);
			const newDistance =
				(distances.get(current) ?? Number.POSITIVE_INFINITY) + cost;

			if (newDistance < (distances.get(neighbor) ?? Number.POSITIVE_INFINITY)) {
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

/**
 * Performs Breadth-First Search pathfinding on a 2D grid
 */
export const bfs = <T>(
	grid: T[][],
	start: [number, number],
	end: [number, number],
	directions: readonly (readonly [number, number])[],
	isValidMove?: (current: [number, number], next: [number, number], grid: T[][]) => boolean
): [number, number][] => {
	if (!isInBounds(grid, start[0], start[1]) || !isInBounds(grid, end[0], end[1])) {
		throw new Error("Start or end position is out of bounds");
	}

	const queue: [number, number][] = [start];
	const visited = new Set<string>();
	const previous = new Map<string, [number, number]>();
	
	visited.add(convertTupleToString(...start));

	while (queue.length > 0) {
		const current = queue.shift()!;
		
		if (current[0] === end[0] && current[1] === end[1]) {
			// Reconstruct path
			const path: [number, number][] = [];
			let currentPos: [number, number] = end;
			
			while (currentPos[0] !== start[0] || currentPos[1] !== start[1]) {
				path.unshift(currentPos);
				const prev = previous.get(convertTupleToString(...currentPos));
				if (!prev) break;
				currentPos = prev;
			}
			path.unshift(start);
			return path;
		}

		for (const [dRow, dCol] of directions) {
			const newRow = current[0] + dRow;
			const newCol = current[1] + dCol;
			
			if (!isInBounds(grid, newRow, newCol)) {
				continue;
			}

			const nextPos: [number, number] = [newRow, newCol];
			const nextPosStr = convertTupleToString(...nextPos);

			if (visited.has(nextPosStr)) {
				continue;
			}

			if (isValidMove && !isValidMove(current, nextPos, grid)) {
				continue;
			}

			visited.add(nextPosStr);
			previous.set(nextPosStr, current);
			queue.push(nextPos);
		}
	}

	return []; // No path found
};

/**
 * Represents a node in the A* pathfinding algorithm
 */
type AStarNode = {
	position: [number, number];
	g: number; // Cost from start to current node
	h: number; // Heuristic estimate from current node to end
	f: number; // Total cost (g + h)
};

/**
 * Implements A* pathfinding algorithm on a 2D grid
 */
export const astar = <T>(
	grid: T[][],
	start: [number, number],
	end: [number, number],
	directions: readonly (readonly [number, number])[],
	getCost: CostFunction<T>,
	heuristic: HeuristicFunction
): [number, number][] => {
	if (!isInBounds(grid, start[0], start[1]) || !isInBounds(grid, end[0], end[1])) {
		throw new Error("Start or end position is out of bounds");
	}

	const openSet = new Map<string, AStarNode>();
	const closedSet = new Set<string>();
	const previous = new Map<string, [number, number]>();

	// Initialize start node
	openSet.set(convertTupleToString(...start), {
		position: start,
		g: 0,
		h: heuristic(start, end),
		f: heuristic(start, end)
	});

	while (openSet.size > 0) {
		// Find node with lowest f score
		let currentNode: AStarNode | undefined;
		let currentKey = "";
		
		for (const [key, node] of openSet) {
			if (!currentNode || node.f < currentNode.f) {
				currentNode = node;
				currentKey = key;
			}
		}

		if (!currentNode) break;
		
		if (currentNode.position[0] === end[0] && currentNode.position[1] === end[1]) {
			// Reconstruct path
			const path: [number, number][] = [];
			let currentPos: [number, number] = end;
			
			while (currentPos[0] !== start[0] || currentPos[1] !== start[1]) {
				path.unshift(currentPos);
				const prev = previous.get(convertTupleToString(...currentPos));
				if (!prev) break;
				currentPos = prev;
			}
			path.unshift(start);
			return path;
		}

		openSet.delete(currentKey);
		closedSet.add(currentKey);

		for (const [dRow, dCol] of directions) {
			const newRow = currentNode.position[0] + dRow;
			const newCol = currentNode.position[1] + dCol;
			
			if (!isInBounds(grid, newRow, newCol)) {
				continue;
			}

			const neighborPos: [number, number] = [newRow, newCol];
			const neighborKey = convertTupleToString(...neighborPos);

			if (closedSet.has(neighborKey)) {
				continue;
			}

			const gScore = currentNode.g + getCost(currentNode.position, neighborPos, grid);
			const hScore = heuristic(neighborPos, end);
			const fScore = gScore + hScore;

			const existingNeighbor = openSet.get(neighborKey);
			if (!existingNeighbor || gScore < existingNeighbor.g) {
				previous.set(neighborKey, currentNode.position);
				openSet.set(neighborKey, {
					position: neighborPos,
					g: gScore,
					h: hScore,
					f: fScore
				});
			}
		}
	}

	return []; // No path found
};

// ===== Error Handling =====

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

