import { createContext, useContext } from 'react';
import { useCalculatorState } from './CalculatorState';

const CalculatorStateContext = createContext<ReturnType<typeof useCalculatorState> | undefined>(undefined);

export function CalculatorStateProvider({ children }: { children: React.ReactNode }) {
  const state = useCalculatorState();
  return (
    <CalculatorStateContext.Provider value={state}>
      {children}
    </CalculatorStateContext.Provider>
  );
}

export function useCalculatorStateContext() {
  const context = useContext(CalculatorStateContext);
  if (context === undefined) {
    throw new Error('useCalculatorStateContext must be used within a CalculatorStateProvider');
  }
  return context;
}