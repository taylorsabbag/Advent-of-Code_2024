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

const testInput = "2333133121414131402";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		let id = 0;
		return input.split("").flatMap((fOrFS, index) => {
			if (index % 2 === 0 || index === 0) {
				const fileBlocks = new Array(Number(fOrFS)).fill(`${id++}`);
				return fileBlocks;
			}
			const emptySpaces = new Array(Number(fOrFS)).fill(".");
			return emptySpaces;
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

const calculateChecksum = (input: string[]): number => {
	return input.reduce((acc, curr, index) => {
		if (curr === ".") return acc;
		return acc + Number(curr) * index;
	}, 0);
};

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		const swapFileBlocks = (input: string[], from: number, to: number) => {
			[input[from], input[to]] = [input[to], input[from]];
		};

		const rearrangeFileBlocks = (input: ReturnType<typeof formatInput>) => {
			// Create a copy to avoid mutating the input
			const result = [...input];
			let left = 0;
			let right = result.length - 1;

			// Continue until pointers meet
			while (left < right) {
				// Skip if left pointer is already on a file block
				if (result[left] !== ".") {
					left++;
					continue;
				}

				// Skip if right pointer is already on an empty space
				if (result[right] === ".") {
					right--;
					continue;
				}

				// Swap empty space with file block
				swapFileBlocks(result, left, right);
				left++;
				right--;
			}

			return result;
		};

		const rearrangedInput = rearrangeFileBlocks(input);
		const checksum = calculateChecksum(rearrangedInput);
		return checksum;
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
		// Helper to find all blocks of a specific file ID
		const findFilePositions = (input: string[], fileId: string) => {
			const positions: number[] = [];
			input.forEach((val, index) => {
				if (val === fileId) positions.push(index);
			});
			return positions;
		};

		// Helper to check if a range is all empty spaces
		const isRangeEmpty = (input: string[], start: number, size: number) => {
			for (let i = start; i < start + size; i++) {
				if (input[i] !== ".") return false;
			}
			return true;
		};

		const moveFile = (
			input: string[],
			fileId: string,
			targetStart: number
		) => {
			const positions = findFilePositions(input, fileId);
			const size = positions.length;
			
			// Remove file from current position
			positions.forEach(pos => {
				input[pos] = ".";
			});
			
			// Place file in new position
			for (let i = 0; i < size; i++) {
				input[targetStart + i] = fileId;
			}
		};

		const result = [...input];
		
		// Get unique file IDs and sort in descending order
		const fileIds = [...new Set(result.filter(x => x !== "."))].sort((a, b) => 
			parseInt(b) - parseInt(a)
		);

		// Process each file
		for (const fileId of fileIds) {
			const positions = findFilePositions(result, fileId);
			const fileSize = positions.length;
			
			// Find leftmost valid position
			let targetPos = 0;
			while (targetPos < positions[0]) {  // Only look left of current position
				if (isRangeEmpty(result, targetPos, fileSize)) {
					moveFile(result, fileId, targetPos);
					break;
				}
				targetPos++;
			}
		}

		return calculateChecksum(result);
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
