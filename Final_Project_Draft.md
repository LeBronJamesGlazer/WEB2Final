# Final Project Draft

## 1. Project Proposal

*   **Project title:** Personal Expense Tracker API (web2final)
*   **Topic:** A RESTful API for personal finance management that allows users to track their income and expenses securely.
*   **Why did you choose it?:** To demonstrate the implementation of a full-featured backend system with authentication, authorization, and database management, solving the real-world problem of personal budget tracking.
*   **Main features:**
    *   **User Authentication:** Secure registration and login using JWT (JSON Web Tokens) and bcrypt for password hashing.
    *   **Transaction Management:** Create, read, update, and delete (CRUD) operations for financial transactions (income and expenses).
    *   **Role-Based Access Control:** Differentiated access for standard users and administrators (e.g., admin-only user lists).
    *   **Profile Management:** Users can view and update their profile details.
    *   **Data Validation:** robust validation for inputs (email format, positive/negative numbers for amounts).
*   **Team members and their responsibilities:**
    *   *Daryn* - Full Stack Developer (Backend Logic, Database Design, API Implementation)

## 2. Database Design (Schemas)

### User Collection
*   **username**: string (Required)
*   **email**: string (Required, Unique, Valid Email Format)
*   **password**: string (Required, Min length 6, Hashed)
*   **role**: string (Enum: 'user', 'admin', 'premium', Default: 'user')
*   **createdAt**: date (Default: Date.now)

### Transaction Collection
*   **text**: string (Required, Trimmed)
*   **amount**: number (Required)
*   **type**: string (Enum: 'income', 'expense', Required)
*   **category**: string (Default: 'General')
*   **user**: ObjectId (Reference to User, Required)
*   **createdAt**: date (Default: Date.now)

## 3. API Endpoint List

### Auth
*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Login user and get token

### User
*   `GET /api/users/profile` - Get current user profile (Protected)
*   `PUT /api/users/profile` - Update user profile (Protected)
*   `GET /api/users` - Get all users (Protected, Admin only)

### Transactions
*   `GET /api/transactions` - Get all transactions for the logged-in user
*   `POST /api/transactions` - Add a new transaction
*   `GET /api/transactions/:id` - Get a specific transaction details
*   `PUT /api/transactions/:id` - Update a transaction
*   `DELETE /api/transactions/:id` - Delete a transaction

## 4. Folder Structure

```
/
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── public/
│   ├── css/
│   ├── js/
│   └── *.html
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── transactionController.js
    │   └── userController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── errorMiddleware.js
    │   └── roleMiddleware.js
    ├── models/
    │   ├── Transaction.js
    │   └── User.js
    └── routes/
        ├── authRoutes.js
        ├── transactionRoutes.js
        └── userRoutes.js
```
