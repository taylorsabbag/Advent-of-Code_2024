export default class AoCError extends Error {
	constructor(
		message: string,
		public readonly day: number,
		public readonly part: 1 | 2,
		public readonly originalError?: Error,
	) {
		super(`Day ${day}, Part ${part}: ${message}`);
		this.name = "AoCError";
	}
}
