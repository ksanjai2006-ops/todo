const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db');

// GET all categories
router.get('/', (req, res) => {
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });
  res.json(db.categories || []);
});

// POST new category
router.post('/', (req, res) => {
  const { name, color } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });

  db.nextCategoryId = (db.nextCategoryId || 100) + 1;
  const newCat = {
    id: 'cat-' + db.nextCategoryId,
    name: name.trim(),
    color: color || '#246FE0'
  };

  db.categories.push(newCat);
  writeDb(db);
  res.status(201).json(newCat);
});

// PUT update category
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });

  const cat = (db.categories || []).find(c => c.id === id);
  if (!cat) {
    return res.status(404).json({ error: 'Category not found' });
  }

  if (name && name.trim()) cat.name = name.trim();
  if (color) cat.color = color;

  writeDb(db);
  res.json(cat);
});

// DELETE category
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });

  const initialLength = db.categories.length;
  db.categories = db.categories.filter(c => c.id !== id);

  if (db.categories.length === initialLength) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Remove category from associated tasks
  db.tasks.forEach(t => {
    if (t.categoryId === id) t.categoryId = '';
  });

  writeDb(db);
  res.json({ message: 'Category deleted successfully', id });
});

module.exports = router;
