# Book Selling Platform

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the Server](#running-the-server)
- [Testing with Cypress](#testing-with-cypress)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Folder Structure](#folder-structure)
- [License](#license)

## Introduction

This is a book-selling platform built with Express.js, Sequelize, and MySQL. The platform includes user authentication, book management, and analytics features. API documentation is provided using Swagger.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/)
- [MySQL](https://dev.mysql.com/downloads/mysql/)
- [Git](https://git-scm.com/)

Also, do not forget to populate your database through mysql workbench or cli for testing.

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/AbdulBima/xupertest.git
   cd book-selling-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the environment variables**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   DB_NAME=
   DB_USER=
   DB_PASS=
   DB_HOST=
   JWT_SECRET=
   ```

4. **Start the MySQL server**

   Ensure you have a MySQL server running. If you installed MySQL locally, you can start it with the following command:

   ```bash
   mysql.server start
   ```

5. **Create the database**

   Log in to the MySQL server and create the database:

   ```bash
   mysql -u root -p
   CREATE DATABASE book_selling_platform;
   ```

## Running the Server

1. **Start the server**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

2. **Sync the database**

   The Sequelize models will automatically sync with the database when the server starts.

## Testing with Cypress

Cypress is used for end-to-end testing of the API endpoints.

1. **Install Cypress**

   Cypress is already included as a dev dependency. If you need to install it, run:

   ```bash
   npm install cypress --save-dev
   ```

2. **Configure Cypress**

   Create a `cypress.config.js` file in the root directory with the following content:

   ```javascript
   const { defineConfig } = require('cypress');

   module.exports = defineConfig({
     e2e: {
       baseUrl: 'http://localhost:3000',
       setupNodeEvents(on, config) {
         // implement node event listeners here
       },
     },
   });
   ```

3. **Add Cypress test files**

   Create a directory structure for Cypress tests:

   ```bash
   mkdir -p cypress/e2e
   ```

   Add your Cypress test files in the `cypress/e2e` directory.

4. **Run Cypress tests**

   Open Cypress test runner:

   ```bash
   npx cypress open
   ```

   This will open the Cypress Test Runner where you can run your tests.

## Environment Variables

The application uses the following environment variables:

- `DB_NAME`: The name of the database.
- `DB_USER`: The database user.
- `DB_PASS`: The database user's password.
- `DB_HOST`: The database host.
- `JWT_SECRET`: The secret key for JWT authentication.

## API Documentation

API documentation is available at `http://localhost:3000/api-docs` once the server is running. The documentation is generated using Swagger.

## Folder Structure

```
├── config
│   └── database.js
├── controllers
│   ├── bookController.js
│   └── userController.js
├── middlewares
│   └── auth.js
├── models
│   ├── Book.js
│   ├── Sale.js
│   └── User.js
├── routes
│   ├── bookRoutes.js
│   ├── userRoutes.js
│   └── analyticsRoutes.js
├── services
│   └── externalAPIs.js
├── tests
│   └── cypress
│       ├── e2e
│       │   └── ...
│       └── support
│           └── ...
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```