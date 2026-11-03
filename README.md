# CampusLoop 🎓

**A Student Marketplace for Campus Communities**

CampusLoop is a full-stack student marketplace designed to help students buy, sell, rent, borrow, and swap items within their campus community.

The goal is to create a convenient and student-friendly platform where useful items can find a second life and students can connect with one another.

## ✨ Key Features

### Implemented
- User registration and login APIs
- Secure password hashing using bcrypt
- JWT-based authentication
- Protected user profile API
- MongoDB database integration
- React frontend with multiple pages
- Marketplace UI with search and category filters
- Item listing form and item details UI

### Planned
- Create, edit, and delete marketplace listings
- Dynamic marketplace connected to MongoDB
- Image uploads
- AI-powered chatbot
- AI-based marketplace search and recommendations
- Complete frontend and backend integration

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

**Tools**
- Git and GitHub
- VS Code
- MongoDB Atlas

## 📁 Project Structure

```text
CampusLoop/
├── frontend/             # Original frontend
├── client/               # React frontend
│   └── src/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/2006simranjeet1997-spec/CampusLoop.git
cd CampusLoop
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret
```

### 3. Start the backend

```bash
npm run dev
```

Backend runs at:

`http://localhost:5001`

### 4. Set up the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite.

## 🔐 Authentication API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/users/profile` | Get authenticated user profile |

Protected endpoints require a JWT token in the Authorization header:

```text
Authorization: Bearer YOUR_TOKEN
```

## 🎯 Project Goal

CampusLoop aims to make campus life more affordable, sustainable, and connected through a student-focused marketplace enhanced with AI capabilities.

## 🚀 Development Status

Currently under active development.

The project is being developed in a 10-day intensive development sprint, with a focus on MERN stack implementation, authentication, marketplace functionality, and AI integration.

---

**Built with ❤️ for students, by students.**
