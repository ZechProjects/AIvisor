/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Portfolio } from '@/api/types';
import { portfolioService } from '@/api/portfolio';
import { userService } from '@/api/user';

interface AppContextType {
  user: User | null;
  portfolio: Portfolio[];
  totalValue: number;
  usdtBalance: number;
  isLoading: boolean;
  refreshPortfolio: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPortfolio = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setPortfolio([]);
        setTotalValue(0);
        setUsdtBalance(0);
        return;
      }

      const { data: { portfolio: newPortfolio, usdtBalance: newBalance, totalValue: newTotalValue } } = 
        await portfolioService.getPortfolios(userId);
      console.log(newPortfolio, newBalance, newTotalValue);
      setPortfolio(newPortfolio);
      setUsdtBalance(newBalance);
      setTotalValue(newTotalValue);
    } catch (error) {
      console.error('Failed to refresh portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setIsLoading(true);
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userResponse = await userService.getUserDetails(userId);
          setUser(userResponse.data);
          await refreshPortfolio();

        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      portfolio,
      totalValue,
      usdtBalance,
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