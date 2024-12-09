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
		type EmptySpace = { size: number; index: number };
		const emptySpaces: EmptySpace[] = [];
		const segments = [...input];

		// Collect empty spaces
		for (const segment of segments) {
			if (segment.value === null) {
				emptySpaces.push({ size: segment.size, index: segment.index });
			}
		}

		// Sort empty spaces by index
		emptySpaces.sort((a, b) => a.index - b.index);

		// Process files from highest ID to lowest
		for (let i = segments.length - 1; i >= 0; i--) {
			const segment = segments[i];
			if (segment.value === null) continue;

			// Find first empty space that's both:
			// 1. Large enough to fit the file
			// 2. Located to the left of the current file
			let bestFitIndex = -1;
			for (let j = 0; j < emptySpaces.length; j++) {
				const space = emptySpaces[j];
				if (space.size >= segment.size && space.index < segment.index) {
					bestFitIndex = j;
					break;  // Take the first (leftmost) valid space
				}
			}

			if (bestFitIndex !== -1) {
				const space = emptySpaces[bestFitIndex];
				// Update segment position
				segment.index = space.index;
				
				// Update empty space
				space.size -= segment.size;
				space.index += segment.size;
				
				// Remove empty space if fully used
				if (space.size === 0) {
					emptySpaces.splice(bestFitIndex, 1);
				}
			}
		}

		// Calculate checksum
		let result = 0;
		for (const segment of segments) {
			if (segment.value !== null) {
				const n = segment.size;
				const a1 = segment.index * segment.value;
				const an = (segment.index + n - 1) * segment.value;
				result += n * (a1 + an) / 2;
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
