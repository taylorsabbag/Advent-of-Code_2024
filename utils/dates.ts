/**
 * Extracts the day number from the current file path
 * @returns The day number from the file path, or 0 if not found
 */
export function extractDayNumber(currentFile: string): number {
	try {
		const pathname = new URL(currentFile).pathname;
		const segments = pathname.split("/");
		const daySegment = segments.find((segment) => segment.startsWith("day-"));

		if (!daySegment) {
			return 0;
		}

		const dayNumber = Number.parseInt(daySegment.replace("day-", ""));
		return Number.isNaN(dayNumber) ? 0 : dayNumber;
	} catch (error) {
		console.error("Error extracting day number:", error);
		return 0;
	}
}

/**
 * Extracts the current year from the current date
 * @returns The current year
 */
export function getCurrentYear(): number {
	return new Date().getFullYear();
}
