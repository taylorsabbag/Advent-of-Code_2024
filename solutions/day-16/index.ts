/**
 * Solution for Advent of Code 2024 - Day 16
 * Implements a maze pathfinding solution using a bucket-based Dijkstra's algorithm
 */

import {
	AoCError,
	createGrid,
	extractDayNumber,
	getCurrentYear,
	runner as runSolution,
	timed,
} from "@utils/index.js";

const CURRENT_DAY = extractDayNumber(import.meta.url);
const CURRENT_YEAR = getCurrentYear();
const TURN_COST = 1000;
const STEP_COST = 1;

// Simplified direction handling
const DIRECTIONS = [
	[1, 0],   // RIGHT
	[0, 1],   // DOWN
	[-1, 0],  // LEFT
	[0, -1],  // UP
] as const;

/** Represents a position in the maze with direction and accumulated cost */
type Position = {
	x: number;
	y: number;
	direction: number;
	cost: number;
};

/**
 * Represents a maze grid with pathfinding capabilities
 * Uses a bucket-based implementation of Dijkstra's algorithm for efficient path finding
 */
class MazeGrid {
	private readonly grid: string[][];
	private readonly height: number;
	private readonly width: number;
	private readonly start: [number, number];
	private readonly end: [number, number];

	/**
	 * Creates a new MazeGrid instance
	 * @param input - String representation of the maze with 'S' as start, 'E' as end, and '#' as walls
	 */
	constructor(input: string) {
		this.grid = input.split("\n").map(row => row.split(""));
		this.height = this.grid.length;
		this.width = this.grid[0].length;
		this.start = this.findChar("S");
		this.end = this.findChar("E");
	}

	/**
	 * Finds the coordinates of a specific character in the maze
	 * @param char - The character to find ('S' or 'E')
	 * @returns Tuple of [x, y] coordinates
	 * @throws Error if character is not found
	 */
	private findChar(char: string): [number, number] {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (this.grid[y][x] === char) return [x, y];
			}
		}
		throw new Error(`Character ${char} not found`);
	}

	/**
	 * Checks if a position is valid within the maze
	 * @param x - X coordinate
	 * @param y - Y coordinate
	 * @returns Boolean indicating if the position is valid and not a wall
	 */
	private isValid(x: number, y: number): boolean {
		return x >= 0 && x < this.width && y >= 0 && y < this.height && this.grid[y][x] !== "#";
	}

	/**
	 * Solves the maze finding both shortest path and number of optimal paths
	 * @returns Object containing part1 (shortest path cost) and part2 (number of optimal paths)
	 */
	solve(): { part1: number; part2: number } {
		const seen = Array.from({ length: this.height }, () =>
			Array.from({ length: this.width }, () => Array(4).fill(Number.MAX_SAFE_INTEGER))
		);

		const buckets: Position[][] = Array(1001).fill(null).map(() => []);
		buckets[0].push({ x: this.start[0], y: this.start[1], direction: 0, cost: 0 });
		seen[this.start[1]][this.start[0]][0] = 0;

		let minCost = Number.MAX_SAFE_INTEGER;
		let currentCost = 0;

		while (minCost === Number.MAX_SAFE_INTEGER && currentCost < Number.MAX_SAFE_INTEGER) {
			const bucket = buckets[currentCost % 1001];
			
			while (bucket.length > 0) {
				const current = bucket.pop()!;
				if (current.x === this.end[0] && current.y === this.end[1]) {
					minCost = current.cost;
					break;
				}
				this.processNeighbors(current, seen, buckets);
			}
			currentCost++;
		}

		const pathCount = this.countOptimalPaths(minCost, seen);
		return { part1: minCost, part2: pathCount };
	}

	/**
	 * Processes neighboring positions for the current position
	 * @param current - Current position being evaluated
	 * @param seen - 3D array tracking minimum costs for each position and direction
	 * @param buckets - Priority queue implemented as buckets
	 */
	private processNeighbors(
		current: Position,
		seen: number[][][],
		buckets: Position[][]
	): void {
		const nextX = current.x + DIRECTIONS[current.direction][0];
		const nextY = current.y + DIRECTIONS[current.direction][1];
		const nextCost = current.cost + STEP_COST;

		if (this.isValid(nextX, nextY) && nextCost < seen[nextY][nextX][current.direction]) {
			this.addToQueue(nextX, nextY, current.direction, nextCost, seen, buckets);
		}

		[3, 1].forEach(turn => {
			const newDirection = (current.direction + turn) % 4;
			const turnCost = current.cost + TURN_COST;
			
			if (turnCost < seen[current.y][current.x][newDirection]) {
				this.addToQueue(current.x, current.y, newDirection, turnCost, seen, buckets);
			}
		});
	}

	/**
	 * Adds a new position to the priority queue
	 * @param x - X coordinate
	 * @param y - Y coordinate
	 * @param direction - Direction (0-3)
	 * @param cost - Accumulated cost
	 * @param seen - 3D array tracking minimum costs
	 * @param buckets - Priority queue buckets
	 */
	private addToQueue(
		x: number,
		y: number,
		direction: number,
		cost: number,
		seen: number[][][],
		buckets: Position[][]
	): void {
		seen[y][x][direction] = cost;
		buckets[cost % 1001].push({ x, y, direction, cost });
	}

	/**
	 * Counts the number of positions that are part of optimal paths
	 * @param minCost - Cost of the shortest path
	 * @param seen - 3D array tracking minimum costs
	 * @returns Number of positions that are part of optimal paths
	 */
	private countOptimalPaths(minCost: number, seen: number[][][]): number {
		const visited = Array.from({ length: this.height }, () =>
			Array(this.width).fill(false)
		);
		const queue: Position[] = [];

		for (let dir = 0; dir < 4; dir++) {
			if (seen[this.end[1]][this.end[0]][dir] === minCost) {
				queue.push({ x: this.end[0], y: this.end[1], direction: dir, cost: minCost });
			}
		}

		while (queue.length > 0) {
			const current = queue.shift()!;
			visited[current.y][current.x] = true;

			if (current.x === this.start[0] && current.y === this.start[1]) continue;
			this.addPreviousPositions(current, seen, queue);
		}

		return visited.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
	}

	/**
	 * Adds previous positions to the queue during backward search
	 * @param current - Current position being evaluated
	 * @param seen - 3D array tracking minimum costs
	 * @param queue - Queue for BFS
	 */
	private addPreviousPositions(
		current: Position,
		seen: number[][][],
		queue: Position[]
	): void {
		const prevX = current.x - DIRECTIONS[current.direction][0];
		const prevY = current.y - DIRECTIONS[current.direction][1];
		const prevCost = current.cost - STEP_COST;

		if (this.isValid(prevX, prevY) && seen[prevY][prevX][current.direction] === prevCost) {
			queue.push({ x: prevX, y: prevY, direction: current.direction, cost: prevCost });
		}

		[3, 1].forEach(turn => {
			const prevDirection = (current.direction + turn) % 4;
			const turnCost = current.cost - TURN_COST;
			
			if (seen[current.y][current.x][prevDirection] === turnCost) {
				queue.push({ x: current.x, y: current.y, direction: prevDirection, cost: turnCost });
			}
		});
	}
}

/**
 * Formats the input string for processing
 * @param input - Raw input string
 * @returns Formatted input string
 */
function formatInput(input: string): string {
	return input;
}

/**
 * Solves part 1 of the puzzle - finds the shortest path cost
 * @param input - Formatted input string
 * @returns Minimum cost to reach the end
 */
function solvePart1(input: string): number {
	const maze = new MazeGrid(input);
	return maze.solve().part1;
}

/**
 * Solves part 2 of the puzzle - counts optimal paths
 * @param input - Formatted input string
 * @returns Number of positions that are part of optimal paths
 */
function solvePart2(input: string): number {
	const maze = new MazeGrid(input);
	return maze.solve().part2;
}

const testInput = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;

runSolution(
	CURRENT_YEAR,
	CURRENT_DAY,
	formatInput,
	timed(solvePart1),
	timed(solvePart2),
	testInput,
);