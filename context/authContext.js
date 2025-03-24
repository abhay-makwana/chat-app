import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from "react";
import { auth, authInit } from '../firebase';

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
        // const unsub = onAuthStateChanged(auth, (user) => {
        //     console.log("unsub.:--", unsub)
        //     if (user) {
        //         setIsAuthenticated(true);
        //         setUser(user);
        //     } else {
        //         setIsAuthenticated(false);
        //         setUser(null);
        //     }
        // })
        // return unsub;
    }, [])

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error('useAuth must be wrapped inside AuthContextProvider')
    }

    return value;
}