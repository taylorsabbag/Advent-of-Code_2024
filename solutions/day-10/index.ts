/**
 * Solution for Advent of Code 2024 - Day 10
 * @see https://adventofcode.com/2024/day/10
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
	"89010123\n78121874\n87430965\n96549874\n45678903\n32019012\n01329801\n10456732";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		return input.split("\n").map((line) => line.split("").map(Number));
	} catch (error) {
		throw new AoCError(
			`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

/**
 * Represents a node in the grid with its value, position, and pointers to the previous and next nodes
 */
class Node {
	constructor(
		public value: number,
		public row: number,
		public col: number,
		public previous: Node | null = null,
		public next: Node | null = null,
	) {
		this.value = value;
		this.row = row;
		this.col = col;
		this.previous = previous;
		this.next = next;
	}
}

/**
 * Finds all valid trails of descending numbers starting from a given node
 * @param input - 2D array of numbers representing the grid
 * @param node - Current node being processed
 * @returns Array of arrays, each representing a valid trail ending in 9
 */
function findTrail(
	input: ReturnType<typeof formatInput>,
	node: Node,
	part: "1" | "2",
): Node[][] {
	const validTrails: Node[][] = [];
	const currentTrail: Node[] = [node];
	// Track positions of 9s we've seen to avoid duplicates in part 1
	const seenNines: Set<string> = new Set();

	function explore(currentNode: Node, trail: Node[]): void {
		const directions = [
			{ row: currentNode.row - 1, col: currentNode.col }, // up
			{ row: currentNode.row + 1, col: currentNode.col }, // down
			{ row: currentNode.row, col: currentNode.col - 1 }, // left
			{ row: currentNode.row, col: currentNode.col + 1 }, // right
		];

		if (currentNode.value === 9) {
			const ninePosition = `${currentNode.row},${currentNode.col}`;
			if (part === "2" || !seenNines.has(ninePosition)) {
				if (part === "1") {
					seenNines.add(ninePosition);
				}
				validTrails.push([...trail]);
			}
			return;
		}

		for (const direction of directions) {
			const newRow = direction.row;
			const newCol = direction.col;

			if (
				newRow >= 0 &&
				newRow < input.length &&
				newCol >= 0 &&
				newCol < input[0].length
			) {
				const newValue = input[newRow][newCol];

				if (newValue === currentNode.value + 1) {
					const newNode = new Node(newValue, newRow, newCol, currentNode, null);
					currentNode.next = newNode;
					trail.push(newNode);
					explore(newNode, trail);
					trail.pop(); // Backtrack
				}
			}
		}
	}

	explore(node, currentTrail);
	return validTrails;
}

function getTrailheadScore(
	input: ReturnType<typeof formatInput>,
	row: number,
	col: number,
	part: "1" | "2",
): number {
	const trailhead = new Node(input[row][col], row, col, null, null);
	const validTrails = findTrail(input, trailhead, part);
	return validTrails.length;
}

function calculateTrailheadScoreSum(
	input: ReturnType<typeof formatInput>,
	part: "1" | "2",
) {
	let trailheadScoreSum = 0;

	for (let row = 0; row < input.length; row++) {
		for (let col = 0; col < input[row].length; col++) {
			if (input[row][col] === 0) {
				trailheadScoreSum += getTrailheadScore(input, row, col, part);
			}
		}
	}

	return trailheadScoreSum;
}

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		return calculateTrailheadScoreSum(input, "1");
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
		return calculateTrailheadScoreSum(input, "2");
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
