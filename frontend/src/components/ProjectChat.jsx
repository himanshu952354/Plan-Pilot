import { useState, useRef, useEffect } from 'react';
import { Send, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectChat = ({ project, onSendMessage, fullHeight = false }) => {
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [project.chat]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        onSendMessage(project.id, {
            senderId: user?.id || 999,
            senderName: user?.name,
            text: newMessage,
            timestamp: new Date().toISOString()
        });
        setNewMessage("");
    };

    const formatTime = (isoString) => {
        try {
            return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return '';
        }
    };

    return (
        <div className={`flex flex-col bg-white/50 rounded-2xl border border-white/60 shadow-sm ${fullHeight ? 'h-full' : 'h-[600px]'}`}>
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" ref={messagesContainerRef}>
                <AnimatePresence initial={false}>
                    {project.chat && project.chat.length > 0 ? (
                        project.chat.map((msg) => {
                            const isMe = msg.senderId === (user?.id || 999);
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 border border-white shadow-sm overflow-hidden mb-1">
                                            {msg.senderAvatar ? (
                                                <img src={msg.senderAvatar} alt="avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={12} className="text-slate-500" />
                                            )}
                                        </div>
                                        <div className={`px-3.5 py-2 rounded-2xl shadow-sm relative group ${isMe
                                            ? 'bg-primary-600 text-white rounded-tr-none'
                                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                                            }`}>
                                            <p className="text-[13px] leading-relaxed">{msg.text}</p>
                                            <p className={`text-[9px] mt-0.5 text-right opacity-70 ${isMe ? 'text-primary-100' : 'text-slate-400'}`}>
                                                {formatTime(msg.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                <Send size={20} className="text-slate-300 ml-1" />
                            </div>
                            <p className="text-sm font-medium">No messages yet</p>
                            <p className="text-xs">Start the conversation!</p>
                        </div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/60 bg-white/60 backdrop-blur-md rounded-b-2xl">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-shadow"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="btn btn-primary p-2.5 rounded-xl shadow-md disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95 transition-all text-white bg-primary-600 hover:bg-primary-700"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProjectChat;
