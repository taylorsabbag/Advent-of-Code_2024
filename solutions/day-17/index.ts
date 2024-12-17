/**
 * Solution for Advent of Code 2024 - Day 17
 * @see https://adventofcode.com/2024/day/17
 */

import { AoCError, extractDayNumber, getCurrentYear, runner as runSolution, timed } from "@utils/index.js";

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

type RegisterState = Record<"registerA" | "registerB" | "registerC", bigint>;

function formatInput(input: string) {
	const [registers, program] = input.split("\n\n");
	const registerEntries = registers.split("\n").map(line => {
		const [name, value] = line.split(": ");
		return [name.replace("Register ", "").toLowerCase(), Number(value)];
	});
	
	return {
		registerA: registerEntries[0][1],
		registerB: registerEntries[1][1],
		registerC: registerEntries[2][1],
		programArray: program.replace("Program: ", "").trim().split(",").map(Number)
	};
}

function getOperandValue(operand: number, state: RegisterState): bigint {
	const operandMap: Record<number, bigint> = {
		0: 0n, 1: 1n, 2: 2n, 3: 3n,
		4: state.registerA,
		5: state.registerB,
		6: state.registerC
	};
	return operandMap[operand] ?? 0n;
}

function executeInstruction(
	opcode: OpCode,
	operand: number,
	state: RegisterState,
	instructionPointer: number
): { nextPointer: number; output?: number } {
	const operandValue = getOperandValue(operand, state);
	const nextPointer = instructionPointer + 2;

	const instructions: Record<OpCode, () => { nextPointer: number; output?: number }> = {
		[OpCode.ADV]: () => {
			state.registerA >>= operandValue;
			return { nextPointer };
		},
		[OpCode.BXL]: () => {
			state.registerB ^= BigInt(operand);
			return { nextPointer };
		},
		[OpCode.BST]: () => {
			state.registerB = operandValue & 7n;
			return { nextPointer };
		},
		[OpCode.JNZ]: () => ({
			nextPointer: state.registerA !== 0n ? operand : nextPointer
		}),
		[OpCode.BXC]: () => {
			state.registerB ^= state.registerC;
			return { nextPointer };
		},
		[OpCode.OUT]: () => ({
			nextPointer,
			output: Number(operandValue & 7n)
		}),
		[OpCode.BDV]: () => {
			state.registerB = state.registerA >> operandValue;
			return { nextPointer };
		},
		[OpCode.CDV]: () => {
			state.registerC = state.registerA >> operandValue;
			return { nextPointer };
		}
	};

	const instruction = instructions[opcode];
	if (!instruction) {
		throw new Error(`Invalid opcode: ${opcode}`);
	}
	return instruction();
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

function solvePart2(input: ReturnType<typeof formatInput>): number {
	try {
		const program = input.programArray.flat();
		let resultValue = 0n;

		function findValidSequence(
			programIndex: number,
			accumulator: bigint,
		): boolean {
			if (programIndex < 0) {
				resultValue = accumulator;
				return true;
			}

			for (let digit = 0; digit < 8; digit++) {
				const state: RegisterState = {
					registerA: (accumulator << 3n) | BigInt(digit),
					registerB: 0n,
					registerC: 0n,
				};
				let instructionPointer = 0;
				let outputValue: number | undefined;

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
						outputValue = result.output;
						break;
					}

					instructionPointer = result.nextPointer;
				}

				if (
					outputValue === program[programIndex] &&
					findValidSequence(
						programIndex - 1,
						(accumulator << 3n) | BigInt(digit),
					)
				) {
					return true;
				}
			}
			return false;
		}

		findValidSequence(program.length - 1, 0n);
		return Number(resultValue);
	} catch (error) {
		throw new AoCError(
			`Error solving part 2: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			2,
			error instanceof Error ? error : undefined,
		);
	}
}

// Execute solution
runSolution(
	CURRENT_YEAR,
	CURRENT_DAY,
	formatInput,
	timed(solvePart1),
	timed(solvePart2),
	testInput,
);
