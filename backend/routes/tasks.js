const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db');

// GET all tasks
router.get('/', (req, res) => {
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });
  let tasks = db.tasks || [];

  if (req.query.date) {
    tasks = tasks.filter(t => t.date === req.query.date);
  }
  if (req.query.section) {
    tasks = tasks.filter(t => t.section === req.query.section);
  }
  if (req.query.categoryId) {
    tasks = tasks.filter(t => t.categoryId === req.query.categoryId);
  }
  if (req.query.projectId) {
    tasks = tasks.filter(t => t.projectId === req.query.projectId);
  }

  res.json(tasks);
});

// POST new task
router.post('/', (req, res) => {
  const { text, section, projectId, categoryId, priority, date, time, recurring, alarm } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Task text is required' });
  }

  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });

  db.nextTaskId = (db.nextTaskId || 100) + 1;
  const newTask = {
    id: 't-' + db.nextTaskId,
    text: text.trim(),
    completed: false,
    time: time || '',
    recurring: !!recurring,
    alarm: !!alarm,
    calendar: false,
    section: section || 'myProjects',
    projectId: projectId || '',
    categoryId: categoryId || '',
    priority: priority || 'default',
    date: date || 'today'
  };

  db.tasks.push(newTask);
  writeDb(db);
  res.status(201).json(newTask);
});

// PUT update task
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });

  const index = db.tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const task = db.tasks[index];
  const allowed = ['text', 'completed', 'time', 'recurring', 'alarm', 'calendar', 'section', 'projectId', 'categoryId', 'priority', 'date'];
  allowed.forEach(field => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  db.tasks[index] = task;
  writeDb(db);
  res.json(task);
});

// PUT reorder tasks (hand task)
router.put('/reorder/list', (req, res) => {
  const { taskIds } = req.body;
  if (!Array.isArray(taskIds)) {
    return res.status(400).json({ error: 'taskIds array is required' });
  }

  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });

  const taskMap = new Map(db.tasks.map(t => [t.id, t]));
  const reordered = [];
  taskIds.forEach(id => {
    if (taskMap.has(id)) {
      reordered.push(taskMap.get(id));
      taskMap.delete(id);
    }
  });
  // Append any tasks not in the reorder list
  taskMap.forEach(task => reordered.push(task));

  db.tasks = reordered;
  writeDb(db);
  res.json({ message: 'Tasks reordered successfully', tasks: db.tasks });
});

// DELETE task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });

  const initialLength = db.tasks.length;
  db.tasks = db.tasks.filter(t => t.id !== id);

  if (db.tasks.length === initialLength) {
    return res.status(404).json({ error: 'Task not found' });
  }

  writeDb(db);
  res.json({ message: 'Task deleted successfully', id });
});

module.exports = router;
