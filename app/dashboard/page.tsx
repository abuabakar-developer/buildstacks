"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudArrowUpIcon,
  FolderIcon,
  DocumentIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  HomeIcon,
  ChartBarIcon,
  CalendarIcon,
  CogIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  StarIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  UserGroupIcon,
  LockClosedIcon,
  DocumentDuplicateIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon as ExclamationCircleIconSolid,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import LinePattern from "../components/LinePattern";
import Pusher from 'pusher-js';
import NewProjectModal from '../components/NewProjectModal';
import InviteTeamModal from '../components/InviteTeamModal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import CalendarView from "../components/CalendarView";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  color: string;
}

interface ProjectCardProps {
  name: string;
  status: "active" | "completed" | "pending" | "on-hold";
  progress: number;
  documents: number;
  team: number;
  lastUpdated: string;
  priority: "high" | "medium" | "low";
  owner: any;
  currentUserId?: string;
}

interface DocumentItemProps {
  name: string;
  type: string;
  project: string;
  uploadedBy: string;
  date: string;
  size: string;
  status: "approved" | "pending" | "rejected" | "draft";
  summary?: string;
}

interface ActivityItemProps {
  type: "upload" | "comment" | "approval" | "project" | "team";
  text: string;
  time: string;
  user: string;
}

interface NotificationItemProps {
  type: "warning" | "info" | "success" | "error";
  title: string;
  message: string;
  time: string;
}

interface TeamMemberProps {
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline" | "busy";
  project: string;
}

interface SecurityAlertProps {
  type: "access" | "compliance" | "backup" | "update";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  time: string;
}

// Tab Loading Component
function TabLoading({ tabName }: { tabName: string }) {
  const tabIcons = {
    overview: <HomeIcon className="h-6 w-6" />,
    projects: <BuildingOfficeIcon className="h-6 w-6" />,
    documents: <DocumentIcon className="h-6 w-6" />,
    team: <UsersIcon className="h-6 w-6" />,
    analytics: <ChartBarIcon className="h-6 w-6" />,
    settings: <Cog6ToothIcon className="h-6 w-6" />
  };

  const tabColors = {
    overview: "text-blue-600",
    projects: "text-purple-600", 
    documents: "text-indigo-600",
    team: "text-green-600",
    analytics: "text-orange-600",
    settings: "text-gray-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8"
    >
      {/* Animated Icon */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`mb-6 p-4 rounded-full bg-gradient-to-br from-gray-50 to-white shadow-lg border border-gray-200 ${tabColors[tabName as keyof typeof tabColors]}`}
      >
        {tabIcons[tabName as keyof typeof tabIcons]}
      </motion.div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-2 capitalize">
          Loading {tabName.replace('-', ' ')}...
        </h3>
        <p className="text-gray-600 text-sm">
          Preparing your data and analytics
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="w-full max-w-md mt-6 bg-gray-200 rounded-full h-2 overflow-hidden"
      >
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
      </motion.div>

      {/* Loading Dots */}
      <motion.div
        className="flex space-x-1 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// Replace DashboardLoading to use TabLoading for initial load
function DashboardLoading() {
  return <TabLoading tabName="overview" />;
}

// Add Task Modal Component (Enhanced)
type AddTaskModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (task: any) => void;
  projectId: string;
  teamMembers: any[];
};
function AddTaskModal({ open, onClose, onAdd, projectId, teamMembers }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, assignee, dueDate, priority }),
    });
    if (res.ok) {
      const task = await res.json();
      onAdd(task);
      setTitle("");
      setDescription("");
      setAssignee("");
      setDueDate("");
      setPriority("medium");
      onClose();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add task");
    }
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-bold mb-4">Add Task</h3>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input className="w-full border p-2 rounded mb-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea className="w-full border p-2 rounded mb-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <select className="w-full border p-2 rounded mb-2" value={assignee} onChange={e => setAssignee(e.target.value)}>
          <option value="">Assign to...</option>
          {teamMembers.map((member: any) => <option key={member._id} value={member._id}>{member.name}</option>)}
        </select>
        <input type="date" className="w-full border p-2 rounded mb-2" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <div className="flex gap-2 mb-4">
          <label className={`px-3 py-1 rounded cursor-pointer ${priority === 'high' ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}> <input type="radio" className="hidden" value="high" checked={priority==='high'} onChange={()=>setPriority('high')} /> High </label>
          <label className={`px-3 py-1 rounded cursor-pointer ${priority === 'medium' ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-black'}`}> <input type="radio" className="hidden" value="medium" checked={priority==='medium'} onChange={()=>setPriority('medium')} /> Medium </label>
          <label className={`px-3 py-1 rounded cursor-pointer ${priority === 'low' ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}`}> <input type="radio" className="hidden" value="low" checked={priority==='low'} onChange={()=>setPriority('low')} /> Low </label>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800">{loading ? "Adding..." : "Add Task"}</button>
        </div>
      </form>
    </div>
  );
}

// Kanban Board for Tasks
type KanbanBoardProps = {
  tasks: any[];
  onStatusChange: (taskId: string, newStatus: string) => Promise<void>;
  teamMembers: any[];
};
function KanbanBoard({ tasks, onStatusChange, teamMembers }: KanbanBoardProps) {
  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'done', title: 'Done', color: 'bg-green-100' },
  ];
  const tasksByStatus: { [key: string]: any[] } = columns.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t: any) => t.status === col.id);
    return acc;
  }, {} as { [key: string]: any[] });

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      await onStatusChange(draggableId, destination.droppableId);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto">
        {columns.map(col => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided: any, snapshot: any) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`w-80 min-h-[300px] rounded-lg p-3 ${col.color} shadow`}
              >
                <h4 className="font-bold mb-2 text-black/70">{col.title}</h4>
                {tasksByStatus[col.id].map((task: any, idx: number) => (
                  <Draggable draggableId={task._id} index={idx} key={task._id}>
                    {(provided: any, snapshot: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`mb-3 p-3 rounded-lg bg-white shadow flex flex-col gap-2 border-l-4 ${task.priority === 'high' ? 'border-red-500' : task.priority === 'medium' ? 'border-yellow-400' : 'border-green-500'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-black/80">{task.title}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${task.status === 'done' ? 'bg-green-200 text-green-800' : task.status === 'in-progress' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>{task.status.replace('-', ' ')}</span>
                        </div>
                        {task.description && <div className="text-xs text-black/50">{task.description}</div>}
                        <div className="flex items-center gap-2 text-xs">
                          {task.assignee && <span className="flex items-center gap-1"><UsersIcon className="h-4 w-4 text-blue-400" />{teamMembers.find((m: any) => m._id === task.assignee?._id)?.name || 'Unassigned'}</span>}
                          {task.dueDate && <span className="flex items-center gap-1"><CalendarIcon className="h-4 w-4 text-gray-400" />{new Date(task.dueDate).toLocaleDateString()}</span>}
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{task.priority}</span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all"); // 'all', 'projects', 'documents'
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterUploader, setFilterUploader] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCompanyIdAlert, setShowCompanyIdAlert] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [newOwnerId, setNewOwnerId] = useState("");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [tasksByProject, setTasksByProject] = useState<{ [key: string]: any[] }>({});
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [chartsLoading, setChartsLoading] = React.useState(false); // Simulate loading for skeletons
  const [stripeLoading, setStripeLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const [loadingTab, setLoadingTab] = useState("");
  // Team management state
  const [removeMemberModal, setRemoveMemberModal] = useState<{open: boolean, member: any|null}>({open: false, member: null});
  const [roleUpdateLoading, setRoleUpdateLoading] = useState<string | null>(null); // memberId
  const [removeLoading, setRemoveLoading] = useState(false);
  const [removeError, setRemoveError] = useState("");
  const [roleError, setRoleError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Try to get companyId from /api/auth/me for consistency with NewProjectModal
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => {
          if (data.user && data.user.company) {
            setCompanyId(data.user.company);
            setCookie('companyId', data.user.company);
          } else if (data.user && data.user.companyId) {
            setCompanyId(data.user.companyId);
            setCookie('companyId', data.user.companyId);
          } else {
            // fallback to cookie
            const id = getCookie("companyId");
            setCompanyId(id || null);
          }
        })
        .catch(() => {
          const id = getCookie("companyId");
          setCompanyId(id || null);
        });
    }
  }, []);

  useEffect(() => {
    if (!companyId) return;
    setIsLoading(true);
    fetch(`/api/projects?companyId=${companyId}`)
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
    fetch(`/api/documents?companyId=${companyId}`)
      .then(res => res.json())
      .then(data => setDocuments(data));
  }, [companyId]);

  useEffect(() => {
    if (!companyId) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const projectChannel = pusher.subscribe('projects');
    projectChannel.bind('project-created', (data: any) => {
      setProjects(prev => [data.project, ...prev]);
    });
    const docChannel = pusher.subscribe('documents');
    docChannel.bind('document-uploaded', () => {
      fetch(`/api/documents?companyId=${companyId}`)
        .then(res => res.json())
        .then(data => setDocuments(data));
    });
    return () => {
      projectChannel.unbind_all();
      projectChannel.unsubscribe();
      docChannel.unbind_all();
      docChannel.unsubscribe();
      pusher.disconnect();
    };
  }, [companyId]);

  // Fetch team members for the selected project (default to first project)
  useEffect(() => {
    if (!projects || projects.length === 0) {
      setTeamMembers([]);
      return;
    }
    const projectId = selectedProject?._id || projects[0]._id;
    fetch(`/api/projects/${projectId}`)
      .then(res => res.json())
      .then(data => setTeamMembers(data.members || []));
  }, [projects, selectedProject]);

  // Auto-select the first project if none is selected and projects exist
  useEffect(() => {
    if (!selectedProject && projects && projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  // Fetch user info for settings tab and header
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Fetch tasks for a project
  const fetchTasks = async (projectId: string) => {
    const res = await fetch(`/api/projects/${projectId}/tasks`);
    if (res.ok) {
      const data = await res.json();
      setTasksByProject(prev => ({ ...prev, [projectId]: data }));
    }
  };

  // When projects load, fetch tasks for each
  useEffect(() => {
    if (projects.length) {
      projects.forEach(p => fetchTasks(p._id));
    }
  }, [projects]);

  useEffect(() => {
    setChartsLoading(true);
    const timeout = setTimeout(() => setChartsLoading(false), 600); // Simulate loading
    return () => clearTimeout(timeout);
  }, [projects, tasksByProject]);

  // Check for upgrade success/cancel on page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const upgradeStatus = urlParams.get('upgrade');
      
      if (upgradeStatus === 'success') {
        setShowSuccessMessage(true);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        // Hide success message after 5 seconds
        setTimeout(() => setShowSuccessMessage(false), 5000);
      } else if (upgradeStatus === 'cancel') {
        alert('Upgrade was cancelled. You can try again anytime.');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Tab switching function with loader
  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return; // Don't reload if same tab
    
    setTabLoading(true);
    setLoadingTab(tab);
    
    // Simulate loading for 3 seconds
    setTimeout(() => {
      setActiveTab(tab);
      setTabLoading(false);
      setLoadingTab("");
    }, 3000);
  };

  const handleStripeCheckout = async () => {
    setStripeLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user?.email || 'guest@example.com',
          userId: user?._id || 'guest',
          companyId: companyId || 'guest-company'
        }),
      });
      
      const data = await res.json();
      
      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Stripe checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleJazzCashCheckout = () => {
    alert('JazzCash checkout coming soon!');
  };

  if (isLoading) {
    return <DashboardLoading />;
  }

  // Filtered projects and documents based on search query and type
    const q = searchQuery.toLowerCase();
  const filteredProjects = (searchType === "all" || searchType === "projects") && searchQuery.trim() !== ""
    ? projects.filter((project: any) =>
      (project.name && project.name.toLowerCase().includes(q)) ||
      (project.status && project.status.toLowerCase().includes(q)) ||
      (project.priority && project.priority.toLowerCase().includes(q))
      )
    : projects;
  let filteredDocuments = (searchType === "all" || searchType === "documents") && searchQuery.trim() !== ""
    ? documents.filter((doc: any) =>
      (doc.name && doc.name.toLowerCase().includes(q)) ||
      (doc.type && doc.type.toLowerCase().includes(q)) ||
      (doc.summary && doc.summary.toLowerCase().includes(q))
      )
    : documents;
  // Advanced filters for documents
  if (searchType === "documents") {
    if (filterStatus) {
      filteredDocuments = filteredDocuments.filter(doc => doc.status === filterStatus);
    }
    if (filterUploader) {
      filteredDocuments = filteredDocuments.filter(doc => doc.uploadedBy && doc.uploadedBy.toLowerCase().includes(filterUploader.toLowerCase()));
    }
    if (filterDate) {
      filteredDocuments = filteredDocuments.filter(doc => doc.date && doc.date.startsWith(filterDate));
    }
  }

  // Sidebar navigation items with enhanced UX and prominent icons
  const navItems = [
    { 
      name: "Overview", 
      icon: <HomeIcon className="h-6 w-6" />, 
      tab: "overview",
      color: "text-black/80",
      activeColor: "text-black",
      iconColor: "text-blue-700",
      activeIconColor: "text-blue-800",
      bgColor: "bg-blue-100/50",
      activeBgColor: "bg-blue-100",
      borderColor: "border-blue-500/30",
      activeBorderColor: "border-blue-600"
    },
    { 
      name: "Projects", 
      icon: <BuildingOfficeIcon className="h-6 w-6" />, 
      tab: "projects",
      color: "text-black/80",
      activeColor: "text-black",
      iconColor: "text-purple-700",
      activeIconColor: "text-purple-800",
      bgColor: "bg-purple-100/50",
      activeBgColor: "bg-purple-100",
      borderColor: "border-purple-500/30",
      activeBorderColor: "border-purple-600"
    },
    { 
      name: "Documents", 
      icon: <DocumentIcon className="h-6 w-6" />, 
      tab: "documents",
      color: "text-black/80",
      activeColor: "text-black",
      iconColor: "text-indigo-700",
      activeIconColor: "text-indigo-800",
      bgColor: "bg-indigo-100/50",
      activeBgColor: "bg-indigo-100",
      borderColor: "border-indigo-500/30",
      activeBorderColor: "border-indigo-600"
    },
    { 
      name: "Team", 
      icon: <UsersIcon className="h-6 w-6" />, 
      tab: "team",
      color: "text-black/80",
      activeColor: "text-black",
      iconColor: "text-green-700",
      activeIconColor: "text-green-800",
      bgColor: "bg-green-100/50",
      activeBgColor: "bg-green-100",
      borderColor: "border-green-500/30",
      activeBorderColor: "border-green-600"
    },
    { 
      name: "Analytics", 
      icon: <ChartBarIcon className="h-6 w-6" />, 
      tab: "analytics",
      color: "text-black/80",
      activeColor: "text-black",
      iconColor: "text-orange-700",
      activeIconColor: "text-orange-800",
      bgColor: "bg-orange-100/50",
      activeBgColor: "bg-orange-100",
      borderColor: "border-orange-500/30",
      activeBorderColor: "border-orange-600"
    },
    { 
      name: "Settings", 
      icon: <Cog6ToothIcon className="h-6 w-6" />, 
      tab: "settings",
      color: "text-black/80",
      activeColor: "text-black",
      iconColor: "text-gray-700",
      activeIconColor: "text-gray-800",
      bgColor: "bg-gray-100/50",
      activeBgColor: "bg-gray-100",
      borderColor: "border-gray-500/30",
      activeBorderColor: "border-gray-600"
    },
    {
      name: "Calendar",
      icon: <CalendarIcon className="h-6 w-6" />,
      tab: "calendar",
      color: "text-black/80",
      activeColor: "text-black",
      iconColor: "text-pink-700",
      activeIconColor: "text-pink-800",
      bgColor: "bg-pink-100/50",
      activeBgColor: "bg-pink-100",
      borderColor: "border-pink-500/30",
      activeBorderColor: "border-pink-600"
    }
  ];

  // Tab content renderers
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Stats Overview */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2 font-plus-jakarta">
                <ChartBarIcon className="h-6 w-6 text-purple-600" /> Quick Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-purple-200">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-purple-700">{projects.length}</span>
                  <span className="text-sm text-purple-600 font-semibold mt-1">Active Projects</span>
                  <span className="text-xs text-purple-500 mt-1">{projects.filter(p => p.status === 'completed').length} Completed</span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                    <DocumentIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-blue-700">{documents.length}</span>
                  <span className="text-sm text-blue-600 font-semibold mt-1">Documents</span>
                  <span className="text-xs text-blue-500 mt-1">{documents.filter(d => d.status === 'approved').length} Approved</span>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                    <UsersIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-green-700">{teamMembers.length}</span>
                  <span className="text-sm text-green-600 font-semibold mt-1">Team Members</span>
                  <span className="text-xs text-green-500 mt-1">Active Users</span>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-yellow-200">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-yellow-700">{Object.values(tasksByProject).reduce((acc: number, t) => acc + (Array.isArray(t) ? t.length : 0), 0)}</span>
                  <span className="text-sm text-yellow-600 font-semibold mt-1">Total Tasks</span>
                  <span className="text-xs text-yellow-500 mt-1">In Progress</span>
                </div>
              </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Projects Section */}
              <section className="lg:col-span-2 bg-white rounded-2xl shadow border border-black/10 p-6">
                <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2 font-plus-jakarta">
                  <BuildingOfficeIcon className="h-6 w-6 text-purple-600" /> Recent Projects
                </h3>
                {filteredProjects.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <BuildingOfficeIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-semibold">No projects found</p>
                    <p className="text-sm">Create your first project to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProjects.slice(0, 4).map((project) => (
                      <div key={project._id} onClick={() => setSelectedProject(project)} className="cursor-pointer">
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-bold text-black/80 text-sm">{project.name}</h4>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                  project.status === "active" ? "bg-green-100 text-green-700" : 
                                  project.status === "completed" ? "bg-blue-100 text-blue-700" : 
                                  project.status === "pending" ? "bg-yellow-100 text-yellow-700" : 
                                  "bg-gray-100 text-gray-700"
                                }`}>
                                  {project.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-black/60">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs text-black/60">
                              <span>Documents: {project.documents}</span>
                              <span>Team: {project.team}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Team Members Section */}
              <section className="lg:col-span-1 bg-white rounded-2xl shadow border border-black/10 p-6">
                <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2 font-plus-jakarta">
                  <UsersIcon className="h-6 w-6 text-green-600" /> Team Members
                </h3>
                <div className="space-y-3">
                  {teamMembers.length > 0 ? (
                    teamMembers.slice(0, 5).map((member, idx) => {
                      // Create full name from firstName and lastName, or use name if available
                      const fullName = member.firstName && member.lastName 
                        ? `${member.firstName} ${member.lastName}` 
                        : member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown User';
                      
                      // Get initials for avatar
                      const getInitials = () => {
                        if (member.firstName && member.lastName) {
                          return `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
                        } else if (member.firstName) {
                          return member.firstName[0].toUpperCase();
                        } else if (member.name) {
                          return member.name[0].toUpperCase();
                        } else if (member.email) {
                          return member.email[0].toUpperCase();
                        }
                        return '?';
                      };

                      return (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200 hover:shadow-md transition-all duration-200 group">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-all duration-200">
                            {getInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-black/80 text-sm truncate">{fullName}</p>
                            <p className="text-xs text-black/60 flex items-center gap-1">
                              <span className="capitalize">{member.role || 'Member'}</span>
                              {member.email && (
                                <span className="text-black/40">•</span>
                              )}
                              {member.email && (
                                <span className="text-black/40 truncate">{member.email}</span>
                              )}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`w-2 h-2 rounded-full ${
                              member.status === 'online' ? 'bg-green-500' :
                              member.status === 'busy' ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`}></span>
                            {member.role === 'admin' && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <UsersIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm font-semibold">No team members</p>
                      <p className="text-xs">Invite your first team member</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Document Upload Section */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2 font-plus-jakarta">
                <CloudArrowUpIcon className="h-6 w-6 text-blue-600" /> Quick Document Upload
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <h4 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2 font-plus-jakarta">
                    <DocumentIcon className="h-5 w-5" /> Upload New Document
                  </h4>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!selectedFile || !selectedProjectId) {
                        setUploadError("Please select a file and a project.");
                        return;
                      }
                      setUploading(true);
                      setUploadError("");
                      setUploadSuccess("");
                      const formData = new FormData();
                      formData.append("file", selectedFile);
                      formData.append("projectId", selectedProjectId);
                      formData.append("companyId", companyId || "");
                      if (user && user.firstName && user.lastName) {
                        formData.append("uploadedBy", `${user.firstName} ${user.lastName}`);
                      } else if (user && user.firstName) {
                        formData.append("uploadedBy", user.firstName);
                      } else if (user && user.email) {
                        formData.append("uploadedBy", user.email);
                      } else {
                        formData.append("uploadedBy", "Current User");
                      }
                      const res = await fetch("/api/documents", {
                        method: "POST",
                        body: formData,
                      });
                      if (res.ok) {
                        setUploadSuccess("Document uploaded successfully!");
                        setSelectedFile(null);
                        setSelectedProjectId(null);
                        fetch(`/api/documents?companyId=${companyId}`)
                          .then(res => res.json())
                          .then(data => setDocuments(data));
                      } else {
                        setUploadError("Failed to upload document.");
                      }
                      setUploading(false);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">Select Project</label>
                      <select
                        value={selectedProjectId || ""}
                        onChange={e => setSelectedProjectId(e.target.value)}
                        className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        required
                      >
                        <option value="" disabled>Select a project</option>
                        {projects.map((proj) => (
                          <option key={proj._id} value={proj._id}>{proj.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">Select File</label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${selectedFile ? 'border-green-400 bg-green-50' : 'border-blue-300 bg-white hover:bg-blue-50'}`}
                        onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            setSelectedFile(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => {
                          document.getElementById('fileInput')?.click();
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label="Select or drop a file"
                      >
                        {selectedFile ? (
                          <div className="flex flex-col items-center gap-2">
                            <DocumentIcon className="h-8 w-8 text-green-500" />
                            <span className="font-semibold text-black/80">{selectedFile.name}</span>
                            <span className="text-xs text-black/50">{selectedFile.type || 'Unknown type'} • {(selectedFile.size / 1024).toFixed(1)} KB</span>
                            <button
                              type="button"
                              className="mt-2 text-xs text-red-600 hover:underline"
                              onClick={e => { e.stopPropagation(); setSelectedFile(null); }}
                            >Remove</button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <CloudArrowUpIcon className="h-8 w-8 text-blue-400" />
                            <span className="text-blue-600">Drag & drop a file here, or click to select</span>
                          </div>
                        )}
                        <input
                          id="fileInput"
                          type="file"
                          onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                          className="hidden"
                          required={!selectedFile}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full bg-blue-500 text-white rounded-lg px-4 py-3 font-semibold hover:bg-blue-600 transition-all duration-200 disabled:opacity-60"
                    >
                      {uploading ? "Uploading..." : "Upload Document"}
                    </button>
                    {uploadSuccess && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">{uploadSuccess}</div>}
                    {uploadError && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{uploadError}</div>}
                  </form>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-bold text-black/80 mb-4 flex items-center gap-2 font-plus-jakarta">
                    <DocumentCheckIcon className="h-5 w-5" /> Recent Documents
                  </h4>
                  <div className="space-y-3">
                    {filteredDocuments.slice(0, 5).map((doc, idx) => (
                      <div key={doc._id || idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <DocumentIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-black/80 text-sm truncate">{doc.name}</p>
                          <div className="flex items-center gap-2 text-xs text-black/60">
                            <span>{projects.find(p => p._id === (doc.projectId?._id || doc.projectId))?.name || 'Unknown Project'}</span>
                            <span>•</span>
                            <span className="font-medium text-blue-600">{doc.uploadedBy || 'Unknown User'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            doc.status === "approved" ? "bg-green-100 text-green-700" : 
                            doc.status === "pending" ? "bg-yellow-100 text-yellow-700" : 
                            doc.status === "rejected" ? "bg-red-100 text-red-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {doc.status}
                          </span>
                          <p className="text-xs text-black/60 mt-1">{new Date(doc.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    {filteredDocuments.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <DocumentIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm font-semibold">No documents yet</p>
                        <p className="text-xs">Upload your first document</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      case "projects":
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Projects Header */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black/80 flex items-center gap-3">
                  <BuildingOfficeIcon className="h-7 w-7 text-purple-600" /> 
                  Project Management
                </h2>
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  New Project
                </button>
              </div>
            </section>

            {/* Project Analytics Overview */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                <ChartBarIcon className="h-6 w-6 text-purple-600" /> Project Analytics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-purple-200">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-purple-700">{projects.length}</span>
                  <span className="text-sm text-purple-600 font-semibold mt-1">Total Projects</span>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-green-700">{projects.filter(p => p.status === 'active').length}</span>
                  <span className="text-sm text-green-600 font-semibold mt-1">Active</span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-blue-700">{projects.filter(p => p.status === 'completed').length}</span>
                  <span className="text-sm text-blue-600 font-semibold mt-1">Completed</span>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-yellow-200">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3">
                    <ClockIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-yellow-700">{projects.filter(p => p.status === 'pending').length}</span>
                  <span className="text-sm text-yellow-600 font-semibold mt-1">Pending</span>
                </div>
              </div>
            </section>

            {/* Search and Filters */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-600" /> Search & Filter Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="on-hold">On Hold</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </section>

            {/* Projects Grid */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                <FolderIcon className="h-6 w-6 text-purple-600" /> All Projects
              </h3>
              {filteredProjects.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <BuildingOfficeIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-semibold">No projects found</p>
                  <p className="text-sm">Create your first project to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <div key={project._id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-black/80 text-sm mb-1">{project.name}</h4>
                            <p className="text-xs text-black/60">{project.desc}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            project.status === "active" ? "bg-green-100 text-green-700" : 
                            project.status === "completed" ? "bg-blue-100 text-blue-700" : 
                            project.status === "pending" ? "bg-yellow-100 text-yellow-700" : 
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {project.status}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            project.priority === "high" ? "bg-red-100 text-red-700" : 
                            project.priority === "medium" ? "bg-yellow-100 text-yellow-700" : 
                            project.priority === "low" ? "bg-green-100 text-green-700" : 
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {project.priority}
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-black/60 mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Project Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{project.documents}</div>
                          <div className="text-xs text-black/60">Documents</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{project.team}</div>
                          <div className="text-xs text-black/60">Team</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{tasksByProject[project._id]?.length || 0}</div>
                          <div className="text-xs text-black/60">Tasks</div>
                        </div>
                      </div>
                      
                      {/* Owner Info */}
                      {project.owner && (
                        <div className="flex items-center gap-2 mb-4 p-2 bg-yellow-50 rounded-lg">
                          <StarIcon className="h-4 w-4 text-yellow-500" />
                          <span className="text-xs text-yellow-700 font-semibold">
                            {project.owner.firstName} {project.owner.lastName} {user?._id === project.owner._id ? '(You)' : ''}
                          </span>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button className="flex-1 bg-purple-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-purple-600 transition-colors">
                          View
                        </button>
                        {user?._id === project.owner?._id && (
                          <button 
                            onClick={() => {
                              setSelectedProject(project);
                              setInviteModalOpen(true);
                            }}
                            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors"
                          >
                            Invite
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        );
      case "documents":
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Documents Header */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black/80 flex items-center gap-3">
                  <DocumentIcon className="h-7 w-7 text-blue-600" /> 
                  Document Management
                </h2>
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Upload Document
                </button>
              </div>
            </section>

            {/* Document Analytics Overview */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                <ChartBarIcon className="h-6 w-6 text-purple-600" /> Document Analytics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                    <DocumentIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-blue-700">{documents.length}</span>
                  <span className="text-sm text-blue-600 font-semibold mt-1">Total Documents</span>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-green-700">{documents.filter(d => d.status === 'approved').length}</span>
                  <span className="text-sm text-green-600 font-semibold mt-1">Approved</span>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-yellow-200">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3">
                    <ClockIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-yellow-700">{documents.filter(d => d.status === 'pending').length}</span>
                  <span className="text-sm text-yellow-600 font-semibold mt-1">Pending</span>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-red-200">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-3">
                    <ExclamationCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-red-700">{documents.filter(d => d.status === 'rejected').length}</span>
                  <span className="text-sm text-red-600 font-semibold mt-1">Rejected</span>
                </div>
              </div>
            </section>

            {/* Search and Filters */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-600" /> Search & Filter Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="draft">Draft</option>
                </select>
                <select
                  value={filterUploader}
                  onChange={(e) => setFilterUploader(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">All Uploaders</option>
                  {Array.from(new Set(documents.map(d => d.uploadedBy))).map(uploader => (
                    <option key={uploader} value={uploader}>{uploader}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </section>

            {/* Documents Grid View */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                <DocumentDuplicateIcon className="h-6 w-6 text-blue-600" /> All Documents
              </h3>
              {filteredDocuments.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <DocumentIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-semibold">No documents found</p>
                  <p className="text-sm">Upload your first document to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocuments.map((doc, idx) => (
                    <div key={doc._id || idx} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <DocumentIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-black/80 text-sm mb-1">{doc.name}</h4>
                            <p className="text-xs text-black/60">{doc.type}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          doc.status === "approved" ? "bg-green-100 text-green-700" : 
                          doc.status === "pending" ? "bg-yellow-100 text-yellow-700" : 
                          doc.status === "rejected" ? "bg-red-100 text-red-700" : 
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs text-black/60">
                          <span>Project:</span>
                          <span className="font-semibold text-black/80">
                            {projects.find(p => p._id === (doc.projectId?._id || doc.projectId))?.name || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-black/60">
                          <span>Uploaded by:</span>
                          <span className="font-semibold text-black/80">{doc.uploadedBy}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-black/60">
                          <span>Date:</span>
                          <span className="font-semibold text-black/80">{doc.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors">
                          View
                        </button>
                        <button className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-600 transition-colors">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        );
      case "team":
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Team Header */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black/80 flex items-center gap-3">
                  <UsersIcon className="h-7 w-7 text-green-600" /> 
                  Team Management
                </h2>
                <button
                  onClick={() => setInviteModalOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Invite Member
                </button>
              </div>
            </section>

            {/* Team Analytics Overview */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                <ChartBarIcon className="h-6 w-6 text-green-600" /> Team Analytics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                    <UsersIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-green-700">{teamMembers.length}</span>
                  <span className="text-sm text-green-600 font-semibold mt-1">Total Members</span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                    <BuildingOfficeIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-blue-700">{projects.length}</span>
                  <span className="text-sm text-blue-600 font-semibold mt-1">Active Projects</span>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-purple-200">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3">
                    <DocumentIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-purple-700">{documents.length}</span>
                  <span className="text-sm text-purple-600 font-semibold mt-1">Documents</span>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-yellow-200">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-yellow-700">{Object.values(tasksByProject).reduce((acc: number, t) => acc + (Array.isArray(t) ? t.length : 0), 0)}</span>
                  <span className="text-sm text-yellow-600 font-semibold mt-1">Total Tasks</span>
                </div>
              </div>
            </section>

            {/* Team Members Grid */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                <UserGroupIcon className="h-6 w-6 text-green-600" /> Team Members
              </h3>
              {teamMembers.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <UsersIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-semibold">No team members yet</p>
                  <p className="text-sm">Invite your first team member to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member, idx) => {
                    // Create full name from firstName and lastName, or use name if available
                    const fullName = member.firstName && member.lastName 
                      ? `${member.firstName} ${member.lastName}` 
                      : member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown User';
                    
                    // Get initials for avatar
                    const getInitials = () => {
                      if (member.firstName && member.lastName) {
                        return `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
                      } else if (member.firstName) {
                        return member.firstName[0].toUpperCase();
                      } else if (member.name) {
                        return member.name[0].toUpperCase();
                      } else if (member.email) {
                        return member.email[0].toUpperCase();
                      }
                      return '?';
                    };

                    // Only owner/admin can remove/update others, and cannot remove self
                    const isCurrentUser = user?._id === member._id;
                    const isOwnerOrAdmin = user?.role === 'admin' || user?._id === selectedProject?.owner?._id;
                    return (
                      <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-green-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {getInitials()}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-black/80 text-lg">{fullName}</h4>
                            <p className="text-sm text-black/60">{member.email}</p>
                            <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              {member.role || 'Member'}
                            </span>
                          </div>
                        </div>
                        {/* Role update and remove actions */}
                        {isOwnerOrAdmin && !isCurrentUser && (
                          <div className="flex items-center gap-2 mb-4">
                            {/* Change Role */}
                            <select
                              value={member.role || 'member'}
                              onChange={async (e) => {
                                setRoleUpdateLoading(member._id);
                                setRoleError("");
                                try {
                                  const res = await fetch(`/api/projects/${selectedProject?._id}/members/${member._id}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ role: e.target.value }),
                                  });
                                  if (!res.ok) {
                                    const data = await res.json();
                                    setRoleError(data.error || 'Failed to update role');
                                  } else {
                                    // Refetch team members
                                    fetch(`/api/projects/${selectedProject?._id}`)
                                      .then(res => res.json())
                                      .then(data => setTeamMembers(data.members || []));
                                  }
                                } catch (err) {
                                  setRoleError('Failed to update role');
                                }
                                setRoleUpdateLoading(null);
                              }}
                              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                              disabled={roleUpdateLoading === member._id}
                            >
                              <option value="admin">Admin</option>
                              <option value="member">Member</option>
                            </select>
                            {/* Remove */}
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold disabled:opacity-60"
                              onClick={() => setRemoveMemberModal({open: true, member})}
                              disabled={removeLoading}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                        {roleError && <div className="text-red-500 text-xs mb-2">{roleError}</div>}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                            <span className="text-xs text-blue-600">Status</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              member.status === 'online' ? 'bg-green-100 text-green-700' :
                              member.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {member.status || 'offline'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                            <span className="text-xs text-purple-600">Projects</span>
                            <span className="text-xs font-semibold text-purple-700">
                              {projects.filter(p => p.members?.some((m: any) => m._id === member._id || m.email === member.email)).length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                            <span className="text-xs text-yellow-600">Documents</span>
                            <span className="text-xs font-semibold text-yellow-700">
                              {documents.filter(d => d.uploadedBy === fullName || d.uploadedBy === member.email).length}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors">
                            View Profile
                          </button>
                          <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors">
                            Message
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
            {/* Remove Member Modal */}
            {removeMemberModal.open && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
                  <h3 className="text-lg font-bold mb-4 text-red-600">Remove Team Member</h3>
                  <p className="mb-4">Are you sure you want to remove <span className="font-semibold">{removeMemberModal.member?.firstName} {removeMemberModal.member?.lastName || removeMemberModal.member?.name}</span> from the team?</p>
                  {removeError && <div className="text-red-500 mb-2">{removeError}</div>}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRemoveMemberModal({open: false, member: null})}
                      className="px-4 py-2 rounded bg-gray-200"
                      disabled={removeLoading}
                    >Cancel</button>
                    <button
                      type="button"
                      onClick={async () => {
                        setRemoveLoading(true);
                        setRemoveError("");
                        try {
                          const res = await fetch(`/api/projects/${selectedProject?._id}/members/${removeMemberModal.member._id}`, {
                            method: 'DELETE',
                          });
                          if (!res.ok) {
                            const data = await res.json();
                            setRemoveError(data.error || 'Failed to remove member');
                          } else {
                            // Refetch team members
                            fetch(`/api/projects/${selectedProject?._id}`)
                              .then(res => res.json())
                              .then(data => setTeamMembers(data.members || []));
                            setRemoveMemberModal({open: false, member: null});
                          }
                        } catch (err) {
                          setRemoveError('Failed to remove member');
                        }
                        setRemoveLoading(false);
                      }}
                      className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                      disabled={removeLoading}
                    >{removeLoading ? 'Removing...' : 'Remove'}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "analytics":
        const projectStatusData = getProjectStatusData(projects);
        const taskCompletionData = getTaskCompletionData(tasksByProject);
        const totalTasks = Object.values(tasksByProject).reduce((acc: number, t) => acc + (Array.isArray(t) ? t.length : 0), 0);
        const activeProjects = projects.filter(p => p.status === 'active').length;
        const completedProjects = projects.filter(p => p.status === 'completed').length;
        const pendingProjects = projects.filter(p => p.status === 'pending').length;
        const totalDocuments = documents.length;
        const approvedDocuments = documents.filter(d => d.status === 'approved').length;
        const pendingDocuments = documents.filter(d => d.status === 'pending').length;
        
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Enhanced Quick Stats */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h2 className="text-2xl font-bold text-black/80 mb-6 flex items-center gap-3">
                <ChartBarIcon className="h-7 w-7 text-purple-600" /> 
                Construction Analytics Dashboard
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-purple-200">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-purple-700">{projects.length}</span>
                  <span className="text-sm text-purple-600 font-semibold mt-1">Total Projects</span>
                  <span className="text-xs text-purple-500 mt-1">{activeProjects} Active</span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                    <DocumentIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-blue-700">{totalDocuments}</span>
                  <span className="text-sm text-blue-600 font-semibold mt-1">Documents</span>
                  <span className="text-xs text-blue-500 mt-1">{approvedDocuments} Approved</span>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                    <UsersIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-green-700">{teamMembers.length}</span>
                  <span className="text-sm text-green-600 font-semibold mt-1">Team Members</span>
                  <span className="text-xs text-green-500 mt-1">Active Users</span>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105 shadow-sm border border-yellow-200">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-3">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-yellow-700">{totalTasks}</span>
                  <span className="text-sm text-yellow-600 font-semibold mt-1">Total Tasks</span>
                  <span className="text-xs text-yellow-500 mt-1">In Progress</span>
                </div>
              </div>
            </section>

            {/* Project Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
                <h3 className="text-xl font-bold text-black/80 mb-4 flex items-center gap-2">
                  <ChartPieIcon className="h-6 w-6 text-purple-600" /> Project Status Distribution
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-green-700">Active Projects</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-700">{activeProjects}</span>
                      <span className="text-sm text-green-600 ml-2">({projects.length > 0 ? Math.round((activeProjects / projects.length) * 100) : 0}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold text-blue-700">Completed Projects</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-blue-700">{completedProjects}</span>
                      <span className="text-sm text-blue-600 ml-2">({projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 0}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="font-semibold text-yellow-700">Pending Projects</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-yellow-700">{pendingProjects}</span>
                      <span className="text-sm text-yellow-600 ml-2">({projects.length > 0 ? Math.round((pendingProjects / projects.length) * 100) : 0}%)</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
                <h3 className="text-xl font-bold text-black/80 mb-4 flex items-center gap-2">
                  <DocumentCheckIcon className="h-6 w-6 text-blue-600" /> Document Approval Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-green-700">Approved Documents</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-700">{approvedDocuments}</span>
                      <span className="text-sm text-green-600 ml-2">({totalDocuments > 0 ? Math.round((approvedDocuments / totalDocuments) * 100) : 0}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="font-semibold text-yellow-700">Pending Review</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-yellow-700">{pendingDocuments}</span>
                      <span className="text-sm text-yellow-600 ml-2">({totalDocuments > 0 ? Math.round((pendingDocuments / totalDocuments) * 100) : 0}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                      <span className="font-semibold text-gray-700">Total Documents</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-700">{totalDocuments}</span>
                      <span className="text-sm text-gray-600 ml-2">100%</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Enhanced Project Status Overview */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                <BuildingOfficeIcon className="h-6 w-6 text-purple-600" /> Project Status Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project, idx) => (
                  <div key={project._id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span 
                          className={`inline-block w-3 h-3 rounded-full ${
                            project.status === 'active' ? 'bg-green-500' :
                            project.status === 'completed' ? 'bg-blue-500' :
                            project.status === 'pending' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}
                        ></span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                          project.status === 'active' ? 'bg-green-100 text-green-700' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          project.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status || 'No Status'}
                        </span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        project.priority === 'high' ? 'bg-red-100 text-red-700' :
                        project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        project.priority === 'low' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {project.priority || 'No Priority'}
                      </span>
                    </div>
                    <h4 className="font-bold text-black/80 text-sm mb-2">{project.name || 'Unnamed Project'}</h4>
                    <div className="flex items-center justify-between text-xs text-black/60">
                      <span>Documents: {documents.filter(d => d.projectId === project._id).length}</span>
                      <span>Tasks: {tasksByProject[project._id]?.length || 0}</span>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-12">
                    <DocumentIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-semibold">No projects found</p>
                    <p className="text-sm">Create your first project to see analytics</p>
                  </div>
                )}
              </div>
            </section>

            {/* Task Completion Timeline */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-4 flex items-center gap-2">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" /> Task Completion Timeline
              </h3>
              <div className="h-80">
                {chartsLoading ? (
                  <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={taskCompletionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#666" />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#666" />
                      <RechartsTooltip 
                        formatter={(value: any) => [`${value} tasks`, 'Completed']}
                        contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="completed" 
                        stroke="#10B981" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#10B981' }} 
                        activeDot={{ r: 6, fill: '#10B981' }} 
                        isAnimationActive={true}
                        name="Completed Tasks"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Settings Header */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h2 className="text-2xl font-bold text-black/80 mb-6 flex items-center gap-3">
                <Cog6ToothIcon className="h-7 w-7 text-purple-600" /> 
                Account Settings & Preferences
              </h2>
            </section>

            {/* User Profile Section */}
            {user && (
              <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
                <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" /> Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Profile Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-black/80">{user.firstName} {user.lastName}</h4>
                        <p className="text-blue-700 font-medium">{user.email || user.id}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold">
                          Account Owner
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                        <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-black/60">Company ID</p>
                          <p className="font-semibold text-black/80">{user.companyId}</p>
                        </div>
                      </div>
                      {user.businessType && (
                        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                          <WrenchScrewdriverIcon className="h-5 w-5 text-yellow-500" />
                          <div>
                            <p className="text-sm text-black/60">Business Type</p>
                            <p className="font-semibold text-black/80">{user.businessType}</p>
                          </div>
                        </div>
                      )}
                      {user.country && (
                        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                          <GlobeAltIcon className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="text-sm text-black/60">Country</p>
                            <p className="font-semibold text-black/80">{user.country}</p>
                          </div>
                        </div>
                      )}
                      {user.constructionVolume && (
                        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                          <ChartBarIcon className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="text-sm text-black/60">Construction Volume</p>
                            <p className="font-semibold text-black/80">{user.constructionVolume}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <h4 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                        <CheckBadgeIcon className="h-5 w-5" /> Account Status
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-600">Account Type</span>
                          <span className="font-semibold text-green-700">Active</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-600">Last Login</span>
                          <span className="font-semibold text-green-700">Today</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-600">Member Since</span>
                          <span className="font-semibold text-green-700">2024</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                      <h4 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                        <ExclamationCircleIcon className="h-5 w-5" /> Danger Zone
                      </h4>
                      <p className="text-sm text-red-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <button
                        className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-red-600 transition-all duration-200 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={async () => {
                          setLogoutLoading(true);
                          await fetch('/api/auth/logout', { method: 'POST' });
                          setLogoutLoading(false);
                          window.location.reload();
                        }}
                        disabled={logoutLoading}
                      >
                        {logoutLoading ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Subscription & Billing Section */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                <ChartPieIcon className="h-6 w-6 text-yellow-600" /> Subscription & Billing
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Current Plan */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-center gap-3 mb-4">
                    <ChartPieIcon className="h-8 w-8 text-yellow-600" />
                    <div>
                      <h4 className="text-xl font-bold text-yellow-700">Current Plan</h4>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${projects.length <= 2 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {projects.length <= 2 ? 'Free Plan' : 'Pro Plan'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <span className="text-sm text-yellow-600">Projects Used</span>
                      <span className="font-semibold text-yellow-700">{projects.length} / {projects.length <= 2 ? '2' : 'Unlimited'}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-yellow-600">
                        <span>Usage</span>
                        <span>{Math.min((projects.length / 2) * 100, 100)}%</span>
                      </div>
                      <div className="w-full bg-yellow-200 rounded-full h-3">
                        <div
                          className={`rounded-full h-3 transition-all duration-300 ${projects.length <= 2 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                          style={{ width: `${Math.min((projects.length / 2) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <h4 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                    <StarIcon className="h-6 w-6" /> Plan Features
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-purple-700">Unlimited Documents</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-purple-700">Team Collaboration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-purple-700">Advanced Analytics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-purple-700">Priority Support</span>
                    </div>
                    {projects.length <= 2 && (
                      <div className="flex items-center gap-3">
                        <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm text-yellow-700">Limited to 2 Projects</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <button
                      className={`w-full px-6 py-3 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 ${
                        projects.length <= 2 
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-300' 
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                      onClick={() => projects.length <= 2 && setShowUpgradeModal(true)}
                      disabled={projects.length > 2}
                    >
                      {projects.length <= 2 ? 'Upgrade to Pro' : 'Pro Plan Active'}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Security & Privacy Section */}
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                <ShieldCheckIcon className="h-6 w-6 text-green-600" /> Security & Privacy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <LockClosedIcon className="h-6 w-6 text-green-600" />
                    <h4 className="text-lg font-bold text-green-700">Password</h4>
                  </div>
                  <p className="text-sm text-green-600 mb-4">Update your password to keep your account secure.</p>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-600 transition-all duration-200">
                    Change Password
                  </button>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <DocumentDuplicateIcon className="h-6 w-6 text-blue-600" />
                    <h4 className="text-lg font-bold text-blue-700">Privacy</h4>
                  </div>
                  <p className="text-sm text-blue-600 mb-4">Manage your privacy settings and data preferences.</p>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 transition-all duration-200">
                    Privacy Settings
                  </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
                    <h4 className="text-lg font-bold text-purple-700">Notifications</h4>
                  </div>
                  <p className="text-sm text-purple-600 mb-4">Configure your notification preferences.</p>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-purple-600 transition-all duration-200">
                    Notification Settings
                  </button>
                </div>
              </div>
            </section>
          </div>
        );
      case "calendar":
        return (
          <div className="space-y-8 animate-fade-in">
            <section className="bg-white rounded-2xl shadow border border-black/10 p-6">
              <h2 className="text-2xl font-bold text-black/80 mb-6 flex items-center gap-3">
                <CalendarIcon className="h-7 w-7 text-pink-600" />
                Calendar & Deadlines
              </h2>
              <CalendarView
                tasksByProject={tasksByProject}
                projects={projects}
              />
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-inter">
      {/* Sidebar */}
      <aside className="bg-white border-r border-black/10 w-full md:w-72 flex-shrink-0 sticky top-0 z-30 h-16 md:h-screen flex md:flex-col items-center md:items-stretch px-4 md:px-6 py-2 md:py-8 shadow-sm">
        <div className="flex-1 flex flex-row md:flex-col gap-3 md:gap-4 items-center md:items-stretch w-full">
          {/* Logo Section */}
          <div className="hidden md:flex items-center justify-center mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-black tracking-tight font-plus-jakarta">BuildStack</span>
            </div>
          </div>
          
          {/* Navigation Items */}
          <div className="flex flex-row md:flex-col gap-1 md:gap-2 w-full overflow-y-auto max-h-[calc(100vh-120px)] md:max-h-full">
            {navItems.map((item) => (
              <button
                key={item.tab}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold group relative overflow-hidden font-inter w-full ${
                  activeTab === item.tab 
                    ? `bg-black/8 ${item.activeColor} shadow-lg border-2 ${item.activeBorderColor} transform scale-[1.02]` 
                    : `${item.color} hover:bg-black/5 hover:shadow-md hover:scale-[1.01] border-2 border-transparent`
                } ${tabLoading && loadingTab === item.tab ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleTabChange(item.tab)}
                aria-current={activeTab === item.tab ? "page" : undefined}
                disabled={tabLoading}
                style={{ minHeight: 0 }}
              >
                {/* Active indicator */}
                {activeTab === item.tab && (
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.activeBorderColor} rounded-r-full`} />
                )}
                
                {/* Icon with enhanced styling - more prominent */}
                <div className="flex items-center justify-center transition-all duration-300" style={{ minWidth: 32, minHeight: 32 }}>
                  {tabLoading && loadingTab === item.tab ? (
                    <div className="flex flex-col items-center">
                      {/* Animated Icon */}
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-1 p-2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 shadow border border-gray-200"
                      >
                        {React.cloneElement(item.icon, { className: "h-5 w-5 text-gray-800" })}
                      </motion.div>
                      {/* Progress Bar */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-8 bg-gray-200 rounded-full h-1 overflow-hidden mt-1"
                      >
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                      </motion.div>
                      {/* Animated Dots */}
                      <motion.div className="flex space-x-0.5 mt-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </motion.div>
                    </div>
                  ) : (
                    React.cloneElement(item.icon, {
                      className: `transition-all duration-300 text-gray-800 h-5 w-5 ${
                        activeTab === item.tab 
                          ? 'scale-110 drop-shadow-sm' 
                          : 'group-hover:scale-105 drop-shadow-sm'
                      }`
                    })
                  )}
                </div>
                
                {/* Text */}
                <span className="hidden md:inline font-semibold font-inter text-base">{item.name}</span>
                
                {/* Hover effect */}
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  activeTab === item.tab 
                    ? 'bg-gradient-to-r from-white/30 to-transparent' 
                    : 'group-hover:bg-gradient-to-r from-white/20 to-transparent'
                }`} />
              </button>
            ))}
          </div>
          
          {/* Bottom Spacing */}
          <div className="hidden md:block flex-1"></div>
          
          {/* User Profile Section */}
          <div className="hidden md:block mt-6">
            {user && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-black text-sm truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-black/60 text-xs truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Subtle grid/radial background overlay */}
        <div className="absolute inset-0 pointer-events-none -z-10" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)', backgroundSize: '36px 36px'}} />
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-black/10 px-4 py-3">
          {/* Mobile Layout - Vertical Stack */}
          <div className="block sm:hidden">
            {/* Top Row - New Project Button and User Avatar */}
            <div className="flex items-center justify-between mb-3">
              <button
                className="px-3 py-2 bg-black text-white rounded-full font-semibold shadow hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                onClick={() => setModalOpen(true)}
              >
                <PlusIcon className="h-4 w-4 inline mr-1" /> 
                New
              </button>
              
              {/* User Profile Avatar & Dropdown in Header */}
              <div className="relative" ref={profileRef}>
                {user ? (
                  <>
                    <button
                      className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => setProfileDropdownOpen((open) => !open)}
                      aria-label="User profile"
                    >
                      {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                    </button>
                    {/* Dropdown */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-black/10 rounded-2xl shadow-xl p-5 z-50 flex flex-col items-center animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-2xl font-bold shadow mb-2">
                          {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                        </div>
                        <div className="text-lg font-semibold text-black/80 mb-1" style={{ fontFamily: 'var(--font-plus-jakarta)' }}>{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-blue-700 font-medium bg-blue-100 rounded px-2 py-0.5 mb-2" style={{ fontFamily: 'var(--font-inter)' }}>{user.email || user.id}</div>
                        <div className="w-full flex flex-col gap-1 text-sm text-black/70 mb-3" style={{ fontFamily: 'var(--font-inter)' }}>
                          <div className="flex items-center gap-2"><BuildingOfficeIcon className="h-5 w-5 text-blue-400" /><span className="font-semibold">Company ID:</span> <span className="truncate">{user.companyId}</span></div>
                          {user.businessType && <div className="flex items-center gap-2"><WrenchScrewdriverIcon className="h-5 w-5 text-yellow-500" /><span className="font-semibold">Business Type:</span> <span>{user.businessType}</span></div>}
                          {user.country && <div className="flex items-center gap-2"><GlobeAltIcon className="h-5 w-5 text-green-500" /><span className="font-semibold">Country:</span> <span>{user.country}</span></div>}
                        </div>
                        <button
                          className="w-full bg-black text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-900 transition-all duration-200 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-black/30"
                          onClick={async () => {
                            setLogoutLoading(true);
                            await fetch('/api/auth/logout', { method: 'POST' });
                            setLogoutLoading(false);
                            window.location.reload();
                          }}
                          disabled={logoutLoading}
                        >
                          {logoutLoading ? 'Logging out...' : 'Logout'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-bold shadow-lg border-2 border-white" />
                )}
              </div>
            </div>

            {/* Bottom Row - Search System */}
            <div className="flex items-center gap-3 flex-wrap">
              <MagnifyingGlassIcon className="h-5 w-5 text-black/40" />
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={searchType}
                  onChange={e => setSearchType(e.target.value)}
                  className="border border-black/10 rounded-lg bg-white/50 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black/20"
                  style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
                >
                  <option value="all">All</option>
                  <option value="projects">Projects</option>
                  <option value="documents">Documents</option>
                </select>
                <input
                  type="text"
                  placeholder={`Search ${searchType}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-2 pr-4 py-1 border border-black/10 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent text-sm w-32"
                  style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
                />
                {/* Advanced filters for documents */}
                {searchType === "documents" && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                      className="border border-black/10 rounded-lg bg-white/50 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black/20"
                    >
                      <option value="">All Statuses</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                      <option value="draft">Draft</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Uploader"
                      value={filterUploader}
                      onChange={e => setFilterUploader(e.target.value)}
                      className="pl-2 pr-4 py-1 border border-black/10 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent text-sm w-24"
                    />
                    <input
                      type="date"
                      value={filterDate}
                      onChange={e => setFilterDate(e.target.value)}
                      className="border border-black/10 rounded-lg bg-white/50 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                    <button
                      type="button"
                      className="text-xs text-gray-500 hover:underline ml-1"
                      onClick={() => { setFilterStatus(""); setFilterUploader(""); setFilterDate(""); }}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Layout - Horizontal */}
          <div className="hidden sm:flex items-center justify-between mb-6">
            {/* Left Side - Search System */}
            <div className="flex items-center gap-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-black/40" />
              <div className="flex items-center gap-2">
                <select
                  value={searchType}
                  onChange={e => setSearchType(e.target.value)}
                  className="border border-black/10 rounded-lg bg-white/50 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black/20"
                  style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
                >
                  <option value="all">All</option>
                  <option value="projects">Projects</option>
                  <option value="documents">Documents</option>
                </select>
                <input
                  type="text"
                  placeholder={`Search ${searchType}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-2 pr-4 py-1 border border-black/10 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent text-sm w-40 md:w-56"
                  style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
                />
                {/* Advanced filters for documents */}
                {searchType === "documents" && (
                  <div className="flex items-center gap-2">
                    <select
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                      className="border border-black/10 rounded-lg bg-white/50 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black/20"
                    >
                      <option value="">All Statuses</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                      <option value="draft">Draft</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Uploader"
                      value={filterUploader}
                      onChange={e => setFilterUploader(e.target.value)}
                      className="pl-2 pr-4 py-1 border border-black/10 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent text-sm w-28"
                    />
                    <input
                      type="date"
                      value={filterDate}
                      onChange={e => setFilterDate(e.target.value)}
                      className="border border-black/10 rounded-lg bg-white/50 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black/20"
                    />
                    <button
                      type="button"
                      className="text-xs text-gray-500 hover:underline ml-1"
                      onClick={() => { setFilterStatus(""); setFilterUploader(""); setFilterDate(""); }}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - New Project Button and User Avatar */}
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 bg-black text-white rounded-full font-semibold shadow hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black text-base"
                onClick={() => setModalOpen(true)}
              >
                <PlusIcon className="h-5 w-5 inline mr-1" /> 
                New Project
              </button>
              
              {/* User Profile Avatar & Dropdown in Header */}
              <div className="relative" ref={profileRef}>
                {user ? (
                  <>
                    <button
                      className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-lg font-bold shadow-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => setProfileDropdownOpen((open) => !open)}
                      aria-label="User profile"
                    >
                      {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                    </button>
                    {/* Dropdown */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-black/10 rounded-2xl shadow-xl p-5 z-50 flex flex-col items-center animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-2xl font-bold shadow mb-2">
                          {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                        </div>
                        <div className="text-lg font-semibold text-black/80 mb-1" style={{ fontFamily: 'var(--font-plus-jakarta)' }}>{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-blue-700 font-medium bg-blue-100 rounded px-2 py-0.5 mb-2" style={{ fontFamily: 'var(--font-inter)' }}>{user.email || user.id}</div>
                        <div className="w-full flex flex-col gap-1 text-sm text-black/70 mb-3" style={{ fontFamily: 'var(--font-inter)' }}>
                          <div className="flex items-center gap-2"><BuildingOfficeIcon className="h-5 w-5 text-blue-400" /><span className="font-semibold">Company ID:</span> <span className="truncate">{user.companyId}</span></div>
                          {user.businessType && <div className="flex items-center gap-2"><WrenchScrewdriverIcon className="h-5 w-5 text-yellow-500" /><span className="font-semibold">Business Type:</span> <span>{user.businessType}</span></div>}
                          {user.country && <div className="flex items-center gap-2"><GlobeAltIcon className="h-5 w-5 text-green-500" /><span className="font-semibold">Country:</span> <span>{user.country}</span></div>}
                        </div>
                        <button
                          className="w-full bg-black text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-900 transition-all duration-200 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-black/30"
                          onClick={async () => {
                            setLogoutLoading(true);
                            await fetch('/api/auth/logout', { method: 'POST' });
                            setLogoutLoading(false);
                            window.location.reload();
                          }}
                          disabled={logoutLoading}
                        >
                          {logoutLoading ? 'Logging out...' : 'Logout'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg font-bold shadow-lg border-2 border-white" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Notification for missing companyId */}
        {(!companyId && showCompanyIdAlert) && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative m-4 flex items-center justify-between" role="alert">
            <span>Company ID is missing. Please log in again or contact support.</span>
            <button
              className="ml-4 text-red-700 hover:text-red-900 font-bold text-lg focus:outline-none"
              onClick={() => setShowCompanyIdAlert(false)}
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        )}

        {/* Main Dashboard Content */}
        <main className="flex-1 p-4 md:p-8 bg-white font-inter">
          {/* Main Dashboard Heading Section */}
          <section className="mb-8">
            {/* Desktop Layout - Horizontal */}
            <div className="hidden sm:flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <HomeIcon className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-black/80 font-plus-jakarta">Construction Dashboard</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-black text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-900 transition-all duration-200 flex items-center gap-2 font-inter hover:scale-105 transform"
                >
                  <PlusIcon className="h-5 w-5" /> New Project
                </button>
                <button
                  onClick={() => setInviteModalOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 font-inter hover:scale-105 transform"
                >
                  <UsersIcon className="h-5 w-5" /> Invite Team
                </button>
              </div>
            </div>

            {/* Mobile Layout - Vertical */}
            <div className="block sm:hidden">
              <div className="flex items-center gap-3 mb-4">
                <HomeIcon className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-black/80 font-plus-jakarta">Construction Dashboard</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex-1 bg-black text-white px-4 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-900 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-inter hover:scale-105 transform"
                >
                  <PlusIcon className="h-4 w-4" /> New Project
                </button>
                <button
                  onClick={() => setInviteModalOpen(true)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-full font-semibold shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-inter hover:scale-105 transform"
                >
                  <UsersIcon className="h-4 w-4" /> Invite Team
                </button>
              </div>
            </div>
          </section>

          {tabLoading ? (
            <TabLoading tabName={loadingTab} />
          ) : (
            renderTabContent()
          )}
        </main>

        {/* Modals */}
        <NewProjectModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={async project => {
            const res = await fetch("/api/projects", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...project, companyId: companyId }),
            });
            if (res.ok) {
              setProjects(prev => [project, ...prev]);
            }
          }}
        />
        <InviteTeamModal
          open={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          project={selectedProject}
        />
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <StarIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-black/80 mb-2">Upgrade to Pro</h2>
                <p className="text-black/60">Unlock unlimited projects and premium features</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700">Unlimited Projects</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-700">Advanced Analytics</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-purple-700">Priority Support</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    stripeLoading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  }`}
                  onClick={handleStripeCheckout}
                  disabled={stripeLoading}
                >
                  {stripeLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.831 3.47 1.426 3.47 2.338 0 .914-.796 1.431-2.127 1.431-1.72 0-4.516-.924-6.378-2.168l-.9 5.555C8.22 21.827 10.58 23 13.26 23c2.834 0 5.343-.624 6.877-1.813C21.75 19.85 22.5 18.266 22.5 16.4c0-4.339-2.526-6.25-8.524-7.25z"/>
                      </svg>
                      Pay with Stripe
                    </>
                  )}
                </button>
                
                <button
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  onClick={handleJazzCashCheckout}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Pay with JazzCash
                </button>
              </div>
              
              <button
                className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
                onClick={() => setShowUpgradeModal(false)}
              >
                Maybe later
              </button>
            </div>
          </div>
        )}
        {/* Tasks Section */}
        {selectedProject && (
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-lg">Tasks</h4>
              <button onClick={() => { setActiveProjectId(selectedProject._id); setTaskModalOpen(true); }} className="flex items-center gap-1 px-3 py-1 bg-black text-white rounded hover:bg-gray-800">
                <PlusIcon className="w-4 h-4" /> Add Task
              </button>
            </div>
            <KanbanBoard
              tasks={tasksByProject[selectedProject?._id || ''] || []}
              onStatusChange={async (taskId, newStatus) => {
                // Update status in backend
                await fetch(`/api/projects/${selectedProject._id}/tasks/${taskId}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: newStatus }),
                });
                // Refetch tasks
                fetchTasks(selectedProject._id);
              }}
              teamMembers={teamMembers}
            />
          </div>
        )}
        <AddTaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} onAdd={task => {
          setTasksByProject(prev => ({
            ...prev,
            [activeProjectId || '']: [task, ...(prev[activeProjectId || ''] || [])]
          }));
          setTaskModalOpen(false);
        }} projectId={activeProjectId || ''} teamMembers={teamMembers} />

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Payment Successful!</h3>
                <p className="text-sm opacity-90">Welcome to Pro! You now have unlimited construction projects.</p>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <StarIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-black/80 mb-2">Upgrade to Pro</h2>
                <p className="text-black/60">Unlock unlimited projects and premium features</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700">Unlimited Projects</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-700">Advanced Analytics</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-purple-700">Priority Support</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    stripeLoading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  }`}
                  onClick={handleStripeCheckout}
                  disabled={stripeLoading}
                >
                  {stripeLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.831 3.47 1.426 3.47 2.338 0 .914-.796 1.431-2.127 1.431-1.72 0-4.516-.924-6.378-2.168l-.9 5.555C8.22 21.827 10.58 23 13.26 23c2.834 0 5.343-.624 6.877-1.813C21.75 19.85 22.5 18.266 22.5 16.4c0-4.339-2.526-6.25-8.524-7.25z"/>
                      </svg>
                      Pay with Stripe
                    </>
                  )}
                </button>
                
                <button
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  onClick={handleJazzCashCheckout}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Pay with JazzCash
                </button>
              </div>
              
              <button
                className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
                onClick={() => setShowUpgradeModal(false)}
              >
                Maybe later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, change, changeType, icon, color }: StatCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white/80 backdrop-blur-sm border border-black/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-black/5 ${color}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          changeType === "positive" ? "text-green-600" : 
          changeType === "negative" ? "text-red-600" : "text-black/50"
        }`} style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
          {changeType === "positive" && <ArrowUpIcon className="h-3 w-3" />}
          {changeType === "negative" && <ArrowDownIcon className="h-3 w-3" />}
          <span>{change}</span>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-black/70" style={{ fontFamily: 'var(--font-plus-jakarta)', fontWeight: 700 }}>{value}</p>
        <p className="text-black/50 text-sm" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>{title}</p>
      </div>
    </motion.div>
  );
}

function ProjectCard({ name, status, progress, documents, team, lastUpdated, priority, _id, members, onInvite, owner, currentUserId }: ProjectCardProps & { _id: string, members?: any[], onInvite: () => void, owner: any, currentUserId?: string }) {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    "on-hold": "bg-gray-100 text-gray-800"
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800"
  };

  return (
    <motion.div 
      whileHover={{ x: 4 }}
      className="bg-white/60 backdrop-blur-sm border border-black/10 rounded-xl p-4 hover:bg-white/80 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-black/70 mb-1" style={{ fontFamily: 'var(--font-inter)', fontWeight: 600 }}>{name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`} style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
              {status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`} style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
              {priority}
            </span>
          </div>
          {owner && (
            <div className="flex items-center gap-1 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                <StarIcon className="h-4 w-4 mr-1 text-yellow-500" />
                {owner.firstName} {owner.lastName} {currentUserId === owner._id ? '(You)' : ''} <span className="ml-1">Owner</span>
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 items-end">
          {currentUserId === owner?._id && (
          <button className="text-blue-600 hover:underline text-sm font-medium" onClick={onInvite}>
            Invite
          </button>
          )}
          <button className="text-black/40 hover:text-black/60 transition-colors duration-200">
            <EyeIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      {/* Show avatars of current members */}
      {members && members.length > 0 && (
        <div className="flex -space-x-2 mb-2">
          {members.slice(0, 5).map((m, idx) => (
            <div key={idx} className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-black/60" title={m.name || m.email || "Unknown"}>{m.avatar || (m.name ? m.name[0] : (m.email ? m.email[0] : "?"))}</div>
          ))}
          {members.length > 5 && <span className="text-xs text-gray-500 ml-2">+{members.length - 5} more</span>}
        </div>
      )}
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm text-black/50 mb-1" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-black/10 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-black/50" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <DocumentIcon className="h-3 w-3" />
              {documents}
            </span>
            <span className="flex items-center gap-1">
              <UsersIcon className="h-3 w-3" />
              {team}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            {lastUpdated}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function DocumentItem({ name, type, project, uploadedBy, date, size, status, summary }: DocumentItemProps & { summary?: string }) {
  const statusColors = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    draft: "bg-gray-100 text-gray-800"
  };

  return (
    <motion.div 
      whileHover={{ x: 4 }}
      className="flex flex-col gap-2 p-3 bg-white/60 backdrop-blur-sm border border-black/10 rounded-lg hover:bg-white/80 transition-all duration-300"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 bg-black/5 rounded-lg">
          <DocumentIcon className="h-4 w-4 text-black/60" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-black/70 truncate" style={{ fontFamily: 'var(--font-inter)', fontWeight: 600 }}>{name}</p>
          <div className="flex items-center gap-2 text-sm text-black/50" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
            <span>{type}</span>
            <span>•</span>
            <span>{project}</span>
            <span>•</span>
            <span>{uploadedBy}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`} style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
          {status}
        </span>
        <div className="text-right text-sm text-black/50" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
          <div>{size}</div>
          <div>{date}</div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 text-black/40 hover:text-black/60 transition-colors duration-200">
            <EyeIcon className="h-3 w-3" />
          </button>
          <button className="p-1 text-black/40 hover:text-black/60 transition-colors duration-200">
            <PencilIcon className="h-3 w-3" />
          </button>
        </div>
      </div>
      {summary && (
        <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-black/70" style={{ fontFamily: 'var(--font-inter)' }}>
          <span className="font-semibold text-black/60">AI Summary:</span> {summary}
        </div>
      )}
    </motion.div>
  );
}

function TeamMember({ name, role, avatar, status, project }: TeamMemberProps) {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-yellow-500"
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm border border-black/10 rounded-lg hover:bg-white/80 transition-all duration-300">
      <div className="relative">
        <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center text-black/70 font-semibold text-sm" style={{ fontFamily: 'var(--font-inter)', fontWeight: 600 }}>
          {avatar}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${statusColors[status]}`}></div>
      </div>
      <div className="flex-1">
        <p className="font-medium text-black/70 text-sm" style={{ fontFamily: 'var(--font-inter)', fontWeight: 600 }}>{name}</p>
        <p className="text-black/50 text-xs" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>{role} • {project}</p>
      </div>
      <div className="text-right">
        <span className={`text-xs px-2 py-1 rounded-full ${
          status === "online" ? "bg-green-100 text-green-800" :
          status === "busy" ? "bg-yellow-100 text-yellow-800" :
          "bg-gray-100 text-gray-800"
        }`} style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
          {status}
        </span>
      </div>
    </div>
  );
}

function SecurityAlert({ type, title, description, severity, time }: SecurityAlertProps) {
  const severityColors = {
    low: "bg-green-50 border-green-200",
    medium: "bg-yellow-50 border-yellow-200",
    high: "bg-red-50 border-red-200"
  };

  const severityTextColors = {
    low: "text-green-800",
    medium: "text-yellow-800",
    high: "text-red-800"
  };

  return (
    <div className={`p-3 rounded-lg border ${severityColors[severity]}`}>
      <div className="flex items-start gap-3">
        <ShieldCheckIcon className={`h-4 w-4 mt-0.5 ${severityTextColors[severity]}`} />
        <div className="flex-1">
          <h4 className={`font-medium text-sm ${severityTextColors[severity]}`} style={{ fontFamily: 'var(--font-inter)', fontWeight: 600 }}>{title}</h4>
          <p className="text-black/60 text-xs mt-1" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>{description}</p>
          <p className="text-black/40 text-xs mt-1" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>{time}</p>
        </div>
      </div>
    </div>
  ); 
} 

function calculateProjectProgress(tasks: any[]): number {
  if (!tasks || tasks.length === 0) return 0;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  return Math.round((doneCount / tasks.length) * 100);
}

// Helper: Get project status breakdown for PieChart
function getProjectStatusData(projects: any[]) {
  const statusCounts: { [key: string]: number } = {};
  projects.forEach(p => {
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
  });
  return Object.entries(statusCounts).map(([status, count]) => ({ name: status, value: count }));
}

// Helper: Get tasks completed over time for LineChart
function getTaskCompletionData(tasksByProject: { [key: string]: any[] }) {
  // Flatten all tasks
  const allTasks = Object.values(tasksByProject).flat();
  // Only done tasks with completedAt
  const doneTasks = allTasks.filter((t: any) => t.status === 'done' && t.completedAt);
  // Group by date (YYYY-MM-DD)
  const dateCounts: { [date: string]: number } = {};
  doneTasks.forEach((t: any) => {
    const date = new Date(t.completedAt).toISOString().slice(0, 10);
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });
  // Sort by date
  const sortedDates = Object.keys(dateCounts).sort();
  return sortedDates.map(date => ({ date, completed: dateCounts[date] }));
}

const PROJECT_STATUS_COLORS = ['#6366F1', '#22D3EE', '#F59E42', '#10B981', '#F43F5E', '#A78BFA'];

function handleStripeCheckout() {
  alert('Stripe checkout coming soon!');
}
function handleJazzCashCheckout() {
  alert('JazzCash checkout coming soon!');
}

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}











