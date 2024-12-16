/**
 * Creates a 2D grid from a string input
 * @param input - String representing a grid with newline separators
 * @returns 2D array of characters
 */
export const createGrid = (input: string) => {
	return input.split("\n").map((line) => line.split(""));
};

/**
 * Converts a tuple of values into a string representation
 * @param values - Tuple of values to convert
 * @returns String representation of the tuple
 */
export const convertTupleToString = <T extends readonly unknown[]>(...values: T): string => {
	return values.join(",");
};

/**
 * Converts a string representation back into a tuple of values
 * @param str - String to convert
 * @param converters - Array of conversion functions for each value
 * @returns Tuple of converted values
 * @throws {TypeError} If the number of values doesn't match the number of converters
 */
export const convertStringToTuple = <T extends unknown[]>(
	str: string,
	converters: { [K in keyof T]: (value: string) => T[K] }
): T => {
	const values = str.split(",");
	
	if (values.length !== converters.length) {
		throw new TypeError(
			`Mismatch between number of values (${values.length}) and converters (${converters.length})`
		);
	}

	return values.map((value, index) => converters[index](value)) as T;
};