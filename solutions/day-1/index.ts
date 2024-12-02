/**
 * Solution for Advent of Code 2024 - Day 1
 * @see https://adventofcode.com/2024/day/1
 */

import { getInput } from "../../utils/index.js";

/**
 * Formats the raw input string into a more usable data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string): string[] {
    return input.trim().split("\n");
}

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePuzzle1(input: string[]): number {
    try {
        // TODO: Implement solution for part 1
        return 0;
    } catch (error) {
        throw new Error(`Error solving puzzle 1: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

/**
 * Solves part 2 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 2
 */
function solvePuzzle2(input: string[]): number {
    try {
        // TODO: Implement solution for part 2
        return 0;
    } catch (error) {
        throw new Error(`Error solving puzzle 2: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

/**
 * Main function to run the solutions
 */
async function main(): Promise<void> {
    try {
        const rawInput = await getInput(2024, 1);
        const formattedInput = formatInput(rawInput);
        console.log(formattedInput);

        const solution1 = solvePuzzle1(formattedInput);
        console.log("Solution 1:", solution1);

        const solution2 = solvePuzzle2(formattedInput);
        console.log("Solution 2:", solution2);
    } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : "Unknown error");
        process.exit(1);
    }
}

// Run the solution
main();
