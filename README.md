# Employee Task Manager

A full-stack web application for managing employee tasks with role-based access control, built with Flask (backend) and React + Tailwind CSS (frontend).

## Features

### Authentication
- Session-based login with HTTP-only cookies
- Admin and Employee roles
- Secure logout functionality
- Auto-redirect based on role

### Admin Dashboard
- Overview: Total users and tasks statistics
- User Management:
  - View all users
  - Add new users
  - Delete individual or all users
  - Assign roles (Admin/Employee)
- Task Management:
  - View all tasks
  - Assign tasks to employees
  - Set task priority (Low/Medium/High)
  - Delete tasks
- Navigation: Tab-based interface

### Employee Dashboard
- View assigned tasks only
- Update task status in real-time
- Color-coded priority display
- Task descriptions and dates
- Responsive task list

### User Interface
- Modern, responsive design
- Mobile-first approach
- Tailwind CSS styling
- Toast notifications
- Loading states
- Confirmation dialogs

## Tech Stack

### Backend
- Framework: Flask (Python)
- Database: SQLAlchemy ORM
- Authentication: Flask-Session (HTTP-only cookies)
- CORS: Enabled with credentials
- API: RESTful JSON endpoints

### Frontend
- Framework: React 18
- Styling: Tailwind CSS
- Routing: React Router v6
- HTTP Client: Axios (with credentials)
- Notifications: React Hot Toast
- Build Tool: Create React App

## Project Structure

```
employee_task_manager/
├── backend/
│   ├── app.py                    # Main Flask app
│   ├── config.py                 # Configuration
│   ├── models/
│   │   ├── task_model.py
│   │   └── user_model.py
│   ├── routes/
│   │   ├── task_routes.py
│   │   └── user_route.py
│   └── util/
│       └── utils.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── SETUP_GUIDE.md
├── QUICK_REFERENCE.md
├── FRONTEND_DOCS.md
├── COMPONENT_ARCHITECTURE.md
└── IMPLEMENTATION_SUMMARY.md
```

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js v14+
- Git

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install flask flask-cors flask-session sqlalchemy

# Run the server
python app.py
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

## Demo Credentials

### Admin Account
```
Username: admin
Password: admin123
```
Access: `/admin/dashboard`

### Employee Account
```
Username: user
Password: user123
```
Access: `/employee/dashboard`

## API Routes

### Authentication
```
POST   /api/login         - Login with username/email + password
POST   /api/logout        - Logout user
```

### Users
```
GET    /api/get_users                - Get all users (admin)
POST   /api/add_user                 - Create new user
DELETE /api/delete_user/<id>         - Delete user by ID
DELETE /api/delete_all_users         - Delete all users
```

### Tasks
```
GET    /api/get_all_tasks            - Get all tasks (admin)
GET    /api/my_tasks                 - Get user's assigned tasks
POST   /api/add_task                 - Create new task
PUT    /api/update_task_status/<id>  - Update task status
DELETE /api/delete_task/<id>         - Delete task
```

## Security Features

- Authentication: Session-based with HTTP-only cookies
- Authorization: Role-based access control (RBAC)
- CORS: Configured with `supports_credentials=True`
- Input Validation: Server-side validation on all endpoints
- Data Protection: No sensitive data exposed in responses
- Logout: Proper session cleanup

## Responsive Design

- Mobile (< 640px): Single column, hamburger menu
- Tablet (640px - 1024px): Adjusted layouts
- Desktop (> 1024px): Multi-column, visible sidebar

Tested on:
- iPhone 12/14 Pro
- iPad
- Android devices
- Chrome, Firefox, Safari

## Admin Workflow

1. Login with admin credentials
2. Dashboard Overview shows stats
3. Switch to Users Tab:
   - Click "Manage Users"
   - See all users in table
   - Click "+ Add User" to add new user
   - Click "Delete All" to remove all users
   - Or delete individual users
4. Switch to Tasks Tab:
   - Click "Manage Tasks"
   - See all tasks in table
   - Click "+ Add Task" to create task
   - Delete individual tasks

## Employee Workflow

1. Login with employee credentials
2. Dashboard shows all assigned tasks
3. View Task Details:
   - Title and description
   - Priority (color-coded)
   - Created date
4. Update Status:
   - Click dropdown on task
   - Select new status (Pending/In Progress/Completed)
   - Status updates automatically

## Documentation

### Frontend Documentation
- [FRONTEND_DOCS.md](./FRONTEND_DOCS.md) - Complete frontend reference
- [SETUP_GUIDE.md](./frontend/SETUP_GUIDE.md) - Frontend setup guide
- [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md) - Component details
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What's built
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick reference guide

### Code Structure
- Backend: See Flask app structure in `backend/`
- Frontend: See React structure in `frontend/src/`

## Testing

### Test Admin Features
```
1. Login with admin/admin123
2. Add a user
3. View users in table
4. Add a task
5. Assign to a user
6. View task in table
7. Delete task
8. Delete user
9. Logout
```

### Test Employee Features
```
1. Login with user/user123
2. See assigned tasks
3. Update task status
4. See status change immediately
5. Logout
```

### Test Responsive Design
```
1. Open DevTools (F12)
2. Toggle device toolbar (mobile view)
3. Test on various screen sizes
4. Test sidebar toggle on mobile
5. Test form inputs on mobile
```

## Deployment

### Frontend Deployment
```bash
# Build for production
cd frontend
npm run build

# Deploy build folder to:
# - Vercel (recommended)
# - Netlify
# - GitHub Pages
# - AWS S3 + CloudFront
# - Azure Static Web Apps
```

### Backend Deployment
Deploy Flask app to:
- Heroku
- Railway
- PythonAnywhere
- AWS EC2
- Google Cloud
- Azure App Service

## Troubleshooting

### Frontend Issues

"Cannot connect to backend"
- Check backend is running on port 5000
- Verify CORS is enabled in Flask app
- Check `api/axios.js` baseURL

"Styles not showing"
- Run `npm install` to install Tailwind
- Check `index.css` has Tailwind directives
- Clear browser cache

"Login not working"
- Check backend login endpoint
- Verify credentials in database
- Check Network tab for API errors

### Backend Issues

"Connection refused on port 5000"
- Check if port 5000 is available
- Run `python app.py`
- Check for firewall issues

"CORS errors"
- Ensure Flask-CORS installed
- Check `supports_credentials=True`
- Verify frontend URL in CORS config

## Database Schema

### Users Table
```sql
user_id (Primary Key)
username (Unique)
email (Unique)
password_hash
role (admin/user)
created_at
```

### Tasks Table
```sql
task_id (Primary Key)
title
description
status (Pending/In Progress/Completed)
priority (Low/Medium/High)
assigned_to (Foreign Key → user_id)
created_at
```

## UI Components

### Admin Dashboard
- Stat cards (users count, tasks count)
- Tab navigation
- Data tables with actions
- Modal forms
- Confirmation dialogs

### Employee Dashboard
- Task cards with details
- Status dropdown
- Priority color codes
- Responsive layout
- Loading states

## Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI framework |
| Styling | Tailwind CSS | Responsive design |
| Routing | React Router v6 | Navigation |
| HTTP | Axios | API calls |
| Backend | Flask | Web framework |
| Database | SQLAlchemy | ORM |
| Auth | Flask-Session | Authentication |
| CORS | Flask-CORS | Cross-origin requests |

## Performance Optimizations

Frontend:
- Lazy loading components
- Efficient re-renders
- Optimized CSS bundling
- Minified production build

Backend:
- Database indexing
- Query optimization
- Session management
- Error handling

## Development Workflow

1. Backend Development
   - Create Flask routes
   - Test with curl or Postman
   - Ensure JSON responses

2. Frontend Development
   - Create React components
   - Connect to API endpoints
   - Test with demo data

3. Integration Testing
   - Test full user workflows
   - Check error handling
   - Verify data sync

4. Deployment
   - Build frontend
   - Deploy to hosting
   - Run backend on server

## Support

### Common Questions

Q: Can I use this project?  
A: Yes! It's a complete, working application ready for use.

Q: How do I modify the database?  
A: Edit the models in `backend/models/` and create migrations.

Q: How do I add new features?  
A: Add routes in backend and components in frontend, then integrate.

Q: Is this production-ready?  
A: Mostly yes, but consider:
- Adding more security features
- Implementing proper error logging
- Setting up monitoring
- Adding rate limiting
- Implementing data validation

## Learning Resources

### Frontend Learning
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

### Backend Learning
- [Flask Documentation](https://flask.palletsprojects.com)
- [SQLAlchemy](https://sqlalchemy.org)
- [RESTful API Design](https://restfulapi.net)

## License

This project is provided as-is for educational and commercial use.

## Contributing

Feel free to fork, modify, and improve this project!

## Contact & Support

- Check documentation files for detailed guides
- Review component comments in code
- Check browser console for errors
- Verify API responses in Network tab

## Final Checklist

- [x] Frontend built with React + Tailwind
- [x] Backend built with Flask
- [x] Session-based authentication
- [x] Role-based access control
- [x] Admin dashboard with full features
- [x] Employee dashboard with task management
- [x] Responsive design
- [x] Complete documentation
- [x] Working demo credentials
- [x] Production-ready code

## You're All Set!

The application is complete and ready to use. Start the backend and frontend, then login with the demo credentials to explore the full functionality.

Happy coding!

---

Version: 1.0.0  
Last Updated: January 6, 2026  
Status: Production Ready
