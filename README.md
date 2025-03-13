# Gadget Inventory Management System

## Project Overview
A full-stack inventory management application for tracking gadgets.

## Technologies
- Backend: Node.js
- Frontend: Angular
- Database: SQLite

## Backend Setup
1. Navigate to backend directory
cd backend
npm install
npm start

## Postman Collection Details

### Endpoints

1. Get All Gadgets
   - Method: GET
   - URL: `http://localhost:3000/api/gadgets`

2. Create Single Gadget
   - Method: POST
   - URL: `http://localhost:3000/api/gadgets/single`

3. Get Gadget by ID
   - Method: GET
   - URL: `http://localhost:3000/api/gadgets/{id}`

4. Update Single Gadget
   - Method: PUT
   - URL: `http://localhost:3000/api/gadgets/single/{id}`

5. Delete Single Gadget
   - Method: DELETE
   - URL: `http://localhost:3000/api/gadgets/single/{id}`

6. Bulk Create Gadgets
   - Method: POST
   - URL: `http://localhost:3000/api/gadgets/bulk`

6. Bulk Update Gadgets
   - Method: PUT
   - URL: `http://localhost:3000/api/gadgets/bulk`

6. Bulk Delete Gadgets
   - Method: DELETE
   - URL: `http://localhost:3000/api/gadgets/bulk`

### Authentication Endpoints

1. Register User
   - Method: POST
   - URL: `http://localhost:3000/api/auth/register`

2. Login User
   - Method: POST
   - URL: `http://localhost:3000/api/auth/login`   
     