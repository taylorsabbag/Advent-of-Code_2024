/**
 * Solution for Advent of Code 2024 - Day 19
 * @see https://adventofcode.com/2024/day/19
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

const testInput = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

/**
 * Node in the trie representing towel patterns
 */
class Node {
	next: number[];
	constructor() {
		this.next = new Array(6).fill(0);
	}

	setTowel(): void {
		this.next[3] = 1;
	}

	towels(): number {
		return this.next[3];
	}
}

/**
 * Perfect hash function for the five possible colors
 * Maps w->0, u->2, b->4, r->5, g->1
 * @param b - ASCII code of the color character
 * @returns Index in the fixed-size array (0-7)
 */
function perfectHash(b: number): number {
	return (b ^ (b >> 4)) % 8;
}

/**
 * Builds a trie from the towel patterns for efficient prefix matching
 * @param towels - Array of towel patterns
 * @returns Array of trie nodes
 */
function buildTrie(towels: string[]): Node[] {
	const trie: Node[] = [new Node()];

	for (const towel of towels) {
		let i = 0;

		for (const char of towel) {
			const j = perfectHash(char.charCodeAt(0));
			if (trie[i].next[j] === 0) {
				trie[i].next[j] = trie.length;
				i = trie.length;
				trie.push(new Node());
			} else {
				i = trie[i].next[j];
			}
		}

		trie[i].setTowel();
	}

	return trie;
}

/**
 * Counts possible ways to create a design using the trie
 * @param trie - Trie containing valid towel patterns
 * @param design - Design pattern to match
 * @returns [isPossible, totalWays]
 */
function countWays(trie: Node[], design: string): [boolean, number] {
	const size = design.length;
	const ways: number[] = new Array(size + 1).fill(0);
	ways[0] = 1; // One way to create empty prefix

	for (let start = 0; start < size; start++) {
		if (ways[start] > 0) {
			let i = 0;

			for (let end = start; end < size; end++) {
				i = trie[i].next[perfectHash(design.charCodeAt(end))];
				if (i === 0) break;
				ways[end + 1] += trie[i].towels() * ways[start];
			}
		}
	}

	const total = ways[size];
	return [total > 0, total];
}

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns [part1Answer, part2Answer]
 */
function formatInput(input: string): [number, number] {
	try {
		const [prefix, suffix] = input.split("\n\n");
		const towels = prefix.split(", ").filter((t) => t.length > 0);
		const designs = suffix.split("\n").filter((d) => d.length > 0);

		const trie = buildTrie(towels);
		let part1 = 0;
		let part2 = 0;

		for (const design of designs) {
			const [possible, total] = countWays(trie, design);
			part1 += possible ? 1 : 0;
			part2 += total;
		}

		return [part1, part2];
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
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		return input[0];
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
		return input[1];
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
	testInput,
);
