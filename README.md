# Chat Application

## Overview
This project is a **real-time chat application** built using the MERN (MongoDB, Express, React, Node.js) stack, enhanced with additional technologies like Redis for caching and Socket.IO for WebSocket communication. 
It showcases modern web development practices, efficient data management, and performance optimization techniques.

## Key Features
1. **Real-Time Messaging**: Instant message exchange using WebSocket with Socket.IO.
2. **Authentication**: Secure user login and registration with JWT and bcrypt.
3. **Chat Management**:
   - Displays active chats with the most recent messages.
   - Lazy loading for chat history.
4. **Online Status**: Tracks user sessions efficiently with Redis.
5. **Frontend**:
   - Built with React and styled using Tailwind CSS.
   - Component-based architecture with reusable custom hooks.
6. **Testing**:
   - End-to-end testing with Playwright.
   - Server-side testing using Jest and Supertest.
7. **CI/CD**: Automated workflows with GitHub Actions.

## Tech Stack
### Core Stack
- **MongoDB**: NoSQL database for storing chat messages and user data.
- **Express**: Node.js framework for building APIs.
- **React**: Frontend library for building the user interface.
- **Node.js**: Backend runtime for server-side logic.

### Additional Tools
- **Redis**: Used for caching online users and optimizing session management.
- **Socket.IO**: WebSocket library for real-time communication.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vite**: Fast build tool for frontend development.

### Testing
- **Playwright**: End-to-end testing for the frontend.
- **Jest + Supertest**: Testing server-side routes and APIs.

### Deployment
- **GitHub Actions**: Automated CI/CD pipeline for testing and deployment.

## Folder Structure
```
chat-app/
├── server/         # Backend API
├── socket/         # Socket.IO server
└── client/         # React frontend
```

## Installation and Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ofek29/chat-app.git
   cd chat-app
   ```
2. **Install Dependencies**:
   ```bash
   cd server
   npm install
  
   cd socket
   npm install
 
   cd client
   npm install
   ```
3. **Start the Application**:
   ```bash
   cd client
   npm start
   ```

The chat-app should now be accessible at http://localhost:5173.
   
