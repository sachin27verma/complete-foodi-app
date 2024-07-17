import React, { createContext, useState, useEffect } from 'react';
import { 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    updateProfile 
} from 'firebase/auth';
import app from '../firebase/firebase.config';
import axios from 'axios';

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = async (email, password) => {
        setLoading(true);
        try {
            return await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error creating user:", error);
            setLoading(false);
            throw error;
        }
    };

    const signUpWithGmail = async () => {
        setLoading(true);
        try {
            return await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error signing up with Google:", error);
            setLoading(false);
            throw error;
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error logging in:", error);
            setLoading(false);
            throw error;
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('access-token');
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    };

    const updateUserProfile = async (name, photoURL) => {
        try {
            await updateProfile(auth.currentUser, {
                displayName: name, 
                photoURL: photoURL
            });
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userInfo = { email: currentUser.email };
                try {
                    const response = await axios.post('https://foodi-client-b9e3c.web.app/jwt', userInfo);
                    if (response.data.token) {
                        localStorage.setItem("access-token", response.data.token);
                    }
                } catch (error) {
                    console.error("Error fetching token:", error);
                }
            } else {
                localStorage.removeItem("access-token");
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const authInfo = {
        user, 
        loading,
        createUser, 
        login, 
        logOut,
        signUpWithGmail,
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
