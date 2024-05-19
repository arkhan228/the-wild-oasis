import { createContext, useContext, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

const DarkModeContext = createContext('');

function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
    'isDarkMode'
  );

  useEffect(
    function () {
      document.documentElement.classList.add(
        isDarkMode ? 'dark-mode' : 'light-mode'
      );
      document.documentElement.classList.remove(
        isDarkMode ? 'light-mode' : 'dark-mode'
      );
    },
    [isDarkMode]
  );

  function toggleDarkMode() {
    setIsDarkMode(isDark => !isDark);
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode() {
  const context = useContext(DarkModeContext);

  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useDarkMode, DarkModeProvider };
