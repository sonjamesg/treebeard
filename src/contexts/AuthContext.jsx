import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('socialvibe_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      if (foundUser.banned) {
        throw new Error('This account has been banned.');
      }

      const userSession = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        avatar: foundUser.avatar,
        bio: foundUser.bio,
        role: foundUser.role || 'user',
        followers: foundUser.followers || [],
        following: foundUser.following || [],
        postsCount: foundUser.postsCount || 0
      };

      setUser(userSession);
      localStorage.setItem('socialvibe_user', JSON.stringify(userSession));
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${foundUser.username}`,
      });

      return userSession;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
      
      if (users.find(u => u.email === userData.email || u.username === userData.username)) {
        throw new Error('User already exists');
      }

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face`,
        bio: '',
        role: 'user',
        followers: [],
        following: [],
        postsCount: 0,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('socialvibe_users', JSON.stringify(users));

      const userSession = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        bio: newUser.bio,
        role: newUser.role,
        followers: newUser.followers,
        following: newUser.following,
        postsCount: newUser.postsCount
      };

      setUser(userSession);
      localStorage.setItem('socialvibe_user', JSON.stringify(userSession));

      toast({
        title: "Account created!",
        description: `Welcome to TreeBeard, ${newUser.username}!`,
      });

      return userSession;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('socialvibe_user');
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const updateUser = (updates, isPasswordChange = false) => {
    if (!user) return;
  
    const users = JSON.parse(localStorage.getItem('socialvibe_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
  
    if (userIndex === -1) {
      toast({ title: "Error", description: "User not found.", variant: "destructive" });
      return false;
    }
  
    if (isPasswordChange) {
      if (users[userIndex].password !== updates.currentPassword) {
        toast({ title: "Incorrect Password", description: "The current password you entered is incorrect.", variant: "destructive" });
        return false;
      }
      users[userIndex].password = updates.newPassword;
    } else {
      users[userIndex] = { ...users[userIndex], ...updates };
    }
  
    localStorage.setItem('socialvibe_users', JSON.stringify(users));
  
    // Only update session user if it's not a password change
    if (!isPasswordChange) {
      const updatedUserSession = { ...user, ...updates };
      setUser(updatedUserSession);
      localStorage.setItem('socialvibe_user', JSON.stringify(updatedUserSession));
    }
  
    return true;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};