# Project Management Dashboard - Final Presentation

## Slide 1: Project Title
**Project Management Dashboard (MERN Capstone)**
*Presented by: [Student Name]*
*Full Stack Web Development - Week 4*

---

## Slide 2: Problem Statement
Modern teams struggle with fragmented workflows, juggling spreadsheets, chats, and emails to manage tasks. There is a strong need for a centralized, visual tool to track project progress, assign responsibilities, and monitor deadlines effectively.

---

## Slide 3: Solution
We built a intuitive, Kanban-style Project Management Dashboard. It allows teams to visually organize tasks into lists, move them through workflow stages via drag-and-drop, and filter critical tasks—bringing clarity and focus to project execution.

---

## Slide 4: Technology Stack
- **Frontend**: React 18, Vite, React Router, Context API, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose
- **Security**: JSON Web Tokens (JWT) & bcryptjs
- **Key Libraries**: `@hello-pangea/dnd`, `axios`, `lucide-react`

---

## Slide 5: System Architecture
The application uses a standard MERN stack RESTful architecture:
1. **Client Tier**: React SPA handles routing, UI state, and user interactions.
2. **Logic Tier**: Express API validates inputs, authenticates requests, and runs business logic.
3. **Data Tier**: MongoDB stores persistent documents (Users, Projects, Boards, Lists, Cards).

---

## Slide 6: Key Features
- Dynamic Dashboard with Analytics
- Infinite Kanban Boards per Project
- Fluid Drag-and-Drop Task Reordering
- Task Assignment, Priority, and Due Date tracking
- Search and Multi-parameter Filtering
- Comprehensive Project and Member Management

---

## Slide 7: Authentication and Security
- **Secure Passwords**: Hashed with bcrypt before storing in MongoDB.
- **Stateless Auth**: JWT-based authentication via HTTP Authorization headers.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `admin` and `member` roles. Users can only modify projects they own or are members of.

---

## Slide 8: Database Design
Normalized NoSQL Document structure utilizing Mongoose References (`ObjectId`):
- `User` (1) : (M) `Project`
- `Project` (1) : (M) `Board`
- `Board` (1) : (M) `List`
- `List` (1) : (M) `Card`

---

## Slide 9: Testing and Deployment
- **Testing**: Manual UI verification and backend endpoint testing via Postman to ensure RBAC and Drag-and-Drop state synchronization.
- **Database**: Hosted reliably on MongoDB Atlas.
- **API Server**: Render.
- **Frontend App**: Vercel / Netlify.

---

## Slide 10: Future Enhancements
- Real-time Collaboration (WebSockets/Socket.io)
- Email Notifications for assigned and overdue tasks
- File attachments on task cards
- Timeline/Gantt Chart view
