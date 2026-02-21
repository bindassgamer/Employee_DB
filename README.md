# Employee Management System

Full-stack employee management application with authentication, employee listing/filtering, and employee creation with photo upload.

## Tech Stack

- Frontend: React 18 + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT (Bearer token)
- Uploads: Multer (image files up to 3 MB)

## Project Structure

```text
.
|-- client/   # React app
`-- server/   # Express API
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB running locally or remotely

## Environment Variables

### Server (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/employee_management
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=1h
CLIENT_ORIGIN=http://localhost:5173
```

### Client (`client/.env`)

```env
VITE_API_BASE=http://localhost:5000
```

## Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

## Run Locally

Open two terminals.

### 1) Start backend

```bash
cd server
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2) Start frontend

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Available Scripts

### Client (`client/package.json`)

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build

### Server (`server/package.json`)

- `npm run dev` - start API with nodemon
- `npm start` - start API with node

## Authentication Flow

1. Login via `POST /api/auth/login` with `identifier` (email or username) and `password`.
2. API returns a JWT token.
3. Frontend stores token in `localStorage` and sends it as `Authorization: Bearer <token>`.
4. Protected employee endpoints require this header.

## API Endpoints

Base URL: `http://localhost:5000`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Employees (Protected)

- `GET /api/employees/meta`
- `GET /api/employees?search=&department=&designation=&gender=`
- `POST /api/employees` (multipart/form-data, file field name: `photo`)

## Validation Rules

- Required fields for employee creation:
  `fullName`, `dateOfBirth`, `email`, `department`, `phoneNumber`, `designation`, `gender`, `photo`
- Email must be valid format.
- Phone number must be exactly 10 digits.
- Photo must be an image (`jpeg`, `jpg`, `png`, `webp`) and <= 3 MB.

## Notes

- Uploaded employee photos are stored in `server/src/uploads` and served from `/uploads`.
- If `server/src/uploads` does not exist, create it manually:

```bash
New-Item -ItemType Directory -Force server/src/uploads
```

## Current UI Features

- Login screen
- Employee dashboard table
- Search employees
- Create employee modal with image upload
- Logout action

## Troubleshooting

- `MONGO_URI is not set`: check `server/.env`.
- `Missing or invalid token`: login again and verify auth header.
- CORS issues: ensure `CLIENT_ORIGIN` matches your frontend URL.
