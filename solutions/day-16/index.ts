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
		const startNode = input
			.find((row) => row.find((node) => node.value === "S"))
			?.find((node) => node.value === "S");

		if (!startNode) {
			throw new Error("Start node not found");
		}

		const pathfinder = findShortestPath(startNode, input);

		if (!pathfinder) {
			throw new Error("No path found");
		}

		return pathfinder.cost;
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
		const startNode = input
			.find((row) => row.find((node) => node.value === "S"))
			?.find((node) => node.value === "S");

		if (!startNode) {
			throw new Error("Start node not found");
		}

		const optimalPaths = findAllOptimalPaths(startNode, input);

		if (optimalPaths.length === 0) {
			throw new Error("No paths found");
		}

		const uniqueNodes = new Set<string>();
		for (const path of optimalPaths) {
			const pathNodes = countNodesInPath(path);
			for (const node of pathNodes) {
				uniqueNodes.add(node);
			}
		}

		return uniqueNodes.size;
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
