export default function timed<T>(
	fn: (input: T) => number | string,
): (input: T) => number | string {
	return (input: T) => {
		const start = performance.now();
		const result = fn(input);
		const end = performance.now();
		console.log(`Time taken: ${(end - start).toFixed(2)}ms`);
		return result;
	};
}
