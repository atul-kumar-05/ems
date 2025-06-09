# Employee Management System (EMS) Documentation

## Overview

The Employee Management System (EMS) is a full-stack web application designed to manage employee records efficiently. It consists of a React-based frontend (ems-fronted) and a Spring Boot backend (ems-backend), providing a modern, secure, and user-friendly interface for HR and management operations.

---

## Table of Contents

1. [Project Structure](#project-structure)

2. [Frontend (ems-fronted)](#frontend-ems-fronted)
   - [Tech Stack](#frontend-tech-stack)
   - [Key Features](#frontend-key-features)
   - [Component Structure](#frontend-component-structure)
   - [How to Run](#frontend-how-to-run)

3. [Backend (ems-backend)](#backend-ems-backend)
   - [Tech Stack](#backend-tech-stack)
   - [Key Features](#backend-key-features)
   - [API Endpoints](#backend-api-endpoints)
   - [Data Model](#backend-data-model)
   - [How to Run](#backend-how-to-run)

4. [Development & Contribution](#development--contribution)

5. [License](#license)

---

## Project Structure

```
ems/
├── ems-fronted/      # React frontend application
├── ems-backend/      # Spring Boot backend application
└── README.md         # Project root readme (this file)
```

---

## Frontend: `ems-fronted`

### Tech Stack

- **React** (with Vite for fast development)
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **ESLint** for code quality

#### Key Dependencies

- `react`, `react-dom`
- `@vitejs/plugin-react`
- `tailwindcss`, `@tailwindcss/vite`
- `lucide-react`

### Key Features

- **Authentication:** Secure login with JWT token storage.
- **Employee CRUD:** Create, read, update, and delete employee records.
- **Search & Filter:** Quickly find employees by name or department.
- **Responsive UI:** Modern, mobile-friendly design using Tailwind CSS.
- **Role & Department Management:** Assign roles and departments to employees.

### Component Structure

- `src/components/EmployeeManagement.jsx`: Main component handling authentication, employee CRUD, and UI logic.
- `src/App.jsx`, `src/main.jsx`: App entry points and routing.
- `src/assets/`, `src/index.css`, `src/App.css`: Static assets and styles.

### How to Run

1. Install dependencies:
   ```bash
   cd ems-fronted
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The app will be available at `http://localhost:5173` (default Vite port).

---

## Backend: `ems-backend`

### Tech Stack

- **Java 21**
- **Spring Boot 3.5**
- **Spring Security** (JWT-based authentication)
- **Spring Data JPA** (with MySQL)
- **ModelMapper** for DTO mapping
- **Lombok** for boilerplate reduction

#### Key Dependencies

- `spring-boot-starter-web`
- `spring-boot-starter-security`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-validation`
- `io.jsonwebtoken` (JWT)
- `mysql-connector-j`
- `lombok`

### Key Features

- **RESTful API** for employee management
- **JWT Authentication** for secure endpoints
- **Validation** for incoming data
- **Role-based access** (extendable)
- **Error handling** and meaningful responses

### API Endpoints

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| POST   | `/employees/`      | Create a new employee          |
| PUT    | `/employees/{id}`  | Update an existing employee    |
| GET    | `/employees/{id}`  | Get employee by ID             |
| GET    | `/employees/`      | List all employees             |
| DELETE | `/employees/{id}`  | Delete employee by ID          |

> **Note:** All endpoints (except authentication) require a valid JWT token.

### Data Model

**Employee**
- `employeeId` (Integer, Primary Key)
- `firstName` (String)
- `lastName` (String)
- `email` (String)
- `phone` (String)
- `salary` (Double)
- `role` (String)
- `department` (String)

### How to Run

1. Configure your MySQL database in `src/main/resources/application.properties`.
2. Build and run the backend:
   ```bash
   cd ems-backend
   ./mvnw spring-boot:run
   ```
3. The API will be available at `http://localhost:8080`.

---

## Development & Contribution

- **Frontend:** Follow React and Tailwind best practices. Use ESLint for code quality.
- **Backend:** Follow Spring Boot conventions. Use DTOs for API communication and validate all inputs.
- **Pull Requests:** Welcome! Please include tests and update documentation as needed.

---

## License

This project is licensed under the MIT Lice



![Screenshot (8)](https://github.com/user-attachments/assets/dbfd1f9c-98b6-473a-b461-e4bce0c8cee2)
![Screenshot (9)](https://github.com/user-attachments/assets/cf3dfab4-c5d2-41fc-af72-d5a0a9a284fa)
![Screenshot (10)](https://github.com/user-attachments/assets/765d7dc0-e0b4-4d50-b299-2f75b341f12f)
![Screenshot (11)](https://github.com/user-attachments/assets/047c5c81-843d-4fc4-bfa8-2ac65201bb77)
![Screenshot (13)](https://github.com/user-attachments/assets/c44cc066-3b54-41a4-adee-3030ce842ed2)
