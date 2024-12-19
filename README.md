<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041-->

<div align="center">

# 🎄 Advent of Code 2024 Solutions

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js Version](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![Biome](https://img.shields.io/badge/Biome-Latest-60A5FA?logo=biome)](https://biomejs.dev/)

My solutions to the [Advent of Code 2024](https://adventofcode.com/2024) challenges, implemented in TypeScript with a focus on clean, maintainable code.

[Features](#features) •
[Setup](#setup) •
[Usage](#running-solutions) •
[Development](#development)

</div>

## Features

- 🚀 **Automatic Input Fetching** - Downloads puzzle inputs with session token
- ✅ **Answer Validation** - Verifies solutions against AoC API
- 📝 **Type Safety** - Full TypeScript with strict checking
- 🔄 **Hot Reloading** - Instant feedback during development
- 🧪 **Consistent Structure** - Standardized solution template
- 💾 **Input Caching** - Offline development support
- ⚡ **Performance Tracking** - Solution execution timing
- 🛠️ **Developer Tools** - ESLint, Prettier, and more

## Prerequisites

- Node.js 20.x or later
- npm 9.x or later
- Advent of Code session token

## Setup

1. **Clone and Install**

   ```bash
   git clone [your-repo-url]
   cd advent-of-code_2024
   npm install
   ```

2. **Configure Environment**

   ```bash
   # Create .env file
   echo "AOC_SESSION=your_session_token_here" > .env
   ```

   To get your session token:
   1. Log into [Advent of Code](https://adventofcode.com)
   2. Open DevTools (F12) → Application → Storage → Cookies
   3. Copy the 'session' cookie value

## Project Structure

```txt
advent-of-code_2024/
├── solutions/           # Daily puzzle solutions
│   ├── day-{N}/        # Individual day solutions (1-25)
│   │   └── index.ts    # Solution implementation
│   └── template/       # Solution template files
├── utils/              # Shared utilities
│   ├── cache.ts        # Input caching functionality
│   ├── checkAnswer.ts  # Solution validation
│   ├── dates.ts        # Date handling utilities
│   ├── errors.ts       # Custom error types
│   ├── getInput.ts     # Puzzle input fetcher
│   ├── index.ts        # Utility exports
│   ├── performance.ts  # Timing utilities
│   └── runner.ts       # Solution runner
├── scripts/            # Project automation
│   └── create-day.ts   # Solution scaffolding
├── templates/          # Project templates
├── dist/              # Compiled output
├── .cache/            # Cached puzzle inputs
└── node_modules/      # Dependencies
```

### Key Directories

- **solutions/**: Contains daily puzzle solutions, each in its own directory with a standardized structure
- **utils/**: Shared utilities for input handling, performance tracking, and solution validation
- **scripts/**: Automation tools for project management and solution creation
- **templates/**: Template files for generating new solutions
- **dist/**: Compiled TypeScript output
- **.cache/**: Local cache for puzzle inputs (git-ignored)

### Solution Structure

Each day's solution follows a consistent pattern:

```txt
solutions/day-N/
└── index.ts           # Main solution file containing:
    ├── formatInput()  # Input parser
    ├── solvePart1()   # Part 1 solution
    └── solvePart2()   # Part 2 solution
```

The solution template includes:

- Strong TypeScript types
- Error handling with custom AoCError
- Performance tracking via the timed() wrapper
- Standardized input parsing
- Consistent error reporting

This structure ensures consistency across solutions while maintaining clean separation of concerns and reusable utilities.

## Running Solutions

```bash
# Run specific day
DAY=N npm run start:day    # N = 1-25

# Run current day
npm run day

# Run latest solution (that you've created; good when you're a day or more behind)
npm run start:latest

# Development mode with hot reload
DAY=N npm run dev
```

## Development

```bash
# Format code
npm run format

# Lint code
npm run lint
npm run lint:fix

# Build project
npm run build

# Run with test input
DAY=N npm run start:day:test

# Run current day with test input
npm run day:test

# Run latest solution with test input (that you've created; good when you're a day or more behind)
npm run start:latest:test

# Development mode with test input
DAY=N npm run dev:test
```

### Creating Solution Files

The project includes scripts to create the necessary file structure for solutions:

```bash
# Create a single day's files
npm run new N      # Replace N with day number (1-25)

# Create files for all 25 days at once
npm run new:all
```

## Tech Stack

- **Language:** TypeScript 5.7
- **Runtime:** Node.js 20.x
- **Module System:** ESM
- **Development:**
  - ESLint
  - Prettier
  - tsx (for hot reloading)

## Caching

Input files are cached in `/dist/.cache/`:

- Minimizes API requests
- Enables offline work
- Improves performance
- Git-ignored by default

## License

[ISC License](LICENSE)

## Author

Taylor Sabbag

---

<div align="center">
⭐ Star this repository if you find it helpful!

Made with ❤️ for Advent of Code
</div>
