# Full-Stack Task Manager (Todoist Replica)

A modular, full-stack task manager application cleanly decoupled into **`backend/`** and **`frontend/`** architectures.

## Project Structure

```
task-manager/
├── backend/                  # Node.js + Express REST API
│   ├── data/
│   │   └── db.json          # Persisted JSON database
│   ├── routes/
│   │   ├── auth.js          # Authentication (Sign in, Sign up with custom password)
│   │   ├── tasks.js         # Task CRUD & reordering
│   │   ├── categories.js    # Category management
│   │   ├── projects.js      # Project management (My Projects & Team)
│   │   └── data.js          # Bootstrap & reset
│   ├── db.js                # Database read/write utility
│   ├── server.js            # Express server & static asset host
│   └── package.json         # Backend dependencies
├── frontend/                 # Client UI
│   ├── index.html           # Desktop view & mobile phone preview markup
│   ├── index.css            # Responsive styles & design system
│   ├── app.js               # Client application logic & API sync
│   └── avatar.jpg           # Profile image asset
├── package.json             # Root runner scripts
├── .gitignore
└── README.md
```

## Getting Started

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start the Application
```bash
npm start
```

Open your browser at **`http://localhost:5000`**.

The server hosts both the REST API at `/api/*` and the frontend application at `/`.

## Key Features

- **Authentication**: Sign up with username/email and create your own password, Sign In, Sign Out.
- **My Projects & Team Projects**: Add new projects under *My Projects* or *Team* using the `+` buttons.
- **Task Scheduling & Time Management**: Add time to tasks, schedule due dates, and edit tasks.
- **Notifications**: Click the notification bell to view due task reminders, alarms, and trigger test alerts.
- **Mobile Experience**: Clean phone frame preview and responsive mobile drawer, bottom sheet task creation, and timeline schedule.
- **Full Offline Fallback**: Works seamlessly even when offline with local caching.
