# Project Guidelines

## Technology Stack
- Node.js with Express
- SQLite via better-sqlite3
- EJS templates for server-rendered HTML
- xUnit-style tests with Jest

## Code Style
- Use async/await — never raw callbacks or `.then()` chains
- Follow the existing error handling pattern in `src/errorHandler.js`
- All new routes must be added to `src/routes.js` following the existing pattern
- Use 2-space indentation

## Testing
- Every new route must have a corresponding test in `tests/`
- Use supertest for HTTP integration tests

## Security
- Never log user-provided input directly
- Validate all request parameters before database access
