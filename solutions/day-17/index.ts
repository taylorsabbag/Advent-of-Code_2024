/**
 * Solution for Advent of Code 2024 - Day 17
 * @see https://adventofcode.com/2024/day/17
 */

import {
	runner as runSolution,
	extractDayNumber,
	getCurrentYear,
	timed,
	AoCError,
} from "@utils/index.js";

const CURRENT_DAY = extractDayNumber(import.meta.url);
const CURRENT_YEAR = getCurrentYear();

const testInput = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`;

let REGISTER_A = 0;
let REGISTER_B = 0;
let REGISTER_C = 0;

/**
 * Formats the raw input string into the required data structure
 * @param input - Raw puzzle input string
 * @returns Formatted input data
 */
function formatInput(input: string) {
	try {
		const [registers, program] = input.split("\n\n");
		const [registerA, registerB, registerC] = registers.split("\n");
		REGISTER_A = Number.parseInt(registerA.split(": ")[1]);
		REGISTER_B = Number.parseInt(registerB.split(": ")[1]);
		REGISTER_C = Number.parseInt(registerC.split(": ")[1]);

		const programNumbers = program.replace("Program: ", "").trim();
		const numbers = programNumbers
			.split(",")
			.map((value) => Number.parseInt(value));

		const programArray = numbers.reduce<[number, number][]>(
			(acc, value, index) => {
				if (index % 2 === 0) {
					acc.push([value, numbers[index + 1]]);
				}
				return acc;
			},
			[],
		);
		return programArray;
	} catch (error) {
		throw new AoCError(
			`Error formatting input: ${error instanceof Error ? error.message : "Unknown error"}`,
			CURRENT_DAY,
			1,
			error instanceof Error ? error : undefined,
		);
	}
}

enum OpCode {
	ADV = 0,
	BXL = 1,
	BST = 2,
	JNZ = 3,
	BXC = 4,
	OUT = 5,
	BDV = 6,
	CDV = 7,
}

const opCodeMap: Record<OpCode, string> = {
	[OpCode.ADV]: "ADV",
	[OpCode.BXL]: "BXL",
	[OpCode.BST]: "BST",
	[OpCode.JNZ]: "JNZ",
	[OpCode.BXC]: "BXC",
	[OpCode.OUT]: "OUT",
	[OpCode.BDV]: "BDV",
	[OpCode.CDV]: "CDV",
};

let POINTER = 0;
const POINTER_INCREMENT = 1;

const movePointer = () => {
	POINTER += POINTER_INCREMENT;
};

type OperandIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const getComboOperandValue = (operand: OperandIndex): number => {
	switch (operand) {
		case 0: return 0;
		case 1: return 1;
		case 2: return 2;
		case 3: return 3;
		case 4: return REGISTER_A;
		case 5: return REGISTER_B;
		case 6: return REGISTER_C;
		default: throw new Error(`Invalid combo operand: ${operand}`);
	}
};

const adv = (comboOperand: OperandIndex) => {
	const result = Math.trunc(REGISTER_A / 2 ** getComboOperandValue(comboOperand));
	REGISTER_A = result;
	movePointer();
	console.log(`Result: ${result}`);
	return result;
};

const bxl = (literalOperand: number) => {
	const result = REGISTER_B ^ literalOperand;
	REGISTER_B = result;
	movePointer();
	return result;
};

const bst = (comboOperand: OperandIndex) => {
	const result = getComboOperandValue(comboOperand) % 8;
	REGISTER_B = result;
	movePointer();
	return result;
};

const jnz = (literalOperand: number) => {
	if (REGISTER_A !== 0) {
		POINTER = literalOperand;
	} else {
		movePointer();
	}
};

const bxc = (operand: number) => {
	const result = REGISTER_B ^ REGISTER_C;
	REGISTER_B = result;
	movePointer();
	return result;
};

const out = (comboOperand: OperandIndex) => {
	const value = getComboOperandValue(comboOperand);
	const result = value % 8;
	movePointer();
	console.log(`Result: ${result}`);
	return result;
};

const bdv = (comboOperand: OperandIndex) => {
	const result = Math.trunc(REGISTER_A / 2 ** getComboOperandValue(comboOperand));
	REGISTER_B = result;
	movePointer();
	return result;
};

const cdv = (comboOperand: OperandIndex) => {
	const result = Math.trunc(REGISTER_A / 2 ** getComboOperandValue(comboOperand));
	REGISTER_C = result;
	movePointer();
	return result;
};

const opCodeReducer = (opCode: OpCode) => {
	const opCodeString = opCodeMap[opCode];
	if (!opCodeString) {
		throw new Error(`Invalid opcode: ${opCode}`);
	}

	switch (opCodeString) {
		case "ADV":
			return adv;
		case "BXL":
			return bxl;
		case "BST":
			return bst;
		case "JNZ":
			return jnz;
		case "BXC":
			return bxc;
		case "OUT":
			return out;
		case "BDV":
			return bdv;
		case "CDV":
			return cdv;
		default:
			throw new Error(`Invalid opcode: ${opCode}`);
	}
};

const runProgram = (program: [number, number][]) => {
	const outputs: number[] = [];

	while (POINTER < program.length) {
		const [opCode, operand] = program[POINTER];
		const opCodeFunction = opCodeReducer(opCode as OpCode);
		console.log(
			`Running ${opCodeMap[opCode as OpCode]} (${opCode}) with operand ${operand}`,
		);
		const result = opCodeFunction(operand as OperandIndex);
		console.log(`Pointer: ${POINTER}, Program: ${program[POINTER]}\n`);

		if (opCode === OpCode.OUT) {
			outputs.push(result as number);
		}
	}

	return outputs.join(",");
};

/**
 * Solves part 1 of the puzzle
 * @param input - Formatted input data
 * @returns Solution to part 1
 */
function solvePart1(input: ReturnType<typeof formatInput>): string {
	try {
		const result = runProgram(input);
		return result;
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
		return 0;
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
