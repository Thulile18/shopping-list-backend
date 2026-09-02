# Shopping List REST API

A pure Node.js and TypeScript REST API implementing full CRUD capabilities for a Shopping List tracker system using pure in-memory data structures. Built entirely without external framework dependencies to emphasize deep clean architecture design rules.

## Due Date Tracking
* **Target Deadline:** 09 September 2026, 16:00 SAST

## Project File Layout
```text
├── dist/                   # Transpiled build production files
├── src/
│   ├── models/
│   │   └── item.ts         # Data Model interface shape definitions
│   ├── utils/
│   │   └── response.ts     # Stream parsers & consistent JSON structures
│   └── server.ts           # Core server mapping setup & controller routing
├── package.json
└── tsconfig.json
```

## Setup & Running Guide

1. Install project dependencies:
   ```bash
   npm install
   ```
2. Spin up the application inside the live development environment watcher:
   ```bash
   npm run dev
   ```

## Endpoint Matrix

All communication transactions across these endpoints use a uniform, nested validation envelope payload design pattern:

### 1. Retrieve Entire List Stack
* **Endpoint:** `GET /items`
* **Response Status:** `200 OK`

### 2. Append New List Element
* **Endpoint:** `POST /items`
* **Request Payload Example:**
  ```json
  {
    "name": "Milk",
    "quantity": "2L",
    "purchased": false
  }
  ```
* **Response Status:** `201 Created` (Valid fields) or `400 Bad Request` (Missing validation targets)

### 3. Fetch Specific Element Node
* **Endpoint:** `GET /items/:id`
* **Response Status:** `200 OK` (Found) or `404 Not Found` (Invalid identifier index)

### 4. Update Resource Property Sets
* **Endpoint:** `PUT /items/:id`
* **Request Payload Example:**
  ```json
  {
    "name": "Milk",
    "quantity": "3L",
    "purchased": true
  }
  ```
* **Response Status:** `200 OK` (Updated) or `404 Not Found`

### 5. Remove Target Resource Node
* **Endpoint:** `DELETE /items/:id`
* **Response Status:** `204 No Content` (Success path) or `404 Not Found`
