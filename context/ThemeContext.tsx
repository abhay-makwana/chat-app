import { createContext, ReactNode, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeContextType = {
    currentTheme: string,
    toggleTheme: (newTheme: string) => void
}

export const ThemeContext = createContext<ThemeContextType>({
    currentTheme: 'light',
    toggleTheme: () => {}
});

const ThemeProvider = ({children}: {children: ReactNode}) => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const getTheme = async() => {
            try {
                const savedTheme = await AsyncStorage.getItem("theme");
                if (savedTheme) {
                    setTheme(savedTheme);
                }
            } catch (err) {
                console.log("Theme error: ", err)
            }
        }
        
        getTheme();
    }, [])

    const toggleTheme = (newTheme: string) => {
        setTheme(newTheme);
        AsyncStorage.setItem("theme", newTheme);
    }

    return (
        <ThemeContext.Provider value={{currentTheme: theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;