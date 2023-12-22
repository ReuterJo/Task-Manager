# Description

This is a full stack task manager application developed using the Node.js framework. The frontend is built with React and the backend is managed with MongoDB.

# Setup

1. Navigate to the task-manager-ui directory and enter "npm install"

2. Navigate to the task-manager-api directory and enter "npm install"

3. Create a free MongoDB Atlas account: https://www.mongodb.com/cloud/atlas/register

4. Create a new database called "tasks_db" and a new collection within that database called "tasks": https://www.mongodb.com/basics/create-database

5. Obtain your MongoDB connection string: https://www.mongodb.com/basics/mongodb-connection-string

6. Navigate to the task-manager-api directory, and make a ".env" file. Include the following two lines:

MONGODB_CONNECT_STRING='mongodb+srv://<MongoDBUserName>:<MongoDBDatabasePassword>@<MongoDBConnectionString>/tasks_db'
PORT=8000

Please note that <MongoDBDatabasePassword> is distinct from your password associated with your MongoDB login

7. Navigate to the task-manager-api directory and enter "npm start." This will start the backend on http://localhost:8000/

8. Navigate to task-manager-ui directory and enter "npm start." This will start the frontend on http://localhost:3000/