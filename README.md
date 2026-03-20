# Notes Web App

A simple and clean notes application built with React and Node.js. This app lets you create, read, update, and delete notes with a nice user interface.

## Features

- Create new notes
- View all your notes
- Edit existing notes
- Delete notes you don't need
- Search through your notes
- Toast notifications for actions
- Loading animations
- Confirm before deleting

## Tech Stack

**Frontend:**
- React.js
- CSS for styling
- Firebase for backend

**Backend:**
- Node.js
- Express.js
- Firebase Realtime Database

## How to Run Locally

### Backend Setup

1. Go to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and add your Firebase credentials:
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_DATABASE_URL=your_database_url
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Go to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend:
```bash
npm start
```

The app will open at `http://localhost:3000`

## CRUD Operations Explained

### CREATE - Adding a New Note

**How it works:**
1. Click the "+ New Note" button in the sidebar
2. A new empty note is created automatically
3. You can start typing the title and content
4. The note saves automatically when you type

**Code Flow:**
- Frontend: `handleCreateNote()` in `App.js` calls the API
- Backend: `POST /api/notes` endpoint in `noteController.js`
- Database: New note is saved to Firebase with a unique ID
- Response: Returns the new note with ID and timestamp

**What happens:**
```
User clicks button → Frontend sends POST request → Backend creates note in Firebase → Returns new note → Frontend adds it to the list → Shows success toast
```

### READ - Viewing Notes

**How it works:**
1. When you open the app, all notes load automatically
2. Notes are displayed in the sidebar
3. Click any note to view its full content
4. Search bar filters notes in real-time

**Code Flow:**
- Frontend: `fetchNotes()` in `App.js` runs on page load
- Backend: `GET /api/notes` endpoint fetches all notes
- Database: Reads all notes from Firebase
- Response: Returns array of all notes

**What happens:**
```
App loads → Frontend sends GET request → Backend fetches from Firebase → Returns all notes → Frontend displays them in sidebar
```

### UPDATE - Editing a Note

**How it works:**
1. Click on a note to select it
2. Edit the title or content in the editor
3. Changes save automatically after you stop typing (debounced)
4. You'll see a success message when saved

**Code Flow:**
- Frontend: `handleUpdateNote()` in `App.js` with debounce
- Backend: `PUT /api/notes/:id` endpoint updates the note
- Database: Updates the specific note in Firebase
- Response: Returns the updated note

**What happens:**
```
User types → Wait 500ms → Frontend sends PUT request → Backend updates Firebase → Returns updated note → Frontend updates the list → Shows success toast
```

### DELETE - Removing a Note

**How it works:**
1. Click the "×" button on any note
2. A confirmation dialog appears
3. Click "Delete" to confirm
4. The note is removed from the list

**Code Flow:**
- Frontend: `handleDeleteNote()` in `App.js` after confirmation
- Backend: `DELETE /api/notes/:id` endpoint
- Database: Removes the note from Firebase
- Response: Success confirmation

**What happens:**
```
User clicks × → Confirm dialog shows → User confirms → Frontend sends DELETE request → Backend removes from Firebase → Frontend removes from list → Shows success toast
```

## Project Structure

```
notes-webapp/
├── backend/
│   ├── config/
│   │   └── firebase.js          # Firebase setup
│   ├── controllers/
│   │   └── noteController.js    # CRUD logic
│   ├── routes/
│   │   └── noteRoutes.js        # API endpoints
│   ├── services/
│   │   └── noteService.js       # Database operations
│   └── server.js                # Express server
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js       # Notes list
│   │   │   ├── NoteEditor.js    # Edit notes
│   │   │   ├── SearchBar.js     # Search functionality
│   │   │   ├── Toast/           # Notifications
│   │   │   ├── ConfirmDialog/   # Delete confirmation
│   │   │   └── LoadingSkeleton/ # Loading states
│   │   ├── contexts/
│   │   │   └── ToastContext.js  # Toast notifications
│   │   ├── services/
│   │   │   └── noteService.js   # API calls
│   │   └── App.js               # Main component
│   └── public/
│       └── index.html
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

## Deployment

**Backend:** Deployed on Vercel at `https://notes-webapp-api.vercel.app`

**Frontend:** Deployed on Vercel at `https://frontend-nu-pied-88.vercel.app`

## Features Breakdown

### Toast Notifications
- Success messages when you create, update, or delete notes
- Error messages if something goes wrong
- Auto-dismiss after a few seconds

### Confirm Dialog
- Prevents accidental deletion
- Keyboard support (ESC to cancel)
- Click outside to cancel

### Loading Skeletons
- Shows animated placeholders while loading
- Better user experience than blank screens

### Search Functionality
- Real-time search as you type
- Searches both title and content
- Highlights matching text

### Pagination
- Shows 10 notes per page
- Easy navigation between pages
- Shows page numbers

## Common Issues

**Backend not connecting:**
- Check if Firebase credentials are correct in `.env`
- Make sure backend is running on port 5000

**Frontend not loading notes:**
- Check if `REACT_APP_API_URL` points to the right backend
- Open browser console to see error messages

**Notes not saving:**
- Check Firebase Database rules
- Make sure you have write permissions

## Future Improvements

- Add user authentication
- Add note categories/tags
- Add rich text editor
- Add note sharing
- Add dark mode
- Add export notes feature

## Author

Built by a junior developer learning full-stack development!

## License

This project is open source and available for learning purposes.
