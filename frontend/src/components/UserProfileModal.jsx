import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Settings, Shield, Bell, LogOut, Mail, Briefcase, Calendar, ChevronRight } from 'lucide-react';

const UserProfileModal = ({ onClose, user, onLogout }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Content - Horizontal Rectangular Box */}
            <motion.div
                layoutId="profile-pop"
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 30
                }}
                className="relative w-full max-w-5xl h-[520px] bg-white rounded-[40px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-row"
            >
                {/* Left Side: Premium Identity Card (Emerald Theme) */}
                <div className="w-[38%] bg-emerald-600 p-10 flex flex-col items-center justify-center text-white relative overflow-hidden group/left shrink-0">
                    {/* Background Accents */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                    <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-emerald-400/20 via-transparent to-teal-900/40 pointer-events-none"></div>

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                        className="w-40 h-40 rounded-[48px] bg-white/20 backdrop-blur-xl p-2 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)] mb-8 relative z-10"
                    >
                        <div className="w-full h-full rounded-[38px] bg-white flex items-center justify-center overflow-hidden border-2 border-white/50">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl font-black text-emerald-600">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                            )}
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-400 border-[6px] border-emerald-600 rounded-full shadow-lg"
                        ></motion.div>
                    </motion.div>

                    <div className="text-center relative z-10">
                        <motion.h2
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-black tracking-tight"
                        >
                            {user.name || 'Anonymous User'}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-emerald-100 font-bold text-xs tracking-[0.3em] uppercase mt-2 opacity-80"
                        >
                            {user.role || 'Enterprise Member'}
                        </motion.p>
                    </div>

                    <div className="mt-10 w-full relative z-10 space-y-3">
                        <div className="flex items-center gap-4 px-5 py-4 bg-white/10 backdrop-blur-xl rounded-[24px] border border-white/10 group/email transition-all hover:bg-white/15">
                            <Mail size={18} className="text-emerald-100" />
                            <span className="text-xs font-bold truncate tracking-wider">{user.email || 'user@planpilot.ai'}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Navigation & Logic */}
                <div className="flex-1 p-12 bg-white flex flex-col relative overflow-y-auto custom-scrollbar">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-95 group/close z-20"
                    >
                        <X size={24} className="group-hover/close:rotate-90 transition-transform duration-300" />
                    </button>

                    <div className="flex-1 text-slate-700">
                        <div className="grid grid-cols-2 gap-6 mb-10">
                            {[
                                { icon: Briefcase, label: 'Department', value: user.department || 'Product Engineering' },
                                { icon: Calendar, label: 'Joined Date', value: 'February 2024' }
                            ].map((stat, i) => (
                                <div key={i} className="p-5 bg-slate-50/80 rounded-[28px] border border-slate-100 group/card hover:border-emerald-500/30 hover:bg-white transition-all duration-300">
                                    <div className="p-2.5 bg-white rounded-xl text-emerald-600 shadow-sm w-fit mb-4 group-hover/card:bg-emerald-600 group-hover/card:text-white transition-all transform group-hover/card:scale-110">
                                        <stat.icon size={20} />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-sm font-black text-slate-800 tracking-tight">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Interactive Settings Navigation */}
                        <div className="space-y-4">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Workspace Settings</p>
                            {[
                                { icon: Settings, label: 'Account Preferences' },
                                { icon: Shield, label: 'Privacy & Security' },
                                { icon: Bell, label: 'Smart Notifications' }
                            ].map((item, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ x: 8, backgroundColor: '#f1f5f9' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-between p-4 rounded-[24px] transition-all group/btn bg-slate-50/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white text-slate-600 rounded-xl group-hover/btn:bg-emerald-600 group-hover/btn:text-white transition-all shadow-sm">
                                            <item.icon size={20} />
                                        </div>
                                        <span className="font-bold text-slate-700 tracking-tight">{item.label}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300 group-hover/btn:text-emerald-500 group-hover/btn:translate-x-1 transition-all" />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Master Actions */}
                    <div className="flex gap-6 pt-10 border-t border-slate-100 mt-auto">
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: '#fff1f2' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onLogout}
                            className="flex-1 flex items-center justify-center gap-3 py-5 bg-rose-50 text-rose-600 font-black rounded-[24px] hover:text-rose-700 transition-all border-2 border-rose-100/50"
                        >
                            <LogOut size={22} />
                            <span>Sign Out</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02, y: -4, shadow: "0 20px 25px -5px rgb(16 185 129 / 0.1), 0 8px 10px -6px rgb(16 185 129 / 0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-[1.5] py-5 bg-emerald-600 text-white font-black rounded-[24px] hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all border-b-4 border-emerald-800 active:border-b-0 flex items-center justify-center gap-3"
                        >
                            <span>Enterprise Controls</span>
                            <ChevronRight size={20} />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserProfileModal;
