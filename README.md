# CRUD with MongoDB - To-Do Application

A simple To-Do application built with Node.js, Express, and MongoDB that demonstrates CRUD (Create, Read, Update, Delete) operations on a NoSQL database.

## Features

- ✅ Create new tasks with title and description
- 📋 View all tasks (sorted by most recent first)
- ✏️ Update task details and completion status
- 🗑️ Delete tasks
- 🎨 Modern and responsive UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd "CRUD with MongoDB"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB connection:
   - Create a `.env` file in the root directory (if not already present)
   - Add your MongoDB connection string:
     ```
     MONGODB_URI=mongodb://localhost:27017
     ```
   - Or use MongoDB Atlas connection string for cloud database

## Running the Application

1. Make sure MongoDB is running (if using local MongoDB):
   ```bash
   mongod
   ```

2. Start the server:
   ```bash
   node index.js
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## API Endpoints

Base URL: `http://localhost:3000/api`

### Create a Note
- **POST** `/api/notes`
- Body: `{ "title": "Task Title", "content": "Task Description" }`

### Get All Notes
- **GET** `/api/notes`
- Returns: Array of all notes (sorted by most recent first)

### Get Single Note
- **GET** `/api/notes/:id`
- Returns: Single note object

### Update a Note
- **PATCH** `/api/notes/:id`
- Body: `{ "title": "Updated Title", "content": "Updated Content", "completed": true }`

### Delete a Note
- **DELETE** `/api/notes/:id`
- Returns: Success confirmation

## Project Structure

```
CRUD with MongoDB/
├── index.js              # Express server and API routes
├── mongo_client.js       # MongoDB connection handler
├── package.json          # Project dependencies
├── public/               # Frontend files
│   ├── index.html        # Main HTML page
│   ├── app.js            # Frontend JavaScript
│   └── styles.css        # Styling
└── README.md            # This file
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Database Driver**: MongoDB Native Driver

## Author

Utkarsh Dubey

## License

ISC
