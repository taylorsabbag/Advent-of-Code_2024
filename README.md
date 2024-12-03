<div align="center">

# 🎄 Advent of Code 2024 Solutions

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js Version](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![Code Style: Prettier](https://img.shields.io/badge/Code_Style-Prettier-ff69b4.svg?logo=prettier)](https://github.com/prettier/prettier)
[![ESLint](https://img.shields.io/badge/ESLint-Configured-4B32C3?logo=eslint)](https://eslint.org/)

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

```
advent-of-code_2024/
├── solutions/          # Daily solutions
│   ├── day-N/         # N = day number
│   │   └── index.ts   # Solution implementation
│   └── template/      # Solution template
├── utils/             # Shared utilities
├── dist/              # Compiled output
└── .cache/            # Cached puzzle inputs
```

## Running Solutions

```bash
# Run specific day
DAY=N npm run start:day    # N = 1-25

# Run current day
npm run day

# Run latest solution
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
```

### Creating Solution Files

The project includes scripts to create the necessary file structure for solutions:

```bash
# Create a single day's files
npm run new N      # Replace N with day number (1-25)

# Create files for all 25 days at once
npm run new:all
```

Each generated day folder includes:
- A TypeScript solution file (`index.ts`)
- An empty input file (`input.txt`) for the day's puzzle input
- A README with space for notes and problem description

## Solution Template

Each solution includes:

- Strong TypeScript types
- Input parsing utilities
- Performance measurements
- Error handling
- Consistent structure

## Tech Stack

- **Language:** TypeScript 5.7
- **Runtime:** Node.js 20.x
- **Module System:** ESM
- **Development:**
  - ESLint
  - Prettier
  - tsx (for hot reloading)

## Caching

Input files are cached in `.cache/`:

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
