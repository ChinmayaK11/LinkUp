# 🔗 LinkUp — Not Just A Platform, It's a Link

A full-stack social media web application built with **React**, **Node.js**, **MongoDB**, and **Socket.io**. LinkUp lets users connect, share posts, send real-time messages, and stay updated through stories and loops.

---

## 🚀 Features

- 🔐 **Authentication** — Secure login & signup with JWT & cookies
- 👤 **User Profiles** — View and edit your profile
- 📸 **Posts** — Create, like, and comment on posts
- 🔁 **Loops** — Share short looping content
- 📖 **Stories** — 24-hour disappearing stories
- 💬 **Real-time Messaging** — Instant chat powered by Socket.io
- 🟢 **Online Status** — See who's online in real time
- ⌨️ **Typing Indicators** — Know when someone is typing
- ☁️ **Image Uploads** — Cloudinary integration for media storage

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Redux Toolkit | State Management |
| React Router v7 | Navigation |
| Tailwind CSS v4 | Styling |
| Socket.io Client | Real-time Communication |
| Axios | HTTP Requests |
| Vite | Build Tool |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | Server & REST API |
| MongoDB + Mongoose | Database |
| Socket.io | WebSocket Server |
| JWT | Authentication |
| Cloudinary | Image Storage |
| Bcryptjs | Password Hashing |
| Nodemailer | Email Service |
| Multer | File Uploads |

---

## 📁 Project Structure

```
LinkUp/
│
├── backend/
│   ├── config/          # DB connection
│   ├── routes/          # API routes
│   ├── controllers/     # Route handlers
│   ├── models/          # Mongoose schemas
│   ├── middleware/      # Auth middleware
│   ├── socket.js        # Socket.io setup
│   └── index.js         # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # App pages
│   │   ├── store/       # Redux store
│   │   ├── hooks/       # Custom hooks
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   └── vite.config.js
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js >= 18.0.0
- MongoDB
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/ChinmayaK11/LinkUp.git
cd LinkUp
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/user/:id` | Get user profile |
| GET | `/api/post` | Get all posts |
| POST | `/api/post` | Create a post |
| GET | `/api/message/:id` | Get messages |
| POST | `/api/message/send/:id` | Send a message |
| GET | `/health` | Server health check |

---

## 👨‍💻 Author

**Chinmaya Kagolli**
- GitHub: [@ChinmayaK11](https://github.com/ChinmayaK11)

---

> 💡 *LinkUp — Not Just A Platform, It's a Link*
