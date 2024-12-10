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

// NOTE: Implementing memoization or early pruning turn out to be slower due to the
// overhead of maintaining the cache and checking for early exits. Even working backwards from 9
// to 0, the performance was worse than the straightforward approach.

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

const START_VALUE = 0;
const END_VALUE = 9;

/**
 * Finds all valid nine positions (as strings) reachable from a given starting node
 * @param input - 2D array of numbers representing the grid
 * @param startNode - Starting node
 * @param collection - Function to handle collection of nines (Array or Set)
 * @returns Array of stringified nine positions
 */
function findNines(
	input: ReturnType<typeof formatInput>,
	startNode: Node,
): string[] {
	const validNines: string[] = [];
	const currentTrail: Node[] = [startNode];
	
	function explore(currentNode: Node): void {
		if (currentNode.value === END_VALUE) {
			validNines.push(`${currentNode.row},${currentNode.col}`);
			return;
		}
		
		const nextValue = currentNode.value + 1;
		const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
		
		for (const [dRow, dCol] of directions) {
			const newRow = currentNode.row + dRow;
			const newCol = currentNode.col + dCol;
			
			if (
				newRow >= 0 &&
				newRow < input.length &&
				newCol >= 0 &&
				newCol < input[0].length &&
				input[newRow][newCol] === nextValue
			) {
				const newNode = new Node(nextValue, newRow, newCol, currentNode);
				currentNode.next = newNode;
				currentTrail.push(newNode);
				explore(newNode);
				currentTrail.pop();
			}
		}
	}
	
	explore(startNode);
	return validNines;
}

function getTrailheadScore(
	input: ReturnType<typeof formatInput>,
	row: number,
	col: number,
	part: "1" | "2",
): number {
	const trailhead = new Node(input[row][col], row, col);
	const nines = findNines(input, trailhead);
	return part === "1" ? new Set(nines).size : nines.length;
}

function calculateTrailheadScoreSum(
	input: ReturnType<typeof formatInput>,
	part: "1" | "2",
) {
	let trailheadScoreSum = 0;

	for (let row = 0; row < input.length; row++) {
		for (let col = 0; col < input[row].length; col++) {
			if (input[row][col] === START_VALUE) {
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
