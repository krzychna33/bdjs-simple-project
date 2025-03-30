# BDJS Project

A monorepo project for collecting and displaying gold prices data. The project consists of three main packages:

## Project Structure

### 1. Web (`packages/web`)
A React-based frontend application for displaying gold prices data.
- Built with React, TypeScript, and Vite
- Uses Recharts for data visualization
- Axios for API communication

### 2. API (`packages/api`)
Express.js backend service for managing gold prices data.
- Built with Express, TypeScript, and MongoDB
- Provides RESTful endpoints for gold prices data
- Includes data validation and transformation

### 3. Collector (`packages/collector`)
CLI tool for collecting gold prices data from external sources.
- Built with TypeScript and Commander.js
- Collects and stores gold prices data in the database
- Can be run as a scheduled task

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MongoDB (provided via Docker)

## Getting Started


1. Install dependencies:
```bash
npm install
```

2. Start MongoDB using Docker Compose:
```bash
docker-compose up -d
```

3. Start the development servers:

In separate terminal windows:

```bash
# Start the API server
npm run dev

# Start the web application
npm run dev

# Using the collector (optional)
npm run build

# And then

node dist/index.js --dates 2024-01-03

```


## MongoDB Configuration

The project uses MongoDB with the following default configuration:
- Port: 27037
- Username: admin
- Password: password123
- Database: gold-prices

These settings can be modified in the `docker-compose.yml` file. 