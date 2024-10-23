# Chat App

## Overview

The **Chat App** is a real-time messaging platform that allows users to communicate in different chat rooms, send private messages, and more. Built using Node.js and Express on the backend, React for the frontend, and WebSockets powered by Socket.IO for real-time communication. The app uses **Vite** for fast bundling and **Tailwind CSS** for a modern and responsive design.

## Features

- 🔥 **Real-time Messaging**: Powered by WebSocket technology (Socket.IO).
- 💬 **Multiple Chat Rooms**: Join or create rooms for group conversations.
- 🧑‍🤝‍🧑 **Direct Messaging**: Private 1-on-1 chat feature.
- 🖥️ **Responsive Design**: Tailwind CSS ensures the app works seamlessly across devices.
- ⚡ **Fast Development with Vite**: Lightning-fast builds and HMR (Hot Module Replacement) for an
  improved developer experience.

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime for the backend.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user information and chat data.

- **Socket.IO**: Enables real-time, bidirectional communication between the client and server.

### Frontend
- **React.js**: JavaScript library for building dynamic user interfaces.
- **Vite**: Fast and modern build tool for a smooth development experience.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Socket.IO Client**: For connecting to the WebSocket server from the frontend.

## Folder Structure

```
chat-app/
├── client/               # React frontend with Vite
│   ├── public/           # Public assets (HTML, icons, etc.)
│   └── src/              # React source code
│       └── ...           # Frontend files 
├── server/               # Express backend 
│   ├── app.js            # Entry point for the backend 
│   └── ...               # Other backend files 
├── package.json          # Node.js dependencies and scripts 
└── README.md             # Project documentation 
```

## Installation
