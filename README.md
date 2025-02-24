# Bisdom

**Bisdom** is a web-based application designed for due diligence teams to perform top-down assessments of an organization's business domains. It enables teams to evaluate leadership, key performance indicators (KPIs), customer journey use cases, business capabilities, and their technology implementations. A key outcome is identifying differentiating domains that require in-house investment for competitive advantage.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

---

## Features

Bisdom provides a structured approach to assessing business domains through the following modules:

- **Leadership & Strategy**: Capture domain ownership and strategic goals.
- **KPIs**: Define and track performance metrics linked to strategic objectives.
- **Customer Use Cases**: Map customer journeys and their business value.
- **Business Capabilities**: Assess the operational abilities supporting use cases.
- **Implementation**: Evaluate the technology stack (applications, data, etc.) behind capabilities.
- **Continuous Improvement**: Track and prioritize enhancement initiatives.

Additionally, Bisdom includes a **Differentiation Analyzer** to identify domains critical for competitive advantage, guiding investment decisions for in-house development.

---

## Prerequisites

Before installing Bisdom, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (v4.4 or later)
- [Git](https://git-scm.com/)

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/bisdom-app.git
   cd bisdom-app
   ```

2. **Set up the backend**:
   ```bash
   cd backend
   npm install
   ```
   Configure the database connection in `backend/config/db.js`. (update with your MongoDB URI).
   Start the backend server:
   ```bash
   npm start
   ```

3. **Set up the frontend**:
   ```bash
   cd ../frontend
   npm install
   ```
   Configure the API endpoint in `frontend/src/config.js`.
   Start the frontend server:
   ```bash
   npm start
   ```

4. **Access the application**:
   - Open your browser and navigate to http://localhost:3000 to use Bisdom.

---

## Usage

Login: Access the application at /login and enter your credentials.
- Manage Domains: Navigate to /domains to create or view business domains.
- Add KPIs: For a specific domain, go to /domains/:domainId/kpis to define KPIs linked to strategic goals.
- Define Use Cases: At /domains/:domainId/use-cases, create customer use cases and link them to KPIs and capabilities.
- Assess Capabilities: Use /domains/:domainId/capabilities to evaluate business capabilities and their maturity.
- Analyze Differentiation: (Planned for Phase 3) Identify key differentiators for in-house investment.

Project Structure
Bisdom is organized into backend and frontend directories:

bisdom-app/
├── backend/
│   ├── models/           # Mongoose schemas (Domain, KPI, UseCase, etc.)
│   ├── routes/           # API routes for each module
│   ├── config/           # Database and configuration files
│   ├── middleware/       # Authentication middleware
│   ├── package.json
│   └── server.js         # Backend entry point
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page-level components (Login, DomainList, etc.)
│   │   ├── App.js        # Main application component
│   │   └── index.js      # React entry point
│   ├── package.json
├── .gitignore
└── README.md

---

## Technologies

Bisdom is built using the following technologies:
Frontend: React.js, React Router, Axios
Backend: Node.js, Express.js, Mongoose
Database: MongoDB
Authentication: JWT (JSON Web Tokens)

---

## Contributing

Contributions are welcome! To contribute:
Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit (git commit -m 'Add your feature').
Push to your branch (git push origin feature/your-feature).
Open a pull request.
Please ensure your code follows the project's coding standards and includes relevant tests.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.


---

### Notes:
- **Repository Link**: Replace `https://github.com/your-repo/bisdom-app.git` with the actual URL of your repository.
- This `README.md` file is complete, well-structured, and ready to be placed in the root directory of the Bisdom application. It provides a comprehensive guide for users and contributors alike. Let me know if you need any adjustments!