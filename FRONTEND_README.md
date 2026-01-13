# Frontend Setup & API Requirements

## Frontend Files
The frontend is located in the `public/` folder:
- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `app.js` - Frontend JavaScript logic

## How to Use

### Option 1: Open directly in browser
Simply open `public/index.html` in your web browser. The frontend will try to connect to `http://localhost:3000/api`.

### Option 2: Serve with a simple HTTP server
If you encounter CORS issues, serve the files using a simple HTTP server:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js (if you have http-server installed)
npx http-server public -p 8080
```

Then open `http://localhost:8080` in your browser.

## API Endpoints You Need to Implement

Your backend should implement the following REST API endpoints:

### Base URL
The frontend expects the API to be available at: `http://localhost:3000/api`

You can change this in `public/app.js` by modifying the `API_BASE_URL` constant.

### 1. GET `/api/tasks`
**Description:** Retrieve all tasks

**Response:**
```json
[
  {
    "_id": "task_id_here",
    "title": "Task title",
    "description": "Task description",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. POST `/api/tasks`
**Description:** Create a new task

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description (optional)",
  "status": "pending"
}
```

**Response:**
```json
{
  "_id": "task_id_here",
  "title": "Task title",
  "description": "Task description",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. GET `/api/tasks/:id`
**Description:** Get a single task by ID

**Response:**
```json
{
  "_id": "task_id_here",
  "title": "Task title",
  "description": "Task description",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. PUT `/api/tasks/:id`
**Description:** Update a task

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed"
}
```

**Response:**
```json
{
  "_id": "task_id_here",
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 5. DELETE `/api/tasks/:id`
**Description:** Delete a task

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

## Task Schema

Each task should have the following fields:
- `_id` or `id` - Unique identifier (MongoDB ObjectId)
- `title` - String (required)
- `description` - String (optional)
- `status` - String, either "pending" or "completed" (default: "pending")
- `createdAt` or `created_at` - Date/ISO string (optional, but recommended)

## Error Handling

The frontend expects error responses in this format:
```json
{
  "message": "Error message here"
}
```

## CORS Configuration

If you're running the frontend and backend on different ports, make sure to enable CORS in your backend:

```javascript
// Example with Express.js
const cors = require('cors');
app.use(cors());
```

## Testing

Once you implement your backend:
1. Start your backend server (e.g., `node index.js`)
2. Open the frontend in your browser
3. Try adding, viewing, editing, and deleting tasks
4. Check the browser console (F12) for any errors

Good luck with your MongoDB CRUD practice! 🚀
