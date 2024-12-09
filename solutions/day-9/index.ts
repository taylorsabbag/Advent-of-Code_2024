/**
 * Solution for Advent of Code 2024 - Day 9
 * @see https://adventofcode.com/2024/day/9
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

const testInput = `2333133121414131402`;

type Segment = {
	value: number | null; // null for empty space, fileId for files
	index: number;
	size: number;
};

/**
 * Formats the raw input string into segments
 * @param input - Raw puzzle input string
 * @returns Array of segments representing files and empty spaces
 */
function formatInput(input: string): Segment[] {
	try {
		const segments: Segment[] = [];
		let index = 0;
		let fileId = 0;

		for (let i = 0; i < input.length; i++) {
			const size = Number(input[i]);
			if (i % 2 === 0) {
				segments.push({ value: fileId++, index, size });
			} else {
				segments.push({ value: null, index, size });
			}
			index += size;
		}
		return segments;
	} catch (error) {
		throw new AoCError(
			`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

function solvePart1(input: Segment[]): number {
	try {
		const result: (number | null)[] = [];

		// Fill array with initial values
		for (const segment of input) {
			for (let i = 0; i < segment.size; i++) {
				result.push(segment.value);
			}
		}

		// Move files to the left
		let left = 0;
		let right = result.length - 1;
		while (left <= right) {
			if (result[left] !== null) {
				left++;
			} else if (result[right] === null) {
				right--;
			} else {
				[result[left], result[right]] = [result[right], result[left]];
				left++;
				right--;
			}
		}

		// Calculate checksum
		return result.reduce(
			(acc: number, curr: number | null, index: number) =>
				acc + (curr !== null ? curr * index : 0),
			0,
		);
	} catch (error) {
		throw new AoCError(
			`Error solving part 1: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

function solvePart2(input: Segment[]): number {
	try {
		// Convert our input format to match the array structure from OCaml solution
		const array: Array<{ type: "Empty" | "File"; id?: number; size: number }> = [];
		for (const segment of input) {
			if (segment.value === null) {
				array.push({ type: "Empty", size: segment.size });
			} else {
				array.push({ type: "File", id: segment.value, size: segment.size });
			}
		}

		// Helper function to calculate sum of integers from low to high inclusive
		const intSum = (low: number, high: number): number => 
			((high - low + 1) * (high + low)) / 2;

		// Calculate initial positions
		const positions: number[] = [];
		let total = 0;
		for (let i = 0; i < array.length; i++) {
			positions[i] = total;
			total += array[i].size;
		}

		// Initialize memoization array for empty positions
		const emptys: Array<number | null> = Array(10).fill(1);  // Start at odd positions

		// Helper function to find empty spot
		const findEmpty = (size: number, maxPos: number, startPos: number): number | null => {
			let pos = startPos;
			while (pos <= maxPos) {
				if (array[pos].type === "Empty") {
					if (array[pos].size >= size) {
						// Shrink the free block
						array[pos].size -= size;
						return pos;
					}
				}
				pos += 2; // Empty slots are at odd positions
			}
			return null;
		};

		// Memoized version of findEmpty
		const memoizedFindEmpty = (size: number, maxPos: number): number | null => {
			if (emptys[size] === null) return null;
			const result = findEmpty(size, maxPos, emptys[size]!);
			emptys[size] = result;
			return result;
		};

		// Calculate final result
		let result = 0;
		for (let i = array.length - 1; i >= 0; i--) {
			const element = array[i];
			if (element.type === "File") {
				const newPos = (() => {
					const emptySpot = memoizedFindEmpty(element.size, i);
					if (emptySpot === null) {
						return positions[i];
					}
					const n = positions[emptySpot];
					positions[emptySpot] += element.size;
					return n;
				})();
				
				result += element.id! * intSum(newPos, newPos + element.size - 1);
			}
		}

		return result;
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
