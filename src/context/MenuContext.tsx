'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type MenuContextType = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <MenuContext.Provider value={{ menuOpen, setMenuOpen }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within MenuProvider');
  return context;
}