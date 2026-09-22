const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db');

// GET all projects
router.get('/', (req, res) => {
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });
  let projects = db.projects || [];
  if (req.query.section) {
    projects = projects.filter(p => p.section === req.query.section);
  }
  res.json(projects);
});

// POST new project (under myProjects or team)
router.post('/', (req, res) => {
  const { name, color, section } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });

  db.nextProjectId = (db.nextProjectId || 100) + 1;
  const newProject = {
    id: 'proj-' + db.nextProjectId,
    name: name.trim(),
    color: color || '#246FE0',
    section: section === 'team' ? 'team' : 'myProjects'
  };

  if (!db.projects) db.projects = [];
  db.projects.push(newProject);
  writeDb(db);
  res.status(201).json(newProject);
});

// PUT update project
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, color, section } = req.body;
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });

  const proj = (db.projects || []).find(p => p.id === id);
  if (!proj) {
    return res.status(404).json({ error: 'Project not found' });
  }

  if (name && name.trim()) proj.name = name.trim();
  if (color) proj.color = color;
  if (section) proj.section = section;

  writeDb(db);
  res.json(proj);
});

// DELETE project
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });

  const initialLength = (db.projects || []).length;
  db.projects = (db.projects || []).filter(p => p.id !== id);

  if (db.projects.length === initialLength) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Remove project from associated tasks
  db.tasks.forEach(t => {
    if (t.projectId === id) t.projectId = '';
  });

  writeDb(db);
  res.json({ message: 'Project deleted successfully', id });
});

module.exports = router;
