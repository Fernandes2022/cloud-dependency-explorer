# Cloud Dependency Explorer

A full-stack cloud dependency visualization and impact analysis platform
that helps engineers understand relationships between services,
infrastructure resources, teams, environments, and deployments.

## Problem

In a distributed application, services often depend on other services
and infrastructure resources.

When a service or resource fails, it can be difficult to determine which
other parts of the system may be affected.

Cloud Dependency Explorer represents these relationships as a graph and
allows engineers to explore dependencies and perform impact analysis.

## Key Features

- Visualize service and infrastructure dependencies
- Explore relationships between services and resources
- View service ownership and deployment relationships
- Analyze potential impact when an infrastructure resource fails
- Highlight potentially affected services
- Interactive graph visualization

## Architecture

React + TypeScript frontend
        |
        | HTTP / REST API
        v
Express + TypeScript backend
        |
        | Cypher queries
        v
Neo4j / CognoDB

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Flow
- Axios

### Backend

- Node.js
- Express
- TypeScript
- Neo4j Driver

### Database

- Neo4j / CognoDB

### Infrastructure

- Docker
- AWS
- Kubernetes
- Terraform
- CI/CD

## Data Model

The application models several types of entities:

- Service
- Resource
- Team
- Environment
- Deployment

Relationships include:

- DEPENDS_ON
- USES
- OWNED_BY
- DEPLOYED_TO
- DEPLOYS

Example:

API Gateway
    |
    DEPENDS_ON
    |
Order Service
    |
    DEPENDS_ON
    |
Payment Service
    |
    USES
    |
Payment Database

## Impact Analysis

The main feature is dependency impact analysis.

For example, if the Payment Database becomes unavailable,
the system can traverse the dependency graph and identify
services that could potentially be affected.

Example:

Payment Database
       ^
       |
     USES
       |
Payment Service
       ^
       |
   DEPENDS_ON
       |
Order Service
       ^
       |
   DEPENDS_ON
       |
API Gateway

This allows engineers to understand the potential blast radius
of an infrastructure failure.

## Project Structure

cloud_dependency_explorer/

├── backend/
│   ├── src/
│   │   ├── db/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   └── seed.ts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── README.md

## Running Locally

### Backend

cd backend

pnpm install

Create a `.env` file containing the required Neo4j
connection variables.

Run the database seed:

pnpm exec tsx src/seed.ts

Start the backend:

pnpm dev

### Frontend

cd frontend

pnpm install

Start the frontend:

pnpm dev

## Environment Variables

The backend requires Neo4j connection credentials.

See `.env.example` for the required variables.

Never commit actual credentials to source control.

## Future Improvements

- Authentication and authorization
- More advanced dependency traversal
- Historical deployment analysis
- Failure simulation
- Monitoring integration
- Real-time infrastructure status
- AWS resource discovery
- Kubernetes resource discovery
- Role-based access control