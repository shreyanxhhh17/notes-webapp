# Deployment Guide: Render + Vercel

This guide explains how to deploy the Notes App backend to Render and connect it with the Vercel frontend.

## Backend Deployment (Render)

### Step 1: Prepare for Render Deployment

The backend is configured to run on Render with file-based storage. All configuration is in `render.yaml`.

### Step 2: Deploy to Render

1. **Sign up/Login to Render**: Go to https://render.com and sign up
2. **Connect GitHub**: Link your GitHub repository to Render
3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repo `shreyanxhhh17/notes-webapp`
   - Select the branch: `main`
   - **Name**: `notes-app-backend`
   - **Environment**: Select "Node"
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or paid for better uptime)

4. **Set Environment Variables** in Render:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`

5. **Deploy**: Click "Create Web Service" and wait for deployment

### Step 3: Get Your Backend URL

Once deployed, you'll get a URL like: `https://notes-app-backend.onrender.com`

## Frontend Deployment (Vercel)

### Step 1: Update Frontend Configuration

The frontend `.env.production` is already configured to point to Render backend:

```
REACT_APP_API_URL=https://notes-app-backend.onrender.com/api
```

### Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel**: Go to https://vercel.com
2. **Import Project**:
   - Click "Add New" → "Project"
   - Import GitHub repo `shreyanxhhh17/notes-webapp`
   - Select "Next.js" or "React" as framework
3. **Configure for Frontend Only**:
   - **Root Directory**: Select `frontend`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: `build`

4. **Environment Variables** (if needed):
   - No sensitive variables needed for frontend

5. **Deploy**: Click "Deploy"

## Final Configuration

Once both are deployed:

1. **Backend URL** (from Render): `https://notes-app-backend.onrender.com`
2. **Frontend URL** (from Vercel): `https://notes-webapp.vercel.app`

The app will automatically use the Render backend API for all operations.

## Testing the Deployment

1. Visit your Vercel frontend URL
2. Create a new note
3. Type some content
4. The auto-save should work seamlessly with the Render backend
5. Refresh the page - your notes should still be there

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

1. Update `server.js` in the `corsOptions` with your Vercel URL
2. Deploy backend again

### Notes Not Persisting

- Render's free tier uses ephemeral storage
- For production, upgrade to Render's Pro plan or use a database service

### Port Issues

- Ensure `PORT` environment variable is set to `5000` in Render

## Local Development

To test locally before deployment:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

Backend will run on `http://localhost:5000`
Frontend will run on `http://localhost:3000`
