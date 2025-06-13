# mellow-baby 🤱

Mellow Baby is a modern full-stack web application designed to help new parents easily track, log, and analyze their baby's daily activities. It is developed with inspiration from the popular mobile app, Nara Baby.

## ✨ Features

- **🍼 Feeding Tracking:** Log breastfeeding (duration, active side) and bottle-feeding (amount, type) sessions.
- **💤 Sleep Tracking:** Track sleep cycles (start, end) and automatically calculate the total sleep duration.
- **🚼 Diaper Change Tracking:** Practical and quick logging for wet, dirty, or mixed diaper changes.
- **📊 Statistics Dashboard:** Interactive charts and data visualizations for daily, weekly, and monthly summaries.
- **👤 User Accounts:** Securely store and manage data with personal accounts (Authentication via JWT).
- **⏰ Live Timers:** Real-time timers for tracking breastfeeding and sleep sessions.

## 💻 Technology Stack

This project is developed within a **Monorepo** structure using modern and scalable technologies.

- **Frontend:**
  - **Angular (v19)**: A powerful and structured frontend framework.
  - **PrimeNG**: For a rich set of professional UI components.
  - **Tailwind CSS**: For rapid and flexible styling.

- **Backend:**
  - **NestJS**: A modern framework for building efficient and scalable Node.js server-side applications (The Angular of Backend).
  - **Node.js**: JavaScript runtime environment.

- **Database:**
  - **MongoDB**: A flexible, document-based NoSQL database.
  - **Mongoose**: An elegant object modeling tool for MongoDB.

- **Authentication:**
  - **JWT (JSON Web Tokens)**: A secure and stateless standard for authentication.

## 📂 Project Structure

The project houses two separate applications within a single repository:

```
mellow-baby/
├── apps/
│   ├── api/          # NestJS Backend Project
│   └── frontend/     # Angular Frontend Project
└── README.md
```

## 🚀 Getting Started / Local Setup

Follow the steps below to run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/)
- [Angular CLI](https://angular.dev/cli) (v19)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[YOUR-USERNAME]/mellow-baby.git
    cd mellow-baby
    ```

2.  **Install backend dependencies:**
    ```bash
    cd apps/api
    npm install
    ```

3.  **Install frontend dependencies:**
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
    The frontend application will start running at `http://localhost:4200`. Open this address in your browser.

## 📄 License

This project is licensed under the MIT License.
