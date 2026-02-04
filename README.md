#  Personal Expense Manager

A full-stack Node.js application for tracking personal finances. This project features secure authentication, role-based access control (RBAC), interactive data visualization, and is optimized for cloud deployment.

##  Live Demo
https://web2final-2.onrender.com

## ✨ Features

- ** Secure Authentication:** User registration and login powered by JSON Web Tokens (JWT) and Bcrypt password hashing.
- ** Transaction Tracking:** Add, view, and delete income and expense records.
- ** Data Visualization:** Interactive Chart.js doughnut chart for real-time visual breakdown of finances.
- ** Role-Based Access Control (RBAC):**
  - **User:** Standard access to manage personal transactions.
  - **Premium:** Access to advanced analytics and exclusive content.
  - **Admin:** Management capabilities to view all system users.
- ** Email Notifications:** Integrated email service (Nodemailer) for registration welcome emails.
- ** Security:** Protected headers with Helmet, CORS configuration, and input validation using Joi.

##  Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Cloud) using Mongoose ODM
- **Frontend:** HTML5, CSS3, Vanilla JavaScript, Chart.js
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Render (Web Service)

##  Project Structure

```
WEB2Final/
├── public/             # Static frontend files (HTML, CSS, JS)
│   ├── js/app.js       # Main frontend logic (Fetch API calls, Chart.js)
│   └── ...
├── src/
│   ├── config/         # DB connection & configuration
│   ├── controllers/    # Request logic (Auth, Transactions, Users)
│   ├── middleware/     # Auth checks, Error handling, Role verification
│   ├── models/         # Mongoose Schemas (User, Transaction)
│   ├── routes/         # API Route definitions
│   ├── app.js          # Express app setup
│   └── server.js       # Entry point
├── package.json        # Dependencies & Scripts
└── README.md           # Documentation
```

##  Local Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd WEB2Final
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    MONGO_URI=mongodb+srv://<user>:<password>@cluster0.y4lkgxm.mongodb.net/web2final?retryWrites=true&w=majority
    JWT_SECRET=your_super_secret_key
    NODE_ENV=development

    # Email Config (Optional - utilizing Mailtrap/Nodemailer)
    EMAIL_HOST=smtp.mailtrap.io
    EMAIL_PORT=2525
    EMAIL_USER=your_mailtrap_user
    EMAIL_PASS=your_mailtrap_password
    ```

4.  **Run the Application:**
    ```bash
    npm start
    ```
    Access the app at: `http://localhost:3000`

##  API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT

### Transactions (Protected)
- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions` - Add a new transaction
- `DELETE /api/transactions/:id` - Remove a transaction

### Premium (Role: Premium)
- `GET /api/premium/content` - Access exclusive charts and data

### Admin (Role: Admin)
- `GET /api/admin/users` - View all registered users

##  Deployment Guide (Render)

This project is configured for seamless deployment on [Render](https://render.com).

1.  **Push to GitHub:** Ensure your code is pushed to a GitHub repository.
2.  **Create Web Service:**
    - Go to Render Dashboard -> New -> Web Service.
    - Connect your repository.
3.  **Settings:**
    - **Runtime:** Node
    - **Build Command:** `npm install`
    - **Start Command:** `npm start`
4.  **Environment Variables:**
    Add the following in the Render Environment tab:
    - `MONGO_URI`: Your MongoDB Atlas connection string.
    - `JWT_SECRET`: A strong random string.
    - `NODE_ENV`: `production`
5.  **Deploy:** Click "Create Web Service".

---
*Created for Web2 Final Project.*
