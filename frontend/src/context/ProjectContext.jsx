import { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
        } else {
            // Initialize with some dummy data if empty
            const dummyProjects = [
                {
                    id: 1,
                    name: "Website Redesign",
                    description: "Overhaul the company website with new branding.",
                    progress: 45,
                    priority: "High",
                    deadline: "2026-03-15",
                    tasks: [
                        {
                            id: 1,
                            text: "Design Mockups",
                            completed: true,
                            priority: "High",
                            deadline: "2026-02-20",
                            subtasks: [
                                { id: 101, text: "Homepage Sketch", completed: true },
                                { id: 102, text: "About Page Sketch", completed: true },
                            ]
                        },
                        {
                            id: 2,
                            text: "Develop Homepage",
                            completed: false,
                            priority: "Medium",
                            deadline: "2026-02-28",
                            subtasks: []
                        },
                        {
                            id: 3,
                            text: "Mobile Responsiveness",
                            completed: false,
                            priority: "Low",
                            deadline: "2026-03-05",
                            subtasks: []
                        },
                    ]
                },
                {
                    id: 2,
                    name: "Mobile App Development",
                    description: "Create a cross-platform mobile app for customers.",
                    progress: 20,
                    priority: "High",
                    deadline: "2026-04-01",
                    tasks: [
                        { id: 2, text: "Authentication Flow", completed: false, priority: "High", deadline: "2026-02-25", subtasks: [] },
                    ],
                    chat: [
                        { id: 1, senderId: 1, text: "Hey everyone, let's aim for the alpha release by Friday.", timestamp: "2026-02-15T09:00:00" },
                        { id: 2, senderId: 2, text: "Sure, frontend is almost ready.", timestamp: "2026-02-15T09:05:00" }
                    ]
                }
            ];
            setProjects(dummyProjects);
            localStorage.setItem('projects', JSON.stringify(dummyProjects));
        }
    }, []);

    const [employees] = useState([
        { id: 1, name: 'Alice Johnson', role: 'UX Designer', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=random' },
        { id: 2, name: 'Bob Smith', role: 'Frontend Dev', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=random' },
        { id: 3, name: 'Charlie Brown', role: 'Project Manager', avatar: 'https://ui-avatars.com/api/?name=Charlie+Brown&background=random' },
        { id: 4, name: 'Diana Prince', role: 'Backend Dev', avatar: 'https://ui-avatars.com/api/?name=Diana+Prince&background=random' },
        { id: 5, name: 'Ethan Hunt', role: 'Security Specialist', avatar: 'https://ui-avatars.com/api/?name=Ethan+Hunt&background=random' },
    ]);

    const addProject = (project) => {
        const newProjects = [...projects, { ...project, id: Date.now(), progress: 0, tasks: [], chat: [] }];
        setProjects(newProjects);
        localStorage.setItem('projects', JSON.stringify(newProjects));
    };

    const deleteProject = (projectId) => {
        const updatedProjects = projects.filter(p => p.id !== projectId);
        setProjects(updatedProjects);
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
    };

    const addTask = (projectId, task) => {
        const updatedProjects = projects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    tasks: [...p.tasks, { ...task, id: Date.now(), completed: false, subtasks: [] }]
                };
            }
            return p;
        });
        updateProjectProgress(updatedProjects);
    };

    const toggleTask = (projectId, taskId) => {
        const updatedProjects = projects.map(p => {
            if (p.id === projectId) {
                const updatedTasks = p.tasks.map(t =>
                    t.id === taskId ? { ...t, completed: !t.completed } : t
                );
                return { ...p, tasks: updatedTasks };
            }
            return p;
        });
        updateProjectProgress(updatedProjects);
    };

    const addSubtask = (projectId, taskId, subtaskText) => {
        const updatedProjects = projects.map(p => {
            if (p.id === projectId) {
                const updatedTasks = p.tasks.map(t => {
                    if (t.id === taskId) {
                        return {
                            ...t,
                            subtasks: [...t.subtasks, { id: Date.now(), text: subtaskText, completed: false }]
                        };
                    }
                    return t;
                });
                return { ...p, tasks: updatedTasks };
            }
            return p;
        });
        // Optional: Update main task completion based on subtasks? 
        // For now, keep them independent or let user manually check main task.
        setProjects(updatedProjects);
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
    };

    const toggleSubtask = (projectId, taskId, subtaskId) => {
        const updatedProjects = projects.map(p => {
            if (p.id === projectId) {
                const updatedTasks = p.tasks.map(t => {
                    if (t.id === taskId) {
                        const updatedSubtasks = t.subtasks.map(st =>
                            st.id === subtaskId ? { ...st, completed: !st.completed } : st
                        );
                        // Auto-complete parent task if all subtasks are done?
                        // const allCompleted = updatedSubtasks.every(st => st.completed);
                        return { ...t, subtasks: updatedSubtasks };
                    }
                    return t;
                });
                return { ...p, tasks: updatedTasks };
            }
            return p;
        });
        setProjects(updatedProjects);
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
    };

    const addMessage = (projectId, message) => {
        const updatedProjects = projects.map(p => {
            if (p.id === projectId) {
                const currentChat = p.chat || [];
                return {
                    ...p,
                    chat: [...currentChat, { ...message, id: Date.now() }]
                };
            }
            return p;
        });
        setProjects(updatedProjects);
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
    };

    const updateProjectProgress = (currentProjects) => {
        const calculateProgress = (tasks) => {
            if (tasks.length === 0) return 0;
            const completed = tasks.filter(t => t.completed).length;
            return Math.round((completed / tasks.length) * 100);
        };

        const finalProjects = currentProjects.map(p => ({
            ...p,
            progress: calculateProgress(p.tasks)
        }));

        setProjects(finalProjects);
        localStorage.setItem('projects', JSON.stringify(finalProjects));
    }

    const completeProject = (projectId) => {
        const updatedProjects = projects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    status: 'Completed',
                    progress: 100,
                    tasks: p.tasks.map(t => ({ ...t, completed: true }))
                };
            }
            return p;
        });
        setProjects(updatedProjects);
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
    };

    return (
        <ProjectContext.Provider value={{ projects, employees, addProject, deleteProject, completeProject, addTask, toggleTask, addSubtask, toggleSubtask, addMessage, searchQuery, setSearchQuery }}>
            {children}
        </ProjectContext.Provider>
    );
};
