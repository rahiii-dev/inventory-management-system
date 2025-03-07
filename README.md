# 📦 Inventory Management System (MERN)

This is a **MERN**-based **Inventory Management System** that allows users to manage products, customers, sales, and generate reports in various formats.

## 🚀 Features
- **User Authentication** (Login, Protected Routes)  
- **Inventory Management** (Add, Update, Delete items)  
- **Customer Management** (Store customer details)  
- **Sales Module** (Record transactions, track sales)  
- **Reports** (Sales Report, Item Report, Customer Ledger)  
- **Data Export** (Print, Excel, PDF, Email)  

## 📁 Project Structure
```
/backend         → Backend (Node.js, Express, MongoDB)
/backend/src     → Backend source code
/backend/.env-example → Example environment variables

/web/project     → Frontend (React, Vite)
/web/project/src → Frontend source code
/web/project/.env-example → Example environment variables
```

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/rahiii-dev/inventory-management-system
cd inventory-management-system
```

### 2️⃣ Setup Backend
```sh
cd backend
cp .env-example .env   # Copy and configure environment variables
npm install            # Install dependencies
npm run dev            # Start server in developement mode

```
**Backend Scripts:**
- `npm start` → Runs the app in production (`dist/server.js`)
- `npm run dev` → Runs the app in development (`src/server.ts` with nodemon)
- `npm run build` → Compiles TypeScript to JavaScript

### 3️⃣ Setup Frontend
```sh
cd ../web/project
cp .env-example .env  # Copy and configure environment variables
npm install           # Install dependencies
npm run dev           # Start the frontend (Vite)
```
**Frontend Scripts:**
- `npm run dev` → Starts the React app in development mode
- `npm run build` → Builds the project for production
- `npm run preview` → Runs the production build
- `npm run lint` → Runs ESLint to check code quality

## 🌍 Running the Application
1. **Run the backend** → `cd backend && npm run dev`  
2. **Run the frontend** → `cd web/project && npm run dev`  
3. Open **`http://localhost:5173`** in your browser.
