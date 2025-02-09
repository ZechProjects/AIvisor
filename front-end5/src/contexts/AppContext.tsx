/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Portfolio } from '@/api/types';

interface AppContextType {
  user: User | null;
  portfolio: Portfolio[];
  totalValue: number;
  isLoading: boolean;
  refreshPortfolio: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPortfolio = async () => {
    // Implementation here
  };

  useEffect(() => {
    // Initial load
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      portfolio,
      totalValue,
      isLoading,
      refreshPortfolio,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 