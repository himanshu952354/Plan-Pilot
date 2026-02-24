import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';

const AuthModal = ({ isOpen, onClose, onLoginSuccess, initialTab = 'login' }) => {
    const navigate = useNavigate();
    const { isSignedIn } = useUser();

    // Keep state switches completely manual to prevent router conflicts
    const [currentTab, setCurrentTab] = useState(initialTab);

    // Update current tab if initialTab changes while modal is open (unlikely but good practice)
    useEffect(() => {
        if (isOpen) {
            setCurrentTab(initialTab);
        }
    }, [isOpen, initialTab]);

    useEffect(() => {
        if (isSignedIn && isOpen) {
            if (onLoginSuccess) {
                onLoginSuccess();
            } else {
                onClose();
                navigate('/dashboard');
            }
        }
    }, [isSignedIn, isOpen, onLoginSuccess, onClose, navigate]);

    if (!isOpen) return null;

    const appearance = {
        elements: {
            rootBox: "w-full mx-auto",
            cardBox: "shadow-2xl rounded-2xl w-full",
            card: "bg-white w-full p-8 rounded-2xl", // Restore clean white background
            headerTitle: "text-2xl font-bold text-slate-900 tracking-tight",
            headerSubtitle: "text-slate-500 font-medium",
            socialButtonsBlockButton: "bg-white border text-slate-700 hover:bg-slate-50 font-medium rounded-xl py-3 shadow-sm transition-all duration-200 border-slate-200 mt-2",
            dividerLine: "bg-slate-200",
            dividerText: "text-slate-400 text-sm font-medium",
            formFieldLabel: "text-slate-700 font-medium pb-1.5",
            formFieldInput: "bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all",
            formButtonPrimary: "w-full py-3.5 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all duration-200 mt-4",
            footerActionText: "text-slate-500 text-sm",
            footerActionLink: "text-primary-600 hover:text-primary-700 font-bold",
            identityPreview: "bg-slate-50 border border-slate-200 rounded-xl px-4 py-3",
            identityPreviewText: "text-slate-700 font-medium",
            identityPreviewEditButton: "text-primary-600 hover:text-primary-700",
            formFieldAction: "text-primary-600 hover:text-primary-700 text-sm font-medium",
            formFieldSuccessText: "text-success-600",
            formFieldErrorText: "text-red-500 text-sm",
            alertText: "text-slate-700 text-sm",
            alertTextDanger: "text-red-500 text-sm",
        },
        variables: {
            colorPrimary: "#059669",
            colorBackground: "#ffffff",
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal Content - Stripped down to let Clerk handle the card styling natively */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-md"
                    >
                        <button
                            onClick={onClose}
                            className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors z-[100] bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-sm"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative">
                            {/* We capture the click on the footer links to toggle state manually */}
                            {currentTab === 'signup' ? (
                                <div onClick={(e) => {
                                    if (e.target.innerText.toLowerCase().includes('sign in') || e.target.innerText.toLowerCase().includes('log in')) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setCurrentTab('login');
                                    }
                                }}>
                                    <SignUp appearance={appearance} fallbackRedirectUrl="/dashboard" />
                                </div>
                            ) : (
                                <div onClick={(e) => {
                                    if (e.target.innerText.toLowerCase().includes('sign up')) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setCurrentTab('signup');
                                    }
                                }}>
                                    <SignIn appearance={appearance} fallbackRedirectUrl="/dashboard" />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
