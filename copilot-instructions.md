---
description: "Use when: working on the Node.js recipe CRUD app, following Express.js and Handlebars patterns, handling SQLite database operations, or implementing RESTful routes."
---

# GitHub Copilot Instructions

## Project Overview
This is a CRUD recipe application built with Node.js, Express, and Handlebars templating engine. The app allows users to create, read, update, and delete recipes with ingredients and cooking methods.

## Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: SQLite with custom database layer
- **Templating**: Handlebars.js
- **Testing**: Jest
- **Styling**: Vanilla CSS

## Code Style Guidelines
- Use ES6+ features and async/await for asynchronous operations
- Follow RESTful routing conventions for recipe operations
- Use semantic HTML and BEM-style CSS classes where appropriate
- Keep database queries in the `src/database/` directory
- Store all view templates in the `views/` directory with Handlebars syntax

## Key Patterns
- Database operations should use the custom connection layer in `src/database/`
- Routes are defined in `src/routes.js` following Express patterns
- Handlebars helpers for text formatting (split, newline, add) are available
- Use proper error handling for database operations and route handlers
- Follow the existing form structure for CRUD operations

## Testing
- Test files are in `__tests__/` directory
- Use Jest for unit and integration testing
- Include tests for both database operations and route handlers
- Mock database connections in tests using the test setup files