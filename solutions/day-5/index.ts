/**
 * Solution for Advent of Code 2024 - Day 5
 * @see https://adventofcode.com/2024/day/5
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
	"47|53\n97|13\n97|61\n97|47\n75|29\n61|13\n75|53\n29|13\n97|29\n53|29\n61|53\n97|53\n61|29\n47|13\n75|47\n97|75\n47|61\n75|61\n47|29\n75|13\n53|13\n\n75,47,61,53,29\n97,61,53,29,13\n75,29,13\n75,97,47,61,53\n61,13,29\n97,13,75,29,47";

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		const [orderingRulesRaw, pagesToUpdateRaw] = input.split("\n\n");

		const orderingRules = orderingRulesRaw
			.split("\n")
			.map((rule) => rule.split("|").map((num) => Number.parseInt(num)));
		function createRuleMap(rules: number[][]) {
			return rules.reduce(
				(acc, curr) => {
					acc[curr[0]] = [...(acc[curr[0]] ?? []), curr[1]];
					return acc;
				},
				{} as Record<number, number[]>,
			);
		}
		const ruleMap = createRuleMap(orderingRules);

		const pagesToUpdate = pagesToUpdateRaw
			.split("\n")
			.filter(Boolean)
			.map((page) => page.split(",").map((num) => Number.parseInt(num)));

		return {
			orderingRules,
			pagesToUpdate,
			ruleMap,
		};
	} catch (error) {
		throw new AoCError(
			`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

function applyRules(
    pages: number[][],
    ruleMap: Record<number, number[]>,
): { correctPages: number[][]; incorrectPages: number[][] } {
    const correctPages: number[][] = [];
    const incorrectPages: number[][] = [];

    pages.forEach((page) => {
        // Exit early optimization
        let isCorrect = true;
        for (let i = 0; i < page.length && isCorrect; i++) {
            const num = page[i];
            const mustComeAfter = ruleMap[num];
            if (mustComeAfter) {
                for (const afterNum of mustComeAfter) {
                    const afterIndex = page.indexOf(afterNum);
                    if (afterIndex !== -1 && afterIndex <= i) {
                        isCorrect = false;
                        break;
                    }
                }
            }
        }

        if (isCorrect) {
            correctPages.push(page);
        } else {
            incorrectPages.push(page);
        }
    });

    return { correctPages, incorrectPages };
}

const findAndAddMiddle = (correctPages: number[][]) =>
	correctPages.reduce(
		(acc, curr) => acc + curr[Math.floor(curr.length / 2)],
		0,
	);

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		const { pagesToUpdate, ruleMap } = input;

		const { correctPages } = applyRules(pagesToUpdate, ruleMap);

		return findAndAddMiddle(correctPages);
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
		const { pagesToUpdate, ruleMap } = input;
		const { incorrectPages } = applyRules(pagesToUpdate, ruleMap);

		/**
		 * Performs an optimized topological sort on a page using the rules
		 * @param page - Array of numbers to sort
		 * @param rules - Map of numbers to their dependencies
		 * @returns Sorted array respecting dependencies
		 */
		function topologicalSort(page: number[], rules: Record<number, number[]>): number[] {
			// Pre-compute page number set for O(1) lookups
			const pageSet = new Set(page);
			
			// Pre-compute filtered dependencies
			const graph = new Map<number, number[]>();
			page.forEach(num => {
				// Only include dependencies that exist in the page
				graph.set(num, (rules[num] || []).filter(dep => pageSet.has(dep)));
			});

			const result: number[] = [];
			const visited = new Array(Math.max(...page) + 1).fill(false);
			const temp = new Array(Math.max(...page) + 1).fill(false);

			function visit(node: number): void {
				if (temp[node]) {
					throw new Error("Circular dependency detected");
				}
				if (visited[node]) {
					return;
				}

				temp[node] = true;
				const dependencies = graph.get(node) || [];
				for (const dep of dependencies) {
					visit(dep);
				}
				temp[node] = false;
				visited[node] = true;
				result.unshift(node);
			}

			page.forEach(num => {
				if (!visited[num]) {
					visit(num);
				}
			});

			return result;
		}

		const correctedPages = incorrectPages.map(page => topologicalSort(page, ruleMap));
		return findAndAddMiddle(correctedPages);
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
