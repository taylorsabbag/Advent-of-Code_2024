/**
 * Solution for Advent of Code 2024 - Day 1
 * @see https://adventofcode.com/2024/day/1
 */

import { getInput, checkAnswer } from "../../utils/index.js";

const testInput = '3   4\n4   3\n2   5\n1   3\n3   9\n3   3';

/**
 * Represents a list item with its value and original index
 */
type IndexedValue = [number, number]; // [value, originalIndex]

/**
 * Formats the raw input string into two lists of numbers with their original indices
 * @param input - Raw puzzle input string
 * @returns Tuple of [leftList, rightList] where each list contains [value, originalIndex]
 */
function formatInput(input: string): [IndexedValue[], IndexedValue[]] {
    try {
        const lines = input.trim().split("\n");
        const splitLines = lines.map(line => line.split("   "));
        
        const leftList = splitLines.map((item, index): IndexedValue => 
            [Number.parseInt(item[0]), index]
        );
        const rightList = splitLines.map((item, index): IndexedValue => 
            [Number.parseInt(item[1]), index]
        );

        return [leftList, rightList];
    } catch (error) {
        throw new Error(`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePuzzle1(input: [IndexedValue[], IndexedValue[]]): number {
    try {
        const [leftList, rightList] = input;
        
        const sortedLeftList = [...leftList].sort((a, b) => a[0] - b[0]);
        const sortedRightList = [...rightList].sort((a, b) => a[0] - b[0]);
        console.table(sortedLeftList.map((item, index) => [item[0], sortedRightList[index][0]]));

        const sumOfDistance = sortedLeftList.reduce((acc, cur, index) => {
            return acc + Math.abs(sortedRightList[index][0] - cur[0]);
        }, 0);

        return sumOfDistance;
    } catch (error) {
        throw new Error(`Error solving puzzle 1: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

/**
 * Solves part 2 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 2
 */
function solvePuzzle2(input: [IndexedValue[], IndexedValue[]]): number {
    try {
        const [leftList, rightList] = input;
        
        const rightFrequencyMap = new Map<number, number>();
        for (const [value, _] of rightList) {
            rightFrequencyMap.set(value, (rightFrequencyMap.get(value) ?? 0) + 1);
        }

        const similarityScore = leftList.reduce((total, [leftValue, _]) => {
            const matchCount = rightFrequencyMap.get(leftValue) ?? 0;
            return total + (matchCount * leftValue);
        }, 0);

        return similarityScore;
    } catch (error) {
        throw new Error(`Error solving puzzle 2: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

async function main(): Promise<void> {
    try {
        const rawInput = await getInput(2024, 1);
        const formattedInput = formatInput(rawInput);

        const solution1 = solvePuzzle1(formattedInput);
        console.log("Solution 1:", solution1);
        const isCorrect1 = await checkAnswer(2024, 1, solution1.toString(), 1);
        console.log("Is correct 1:", isCorrect1);
        
        const solution2 = solvePuzzle2(formattedInput);
        console.log("Solution 2:", solution2);
        const isCorrect2 = await checkAnswer(2024, 1, solution2.toString(), 2);
        console.log("Is correct 2:", isCorrect2);
    } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : "Unknown error");
        process.exit(1);
    }
}

main();

