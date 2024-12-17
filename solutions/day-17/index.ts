/**
 * Solution for Advent of Code 2024 - Day 17
 * @see https://adventofcode.com/2024/day/17
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

const testInput = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`;

enum OpCode {
	ADV = 0, // Advance
	BXL = 1, // B XOR Literal
	BST = 2, // B Store
	JNZ = 3, // Jump if Not Zero
	BXC = 4, // B XOR C
	OUT = 5, // Output
	BDV = 6, // B Divide
	CDV = 7, // C Divide
}

/**
 * Constants for bitwise operations in the virtual machine
 */
const BITS_PER_DIGIT = 3n;
const DIGIT_MASK = 7n;
const MAX_DIGIT = 8;

/**
 * Represents the result of executing a single instruction
 * @property nextPointer - The next instruction pointer position
 * @property output - Optional output value produced by the instruction
 */
type ExecutionResult = {
	nextPointer: number;
	output?: number;
};

/**
 * Represents the state of the virtual machine's registers
 */
type RegisterState = Record<"registerA" | "registerB" | "registerC", bigint>;

function formatInput(input: string) {
	const [registers, program] = input.split("\n\n");
	const registerEntries = registers.split("\n").map((line) => {
		const [name, value] = line.split(": ");
		return [name.replace("Register ", "").toLowerCase(), Number(value)];
	});

	return {
		registerA: registerEntries[0][1],
		registerB: registerEntries[1][1],
		registerC: registerEntries[2][1],
		programArray: program
			.replace("Program: ", "")
			.trim()
			.split(",")
			.map(Number),
	};
}

/**
 * Gets the value of an operand based on the current register state
 * @param operand - The operand value (0-6)
 * @param state - Current state of the registers
 * @returns The resolved operand value
 */
function getOperandValue(operand: number, state: RegisterState): bigint {
	const operandMap: Record<number, bigint> = {
		0: 0n,
		1: 1n,
		2: 2n,
		3: 3n,
		4: state.registerA,
		5: state.registerB,
		6: state.registerC,
	};
	return operandMap[operand] ?? 0n;
}

/**
 * Executes a single instruction in the virtual machine
 * @param opcode - The operation to perform
 * @param operand - The operand for the operation
 * @param state - Current state of the registers
 * @param instructionPointer - Current position in the program
 * @returns Result containing next instruction pointer and optional output
 * @throws Error if opcode is invalid
 */
function executeInstruction(
	opcode: OpCode,
	operand: number,
	state: RegisterState,
	instructionPointer: number,
): ExecutionResult {
	const operandValue = getOperandValue(operand, state);
	const nextPointer = instructionPointer + 2;

	const instructions = {
		[OpCode.ADV]: () => {
			state.registerA >>= operandValue;
			return { nextPointer };
		},
		[OpCode.BXL]: () => {
			state.registerB ^= BigInt(operand);
			return { nextPointer };
		},
		[OpCode.BST]: () => {
			state.registerB = operandValue & DIGIT_MASK;
			return { nextPointer };
		},
		[OpCode.JNZ]: () => ({
			nextPointer: state.registerA !== 0n ? operand : nextPointer,
		}),
		[OpCode.BXC]: () => {
			state.registerB ^= state.registerC;
			return { nextPointer };
		},
		[OpCode.OUT]: () => ({
			nextPointer,
			output: Number(operandValue & DIGIT_MASK),
		}),
		[OpCode.BDV]: () => {
			state.registerB = state.registerA >> operandValue;
			return { nextPointer };
		},
		[OpCode.CDV]: () => {
			state.registerC = state.registerA >> operandValue;
			return { nextPointer };
		},
	} satisfies Record<OpCode, () => ExecutionResult>;

	return instructions[opcode]?.() ?? 
		(() => { throw new Error(`Invalid opcode: ${opcode}`); })();
}

function solvePart1(input: ReturnType<typeof formatInput>): string {
	try {
		const program = input.programArray;
		const state: RegisterState = {
				registerA: BigInt(input.registerA),
				registerB: BigInt(input.registerB),
				registerC: BigInt(input.registerC),
		};
		const outputs: number[] = [];
		let instructionPointer = 0;

		while (instructionPointer < program.length) {
			const opcode = program[instructionPointer];
			const operand = program[instructionPointer + 1];

			const result = executeInstruction(
				opcode as OpCode,
				operand,
				state,
				instructionPointer,
			);

			if (result.output !== undefined) {
				outputs.push(result.output);
			}

			instructionPointer = result.nextPointer;
		}

		return outputs.join(",");
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
 * Solves part 2 by finding the smallest input value that generates
 * the target program sequence
 * @param input - Formatted input containing program and initial register values
 * @returns The smallest input value that generates the target sequence
 */
function solvePart2(input: ReturnType<typeof formatInput>): number {
	const program = input.programArray.flat();
	let resultValue = 0n;

	/**
	 * Executes the program until an output is produced
	 * @param state - Initial register state
	 * @returns The output value or undefined if no output is produced
	 */
	function runUntilOutput(registerA: bigint): number | undefined {
		let instructionPointer = 0;
		const state = { registerA, registerB: 0n, registerC: 0n };
		
		while (instructionPointer < program.length) {
			const { nextPointer, output } = executeInstruction(
					program[instructionPointer] as OpCode,
					program[instructionPointer + 1],
					state,
					instructionPointer,
			);
			if (output !== undefined) return output;
			instructionPointer = nextPointer;
		}
	}

	/**
	 * Recursively finds a sequence of digits that produces the target program sequence
	 * @param programIndex - Current position in the program being matched
	 * @param accumulator - Built-up value of found digits
	 * @returns true if a valid sequence is found, false otherwise
	 */
	function findValidSequence(programIndex: number, accumulator: bigint): boolean {
		if (programIndex < 0) {
			resultValue = accumulator;
			return true;
		}

		for (let digit = 0; digit < MAX_DIGIT; digit++) {
			const testValue = (accumulator << BITS_PER_DIGIT) | BigInt(digit);
			const output = runUntilOutput(testValue);
			
			if (output === program[programIndex] && 
					findValidSequence(programIndex - 1, testValue)) return true;
		}
		return false;
	}

	findValidSequence(program.length - 1, 0n);
	return Number(resultValue);
}

runSolution(
	CURRENT_YEAR,
	CURRENT_DAY,
	formatInput,
	timed(solvePart1),
	timed(solvePart2),
	testInput,
);
