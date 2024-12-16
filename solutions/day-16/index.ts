/**
 * Solution for Advent of Code 2024 - Day 16
 * @see https://adventofcode.com/2024/day/16
 */

import {
	AoCError,
	convertTupleToString,
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

const testInput =
	"#################\n#...#...#...#..E#\n#.#.#.#.#.#.#.#.#\n#.#.#.#...#...#.#\n#.#.#.#.###.#.#.#\n#...#.#.#.....#.#\n#.#.#.#.#.#####.#\n#.#...#.#.#.....#\n#.#.#####.#.###.#\n#.#.#.......#...#\n#.#.###.#####.###\n#.#.#...#.....#.#\n#.#.#.#####.###.#\n#.#.#.........#.#\n#.#.#.#########.#\n#S#.............#\n#################";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string): Node[][] {
	try {
		const grid = createGrid(input);
		return grid.map((row, y) =>
			row.map((value, x) => ({
				value,
				x,
				y,
			})),
		);
	} catch (error) {
		throw new AoCError(
			`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`,
				CURRENT_DAY,
				1,
				error instanceof Error ? error : undefined,
		);
	}
}

type Node = {
	value: string;
	x: number;
	y: number;
};

type Direction = "N" | "S" | "E" | "W";

type Pathfinder = {
	node: Node;
	direction: Direction;
	cost: number;
	parent?: Pathfinder;
};

function getNeighbours(pathfinder: Pathfinder, graph: Node[][]): Pathfinder[] {
	const neighbours: Pathfinder[] = [];
	const directions: { x: number; y: number; direction: Direction }[] = [
		{ x: 0, y: -1, direction: "N" },
		{ x: 0, y: 1, direction: "S" },
		{ x: -1, y: 0, direction: "W" },
		{ x: 1, y: 0, direction: "E" },
	];

	for (const dir of directions) {
		const newX = pathfinder.node.x + dir.x;
		const newY = pathfinder.node.y + dir.y;

		if (newY >= 0 && newY < graph.length && 
			newX >= 0 && newX < graph[0].length && 
			graph[newY][newX].value !== "#") {
			
			const turnCost = dir.direction === pathfinder.direction ? 0 : TURN_COST;
			neighbours.push({
				node: graph[newY][newX],
				direction: dir.direction,
				cost: pathfinder.cost + turnCost + STEP_COST,
				parent: pathfinder
			});
		}
	}

	return neighbours;
}

function findShortestPath(start: Node, graph: Node[][]): Pathfinder | null {
	const visited = new Set<string>();
	const queue = new Set<Pathfinder>([{
		node: start,
		direction: "E",
		cost: 0
	}]);

	while (queue.size > 0) {
		const current = Array.from(queue).reduce((min, p) => 
			p.cost < min.cost ? p : min
		);
		queue.delete(current);

		const stateKey = `${current.node.x},${current.node.y},${current.direction}`;
		if (visited.has(stateKey)) continue;
		visited.add(stateKey);

		if (current.node.value === "E") {
			return current;
		}

		for (const neighbour of getNeighbours(current, graph)) {
			const neighbourKey = `${neighbour.node.x},${neighbour.node.y},${neighbour.direction}`;
			if (!visited.has(neighbourKey)) {
				queue.add(neighbour);
			}
		}
	}

	return null;
}

function findAllOptimalPaths(start: Node, graph: Node[][]): Pathfinder[] {
	const visited = new Map<string, number>();
	const queue = new Set<Pathfinder>([{
		node: start,
		direction: "E",
		cost: 0
	}]);
	const optimalPaths: Pathfinder[] = [];
	let bestCost = Number.POSITIVE_INFINITY;

	while (queue.size > 0) {
		const current = Array.from(queue).reduce((min, p) => 
			p.cost < min.cost ? p : min
		);
		queue.delete(current);

		const stateKey = `${current.node.x},${current.node.y},${current.direction}`;
		
		const knownCost = visited.get(stateKey);
		if (knownCost !== undefined && current.cost > knownCost) continue;
		
		visited.set(stateKey, current.cost);

		if (current.node.value === "E") {
			if (current.cost < bestCost) {
				optimalPaths.length = 0;
				bestCost = current.cost;
				
				optimalPaths.push(current);
			} else if (current.cost === bestCost) {
				optimalPaths.push(current);
			}
			continue;
		}

		for (const neighbour of getNeighbours(current, graph)) {
			const neighbourKey = `${neighbour.node.x},${neighbour.node.y},${neighbour.direction}`;
			const neighbourKnownCost = visited.get(neighbourKey);
			
			if (neighbourKnownCost === undefined || neighbour.cost <= neighbourKnownCost) {
				queue.add(neighbour);
			}
		}
	}

	return optimalPaths;
}

function countNodesInPath(pathfinder: Pathfinder): Set<string> {
	const nodes = new Set<string>();
	let current: Pathfinder | undefined = pathfinder;
	
	while (current) {
		nodes.add(`${current.node.x},${current.node.y}`);
		current = current.parent;
	}
	
	return nodes;
}

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		const { part1 } = solve(input.map(row => row.map(node => node.value).join("")).join("\n"));
		return part1;
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
		const { part2 } = solve(input.map(row => row.map(node => node.value).join("")).join("\n"));
		return part2;
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
	testInput,
);

/**
 * Represents a point in 2D space
 */
type Point = {
	x: number;
	y: number;
  };
  
  /**
   * Constants for directional movement
   */
  const DIRECTIONS: Point[] = [
	{ x: 1, y: 0 },  // RIGHT
	{ x: 0, y: 1 },  // DOWN
	{ x: -1, y: 0 }, // LEFT
	{ x: 0, y: -1 }, // UP
  ];
  
  /**
   * Grid class to handle 2D maze operations
   */
  class Grid {
	private grid: string[][];
	private height: number;
	private width: number;
  
	constructor(input: string) {
	  this.grid = input.split("\n").map(row => row.split(""));
	  this.height = this.grid.length;
	  this.width = this.grid[0].length;
	}
  
	/**
	 * Checks if a point is within grid bounds
	 */
	isValid(point: Point): boolean {
	  return (
		point.x >= 0 &&
		point.x < this.width &&
		point.y >= 0 &&
		point.y < this.height
	  );
	}
  
	/**
	 * Gets the value at a specific point
	 */
	get(point: Point): string {
	  return this.grid[point.y][point.x];
	}
  
	/**
	 * Finds the first occurrence of a character in the grid
	 */
	find(char: string): Point | undefined {
	  for (let y = 0; y < this.height; y++) {
		for (let x = 0; x < this.width; x++) {
		  if (this.grid[y][x] === char) {
			return { x, y };
		  }
		}
	  }
	  return undefined;
	}
  
	/**
	 * Creates a new grid of the same size with initial values
	 */
	createSimilarGrid<T>(initialValue: T): T[][] {
	  return Array.from({ length: this.height }, () =>
		Array(this.width).fill(initialValue)
	  );
	}
  
	/**
	 * Gets the height of the grid
	 */
	public getHeight(): number {
	  return this.height;
	}

	/**
	 * Gets the width of the grid
	 */
	public getWidth(): number {
	  return this.width;
	}
  }
  
  /**
   * Main solver function that handles both parts simultaneously
   */
  function solve(input: string): { part1: number; part2: number } {
	const grid = new Grid(input);
	const start = grid.find("S");
	const end = grid.find("E");
  
	if (!start || !end) {
	  throw new Error("Start or end point not found");
	}
  
	// Initialize buckets for Dijkstra's algorithm
	const buckets: Array<Array<[Point, number]>> = Array.from(
	  { length: 1001 },
	  () => []
	);
  
	// Initialize seen costs matrix
	const seen: number[][][] = Array.from({ length: grid.getHeight() }, () =>
	  Array.from({ length: grid.getWidth() }, () => Array(4).fill(Number.MAX_SAFE_INTEGER))
	);
  
	// Initialize starting position
	buckets[0].push([start, 0]);
	seen[start.y][start.x][0] = 0;
  
	let cost = 0;
	let lowestCost = Number.MAX_SAFE_INTEGER;
  
	// Forward Dijkstra search
	while (lowestCost === Number.MAX_SAFE_INTEGER) {
	  const index = cost % 1001;
  
	  while (buckets[index].length > 0) {
		const [position, direction] = buckets[index].pop()!;
  
		if (position.x === end.x && position.y === end.y) {
		  lowestCost = cost;
		  break;
		}
  
		// Calculate next possible moves
		const left = (direction + 3) % 4;
		const right = (direction + 1) % 4;
		const nextMoves: Array<[Point, number, number]> = [
		  [
			{ x: position.x + DIRECTIONS[direction].x, y: position.y + DIRECTIONS[direction].y },
			direction,
			cost + 1,
		  ],
		  [position, left, cost + 1000],
		  [position, right, cost + 1000],
		];
  
		for (const [nextPos, nextDir, nextCost] of nextMoves) {
		  if (
			grid.isValid(nextPos) &&
			grid.get(nextPos) !== "#" &&
			nextCost < seen[nextPos.y][nextPos.x][nextDir]
		  ) {
			const nextIndex = nextCost % 1001;
			buckets[nextIndex].push([nextPos, nextDir]);
			seen[nextPos.y][nextPos.x][nextDir] = nextCost;
		  }
		}
	  }
  
	  cost++;
	}
  
	// Backward BFS to find all optimal paths
	const path = grid.createSimilarGrid(false);
	const queue: Array<[Point, number, number]> = [];
  
	// Add end point with all possible directions that achieved lowest cost
	for (let direction = 0; direction < 4; direction++) {
	  if (seen[end.y][end.x][direction] === lowestCost) {
		queue.push([end, direction, lowestCost]);
	  }
	}
  
	while (queue.length > 0) {
	  const [position, direction, currentCost] = queue.shift()!;
	  path[position.y][position.x] = true;
  
	  if (position.x === start.x && position.y === start.y) {
		continue;
	  }
  
	  const left = (direction + 3) % 4;
	  const right = (direction + 1) % 4;
	  const prevMoves: Array<[Point, number, number]> = [
		[
		  { x: position.x - DIRECTIONS[direction].x, y: position.y - DIRECTIONS[direction].y },
		  direction,
		  currentCost - 1,
		],
		[position, left, currentCost - 1000],
		[position, right, currentCost - 1000],
	  ];
  
	  for (const [prevPos, prevDir, prevCost] of prevMoves) {
		if (
		  grid.isValid(prevPos) &&
		  prevCost === seen[prevPos.y][prevPos.x][prevDir]
		) {
		  queue.push([prevPos, prevDir, prevCost]);
		  seen[prevPos.y][prevPos.x][prevDir] = Number.MAX_SAFE_INTEGER;
		}
	  }
	}
  
	const pathCount = path.reduce(
	  (count, row) => count + row.filter(cell => cell).length,
	  0
	);
  
	return {
	  part1: lowestCost,
	  part2: pathCount,
	};
  }