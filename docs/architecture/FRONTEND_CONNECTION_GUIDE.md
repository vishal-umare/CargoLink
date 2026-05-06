# Connecting React Frontend to Node.js Backend

When moving away from Supabase, you stop using the `@supabase/supabase-js` client. Instead, you make HTTP requests to your new Node.js server using the built-in browser `fetch` API (or a library like `axios`).

Here is a simple, beginner-friendly guide showing exactly how to rewrite your frontend logic.

---

## 1. Login (Authentication)

Instead of calling `supabase.auth.signInWithPassword`, you send a POST request to your `/api/auth/login` route.

```javascript
// Example Login Function in React
const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Convert our data into a JSON string
      body: JSON.stringify({ email, password }), 
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login successful!', data);
      
      // CRITICAL: Save the token and user data to localStorage
      // so we can use it on other pages!
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      return data;
    } else {
      // The server sent back an error (e.g., 401 Invalid email/password)
      console.error(data.message);
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
};
```

---

## 2. Explain: How to Send the Token in Headers

For protected routes (like creating a load), the backend expects your JWT token in the `Authorization` header. You must retrieve the token from `localStorage` (where you saved it during login) and attach it to the `fetch` request.

Format:
```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

---

## 3. Create a Load (Protected Route)

Here is how a Shipper creates a load. Notice how we attach the token!

```javascript
// Example Create Load Function in React
const createLoad = async (pickupLocation, deliveryLocation, weight) => {
  try {
    // 1. Get the saved token
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('You must be logged in to create a load!');
      return;
    }

    // 2. Make the POST request
    const response = await fetch('http://localhost:5000/api/loads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 3. Attach the token exactly like this:
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ pickupLocation, deliveryLocation, weight }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Load created successfully!', data);
    } else {
      console.error('Error creating load:', data.message);
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
};
```

---

## 4. Get All Loads (Protected Route)

Here is how a Driver fetches all available loads. GET requests are simpler because they don't require a body.

```javascript
// Example Fetch Loads Function in React
const getAvailableLoads = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5000/api/loads', {
      method: 'GET',
      headers: {
        // We still need the token to prove we are logged in!
        'Authorization': `Bearer ${token}`
      }
    });

    const loads = await response.json();

    if (response.ok) {
      console.log('Fetched loads:', loads);
      // In React, you would typically save this to state here:
      // setLoads(loads);
    } else {
      console.error('Error fetching loads:', loads.message);
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
};
```

## Summary
To replace Supabase in your React components:
1. Delete imports like `import { supabase } from "@/integrations/supabase/client"`.
2. Replace the supabase calls with standard `fetch()` functions pointing to `http://localhost:5000/api/...`
3. Always include the `Authorization` header for protected routes.
