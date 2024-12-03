# Advent of Code 2024 Solutions

My solutions to the [Advent of Code 2024](https://adventofcode.com/2024) challenges, implemented in TypeScript.

## Prerequisites

- Node.js (Latest LTS recommended)
- npm
- A valid Advent of Code session token

## Setup

1. Clone the repository:

```bash
git clone [your-repo-url]
cd advent-of-code_2024
```
2. Install dependencies:
```bash
npm i
```
3. Create a `.env` file in the root directory
```bash
AOC_SESSION=your_session_token_here
```

## Project Structure
```
advent-of-code_2024/
    ├── solutions/ # Daily solution files
    │ └── day-N/ # N = day number
    │   └── index.ts # Solution implementation
    ├── utils/ # Utility functions
    ├── dist/ # Compiled JavaScript files
    └── README.md
```

## Running Solutions

1. Run a specific day:
```bash
DAY=N npm run start:day
```
Replace 'N' with the day number (1-25)
2. Run current day (default):
```bash
npm run day
```

## Development

To work on a solution with hot reloading:
```bash
npm run dev
```

## Building

To compile TypeScript files:
```bash
npm run build
```

## Solution Template

Each day's solution follows a consistent structure with:
- Input parsing
- Part 1 solution
- Part 2 solution
- Error handling
- TypeScript type safety

## Technologies Used

- TypeScript
- Node.js
- ESM modules
- Environment variable support

## License

ISC

## Author

Taylor Sabbag

---

**Note**: Make sure to never commit your `.env` file or share your session token.