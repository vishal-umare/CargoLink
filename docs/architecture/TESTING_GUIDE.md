# CargoLink API Postman Testing Guide

This guide will walk you through how to test your brand new Node.js/Express backend using Postman.

## Pre-requisites
1. Ensure your MongoDB Atlas is connected in `.env`
2. Start your server: `npm start` (Make sure it says "Server running on port 5000" and "MongoDB Connected")
3. Open Postman.

---

## Step 1: Register a New User (Shipper)

First, we need to create an account so we can log in.

1. In Postman, click **New > HTTP Request**.
2. Change the method from `GET` to **`POST`**.
3. Enter the URL: `http://localhost:5000/api/auth/register`
4. Go to the **Body** tab, select **raw**, and change the dropdown from `Text` to **`JSON`**.
5. Paste this JSON:
```json
{
  "name": "Jane Shipper",
  "email": "jane@example.com",
  "password": "password123",
  "role": "shipper"
}
```
6. Click **Send**.

**Expected Response (201 Created):**
```json
{
  "_id": "65b9f8d7a...",
  "name": "Jane Shipper",
  "email": "jane@example.com",
  "role": "shipper",
  "token": "eyJhbGciOiJIUzI1Ni..."
}
```

---

## Step 2: Login & Copy Your Token

Even though Register gives you a token, it's good practice to test the Login route too.

1. Change the URL to: `http://localhost:5000/api/auth/login` (Still using **`POST`**)
2. Keep **Body > raw > JSON**.
3. Paste this JSON:
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```
4. Click **Send**.
5. **CRITICAL STEP**: Look at the response at the bottom. Highlight the long string next to `"token"` (do not copy the quotes) and copy it (`Ctrl+C` or `Cmd+C`). You will need this token for every other request!

---

## Step 3: Use the Token in Protected Routes (Create a Load)

Now let's prove that the system blocks unauthorized people, and allows authorized people.

1. Open a new tab in Postman. Change method to **`POST`**.
2. URL: `http://localhost:5000/api/loads`
3. Go to the **Authorization** tab.
4. Change the "Type" dropdown to **"Bearer Token"**.
5. Paste your copied token into the "Token" box.
6. Now go to the **Body** tab, select **raw > JSON**.
7. Paste this JSON:
```json
{
  "pickupLocation": "New York, NY",
  "deliveryLocation": "Los Angeles, CA",
  "weight": 5000
}
```
8. Click **Send**.

**Expected Response (201 Created):**
```json
{
  "shipperId": "65b9f8d7a...",
  "pickupLocation": "New York, NY",
  "deliveryLocation": "Los Angeles, CA",
  "weight": 5000,
  "status": "pending",
  "_id": "65ba1c23f...",
  "createdAt": "2024-01-31T...",
  "updatedAt": "2024-01-31T..."
}
```

*Experiment: Try going to the Authorization tab, changing the Type back to "No Auth", and clicking Send. You should get a "401 Not authorized, no token provided" error!*

---

## Step 4: Get All Loads

Let's test fetching the loads.

1. Open a new tab. Method: **`GET`**.
2. URL: `http://localhost:5000/api/loads`
3. Go to **Authorization > Bearer Token** and paste your token.
4. Leave the **Body** completely empty (GET requests don't need bodies).
5. Click **Send**.

**Expected Response (200 OK):**
```json
[
  {
    "_id": "65ba1c23f...",
    "shipperId": {
      "_id": "65b9f8d7a...",
      "name": "Jane Shipper",
      "email": "jane@example.com"
    },
    "pickupLocation": "New York, NY",
    "deliveryLocation": "Los Angeles, CA",
    "weight": 5000,
    "status": "pending"
  }
]
```
*(Notice how Mongoose `.populate()` automatically filled in Jane's details instead of just showing her ID!)*

Congratulations! Your entire API workflow is fully tested and functioning perfectly.
