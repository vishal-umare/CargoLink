import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiFetch } from "@/lib/api";

type Role = "driver" | "shipper" | "admin";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
}

interface AuthContextType {
  user: any | null; // Changed from strict Supabase User to any for flexibility
  session: any | null; // Changed from strict Supabase Session to any
  profile: Profile | null;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata: { name: string; phone: string; role: Role }) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUserStr = localStorage.getItem('user');
      
      if (token && storedUserStr) {
        try {
          const parsedUser = JSON.parse(storedUserStr);
          
          // Mock Supabase User/Session structure for UI compatibility
          const mockUser = {
            id: parsedUser._id,
            email: parsedUser.email,
          };
          
          const mockProfile: Profile = {
            id: parsedUser._id,
            name: parsedUser.name,
            email: parsedUser.email,
            phone: null,
            role: parsedUser.role as Role,
          };
          
          setUser(mockUser);
          setProfile(mockProfile);
          setSession({ access_token: token }); 
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for 401 Unauthorized events from apiFetch
    const handleUnauthorized = () => {
      setUser(null);
      setSession(null);
      setProfile(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const signUp = async (
    email: string,
    password: string,
    metadata: { name: string; phone: string; role: Role }
  ) => {
    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: metadata.name,
          email,
          password,
          role: metadata.role
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: new Error(data.message || 'Registration failed') };
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      const mockUser = { id: data._id, email: data.email };
      const mockProfile: Profile = { 
        id: data._id, 
        name: data.name, 
        email: data.email, 
        phone: null, 
        role: data.role as Role 
      };
      
      setUser(mockUser);
      setProfile(mockProfile);
      setSession({ access_token: data.token });
      
      return { error: null };
    } catch (error: any) {
      console.error("SignUp error:", error);
      return { error: error instanceof Error ? error : new Error('An error occurred during signup') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: new Error(data.message || 'Login failed') };
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      const mockUser = { id: data._id, email: data.email };
      const mockProfile: Profile = { 
        id: data._id, 
        name: data.name, 
        email: data.email, 
        phone: null, 
        role: data.role as Role 
      };
      
      setUser(mockUser);
      setProfile(mockProfile);
      setSession({ access_token: data.token });
      
      return { error: null };
    } catch (error: any) {
      console.error("SignIn error:", error);
      return { error: error instanceof Error ? error : new Error('An error occurred during login') };
    }
  };

  const signOut = async () => {
    // 1. Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // 2. Clear state cleanly
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

