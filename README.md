# Project Management Dashboard - MERN Capstone

## Project Overview
The Project Management Dashboard is a full-stack web application designed for teams to organize, track, and manage their work seamlessly. Modeled after popular Kanban tools like Trello, it allows users to create projects, build custom boards, and manage task cards using an intuitive drag-and-drop interface. This project serves as the final Week 4 capstone for the Full Stack Web Development program.

## Features
- **Secure Authentication:** JWT-based user registration and login with encrypted passwords.
- **Role-Based Access Control:** Dual roles (Admin and Member) to restrict or grant permissions appropriately.
- **Projects & Boards:** Create infinite projects, each containing multiple kanban boards for organization.
- **Kanban Drag-and-Drop:** Fluidly drag tasks between lists and reorder them visually, with all state changes instantly persisting to MongoDB.
- **Task Management:** Assign tasks, set priorities (Low, Medium, High), manage due dates, and monitor status.
- **Search & Filter:** Find tasks instantly using text search, or filter by Priority and Assignee.
- **Real-time Analytics:** A dynamic dashboard aggregating stats such as total projects, overdue tasks, and pending work.

## Technologies
- **Frontend:** React 18, Vite, React Router DOM, Context API, Vanilla CSS, `@hello-pangea/dnd`, Lucide Icons
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Deployment & Tooling:** Vite Build, ESLint, Postman (API Testing)

## Architecture
This app follows a traditional client-server architecture. The frontend is a Single Page Application (SPA) built with React that communicates with a RESTful Express.js API via Axios. The API acts as the intermediary, executing business logic and persisting data safely in MongoDB.

## Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd assignment4
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## Deployment
- **Frontend**: Designed for deployment on Vercel or Netlify.
- **Backend**: Designed for deployment on Render or Heroku.
- **Database**: MongoDB Atlas.

### Production Links
- **Live Demo**: [Pending Deployment]
- **Backend API**: [Pending Deployment]

## Future Improvements
- Implement WebSockets (Socket.io) for real-time collaboration.
- Add email notifications for overdue tasks.
- Allow uploading attachments to Task Cards.
- Implement a Dark/Light mode toggle (currently defaults to an aesthetically pleasing dark theme).
