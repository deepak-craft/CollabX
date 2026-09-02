import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPersona, UserRole } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  currentUser: UserPersona;
  allPersonas: UserPersona[];
  isLoggedIn: boolean;
  showLandingPage: boolean;
  setShowLandingPage: (show: boolean) => void;
  loginAs: (role: UserRole, subRole?: string) => void;
  selectPersona: (persona: UserPersona) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<UserPersona>(() => storageService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [showLandingPage, setShowLandingPage] = useState<boolean>(false);
  const allPersonas = storageService.getAllPersonas();

  useEffect(() => {
    storageService.setCurrentUser(currentUser);
  }, [currentUser]);

  const loginAs = (role: UserRole, subRole?: string) => {
    const persona = storageService.getPersonaByRole(role, subRole);
    setCurrentUserState(persona);
    setIsLoggedIn(true);
    setShowLandingPage(false);
  };

  const selectPersona = (persona: UserPersona) => {
    setCurrentUserState(persona);
    setIsLoggedIn(true);
    setShowLandingPage(false);
  };

  const logout = () => {
    setShowLandingPage(true);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allPersonas,
        isLoggedIn,
        showLandingPage,
        setShowLandingPage,
        loginAs,
        selectPersona,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
