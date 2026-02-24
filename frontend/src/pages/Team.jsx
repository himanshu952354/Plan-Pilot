import { useProjects } from '../context/ProjectContext';
import { Users, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Team = () => {
    const { employees, projects } = useProjects();

    const getEmployeeStats = (employeeId) => {
        if (!projects) return { active: 0, completed: 0 };
        const employeeProjects = projects.filter(p => p.assignedTo && p.assignedTo.some(e => e.id === employeeId));
        return {
            active: employeeProjects.filter(p => p.progress < 100).length,
            completed: employeeProjects.filter(p => p.progress === 100).length
        };
    };

    return (
        <div className="relative min-h-screen bg-transparent overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gray-100/30 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gray-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-gray-50/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150"></div>
            </div>

            <div className="relative z-10 space-y-8 p-6 md:p-8 w-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="text-primary-600" size={32} />
                        Workspace Members
                    </h1>
                    <p className="text-slate-500 mt-2">Collaborate with your project members.</p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                >
                    {employees.map((employee, index) => {
                        const stats = getEmployeeStats(employee.id);
                        return (
                            <motion.div
                                key={employee.id}
                                variants={fadeInUp}
                                whileHover={{ y: -5 }}
                                className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 ease-out"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
                                <div className="relative z-0">
                                    <div className="h-28 bg-primary-600 relative">
                                        <div className="absolute -bottom-10 left-6">
                                            <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                                                <img
                                                    src={employee.avatar}
                                                    alt={employee.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-12 px-6 pb-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{employee.name}</h3>
                                                <p className="text-gray-600 font-medium text-sm flex items-center gap-1">
                                                    <Briefcase size={14} />
                                                    {employee.role}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2.5">
                                            <div className="flex items-center text-sm text-slate-500 gap-3">
                                                <Mail size={16} className="text-gray-400" />
                                                <span>{employee.name.toLowerCase().replace(' ', '.')}@example.com</span>
                                            </div>
                                            {/* Removed Phone/MapPin for personal use pivot */}
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                                            <div>
                                                <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-black">{stats.completed}</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};

export default Team;
