# MERN Chat Application

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) featuring user authentication, messaging, and live notifications using Socket.io.

## Features

- **User Authentication**: Secure login and registration with JWT tokens and bcrypt password hashing
- **Real-time Messaging**: Instant message delivery using Socket.io
- **User Search**: Find and connect with other users
- **Active Users Tracking**: See who is currently online
- **Persistent Storage**: MongoDB database for users, conversations, and messages
- **Responsive UI**: Modern, mobile-friendly interface with Tailwind CSS
- **State Management**: Efficient state handling with Zustand

## Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - State management
- **Socket.io Client** - Real-time client
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **React Toastify** - Notifications

## Project Structure

```
MERN/
├── Backend/
│   ├── app.js                 # Express app setup
│   ├── package.json
│   ├── db/
│   │   └── dbconnect.js       # MongoDB connection
│   ├── Models/
│   │   ├── user.js            # User schema
│   │   ├── conversation.js    # Conversation schema
│   │   └── message.js         # Message schema
│   ├── Route/
│   │   ├── userauth.js        # Auth routes
│   │   ├── userRoute.js       # User routes
│   │   └── messageRoute.js    # Message routes
│   ├── RouteControllers/
│   │   ├── userelogin.js      # Login controller
│   │   ├── userlogout.js      # Logout controller
│   │   ├── userRoutecontroller.js
│   │   ├── messageController.js
│   │   ├── userSearch.js
│   │   └── currentChatters.js
│   ├── Middleware/
│   │   └── isLogin.js         # Auth middleware
│   └── utils/
│       └── jwt.js             # JWT utilities
│
├── Frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx           # Entry point
│   │   ├── App.jsx            # Main component
│   │   ├── Components/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Message.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   └── socketService.js
│   │   └── Zustans/
│   │       └── userConversation.js
│   └── public/
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/user/search` - Search users
- `GET /api/user/current-chatters` - Get active users
- `GET /api/user/:id` - Get user profile

### Messages
- `GET /api/message/:conversationId` - Get messages in a conversation
- `POST /api/message` - Send a message
- `GET /api/message/conversations` - Get all conversations

## Socket.io Events

### Client to Server
- `join` - User joins the chat
- `send_message` - Send a message to a user
- `typing` - User is typing notification
- `stop_typing` - User stopped typing

### Server to Client
- `receive_message` - New message received
- `user_online` - User came online
- `user_offline` - User went offline
- `typing` - Someone is typing
- `stop_typing` - Someone stopped typing

## Running the Application

1. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

2. **Terminal 1 - Start Backend**:
   ```bash
   cd Backend
   npm start
   ```

3. **Terminal 2 - Start Frontend**:
   ```bash
   cd Frontend
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Deployment

### Backend (Render/Heroku)
- Set environment variables in your hosting platform
- Deploy the Backend folder
- Update CORS origins in `app.js`

### Frontend (Vercel)
- Deploy the Frontend folder
- Set `VITE_API_URL` environment variable to your backend URL

## Available Scripts

### Backend
- `npm start` - Start the server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication Flow

1. User registers/logs in with email and password
2. Password is hashed using bcrypt
3. JWT token is generated and stored in cookies
4. Token is verified on subsequent requests via middleware
5. User can access protected routes only with valid token

## Future Enhancements

- Group chat functionality
- Message reactions and emojis
- File/Image sharing
- Voice/Video calls
- Message encryption
- Read receipts and typing indicators
- User profiles and avatars
- Chat history export

## Troubleshooting

**Port already in use**:
```bash
# For macOS/Linux
lsof -i :5000
kill -9 <PID>

# For Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**MongoDB connection failed**:
- Check if MongoDB service is running
- Verify connection string in `.env`
- Ensure MongoDB credentials are correct

**Socket.io connection issues**:
- Check if CORS origins are correctly configured
- Verify frontend and backend are running
- Check browser console for errors