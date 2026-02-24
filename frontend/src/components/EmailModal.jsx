import React from 'react';
import { motion } from 'framer-motion';
import { X, Mail, MessageSquare, Send, Bell, Search, ChevronRight, User, Clock } from 'lucide-react';

const EmailModal = ({ onClose, user }) => {
    if (!user) return null;

    const messages = [
        { id: 1, sender: 'Sarah Connor', subject: 'Project Milestone Update', time: '2m ago', preview: 'The new design tokens are ready for review. Please check the...', unread: true },
        { id: 2, sender: 'James Maxwell', subject: 'Budget Approval Required', time: '1h ago', preview: 'I have attached the revised budget for the Q3 marketing...', unread: true },
        { id: 3, sender: 'Emily Watson', subject: 'Team Sync Tomorrow', time: '4h ago', preview: 'Just a reminder that we have our weekly sync at 10 AM...', unread: false },
        { id: 4, sender: 'Digital Studio', subject: 'New Asset Delivered', time: 'Yesterday', preview: 'Your high-fidelity prototypes are now available in the...', unread: false },
    ];

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
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                }}
                className="relative w-full max-w-5xl h-[520px] bg-white rounded-[40px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-row"
            >
                {/* Left Side: Navigation & Folders */}
                <div className="w-[30%] bg-slate-50 border-r border-slate-100 p-8 flex flex-col shrink-0">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-2.5 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-200">
                            <Bell size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Notifications</h2>
                    </div>

                    <div className="space-y-2 flex-1">
                        {[
                            { icon: Mail, label: 'Inbox', count: 12, active: true },
                            { icon: Send, label: 'Sent', count: 0, active: false },
                            { icon: Clock, label: 'Snoozed', count: 2, active: false },
                            { icon: Bell, label: 'Alerts', count: 5, active: false }
                        ].map((item, i) => (
                            <button
                                key={i}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${item.active ? 'bg-white shadow-sm border border-slate-100 text-emerald-600' : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} />
                                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                </div>
                                {item.count > 0 && (
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${item.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <button className="mt-auto w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                        <MessageSquare size={18} />
                        <span>New Message</span>
                    </button>
                </div>

                {/* Right Side: Message List */}
                <div className="flex-1 p-8 bg-white flex flex-col relative overflow-hidden">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-95 group/close z-20"
                    >
                        <X size={24} className="group-hover/close:rotate-90 transition-transform duration-300" />
                    </button>

                    <div className="flex items-center justify-between mb-8 pr-12">
                        <div className="relative w-full max-w-sm">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search in messages..."
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                whileHover={{ x: 5, backgroundColor: '#f8fafc' }}
                                className={`p-5 rounded-3xl border transition-all cursor-pointer group ${msg.unread ? 'bg-emerald-50/30 border-emerald-100 shadow-sm' : 'bg-white border-slate-100 hover:border-emerald-200'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${msg.unread ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 tracking-tight text-sm">{msg.sender}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.time}</p>
                                        </div>
                                    </div>
                                    {msg.unread && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse"></div>}
                                </div>
                                <h5 className="font-extrabold text-slate-700 text-sm mb-1 group-hover:text-emerald-700 transition-colors">{msg.subject}</h5>
                                <p className="text-xs text-slate-500 leading-relaxed truncate">{msg.preview}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <button className="text-sm font-black text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 group">
                            <span>View all messages in Archive</span>
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EmailModal;
