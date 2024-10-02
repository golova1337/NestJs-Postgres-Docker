# E-commerce API Project (Nest.js, Sequelize, PostgreSQL, BullMQ, Elasticsearch, Redis, Stripe, CQRS)

## Overview

This project is an e-commerce API built with **Nest.js** and integrates various technologies, including:

- **Sequelize** for ORM
- **PostgreSQL** as the database
- **BullMQ** for task queues
- **Elasticsearch** for advanced search capabilities
- **Redis** for caching and messaging
- **Stripe** for payment processing

The project utilizes **CQRS** (Command Query Responsibility Segregation) architecture to handle complex operations and improve scalability.

## Technologies Used

- **Nest.js:** A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Sequelize:** A promise-based Node.js ORM for PostgreSQL.
- **PostgreSQL:** A powerful, open-source object-relational database system.
- **BullMQ:** A modern library for handling job and message queues.
- **Elasticsearch:** A distributed, RESTful search and analytics engine.
- **Redis:** An in-memory data structure store used as a database, cache, and message broker.
- **Stripe:** A comprehensive payment processing platform for handling online payments.
- **CQRS:** Command Query Responsibility Segregation, a pattern to separate read and write operations for better scalability.

## Getting Started

### Prerequisites

1. **Git:** Ensure Git is installed to clone the repository.
2. **Docker:** Install Docker to manage containerized applications. You can download it from [Docker Desktop](https://www.docker.com/products/docker-desktop/).
3. **Stripe Account:** Create a Stripe account and obtain API keys from [Stripe Dashboard](https://dashboard.stripe.com/).

### Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/golova1337/NestJs-Postgres-Docker.git
   ```

2. **Navigate to the Project Directory:**

   cd NestJs-Postgres-Docker

3. **Install Dependencies:**

   npm install

4. **Create .env file and fill it the following example .env.example:**

   .env

5. **Run Docker:**

   docker-compose up (docker-compose up -d)

6. **Start the Application:**

   npm run start

7. **Start the Testing:**

   npm run test:e2e

8. **Stope Docker:**

   docker-compose down


## Additional Information

- Documentation: For more details on each technology and how they integrate, refer to their respective official documentation.
- Troubleshooting: If you encounter issues, check the logs using docker-compose logs or consult the documentation for each tool.
