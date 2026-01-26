# Personal Expense Manager

A full-stack Node.js application for tracking personal income and expenses. This project demonstrates authentication, role-based access control, CRUD operations, and email integration.

## Features

- **User Authentication:** Secure Registration and Login using JWT and bcrypt.
- **Transaction Management:** Create, Read, Update, and Delete income/expense records.
- **Role-Based Access Control (RBAC):** 'User', 'Admin', and 'Premium' roles.
- **Email Notification:** Sends a "Welcome" email upon registration (Simulated with Ethereal/Nodemailer).
- **Security:** Helmet for headers, CORS enabled, Password Hashing, Input Validation (Joi).

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Validation:** Joi
- **Frontend:** HTML5, CSS3, Vanilla JavaScript

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd WEB2Final
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory (or rename `.env.example` if provided) and add:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    EMAIL_SERVICE=ethereal
    ```

4.  **Run the App:**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3000`.

5.  **Open in Browser:**
    Navigate to `http://localhost:3000` to use the web interface.

## API Documentation

### Authentication

- `POST /api/auth/register`
    - Body: `{ "username": "John", "email": "john@test.com", "password": "123", "role": "user" }`
    - Returns: User object + Token
- `POST /api/auth/login`
    - Body: `{ "email": "john@test.com", "password": "123" }`
    - Returns: User object + Token

### Users (Protected)

- `GET /api/users/profile` - Get logged-in user details.
- `PUT /api/users/profile` - Update profile.
- `GET /api/users` - Admin only: List all users.

### Transactions (Protected)

- `GET /api/transactions` - Get all transactions for the user.
- `POST /api/transactions` - Create a transaction.
    - Body: `{ "text": "Salary", "amount": 5000, "type": "income" }`
- `PUT /api/transactions/:id` - Update a transaction.
- `DELETE /api/transactions/:id` - Delete a transaction.

## Screenshots

*(Placeholders for actual screenshots)*

1.  **Login Screen**
    ![Login Screen](screenshots/login.png)
    *Secure login interface.*

2.  **Dashboard**
    ![Dashboard](screenshots/dashboard.png)
    *View your income and expenses in a list.*

3.  **Add Transaction**
    ![Add Transaction](screenshots/add.png)
    *Form to add new financial records.*
