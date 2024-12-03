<!-- omit in toc -->
# Advent of Code 2024 Solutions

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Node.js Version](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)

My solutions to the [Advent of Code 2024](https://adventofcode.com/2024) challenges, implemented in TypeScript.

<!-- omit in toc -->
## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Running Solutions](#running-solutions)
- [Development](#development)
- [Building](#building)
- [Solution Template](#solution-template)
- [Contributing](#contributing)
- [Technologies Used](#technologies-used)
- [Caching](#caching)
- [Development Tools](#development-tools)
- [License](#license)
- [Author](#author)

## Features

- 🚀 Automatic puzzle input fetching
- ✅ Answer validation against AoC API
- 📝 TypeScript with strict type checking
- 🔄 Hot reloading during development
- 🧪 Consistent solution structure

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

To get your session token:

1. Log into [Advent of Code](https://adventofcode.com)
2. Open browser DevTools (F12)
3. Go to Application/Storage > Cookies
4. Copy the value of the 'session' cookie

## Project Structure

```
advent-of-code_2024/
    ├── solutions/ # Daily solution files
    │       ├── day-N/ # N = day number
    │       │     └── index.ts # Solution implementation
    │       └── template/
    │             └── template.ts # Template for all solutions
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

2. Run current day (uses today's date):

```bash
npm run day
```

3. Run most recent solution:

```bash
npm run start:latest
```

## Development

1. Create a new day's solution:

```bash
npm run new [day]  # day is optional, defaults to current date
```

2. Work on a solution with hot reloading:

```bash
DAY=N npm run dev
```

3. Code formatting and linting:

```bash
npm run format    # Format all files
npm run lint      # Check for issues
npm run lint:fix  # Automatically fix issues
```

4. Build the project:

```bash
npm run build
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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-solution`)
3. Commit your changes (`git commit -m 'Add amazing solution'`)
4. Push to the branch (`git push origin feature/amazing-solution`)
5. Open a Pull Request

## Technologies Used

- TypeScript
- Node.js
- ESM modules
- Environment variable support

## Caching

Input files are automatically cached in the `.cache` directory to:

- Reduce API calls to Advent of Code servers
- Enable offline development
- Speed up subsequent runs

Cached files are ignored by git to avoid sharing inputs.

## Development Tools

- 🔄 Hot module reloading with `tsx watch`
- 🎯 Path aliases for cleaner imports
- ⏱️ Solution timing decorators
- 🚨 Custom error handling
- 📝 Automatic day generation

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

Taylor Sabbag

---

**Note**: Make sure to never commit your `.env` file or share your session token.
