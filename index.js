import express from "express";
import { connectDB } from "./mongo_client.js";
import { ObjectId } from "mongodb";

const app = express();
const port = 3000;

//Middleware
app.use(express.json());
app.use(express.static("public")); // Serve static files from public directory

let db;

// Initialize database connection before starting server
async function initializeServer() {
  try {
    const result = await connectDB();
    if (!result.success) {
      console.log("DB connect failed", result.message);
      process.exit(1);
    }
    db = result.client.db("notesdb");
    console.log("Connected to MongoDB, database ready");

    // Start server only after DB is connected
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
}

initializeServer();

//Health check
app.get("/", (req, res) => {
  res.send("Notes API is running");
});

//Collection name
const COLLECTION = "notes";

// for reference : api_design.md

//GET all notes
app.get("/api/notes", async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const notes = await db
      .collection(COLLECTION)
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});
//GET one note
app.get("/api/notes/:id", async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const note = await db
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!note) {
      return res.status(404).json({ error: "note not found" });
    }
    res.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
});
//POST methods
app.post("/api/notes", async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const result = await db
      .collection(COLLECTION)
      .insertOne({ title, content, completed: false, createdAt: new Date() });

    res.status(201).json({
      insertedId: result.insertedId,
      message: `A document was inserted with the _id: ${result.insertedId}`,
    });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

//PATCH methods
app.patch("/api/notes/:id", async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const result = await db.collection(COLLECTION).updateOne(
      {
        //this is the query to search the object ...
        _id: new ObjectId(req.params.id),
      },
      {
        //this is the "update" parameter
        $set: req.body,
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "this note does not exist" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});
//DELETE methods
app.delete("/api/notes/:id", async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const result = await db.collection(COLLECTION).deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});
