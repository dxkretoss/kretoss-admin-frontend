
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';
import { UserType } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  login: (data: UserType) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });


  const login = async (data: UserType): Promise<boolean> => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.clear()
  };


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
