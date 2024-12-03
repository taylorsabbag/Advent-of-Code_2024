import fs from "node:fs/promises";
import path from "node:path";

async function createDay(day: number): Promise<void> {
	const solutionDir = path.join("solutions", `day-${day}`);
	const templatePath = path.join("solutions", "template", "template.ts");

	try {
		// Create directory
		await fs.mkdir(solutionDir, { recursive: true });

		// Read template
		const template = await fs.readFile(templatePath, "utf-8");

		// Replace placeholder
		const content = template.replace(/Day N/g, `Day ${day}`);

		// Write new solution file
		await fs.writeFile(path.join(solutionDir, "index.ts"), content);

		console.log(`Created solution template for day ${day}`);
	} catch (error) {
		console.error("Error creating day:", error);
	}
}

const day = process.argv[2] ? Number.parseInt(process.argv[2]) : new Date().getDate();
createDay(day);
