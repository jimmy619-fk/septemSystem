# Task Management System

# Overview

The Task Management System is a web application designed to help users efficiently manage their tasks. It includes features such as user authentication, task creation, updates, deletion, and deadline notifications. The system also incorporates rate limiting to prevent abuse, along with Swagger documentation for easy API reference.

# Important points

-Only admin can delete tasks (There is a protectedApi middleware which will detect user is admin or not)

- task’s deadline is near (less than 1 hour remaining), Using nodemailer gmail service notifications will be sended to users. (In future we can implement batching in this. Incase if we want to scale the system) (This is tested Will provide the screen shot as well)

- API Rate Limiting is implemented (express-rate-limit)
  1- Users can create up to 20 tasks per hour (rate limit applied).
  2- Users cannot register or log in more than 5 times within 15 minutes (rate limit applied).

- Task Fetching: Indexing and pagination have been implemented to improve the speed and efficiency of data retrieval. (user can filter by status (pending/completed))

# Database design

- Mongoose is used for schema
- Two collections: Users and Tasks. (Users can have multiple tasks)

## Setup Instructions

1. Clone repository https://github.com/jimmy619-fk/septemSystem.git
2. Install dependencies: `npm install`
3. Create `.env` file with required configurations (if you want to use mine you can extract zip folder sended on mail to hr)
4. replace your scripts in package.json with below script
   "scripts": {
   "start": "nodemon node server.js",
   "dev": "nodemon server.js"
   },
5. Start server: `npm start`

## API Documentation

Access Swagger docs at `/api-docs`

## Key Features

- User Authentication
- Task CRUD Operations
- Deadline Notifications
- Rate Limiting
- Error Handling

## Environment Variables

- `PORT`: Server port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key
- `JWT_EXPIRES_IN`: 1h (give according your requirement)
- `EMAIL_USER`: from which email will be send
- `EMAIL_APP_PASSWORD`: you can generate passsword for this app by going to google settings
