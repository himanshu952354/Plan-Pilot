import { useState, useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import ProjectChat from '../components/ProjectChat';
import { MessageSquare, Search, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Messages = () => {
    const { projects, addMessage } = useProjects();
    const { user } = useAuth();
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");


    // Select first project by default if none selected
    useEffect(() => {
        if (!selectedProject && projects.length > 0) {
            setSelectedProject(projects[0]);
        }
    }, [projects, selectedProject]);

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-transparent relative overflow-hidden">
            <div className="flex-1 w-full p-6 md:p-8 flex flex-col min-h-0">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-6 shrink-0"
                >
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <MessageSquare className="text-primary-600" size={32} />
                        Messages
                    </h1>
                    <p className="text-slate-500 mt-2">Collaborate with your team across projects.</p>
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="flex-1 glass rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 flex flex-col md:flex-row min-h-0"
                >
                    {/* Sidebar / Project List */}
                    <div className="w-full md:w-80 bg-white/40 border-r border-white/50 flex flex-col">
                        <div className="p-4 border-b border-white/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1"
                        >
                            {filteredProjects.map(project => (
                                <motion.button
                                    key={project.id}
                                    variants={fadeInUp}
                                    onClick={() => setSelectedProject(project)}
                                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 hover:bg-white/60 ${selectedProject?.id === project.id
                                        ? 'bg-white shadow-sm border border-slate-100 ring-1 ring-gray-200'
                                        : 'text-slate-600 border border-transparent'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${selectedProject?.id === project.id ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <Hash size={18} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className={`font-bold text-sm truncate ${selectedProject?.id === project.id ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {project.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 truncate">
                                            {project.chat?.length || 0} messages
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 bg-white/20 backdrop-blur-sm flex flex-col min-w-0">
                        {selectedProject ? (
                            <>
                                {/* Chat header */}
                                <div className="p-4 border-b border-white/50 flex justify-between items-center bg-white/30 backdrop-blur-md shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold border border-white shadow-sm">
                                            {selectedProject.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-slate-900">{selectedProject.name}</h2>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className={`w-2 h-2 rounded-full ${selectedProject.priority === 'High' ? 'bg-danger-500' :
                                                    selectedProject.priority === 'Medium' ? 'bg-warning-500' : 'bg-primary-500'
                                                    }`}></span>
                                                {selectedProject.priority} Priority
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex -space-x-2">
                                        {/* Team avatars placeholder - using project.assignedTo if available, else static for now to match structure */}
                                        {selectedProject.assignedTo ? (
                                            selectedProject.assignedTo.slice(0, 3).map((emp, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden" title={emp.name}>
                                                    <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                                                </div>
                                            ))
                                        ) : (
                                            [1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-hidden p-0 h-full relative">
                                    <div className="absolute inset-0">
                                        <ProjectChat project={selectedProject} onSendMessage={addMessage} fullHeight={true} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                <MessageSquare size={48} className="mb-4 opacity-20" />
                                <p>Select a project to start messaging</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Messages;
