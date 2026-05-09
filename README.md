# 🔍 Lostiq — Lost & Found Platform

> Sri Lanka's smartest lost & found platform powered by AI matching, real-time chat, and email notifications.

![Lostiq Banner](https://via.placeholder.com/1200x400/1E3A5F/FF6B35?text=Lostiq+Lost+%26+Found+Platform)

## 🌐 Live Demo
> Coming Soon — Deploying on Render + Vercel

## ✨ Features

- 🔐 **Authentication** — Email/Password + Google OAuth
- 🖼️ **Image Upload** — Cloudinary integration
- 🤖 **AI Matching** — Smart algorithm matches lost & found items
- 💬 **Real-time Chat** — Socket.io powered messaging
- 🔔 **Notifications** — In-app + Email alerts
- 🗺️ **Map View** — Interactive Sri Lanka map (Leaflet.js)
- 👮 **Admin Panel** — Manage users, items with charts
- 📊 **Dashboard Charts** — Recharts visualization
- 👤 **Profile Page** — Edit profile & password
- 📱 **PWA** — Install as mobile app

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js | UI Framework |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Socket.io Client | Real-time Chat |
| Leaflet.js | Map View |
| Recharts | Charts |
| Vite PWA | Progressive Web App |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Passport.js | Google OAuth |
| Socket.io | Real-time |
| Nodemailer | Email |
| Cloudinary | Image Storage |

## 🚀 Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account

### Clone Repository
```bash
git clone https://github.com/haq-ops/Lostiq.git
cd Lostiq
```

### Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 📁 Project Structure
Lostiq/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Auth context
│   │   └── api/            # Axios config
│   └── public/             # Static assets
│
└── server/                 # Node.js Backend
├── config/             # DB & Passport config
├── controllers/        # Route controllers
├── middleware/         # Auth middleware
├── models/             # Mongoose models
├── routes/             # API routes
└── utils/              # Email service


## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get profile |
| PUT | /api/auth/profile | Update profile |
| GET | /api/auth/google | Google OAuth |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/items | Get all items |
| POST | /api/items | Create item |
| GET | /api/items/:id | Get single item |
| PUT | /api/items/:id | Update item |
| DELETE | /api/items/:id | Delete item |

### Claims
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/claims | Submit claim |
| GET | /api/claims/:itemId | Get claims |
| PUT | /api/claims/:id | Update claim |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/messages | Send message |
| GET | /api/messages/:itemId/:userId | Get messages |
| GET | /api/messages/conversations | Get conversations |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/ai/match/:itemId | Find AI matches |

## 👥 Team
- **Faslulhaq Farees** — Full Stack Developer

## 📄 License
MIT License

---

<div align="center">
  <p>Made with ❤️ in Sri Lanka 🇱🇰</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
