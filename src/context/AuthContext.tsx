import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signInAnonymously,
    setPersistence,
    inMemoryPersistence // WICHTIG: Nur im RAM speichern, nicht auf Festplatte
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, error: null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState("Initializing..."); // Debug Status

    useEffect(() => {
        const initAuth = async () => {
            try {
                setStatus("Setting Persistence (Memory)...");
                // 1. Zwinge Firebase, KEINE Cookies/Storage zu nutzen (Fix für iFrames)
                await setPersistence(auth, inMemoryPersistence);

                setStatus("Listening for Auth State...");
                const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                    setUser(currentUser);
                    setLoading(false);

                    if (currentUser) {
                        setStatus("User Authenticated!");
                    } else {
                        setStatus("No User - Attempting Auto-Login...");
                        signInAnonymously(auth)
                            .then(() => setStatus("Auto-Login Success!"))
                            .catch((err) => {
                                console.error(err);
                                setError(`Login Failed: ${err.message}`);
                                setStatus("Error during Login");
                            });
                    }
                });

                return () => unsubscribe();
            } catch (err: any) {
                console.error("Auth Error:", err);
                setError(`System Error: ${err.message}`);
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Wenn wir noch laden oder einen Fehler haben, zeigen wir das ÜBER der App an
    if (loading || error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4 z-50 relative">
                <div className={`p-6 rounded-lg border max-w-md w-full ${error ? 'bg-red-900 border-red-500' : 'bg-blue-900 border-blue-500'}`}>
                    <h2 className="text-xl font-bold mb-2 font-mono">
                        {error ? "🛑 Connection Error" : "🚀 Starting App"}
                    </h2>

                    <div className="space-y-2 font-mono text-sm opacity-80">
                        <p>Status: <span className="text-white font-bold">{status}</span></p>
                        {error && <p className="text-red-300 mt-2">{error}</p>}
                    </div>

                    {!error && (
                        <div className="mt-4 flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Connecting to Firebase...</span>
                        </div>
                    )}

                    {error && (
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-white text-red-900 font-bold rounded hover:bg-gray-200 w-full"
                        >
                            Retry Connection
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Wenn eingeloggt, zeige die App
    return (
        <AuthContext.Provider value={{ user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
