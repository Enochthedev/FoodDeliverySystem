# Food Delivery Backend Application

## Overview

This is a backend application for a food delivery service, built using **Node.js**, **Express**, **MongoDB**, and **Swagger** for API documentation. The application provides a RESTful API for managing food orders, restaurants, delivery personnel, and user authentication.

## Features

- **User Authentication**: Register, login, password reset, and role-based access control
- **Order Management**: Create, read, update, and delete orders
- **Restaurant Management**: Create, read, update, and delete restaurants
- **Delivery Personnel Management**: Create, read, update, and delete delivery personnel
- **Order Assignment**: Assign orders to available delivery personnel
- **Payment Gateway Integration**: Secure transactions using third-party payment gateways
- **API Documentation**: Uses Swagger for easy API reference

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- MongoDB (Atlas or Local Instance)
- Package Manager (`npm` or `yarn`)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/enochthedev/food-delivery-backend.git
   cd food-delivery-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm start
   ```

### Configuration

- Create a `.env` file with the following variables:

  ```env
  DB_URI=your_mongo_connection_string
  PAYMENT_GATEWAY_API_KEY=your_payment_api_key
  PAYMENT_GATEWAY_SECRET_KEY=your_payment_secret_key
  JWT_SECRET=your_jwt_secret
  ```

- Ensure MongoDB is running before starting the server.

## API Documentation

The API documentation is available via **Swagger UI** at:

```
http://localhost:4000/api-docs
```

## Endpoints

### **Authentication**

- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login and get JWT token
- `POST /api/user/request-password-reset` - Request a password reset link
- `POST /api/user/reset-password` - Reset password using a token
- `POST /api/user/verify-email` - Verify user email
- `POST /api/user/logout` - Logout user

### **Orders**

- `GET /api/orders` - Retrieve all orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Retrieve an order by ID
- `PUT /api/orders/:id` - Update an order
- `DELETE /api/orders/:id` - Delete an order

### **Restaurants**

- `GET /api/restaurants` - Retrieve all restaurants
- `POST /api/restaurants` - Create a restaurant
- `GET /api/restaurants/:id` - Retrieve a restaurant by ID
- `PUT /api/restaurants/:id` - Update a restaurant
- `DELETE /api/restaurants/:id` - Delete a restaurant

### **Delivery Personnel**

- `GET /api/delivery-personnel` - Retrieve all delivery personnel
- `POST /api/delivery-personnel` - Create a new delivery personnel
- `GET /api/delivery-personnel/:id` - Retrieve a delivery personnel by ID
- `PUT /api/delivery-personnel/:id` - Update a delivery personnel
- `DELETE /api/delivery-personnel/:id` - Delete a delivery personnel

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

## License

This project is licensed under the **MIT License**.

## Social Media

Follow us for updates:

[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=flat&logo=twitter&logoColor=white)](https://x.com/M1thuChowdhury)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/iftekharalammithu/)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=flat&logo=instagram&logoColor=white)](https://www.instagram.com/iftekharalammithu/)
