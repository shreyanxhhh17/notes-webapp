# Notes App - Production Grade Application

A clean and efficient notes application with React frontend and Node.js backend, using Firebase Firestore for persistent storage.

## 🏗️ Project Structure

```
notes/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── App.js
│   │   └── App.css
│   ├── package.json
│   └── .env.example
└── backend/                  # Node.js + Express backend
    ├── config/              # Firebase configuration
    ├── controllers/         # Request handlers
    ├── routes/              # API routes
    ├── services/            # Business logic & Firebase operations
    ├── server.js
    ├── package.json
    └── .env.example
```

## 🚀 Features

### Frontend (React)
- **Evernote-inspired UI**: Clean, minimal interface with sidebar navigation
- **Real-time Search**: Debounced search across title and content with keyword highlighting
- **Pagination**: Inline pagination (10 notes per page) with smart page navigation
- **Performance Optimized**: Uses `useMemo`, `React.memo`, and efficient state management
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Auto-save**: Automatic note saving with visual feedback

### Backend (Node.js + Express)
- **RESTful API**: Clean endpoints for all CRUD operations
- **Firebase Integration**: Secure Firestore operations via Admin SDK
- **Error Handling**: Comprehensive error handling and validation
- **Scalable Architecture**: Clean separation of concerns with services layer

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Firestore database

## 🔥 Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Firestore Database in test mode

2. **Generate Service Account Key**
   - Go to Project Settings → Service accounts
   - Click "Generate new private key"
   - Download the JSON file

3. **Configure Backend Environment**
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in the Firebase configuration:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your Firebase credentials
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edit .env with your API URL
```

### 3. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev  # or npm start
```

**Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📡 API Endpoints

### Notes API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notes` | Create a new note |
| GET | `/api/notes` | Fetch all notes |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

### Request/Response Examples

**Create Note:**
```javascript
POST /api/notes
{
  "title": "My First Note",
  "content": "This is the content of my note"
}

Response:
{
  "id": "note123",
  "title": "My First Note",
  "content": "This is the content of my note",
  "createdAt": {...},
  "updatedAt": {...}
}
```

## 🚀 Deployment

### Frontend (Vercel)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel --prod
```

3. **Environment Variables:**
   - Set `REACT_APP_API_URL` to your deployed backend URL

### Backend (Render/Railway)

**For Render:**
1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy automatically on push

**For Railway:**
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`

## 🎯 Performance Features

### Frontend Optimizations
- **Debounced Search**: 300ms delay to prevent excessive API calls
- **Memoized Filtering**: `useMemo` for search and pagination logic
- **Component Memoization**: `React.memo` for preventing unnecessary re-renders
- **Efficient State Management**: Minimal state updates and proper dependency arrays
- **Virtual Pagination**: Handles 5,000+ notes efficiently

### Backend Optimizations
- **Firestore Indexing**: Proper query optimization
- **Connection Pooling**: Efficient Firebase Admin SDK usage
- **Error Boundaries**: Comprehensive error handling
- **Input Validation**: Proper request validation

## 🎨 UI/UX Features

- **Clean Design**: Inspired by Evernote's minimal aesthetic
- **Active Note Highlighting**: Visual feedback for selected note
- **Smooth Transitions**: CSS transitions for better UX
- **Loading States**: Proper loading and error indicators
- **Mobile Responsive**: Adapts to different screen sizes
- **Keyboard Navigation**: Full keyboard support

## 🔧 Development

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests (if added)
cd backend
npm test
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend (no build step required)
cd backend
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is properly configured
2. **Firebase Connection**: Check service account credentials and permissions
3. **Environment Variables**: Verify all required variables are set
4. **Port Conflicts**: Change PORT in backend .env if needed

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the API documentation
