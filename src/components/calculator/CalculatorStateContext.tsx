import { createContext, useContext, useEffect } from 'react';
import { useCalculatorState } from './CalculatorState';

const CalculatorStateContext = createContext<ReturnType<typeof useCalculatorState> | undefined>(undefined);

export function CalculatorStateProvider({ children }: { children: React.ReactNode }) {
  const state = useCalculatorState();

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('calculatorState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      state.setCallDuration(parsedState.callDuration);
      state.setTotalMinutes(parsedState.totalMinutes);
      state.setMargin(parsedState.margin);
      state.setTaxRate(parsedState.taxRate);
      state.setAgencyInfo(parsedState.agencyInfo);
      state.setClientInfo(parsedState.clientInfo);
    }
  }, []);

  // Save state to localStorage whenever relevant values change
  useEffect(() => {
    const stateToSave = {
      callDuration: state.callDuration,
      totalMinutes: state.totalMinutes,
      margin: state.margin,
      taxRate: state.taxRate,
      agencyInfo: state.agencyInfo,
      clientInfo: state.clientInfo,
    };
    localStorage.setItem('calculatorState', JSON.stringify(stateToSave));
  }, [
    state.callDuration,
    state.totalMinutes,
    state.margin,
    state.taxRate,
    state.agencyInfo,
    state.clientInfo,
  ]);

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