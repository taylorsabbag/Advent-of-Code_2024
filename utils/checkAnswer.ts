/**
 * Response type for answer submission
 */
type AnswerResponse = {
  isCorrect: boolean;
  message: string;
  isTooHigh?: boolean;
  isTooLow?: boolean;
};

// TODO: Fix this function. It's not working.

/**
 * Checks an answer for Advent of Code puzzle
 * @param year - The year of the puzzle
 * @param day - The day of the puzzle
 * @param answer - The answer to check
 * @param level - The puzzle level (1 or 2)
 * @returns Promise containing the submission result
 */
export default async function checkAnswer(
  year: number, 
  day: number, 
  answer: string, 
  level: 1 | 2
): Promise<AnswerResponse> {
  try {
    const formData = new URLSearchParams();
    formData.append("level", level.toString());
    formData.append("answer", answer);

    const response = await fetch(`https://adventofcode.com/${year}/day/${day}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: `session=${process.env.AOC_SESSION}`,
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    const lowerCaseResponse = responseText.toLowerCase();

    // Add debug logging
    console.log("Raw response from AoC server:", responseText);
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    // Check for various success patterns
    if (
      lowerCaseResponse.includes("that's the right answer") ||
      lowerCaseResponse.includes("you got the right answer") ||
      lowerCaseResponse.includes("correct answer")
    ) {
      return { isCorrect: true, message: "Correct answer!" };
    }

    // Check for "too high" pattern
    if (lowerCaseResponse.includes("too high")) {
      return { 
        isCorrect: false, 
        message: "Answer is too high", 
        isTooHigh: true 
      };
    }

    // Check for "too low" pattern
    if (lowerCaseResponse.includes("too low")) {
      return { 
        isCorrect: false, 
        message: "Answer is too low", 
        isTooLow: true 
      };
    }

    // If we get here, it's an incorrect answer but not too high/low
    return { 
      isCorrect: false, 
      message: `Incorrect answer. Server response: ${responseText.slice(0, 100)}...` 
    };

  } catch (error) {
    console.error("Error checking answer:", error);
    return {
      isCorrect: false,
      message: `Error checking answer: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
