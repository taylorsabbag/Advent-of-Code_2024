/**
 * Solution for Advent of Code 2024 - Day 15
 * @see https://adventofcode.com/2024/day/15
 */

import {
	AoCError,
	extractDayNumber,
	getCurrentYear,
	runner as runSolution,
	timed,
} from "@utils/index.js";

const testInput =
	"##########\n#..O..O.O#\n#......O.#\n#.OO..O.O#\n#..O@..O.#\n#O#..O...#\n#O..O..O.#\n#.OO.O.OO#\n#....O...#\n##########\n\n<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^";

const CURRENT_DAY = extractDayNumber(import.meta.url);
const CURRENT_YEAR = getCurrentYear();

/**
 * Represents a complex number with real and imaginary parts
 */
interface Complex {
	real: number;
	imag: number;
}

/**
 * Creates a complex number from real and imaginary parts
 */
const complex = (real: number, imag: number): Complex => ({
	real,
	imag,
});

/**
 * Gets the real part of a complex number
 */
const real = (c: Complex): number => c.real;

/**
 * Gets the imaginary part of a complex number
 */
const imag = (c: Complex): number => c.imag;

/**
 * Adds two complex numbers
 */
const addComplex = (a: Complex, b: Complex): Complex => ({
	real: a.real + b.real,
	imag: a.imag + b.imag,
});

/**
 * Complex number arithmetic operations
 */
const complexOps = {
	add: (a: Complex, b: Complex): Complex => addComplex(a, b),
};

function formatInput(input: string): { grid: string; instructions: string } {
	try {
		const [grid, instructions] = input.split("\n\n");
		// Don't replace newlines with spaces, split them later
		return {
			grid,
			instructions: instructions.replace(/\n/g, ""),
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

// Update the Grid type to use the new Complex interface
type Grid = Map<string, string>; // Use string key as "real,imag"

// Helper to convert Complex to grid key
const toGridKey = (c: Complex): string => `${c.real},${c.imag}`;
const fromGridKey = (key: string): Complex => {
	const [real, imag] = key.split(",").map(Number);
	return complex(real, imag);
};

function solvePart1(input: ReturnType<typeof formatInput>): number {
	try {
		return solvePart1And2(input)[0];
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
		return solvePart1And2(input)[1];
	} catch (error) {
		throw new AoCError(
			`Error solving part 2: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			2,
			error instanceof Error ? error : undefined,
		);
	}
}

function solvePart1And2(input: ReturnType<typeof formatInput>): number[] {
	const { grid: originalGrid, instructions } = input;
	const results: number[] = [];

	const grids = [
		originalGrid,
		originalGrid
			.replace(/#/g, "##")
			.replace(/\./g, "..")
			.replace(/O/g, "[]")
			.replace(/@/g, "@."),
	];

	for (const gridStr of grids) {
		let grid = new Map<string, string>();

		// Split by newlines and process each row
		const rows = gridStr.split("\n");
		for (let j = 0; j < rows.length; j++) {
			const row = rows[j];
			for (let i = 0; i < row.length; i++) {
				grid.set(toGridKey(complex(i, j)), row[i]);
			}
		}

		// Find robot position
		const robotEntry = Array.from(grid.entries()).find(([_, v]) => v === "@");
		if (!robotEntry) throw new Error("Robot position not found");
		let pos = fromGridKey(robotEntry[0]);

		// Update the move function to use the new Complex type
		function move(grid: Grid, p: Complex, d: Complex): boolean {
			const newP = complex(p.real + d.real, p.imag + d.imag);
			const newPKey = toGridKey(newP);
			const pKey = toGridKey(p);

			if (!grid.has(newPKey)) return false;

			const cell = grid.get(newPKey);
			if (
				all([
					cell !== "[" ||
						(move(grid, complex(newP.real + 1, newP.imag), d) &&
							move(grid, newP, d)),
					cell !== "]" ||
						(move(grid, complex(newP.real - 1, newP.imag), d) &&
							move(grid, newP, d)),
					cell !== "O" || move(grid, newP, d),
					cell !== "#",
				])
			) {
				const temp = grid.get(newPKey);
				grid.set(newPKey, grid.get(pKey) ?? ".");
				grid.set(pKey, temp ?? ".");
				return true;
			}
			return false;
		}

		// Update the direction mapping
		const directions: Record<string, Complex> = {
			"<": complex(-1, 0),
			">": complex(1, 0),
			"^": complex(0, -1),
			v: complex(0, 1),
		};

		// Process moves using complex numbers for directions
		for (const m of instructions) {
			const dir = directions[m];

			if (!dir) continue;

			const gridCopy = new Map(grid);
			if (move(grid, pos, dir)) {
				pos = complex(pos.real + dir.real, pos.imag + dir.imag);
			} else {
				grid = gridCopy;
			}
		}

		// Calculate sum using complex numbers
		let sum = complex(0, 0);
		for (const [pos, cell] of grid.entries()) {
			if (cell === "O" || cell === "[") {
				sum = complexOps.add(sum, fromGridKey(pos));
			}
		}
		results.push(Math.floor(real(sum) + imag(sum) * 100));
	}

	return results;
}

const all = (conditions: boolean[]): boolean => conditions.every(Boolean);

runSolution(
	CURRENT_YEAR,
	CURRENT_DAY,
	formatInput,
	timed(solvePart1),
	timed(solvePart2),
);
