# Crypto Live Order Tracker

A real-time cryptocurrency trading platform that provides live order book data and trading capabilities across multiple crypto pairs.

## 🌟 Overview

This project consists of two main components:

- [Client Application](https://github.com/kaan35/crypto-live-order-tracker-client) - Next.js React-based frontend
- [API Server](https://github.com/kaan35/crypto-live-order-tracker-api) - Express.js backend
- [Web Structure](https://github.com/kaan35/crypto-live-order-tracker-web) - Docker compose and .env config

## ⭐ Key Features

### Real-time Order Book

- Live buy/sell order listings with price and quantity
- Real-time trade order tracking

### WebSocket Integration

- Socket.io implementation for real-time updates
- Instant order book synchronization
- Live in-app trade notifications notifications about executed trades for subscribed pairs (price, quantity, timestamp).
- Custom pair subscription system

### Trading Features

- Multiple trading pair support like BTC-USDT
- Order actions (buy/sell)
- Trade history tracking
- Real-time order and trade updates

### Technical Features

- Redis caching for optimized database queries
- Responsive design
- Containerized deployment with Docker
- Scalable architecture

## 🛠️ Technology Stack

### Frontend

- **Framework**: React.js with Next.js
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **WebSocket**: Socket.io

### Backend

- **Framework**: Express.js
- **Language**: Javascript
- **Database**: MongoDB
- **Caching**: Redis
- **WebSocket**: Socket.io

### DevOps & Tools

- **Code Quality**: ESLint, Prettier
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git

## 🏗️ Installation

### Prerequisites

- Docker and Docker Compose
- Git
- Node.js

### Local Development

- 1. Clone the repository:

     `git clone https://github.com/kaan35/crypto-live-order-tracker-api.git && cd crypto-live-order-tracker-api`

- 2. Install dependencies:

     `npm install`

- 3. Copy the config and database file and configure:

     `cp config.sample.js config.js`
     `cp db.sample.js db.js`

- 4. Start the development server:

     `npm run start:dev`

- 5. Build and run using Docker Compose:

     `docker-compose up -d`

The application will be available at [http://localhost:3000](http://localhost:3000)
