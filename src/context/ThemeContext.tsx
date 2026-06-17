'use client';

import React, { createContext, useContext } from 'react';

// Dark mode removed — site is always light.
// Stub kept so no imports break elsewhere.

interface ThemeContextType {
    theme: 'light';
    toggleTheme: () => void;
    isDark: false;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => {},
    isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {}, isDark: false }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
