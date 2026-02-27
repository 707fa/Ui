import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../api/api';

interface User {
    id: string;
    username: string;
    email: string;
    displayName: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateUser: (displayName: string) => void;
    checkUsernameExists: (username: string) => boolean;
    checkEmailExists: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

const CURRENT_USER_KEY = 'neurynth_current_user';

function getCurrentUser(): User | null {
    try {
        const data = sessionStorage.getItem(CURRENT_USER_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error parsing current user:', error);
        sessionStorage.removeItem(CURRENT_USER_KEY);
        return null;
    }
}

function saveCurrentUser(user: User | null) {
    try {
        if (user) {
            sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        } else {
            sessionStorage.removeItem(CURRENT_USER_KEY);
        }
    } catch (error) {
        console.error('Error saving current user:', error);
    }
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = getCurrentUser();
        if (savedUser) {
            setUser(savedUser);
        }
        setIsLoading(false);
    }, []);

    const checkUsernameExists = async (username: string): Promise<boolean> => {
        try {
            const data = await api.post('/check-username', { username });
            return data.exists;
        } catch (error) {
            console.error('Check username error:', error);
            return false;
        }
    };

    const checkEmailExists = async (email: string): Promise<boolean> => {
        try {
            const data = await api.post('/check-email', { email });
            return data.exists;
        } catch (error) {
            console.error('Check email error:', error);
            return false;
        }
    };

    const login = async (login: string, password: string): Promise<boolean> => {
        try {
            const data = await api.post('/login', { login, password });

            if (data.success) {
                setUser(data.user);
                saveCurrentUser(data.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const data = await api.post('/register', { username, email, password });

            if (data.success) {
                const newUser = data.user;
                setUser(newUser);
                saveCurrentUser(newUser);
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: (error as Error).message || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem(CURRENT_USER_KEY);
    };

    const updateUser = async (displayName: string) => {
        // Implementation for profile update would go here
        // For now, we update local state if user exists
        if (user) {
            const updatedUser = { ...user, displayName };
            setUser(updatedUser);
            saveCurrentUser(updatedUser);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            updateUser,
            checkUsernameExists: checkUsernameExists as any, // Temporary cast as we change signatures
            checkEmailExists: checkEmailExists as any
        }}>
            {children}
        </AuthContext.Provider>
    );
}
