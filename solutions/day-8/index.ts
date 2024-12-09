/**
 * Solution for Advent of Code 2024 - Day 8
 * @see https://adventofcode.com/2024/day/8
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
	"............\n........0...\n.....0......\n.......0....\n....0.......\n......A.....\n............\n............\n........A...\n.........A..\n............\n............";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		return input.split("\n").map((line) => line.split(""));
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
 * Calculates potential antinode positions for a pair of antennas
 * @param x1 - X coordinate of first antenna
 * @param y1 - Y coordinate of first antenna
 * @param x2 - X coordinate of second antenna
 * @param y2 - Y coordinate of second antenna
 * @param dx - Optional predefined X vector
 * @param dy - Optional predefined Y vector
 */
function calculateAntinodes(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	dx?: number,
	dy?: number,
): { a1: { x: number; y: number }; a2: { x: number; y: number } } {
	dx ??= x2 - x1;
	dy ??= y2 - y1;
	return {
		a1: { x: x1 - dx, y: y1 - dy },
		a2: { x: x2 + dx, y: y2 + dy },
	};
}

/**
 * Counts total antinodes in a map
 */
const countAntinodes = (antinodes: Record<number, Record<number, boolean>>) => 
    Object.values(antinodes).flatMap(Object.keys).length;

const antinodes: Record<number, Record<number, boolean>> = {};
const allAntinodes: Record<number, Record<number, boolean>> = {};

function processAntinodePositions(
    grid: string[][],
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    antinodes: Record<number, Record<number, boolean>>,
    allAntinodes: Record<number, Record<number, boolean>>
): void {
    // Store original antenna positions for part 2
    if (!allAntinodes[y1]) allAntinodes[y1] = {};
    if (!allAntinodes[y2]) allAntinodes[y2] = {};
    allAntinodes[y1][x1] = true;
    allAntinodes[y2][x2] = true;

    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    let [cX1, cY1, cX2, cY2] = [x1, y1, x2, y2];

    // Process antinodes in both directions
    while (grid[cY1] || grid[cY2]) {
        const { a1, a2 } = calculateAntinodes(cX1, cY1, cX2, cY2, deltaX, deltaY);

        // Check and store positions
        for (const pos of [a1, a2]) {
            if (grid[pos.y]?.[pos.x]) {
                // Store immediate antinodes (Part 1)
                if (pos === a1 && cX1 === x1 && cY1 === y1 || 
                    pos === a2 && cX2 === x2 && cY2 === y2) {
                    if (!antinodes[pos.y]) antinodes[pos.y] = {};
                    antinodes[pos.y][pos.x] = true;
                }
                // Store all antinodes (Part 2)
                if (!allAntinodes[pos.y]) allAntinodes[pos.y] = {};
                allAntinodes[pos.y][pos.x] = true;
            }
        }

        [cX1, cY1, cX2, cY2] = [a1.x, a1.y, a2.x, a2.y];
    }
}

/**
 * Initializes both antinode maps for part 1 and part 2
 * @param grid - Input grid
 * @returns Object containing both antinode maps
 */
function initializeAntinodes(grid: string[][]): {
	antinodes: Record<number, Record<number, boolean>>;
	allAntinodes: Record<number, Record<number, boolean>>;
} {
	for (let y1 = 0; y1 < grid.length; y1++) {
		for (let x1 = 0; x1 < grid[y1].length; x1++) {
			if (grid[y1][x1] === ".") continue;

			for (let y2 = 0; y2 < grid.length; y2++) {
				for (let x2 = 0; x2 < grid[y2].length; x2++) {
					if (x1 === x2 && y1 === y2) continue;
					if (grid[y1][x1] !== grid[y2][x2]) continue;

					processAntinodePositions(grid, x1, y1, x2, y2, antinodes, allAntinodes);
				}
			}
		}
	}

	return { antinodes, allAntinodes };
}


function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		const { antinodes } = initializeAntinodes(input);
		return countAntinodes(antinodes);
	} catch (error) {
		throw new AoCError(
			`Error solving part 1: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

function solvePart2(input: ReturnType<typeof formatInput>): number {
	try {
		const { allAntinodes } = initializeAntinodes(input);
		return countAntinodes(allAntinodes);
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
