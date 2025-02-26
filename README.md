# Bisdom

**Bisdom** is a web-based application designed for due diligence teams to perform top-down assessments of an organization's business domains. It enables teams to evaluate leadership, key performance indicators (KPIs), customer journey use cases, business capabilities, and their technology implementations. A key outcome is identifying differentiating domains that require in-house investment for competitive advantage.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Features

Bisdom provides a structured approach to assessing business domains through the following modules:

- **Leadership & Strategy**: Capture domain ownership and strategic goals.
- **KPIs**: Define and track performance metrics linked to strategic objectives.
- **Customer Use Cases**: Map customer journeys and their business value.
- **Business Capabilities**: Assess the operational abilities supporting use cases.
- **Implementation**: Evaluate the technology stack (applications, data, etc.) behind capabilities.
- **Continuous Improvement**: Track and prioritize enhancement initiatives.

Additionally, Bisdom includes a **Differentiation Analyzer** to identify domains critical for competitive advantage, guiding investment decisions for in-house development.

## Prerequisites

Before installing Bisdom, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (v4.4 or later)
- [Git](https://git-scm.com/)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/bisdom-app.git
   cd bisdom-app
   ```

2. **Install dependencies**:
   ```bash
   npm run install-all
   ```
   This will install dependencies for the root project, backend, and frontend.

3. **Set up environment variables**:
   ```bash
   # In backend/.env
   MONGO_URI=mongodb://localhost:27017/bisdom
   JWT_SECRET=your-secret-key-here
   PORT=5001
   MONGODB_DATA_PATH=~/Projects/bisdom-app/data/db
   ```

4. **Create MongoDB data directory**:
   ```bash
   mkdir -p data/db
   ```

## Development

The project includes several npm scripts for development:

```bash
# Start all services (MongoDB, backend, and frontend)
npm run dev

# Start individual services
npm run start:db        # Start MongoDB
npm run start:backend   # Start backend server
npm run start:frontend  # Start frontend development server
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- MongoDB: mongodb://localhost:27017/bisdom

## Testing

Bisdom includes automated tests to ensure functionality and stability:

### Backend Tests
```bash
cd backend
npm test  # Runs unit and integration tests
```

### Frontend Tests
```bash
cd frontend
npm test  # Runs unit and integration tests
npx cypress run  # Runs E2E tests
```

Test files are organized as follows:
```
bisdom-app/
├── backend/
│   └── tests/
│       ├── unit/          # Backend unit tests
│       ├── integration/   # Backend integration tests
│       └── mocks/        # Test mocks and fixtures
├── frontend/
│   ├── src/
│   │   └── tests/
│   │       ├── unit/     # Frontend unit tests
│   │       └── integration/ # Frontend integration tests
│   └── cypress/
│       └── integration/  # E2E tests
```

## Project Structure

```
bisdom-app/
├── backend/
│   ├── config/           # Database and configuration files
│   ├── middleware/       # Authentication middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes for each module
│   ├── tests/           # Backend tests
│   ├── .env             # Environment variables
│   ├── package.json
│   └── server.js        # Backend entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # Context providers (Auth, etc.)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service files
│   │   ├── styles/      # CSS styles
│   │   └── tests/       # Frontend tests
│   ├── cypress/         # E2E tests
│   └── package.json
├── data/
│   └── db/             # MongoDB data directory
├── .gitignore
├── package.json        # Root package.json with dev scripts
└── README.md
```

## Technologies

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest, React Testing Library, Cypress
- **Development**: Concurrently (for running multiple services)

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes and commit (`git commit -m 'Add your feature'`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a pull request

Please ensure your code follows the project's coding standards and includes relevant tests.

## License

This project is licensed under the MIT License. See the LICENSE file for details.