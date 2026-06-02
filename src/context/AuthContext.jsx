import { createContext, useState, useEffect } from 'react';
import { authService } from '@services/authService';

export const AuthContext = createContext(null);

const DEMO_USERS_KEY = 'demo_users';

const readDemoUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]');
  } catch (error) {
    console.error('Failed to parse demo users:', error);
    return [];
  }
};

const writeDemoUsers = (users) => {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
};

const isNetworkError = (error) => !error?.response;

const buildDemoToken = (email) => `demo-token:${email}`;

const getDemoUserFromToken = (token) => {
  if (!token?.startsWith('demo-token:')) {
    return null;
  }

  const email = token.replace('demo-token:', '');
  const users = readDemoUsers();
  const user = users.find((entry) => entry.email === email);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || 'user',
    status: user.status || 'active',
    firedReason: user.firedReason || '',
    firedAt: user.firedAt || null,
    rehiredAt: user.rehiredAt || null,
    rehireMessage: user.rehireMessage || '',
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = token.startsWith('demo-token:')
          ? getDemoUserFromToken(token)
          : (await authService.verifyToken(token)).data;

        if (!userData) {
          throw new Error('Invalid demo session');
        }

        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      if (isNetworkError(error)) {
        const users = readDemoUsers();
        const matchedUser = users.find(
          (entry) => entry.email === credentials.email && entry.password === credentials.password
        );

        if (!matchedUser) {
          return { success: false, error: 'Invalid email or password' };
        }

        const userData = {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role || 'user',
          status: matchedUser.status || 'active',
          firedReason: matchedUser.firedReason || '',
          firedAt: matchedUser.firedAt || null,
          rehiredAt: matchedUser.rehiredAt || null,
          rehireMessage: matchedUser.rehireMessage || '',
        };

        localStorage.setItem('token', buildDemoToken(matchedUser.email));
        setUser(userData);
        setIsAuthenticated(true);

        return { success: true, user: userData, demoMode: true };
      }

      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      if (isNetworkError(error)) {
        const users = readDemoUsers();
        const emailExists = users.some((entry) => entry.email === userData.email);

        if (emailExists) {
          return { success: false, error: 'An account with this email already exists' };
        }

        const newUser = {
          id: `demo-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role || 'user',
          createdAt: new Date().toISOString(),
        };

        writeDemoUsers([...users, newUser]);
        return {
          success: true,
          data: {
            user: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              status: newUser.status || 'active',
              firedReason: newUser.firedReason || '',
              firedAt: newUser.firedAt || null,
              rehiredAt: newUser.rehiredAt || null,
              rehireMessage: newUser.rehireMessage || '',
            },
          },
          demoMode: true,
        };
      }

      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const loginAsDemo = (role = 'user') => {
    const email = role === 'admin' ? 'admin@demo.com' : 'user@demo.com';
    const demoUser = {
      id: `demo-${role}-001`,
      name: role === 'admin' ? 'Admin User' : 'Demo User',
      email,
      role,
      status: 'active',
      firedReason: '',
      firedAt: null,
      rehiredAt: null,
      rehireMessage: '',
    };
    const token = buildDemoToken(email);

    // Seed demo user into storage so token verification works on reload
    const users = readDemoUsers();
    if (!users.find((u) => u.email === email)) {
      writeDemoUsers([...users, { ...demoUser, password: 'demo123' }]);
    }

    localStorage.setItem('token', token);
    setUser(demoUser);
    setIsAuthenticated(true);
    return demoUser;
  };

  const logout = (onLogout) => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);

    if (typeof onLogout === 'function') {
      onLogout();
    }
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    loginAsDemo,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
