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
		const segments = [...input]; // Create a copy to avoid modifying input

		// Process segments from right to left
		for (let i = segments.length - 1; i > 0; i--) {
			const segmentToMove = segments[i];

			if (segmentToMove.value !== null) {
				// Look for an empty spot that will fit
				for (let n = 0; n < i; n++) {
					if (
						segments[n].value === null &&
						segments[n].size >= segmentToMove.size
					) {
						const emptySpot = segments[n];

						// Found one, move it
						segments.splice(i, 1);
						segmentToMove.index = emptySpot.index;
						segments.splice(n, 0, segmentToMove);

						// Reduce the size of the current empty spot
						emptySpot.size -= segmentToMove.size;
						emptySpot.index += segmentToMove.size;
						break;
					}
				}
			}
		}

		// Calculate checksum
		let result = 0;
		for (const segment of segments) {
			if (segment.value !== null) {
				for (let n = 0; n < segment.size; n++) {
					result += (segment.index + n) * segment.value;
				}
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
