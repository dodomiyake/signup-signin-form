# User Authentication System

This repository contains a simple user authentication system built with Node.js, Express, and MongoDB. It allows users to sign up, sign in, and log out securely.

## Features

- **Sign Up**: Users can create a new account by providing an email and password. Passwords are hashed using bcrypt before being stored in the database.
  
- **Sign In**: Registered users can log in using their email and password. Password validation is handled securely using bcrypt.
  
- **Session Management**: User sessions are managed using `express-session`, which stores session data in MongoDB. Sessions are maintained until the user logs out or the session expires (configured for 7 days).

- **Flash Messages**: Feedback messages for success and error scenarios are displayed using `connect-flash`.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side logic.
  
- **Express**: Web application framework for Node.js, used for routing and middleware.
  
- **MongoDB**: NoSQL database for storing user data.
  
- **Mongoose**: MongoDB object modeling tool for Node.js, used for schema validation and interacting with the database.

- **bcrypt**: Library for hashing passwords securely.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up MongoDB:
   - Ensure MongoDB is installed and running locally.
   - Update the MongoDB connection URL in `app.js` to point to your local or remote MongoDB instance.

4. Start the application:
   ```
   npm start
   ```

5. Access the application:
   - Open your web browser and go to `http://localhost:4040`

## Usage

- **Sign Up**: Navigate to `/signup` to create a new account.
  
- **Sign In**: Navigate to `/signin` to log in with your credentials.
  
- **Home Page**: After successful login, users are redirected to `/home`.
  
- **Log Out**: Click on the "Log Out" button to end the session and redirect to the sign-in page.

## Notes

- Ensure that MongoDB is running and accessible before starting the application.
- Update the session secret (`sessionConfig.secret`) in `app.js` for better security.
