import React, { createContext, useContext, useState } from 'react';

const translations = {
    English: {
        titleLogin: "Sign in to continue",
        titleSignup: "Create An Account",
        email: "Email",
        password: "Password",
        fullName: "Full Name",
        farmName: "Farm Name",
        confirmPassword: "Confirm Password",
        signIn: "Sign In",
        signUp: "Sign Up",
        forgotPassword: "Forgot Password?",
        alreadyHaveAccount: "Already have an account?",
        createNewAccount: "Create New Account",
        signInWithGoogle: "Sign in with Google",
        signUpWithGoogle: "Sign up with Google",
        poweredBy: "Powered by",
        aboutHayDay: "About HayDay",
        signingIn: "Signing In...",
        creatingAccount: "Creating Account...",
        enterEmail: "Enter email",
        enterPassword: "Enter password",
        enterFullName: "Enter full name",
        enterFarmName: "Enter farm name",
        confirmYourPassword: "Confirm your password",
        or: "OR"
    },
    Hindi: {
        titleLogin: "जारी रखने के लिए साइन इन करें",
        titleSignup: "एक खाता बनाएँ",
        email: "ईमेल",
        password: "पासवर्ड",
        fullName: "पूरा नाम",
        farmName: "फार्म का नाम",
        confirmPassword: "पासवर्ड की पुष्टि करें",
        signIn: "साइन इन करें",
        signUp: "साइन अप करें",
        forgotPassword: "पासवर्ड भूल गए?",
        alreadyHaveAccount: "पहले से ही एक खाता है?",
        createNewAccount: "नया खाता बनाएँ",
        signInWithGoogle: "गूगल के साथ साइन इन करें",
        signUpWithGoogle: "गूगल के साथ साइन अप करें",
        poweredBy: "द्वारा संचालित",
        aboutHayDay: "HayDay के बारे में",
        signingIn: "साइन इन हो रहा है...",
        creatingAccount: "खाता बन रहा है...",
        enterEmail: "ईमेल दर्ज करें",
        enterPassword: "पासवर्ड दर्ज करें",
        enterFullName: "पूरा नाम दर्ज करें",
        enterFarmName: "फार्म का नाम दर्ज करें",
        confirmYourPassword: "अपने पासवर्ड की पुष्टि करें",
        or: "अथवा"
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [selectedLanguage, setSelectedLanguage] = useState({ name: 'English', flag: '🇬🇧' });

    const languages = [
        { name: 'English', flag: '🇬🇧' },
        { name: 'Hindi', flag: '🇮🇳' }
    ];

    const t = (key) => {
        return translations[selectedLanguage.name][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage, languages, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
