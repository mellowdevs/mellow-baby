# mellow-baby 🤱

Mellow Baby is a modern full-stack web application designed to help new parents easily track, log, and analyze their baby's daily activities. It is developed with inspiration from the popular mobile app, Nara Baby.

## ✨ Features

- **🍼 Feeding Tracking:** Log breastfeeding (duration, side) and bottle-feeding (amount, type) sessions.
- **💤 Sleep Tracking:** Track sleep cycles (start, end) and automatically calculate total sleep duration.
- **🚼 Diaper Change Tracking:** Quick logging for wet, dirty, or mixed diaper changes.
- **📊 Statistics Dashboard:** Interactive charts and data visualizations for daily, weekly, and monthly summaries.
- **👤 User Accounts:** Securely store and manage data with personal accounts (Authentication via JWT).
- **⏰ Live Timers:** Real-time timers for tracking breastfeeding and sleep sessions.

## 💻 Technology Stack

This project is developed within a **Monorepo** structure using modern and scalable technologies.

- **Frontend:** Angular (v19), PrimeNG, Tailwind CSS
- **Backend:** NestJS, Node.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **API Documentation:** Swagger (OpenAPI)

## 📖 API Documentation (Swagger)

The API is documented using Swagger. Once the backend server is running, you can view and interact with the live, auto-generated API documentation at:

[**http://localhost:3000/api-docs**](http://localhost:3000/api-docs)

## Endpoints

The following API endpoints are currently available:

| Endpoint      | Method | Description                                                                                             | Payload / Response                                                                                                   |
| :------------ | :----- | :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------- |
| `/users`      | `POST` | Creates a new user (Register). Checks for duplicate emails. Hashes the password before saving.           | **Body:** `{ "name": "string", "email": "string", "password": "string" }` <br/> **Returns:** The created user object. |
| `/auth/login` | `POST` | Authenticates a user with email and password. Returns a JSON Web Token (JWT) upon successful validation. | **Body:** `{ "email": "string", "password": "string" }` <br/> **Returns:** `{ "access_token": "string" }`           |

## 🚀 Getting Started / Local Setup

Follow the steps below to run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/)
- [Angular CLI](https://angular.dev/cli) (v19)
- [MongoDB](https://www.mongodb.com/try/download/community) (A local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[YOUR-USERNAME]/mellow-baby.git
    cd mellow-baby
    ```
2.  **Configure Environment Variables (Backend):**
    Before running the backend, you must set up your environment variables.
    - In the `apps/api` directory, create a new file named `.env`.
    - Add the following variables, replacing the placeholder values with your own:
      ```env
      DATABASE_URL=YOUR_MONGODB_ATLAS_CONNECTION_STRING
      JWT_SECRET=YOUR_SUPER_SECRET_FOR_JWT_SIGNING
      ```

3.  **Install backend dependencies:**
    ```bash
    cd apps/api
    npm install
    ```

4.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

You will need two separate terminals to run the application.

1.  **Start the backend (in Terminal 1):**
    From within the `apps/api` directory:
    ```bash
    npm run start:dev
    ```
    The backend API will start running at `http://localhost:3000`.

2.  **Start the frontend (in Terminal 2):**
    From within the `apps/frontend` directory:
    ```bash
    ng serve
    ```
    The frontend application will start running at `http://localhost:4200`.

## 📄 License

This project is licensed under the MIT License.
