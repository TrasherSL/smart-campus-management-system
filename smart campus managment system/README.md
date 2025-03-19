# Smart Campus Management System

A comprehensive MERN stack application for managing campus resources, events, scheduling, and communication. This system provides a modern, user-friendly interface for managing various aspects of campus life.

## Features

### 1. Event Management
- Create, edit, and delete campus events
- Categorize events (Academic, Workshop, Seminar, Club, Sports, Social)
- Set event capacity and target audience
- Mark events as featured
- Add events to personal calendar
- Share events with others
- View events in grid, list, or calendar format
- Filter events by category, department, date, and audience

### 2. User Management
- Role-based access control (Admin, Lecturer, Student)
- User authentication and authorization
- Profile management
- Department-specific access

### 3. Resource Management
- Manage campus resources
- Resource allocation and scheduling
- Resource availability tracking
- Department-wise resource organization

### 4. Calendar Integration
- Personal calendar management
- Event scheduling and reminders
- Calendar export functionality
- Conflict detection

### 5. Department Management
- Department and sub-department organization
- Department-specific events and resources
- Department-wise access control

### 6. Communication Features
- Event notifications
- Department announcements
- User messaging system

## Technical Stack

### Frontend
- React.js
- Material-UI (MUI)
- Redux for state management
- React Router for navigation
- React Big Calendar for calendar view
- date-fns for date manipulation
- react-hot-toast for notifications

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Socket.IO for real-time features

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd smart-campus-management-system
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5002
```

4. Start the development servers:
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
npm run server  # Backend
npm run client  # Frontend
```

## Building for Production

To build the project for production:

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Configure the backend for production:
```bash
cd ../backend
# Set NODE_ENV=production in your .env file
```

3. Start the production server:
```bash
cd ..
npm start
```

## Project Structure

```
smart-campus-management-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── package.json
```

## API Endpoints

### Events
- GET /api/events - Get all events
- POST /api/events - Create new event
- GET /api/events/:id - Get event details
- PUT /api/events/:id - Update event
- DELETE /api/events/:id - Delete event
- POST /api/events/:id/register - Register for event
- DELETE /api/events/:id/register - Unregister from event

### Users
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile

### Resources
- GET /api/resources - Get all resources
- POST /api/resources - Create new resource
- GET /api/resources/:id - Get resource details
- PUT /api/resources/:id - Update resource
- DELETE /api/resources/:id - Delete resource

## Troubleshooting

### Package.json Not Found Error
If you encounter an error like:
```
npm error syscall open
npm error path C:\path\to\project\package.json
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
```

Make sure you are in the correct directory:
1. Check your current directory with `pwd` (Unix/Mac) or `cd` (Windows)
2. Navigate to the directory containing the appropriate package.json:
   - For frontend build: `cd frontend`
   - For backend: `cd backend`
   - For root commands: Make sure you're in the project root

If the package.json file is missing:
1. Check if you're in the correct project structure
2. If necessary, create a package.json file using `npm init`

### Other Common Issues
- **MongoDB Connection Errors**: Ensure MongoDB is running and your connection string is correct
- **Port Already in Use**: Change the port in the .env file
- **Missing Dependencies**: Run `npm install` in the appropriate directory

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the system administrator or create an issue in the repository.