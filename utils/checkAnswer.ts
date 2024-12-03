/**
 * Response type for answer submission
 */
type AnswerResponse = {
  isCorrect: boolean;
  explanation: string;
  message: string;
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
    
    // Extract content from nested main>article>p tags
    const mainContent = responseText.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? responseText;
    const articleContent = mainContent.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? mainContent;
    const paragraphContent = articleContent.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1]?.trim() ?? articleContent;
    
    // Remove any remaining HTML tags
    const cleanContent = paragraphContent.replace(/<[^>]+>/g, "").trim();
    const lowerCaseResponse = cleanContent.toLowerCase();

    let result: AnswerResponse = {
      isCorrect: false,
      explanation: "",
      message: cleanContent
    };

    // Check for rate limiting - either standalone or after incorrect answers
    if (lowerCaseResponse.includes("wait")) {
      // First try to match "have Xs left" pattern
      const timeLeftMatch = cleanContent.match(/have\s+(\d+[ms])\s+left/i);
      
      // If that doesn't work, fall back to the original pattern
      const waitTimeMatch = timeLeftMatch || cleanContent.match(
        /(?:wait|waiting)\s+(\d+)\s*(minutes?|mins?|seconds?|secs?|s|m)\b/i
      );
      
      let waitTime = "an unknown period";
      if (timeLeftMatch) {
        waitTime = timeLeftMatch[1]; // Already in the format we want (e.g., "20s")
      } else if (waitTimeMatch) {
        const [, duration, unit] = waitTimeMatch;
        const normalizedUnit = unit.toLowerCase().startsWith("m") ? "minutes" : "seconds";
        waitTime = `${duration} ${normalizedUnit}`;
      }

      const attemptsMatch = cleanContent.match(/guessed incorrectly (\d+) times/i);
      const attempts = attemptsMatch ? attemptsMatch[1] : null;

      result.explanation = attempts
        ? `Too many incorrect attempts (${attempts}). Please wait ${waitTime} before trying again.`
        : `Rate limited: Please wait ${waitTime} before trying again.`;
    }
    // Check for various success patterns
    else if (
      lowerCaseResponse.includes("that's the right answer") ||
      lowerCaseResponse.includes("you got the right answer") ||
      lowerCaseResponse.includes("correct answer")
    ) {
      result.isCorrect = true;
    }
    // Check for "too high" pattern
    else if (lowerCaseResponse.includes("too high")) {
      result.explanation = "Answer is too high.";
    }
    // Check for "too low" pattern
    else if (lowerCaseResponse.includes("too low")) {
      result.explanation = "Answer is too low.";
    }

    return result;

  } catch (error) {
    console.error("Error checking answer:", error);
    
    // If we have response text, include it in the error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const responseText = error instanceof Error && "responseText" in error 
      ? (error as { responseText: string }).responseText 
      : "";
    
    return {
      isCorrect: false,
      explanation: errorMessage,
      message: responseText,
    };
  }
}
