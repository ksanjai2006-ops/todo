const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../db');

// GET full data payload
router.get('/', (req, res) => {
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database error' });
  res.json(db);
});

// POST reset to defaults
router.post('/reset', (req, res) => {
  const defaultData = {
    users: [
      { id: 'user-1', name: 'Denise', email: 'denise@example.com', password: 'password123' }
    ],
    categories: [
      { id: 'cat-1', name: 'Work', color: '#246FE0' },
      { id: 'cat-2', name: 'Personal', color: '#DC4C3E' },
      { id: 'cat-3', name: 'Health & Fitness', color: '#058527' },
      { id: 'cat-4', name: 'Shopping', color: '#FF9A14' },
      { id: 'cat-5', name: 'Learning', color: '#692FC2' }
    ],
    projects: [
      { id: 'proj-1', name: 'Fitness', color: '#058527', section: 'myProjects' },
      { id: 'proj-2', name: 'Groceries', color: '#FF9A14', section: 'myProjects' },
      { id: 'proj-3', name: 'Appointments', color: '#AF38EB', section: 'myProjects' },
      { id: 'proj-4', name: 'New Brand', color: '#EB8909', section: 'team' },
      { id: 'proj-5', name: 'Website Update', color: '#299438', section: 'team' },
      { id: 'proj-6', name: 'Product Roadmap', color: '#246FE0', section: 'team' },
      { id: 'proj-7', name: 'Meeting Agenda', color: '#6C7A21', section: 'team' }
    ],
    tasks: [
      { id: 't-1', text: 'Do 30 minutes of yoga 🧘', completed: false, time: '7:30 AM', recurring: true, alarm: true, section: 'myProjects', projectId: 'proj-1', categoryId: 'cat-3', priority: 'default', date: 'today' },
      { id: 't-2', text: 'Dentist appointment', completed: false, time: '10:00 AM', calendarIcon: true, alarm: true, recurring: false, section: 'myProjects', projectId: 'proj-3', categoryId: 'cat-2', priority: 'default', date: 'today' },
      { id: 't-3', text: 'Buy bread 🍞', completed: false, time: '', recurring: false, section: 'myProjects', projectId: 'proj-2', categoryId: 'cat-4', priority: 'default', date: 'today' },
      { id: 't-4', text: 'Plan user research sessions', completed: false, time: '2:00 PM', calendarIcon: true, calendarTag: true, section: 'team', projectId: 'proj-5', categoryId: 'cat-1', priority: 'blue', date: 'today' },
      { id: 't-5', text: "Provide feedback on Amy's design", completed: false, time: '', calendar: false, section: 'team', projectId: 'proj-4', categoryId: 'cat-1', priority: 'red', date: 'today' },
      { id: 't-6', text: 'All-hands meeting', completed: false, time: '', recurring: true, section: 'team', projectId: 'proj-7', categoryId: 'cat-1', priority: 'default', date: 'today' },
      { id: 't-7', text: 'Morning Run', completed: false, time: '07:00', recurring: false, section: 'myProjects', projectId: 'proj-1', categoryId: 'cat-3', priority: 'default', date: 'tomorrow' },
      { id: 't-8', text: 'Go Grocery Shopping', completed: false, time: '09:00', recurring: false, section: 'myProjects', projectId: 'proj-2', categoryId: 'cat-4', priority: 'default', date: 'tomorrow' },
      { id: 't-9', text: 'Reply to Emails', completed: false, time: '12:00', recurring: false, section: 'team', projectId: 'proj-5', categoryId: 'cat-1', priority: 'default', date: 'tomorrow' },
      { id: 't-10', text: 'Discuss Plan with Client', completed: false, time: '13:00', recurring: false, section: 'team', projectId: 'proj-6', categoryId: 'cat-1', priority: 'blue', date: 'tomorrow' },
      { id: 't-11', text: 'Shoot Video', completed: false, time: '08:00', recurring: false, section: 'myProjects', projectId: 'proj-1', categoryId: 'cat-1', priority: 'default', date: 'upcoming' },
      { id: 't-12', text: 'Host Project Meeting', completed: false, time: '14:00', recurring: false, section: 'team', projectId: 'proj-6', categoryId: 'cat-1', priority: 'default', date: 'upcoming' },
      { id: 't-13', text: 'Finalize Promo Video', completed: false, time: '17:30', recurring: false, section: 'team', projectId: 'proj-4', categoryId: 'cat-1', priority: 'orange', date: 'upcoming' },
      { id: 't-14', text: 'Pick Up Package', completed: false, time: 'Mon', recurring: false, section: 'myProjects', projectId: 'proj-2', categoryId: 'cat-4', priority: 'default', date: 'upcoming' },
      { id: 't-15', text: 'Organize Project Meeting', completed: false, time: 'Mon', recurring: false, section: 'team', projectId: 'proj-6', categoryId: 'cat-1', priority: 'default', date: 'upcoming' },
      { id: 't-16', text: 'Complete Client Proposal', completed: false, time: 'Mon', recurring: false, section: 'team', projectId: 'proj-4', categoryId: 'cat-1', priority: 'red', date: 'upcoming' },
      { id: 't-17', text: 'Read new design articles', completed: false, time: '', recurring: false, section: 'myProjects', projectId: '', categoryId: 'cat-5', priority: 'default', date: 'inbox' },
      { id: 't-18', text: 'Update portfolio website', completed: false, time: '', recurring: false, section: 'myProjects', projectId: '', categoryId: 'cat-2', priority: 'default', date: 'inbox' }
    ],
    currentView: 'today',
    version: 3,
    nextTaskId: 100,
    nextCategoryId: 100,
    nextProjectId: 100
  };

  writeDb(defaultData);
  res.json({ message: 'Data reset to defaults', data: defaultData });
});

module.exports = router;
