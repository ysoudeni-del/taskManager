const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

// All task routes require authentication
router.use(protect);

// GET - Get only logged-in user's tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Create task for logged-in user
router.post("/", async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }
    const task = await Task.create({
      title,
      description,
      priority: priority || "medium",
      user: req.user,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Update only user's task
router.put("/:id", async (req, res) => {
  try {
    const { title, description, completed, priority } = req.body;
    const updates = {};
    console.log("Received updates:", req.body);
    console.log("Priority received:", priority);

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;
    if (priority !== undefined) updates.priority = priority;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      updates,
      { returnDocument: "after", runValidators: true },
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Delete only user's task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
