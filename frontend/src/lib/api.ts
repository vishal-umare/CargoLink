export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * A wrapper around native fetch that automatically attaches the JWT token
 * and handles 401 Unauthorized errors (token expiration).
 */
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = new Headers(options.headers || {});
  
  // Auto-attach token
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Auto-set JSON content type if not FormData
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle Token Expiration / Invalid Token
  // BUT don't intercept 401 on auth endpoints — those are expected login/register failures
  const isAuthEndpoint = endpoint.startsWith('/auth/');
  if (response.status === 401 && !isAuthEndpoint) {
    console.error("Authentication failed or token expired. Logging out.");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch event so AuthProvider can clear its state
    window.dispatchEvent(new Event('auth:unauthorized'));
    
    // Redirect to login (root) if not already there
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }

  return response;
};
