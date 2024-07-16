import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from '../firebase/firebase.config';
import axios from 'axios';

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Create an account
    const createUser = async (email, password) => {
        setLoading(true);
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setToken(result.user); // Set token after account creation
        return result;
    }

    // Signup with Gmail
    const signUpWithGmail = async () => {
        setLoading(true);
        const result = await signInWithPopup(auth, googleProvider);
        await setToken(result.user); // Set token after Google sign-up
        return result;
    }

    // Login using email and password
    const login = async (email, password) => {
        setLoading(true);
        const result = await signInWithEmailAndPassword(auth, email, password);
        await setToken(result.user); // Set token after login
        return result;
    }

    // Logout
    const logOut = () => {
        localStorage.removeItem('access-token'); // Remove token on logout
        return signOut(auth);
    }

    // Update profile
    const updateUserProfile = ({ name, photoURL }) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photoURL
        });
    }

    // Check signed-in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                await setToken(currentUser);
            }
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const setToken = async (user) => {
        if (user) {
            const { data } = await axios.post(' http://localhost:6001/jwt', { email: user.email });
            localStorage.setItem('access-token', data.token);
        }
    }

    const authInfo = {
        user,
        createUser,
        signUpWithGmail,
        login,
        logOut,
        updateUserProfile,
        loading
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

