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

type FileSystemElement = {
	type: "Empty" | "File";
	id?: number;
	size: number;
};

/**
 * Formats the raw input string into an array of FileSystemElements
 * @param input - Raw puzzle input string
 * @returns Array of FileSystemElements
 */
function formatInput(input: string): FileSystemElement[] {
	try {
		return Array.from({ length: input.length }, (_, i) => {
			const size = Number(input[i]);
			return i % 2 === 0 
				? { type: "File", id: i / 2, size }
				: { type: "Empty", size };
		});
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
 * Calculates sum of integers from low to high inclusive
 */
function intSum(low: number, high: number): number {
	return ((high - low + 1) * (high + low)) / 2;
}

function solvePart1(input: string): number {
	try {
		const array = formatInput(input);
		let total = 0;
		let left = 0;
		let right = array.length - 1;
		let pos = 0;

		while (left <= right) {
			if (left >= right) {
				if (array[left].type === "Empty") {
					break;
				}
				const { id, size } = array[left] as { id: number; size: number };
				total += id * intSum(pos, pos + size - 1);
				pos += size;
				left++;
				continue;
			}

			if (array[left].type === "File") {
				const { id, size } = array[left] as { id: number; size: number };
				total += id * intSum(pos, pos + size - 1);
				pos += size;
				left++;
				continue;
			}

			const leftSize = array[left].size;
			
			if (array[right].type === "Empty") {
				right--;
				continue;
			}

			const rightFile = array[right] as { id: number; size: number };
			
			if (leftSize >= rightFile.size) {
				array[left] = { type: "Empty", size: leftSize - rightFile.size };
				total += rightFile.id * intSum(pos, pos + rightFile.size - 1);
				pos += rightFile.size;
				right--;
			} else {
				array[right] = { type: "File", id: rightFile.id, size: rightFile.size - leftSize };
				total += rightFile.id * intSum(pos, pos + leftSize - 1);
				pos += leftSize;
				left++;
			}
		}

		return total;
	} catch (error) {
		throw new AoCError(
			`Error solving part 1: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

function solvePart2(input: string): number {
	try {
		const array = formatInput(input);

		// Calculate initial positions
		const positions: number[] = [];
		let total = 0;
		for (let i = 0; i < array.length; i++) {
			positions[i] = total;
			total += array[i].size;
		}

		// Initialize memoization array for empty positions
		const emptys: Array<number | null> = Array(10).fill(1);

		// Helper function to find empty spot
		const findEmpty = (size: number, maxPos: number, startPos: number): number | null => {
			let pos = startPos;
			while (pos <= maxPos) {
				if (array[pos].type === "Empty") {
					if (array[pos].size >= size) {
						array[pos].size -= size;
						return pos;
					}
				}
				pos += 2;
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
	(input: string) => input,
	timed(solvePart1),
	timed(solvePart2),
);
