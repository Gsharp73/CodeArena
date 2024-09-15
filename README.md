# Coding Challenge Platform

Website for practicing and creating problems. It uses MongoDB, Express.js, React, and Docker. Users can solve problems, make their own, and blog about coding.
Used docker for safe execution of user's code.

## Running the Project

Note: Docker commands may need admin rights.

1. Build Docker containers:
   ```
   docker-compose build
   ```

2. Start containers:
   ```
   docker-compose up -d
   ```

3. Run backend:
   ```
   cd backend
   npm run devStart
   ```