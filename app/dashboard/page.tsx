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
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import LinePattern from "../components/LinePattern";
import Pusher from 'pusher-js';
import NewProjectModal from '../components/NewProjectModal';
import InviteTeamModal from '../components/InviteTeamModal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import CalendarView from "../components/CalendarView";
import toast from 'react-hot-toast';

// Color palette for projects
const PROJECT_COLORS = [
  "#6366F1", // Indigo
  "#22D3EE", // Cyan
  "#F59E42", // Orange
  "#10B981", // Green
  "#F43F5E", // Red
  "#A78BFA", // Purple
  "#FBBF24", // Yellow
];

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
    overview: <HomeIcon className="h-8 w-8 text-white" />,
    projects: <BuildingOfficeIcon className="h-8 w-8 text-white" />,
    documents: <DocumentIcon className="h-8 w-8 text-white" />,
    team: <UsersIcon className="h-8 w-8 text-white" />,
    analytics: <ChartBarIcon className="h-8 w-8 text-white" />,
    settings: <Cog6ToothIcon className="h-8 w-8 text-white" />
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[400px] p-8 w-full bg-white">
      {/* Black icon background */}
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
        className="relative z-10 mb-8 p-6 rounded-2xl bg-black shadow-xl flex items-center justify-center"
      >
        {tabIcons[tabName as keyof typeof tabIcons]}
      </motion.div>
      {/* Loading Text */}
      <div className="relative z-10 text-center mb-6">
        <h3 className="text-2xl font-bold text-black mb-2 capitalize font-plus-jakarta">
          Loading {tabName.replace('-', ' ')}...
        </h3>
        <p className="text-gray-500 text-base font-inter">
          Getting your dashboard ready
        </p>
      </div>
      {/* Animated SaaS black bar loader */}
      <div className="relative z-10 w-full max-w-xs flex flex-col items-center">
        <div className="flex flex-col gap-1 w-full">
          {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
              className="h-2 rounded-full bg-black/80"
              initial={{ width: '0%' }}
              animate={{ width: ["0%", `${60 + i * 8}%`, "100%", "0%"] }}
              transition={{ duration: 2.2 + i * 0.2, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
        </div>
      </div>
      {/* Friendly message */}
      <div className="relative z-10 mt-8 text-gray-400 text-sm font-inter">
        Just a moment... Your workspace is getting ready!
      </div>
    </div>
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
    { id: 'todo', title: 'To Do', color: 'bg-gray-50' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50' },
    { id: 'done', title: 'Done', color: 'bg-green-50' },
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
      <div className="flex gap-6 min-w-[700px] sm:min-w-0">
        {columns.map(col => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided: any, snapshot: any) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`w-80 min-h-[320px] rounded-2xl p-4 ${col.color} border border-black/10 shadow-sm flex flex-col transition-all duration-200`}
              >
                <h4 className="font-bold mb-3 text-black/70 text-lg font-plus-jakarta">{col.title}</h4>
                {tasksByStatus[col.id].map((task: any, idx: number) => (
                  <Draggable draggableId={task._id} index={idx} key={task._id}>
                    {(provided: any, snapshot: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`mb-4 p-4 rounded-2xl bg-white shadow border-l-4 flex flex-col gap-2 border-black/10 hover:shadow-md transition-all duration-200 ${task.priority === 'high' ? 'border-red-500' : task.priority === 'medium' ? 'border-yellow-400' : 'border-green-500'}`}
                        style={{ touchAction: 'manipulation' }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-black/80 text-base truncate">{task.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${task.status === 'done' ? 'bg-green-200 text-green-800' : task.status === 'in-progress' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>{task.status.replace('-', ' ')}</span>
                        </div>
                        {task.description && <div className="text-xs text-black/50 line-clamp-2">{task.description}</div>}
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                          {task.assignee && <span className="flex items-center gap-1"><UsersIcon className="h-4 w-4 text-blue-400" />{teamMembers.find((m: any) => m._id === task.assignee?._id)?.name || 'Unassigned'}</span>}
                          {task.dueDate && <span className="flex items-center gap-1"><CalendarIcon className="h-4 w-4 text-gray-400" />{new Date(task.dueDate).toLocaleDateString()}</span>}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{task.priority}</span>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

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
        console.log('🔍 Dashboard: Loaded projects from API:', data.length, 'projects');
        console.log('📋 Project names:', data.map((p: any) => p.name));
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
      console.log('🔔 Pusher: Project created event received:', data.project.name);
      setProjects(prev => {
        // Check if project already exists to prevent duplicates
        const projectExists = prev.some(p => p._id === data.project._id);
        if (projectExists) {
          console.log('⚠️ Pusher: Project already exists in state, skipping:', data.project.name);
          return prev;
        }
        return [data.project, ...prev];
      });
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

  const refreshDocuments = async () => {
    if (companyId) {
      try {
        const res = await fetch(`/api/documents?companyId=${companyId}`);
        const data = await res.json();
        setDocuments(data);
      } catch (error) {
        console.error('Error refreshing documents:', error);
      }
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setDocuments(documents.filter(doc => doc._id !== documentId));
        toast.success('Document deleted successfully');
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting document');
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProjects(projects.filter(project => project._id !== projectId));
        toast.success('Project deleted successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Error deleting project');
    }
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
            <section className="bg-white rounded-2xl border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2 font-plus-jakarta">
                <ChartBarIcon className="h-6 w-6 text-purple-600" /> Quick Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Active Projects */}
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300 shadow">
                    <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{projects.length}</span>
                  <span className="text-sm text-black/70 font-semibold">Active Projects</span>
                  <span className="text-xs text-blue-600 mt-1">{projects.filter(p => p.status === 'completed').length} Completed</span>
                </div>
                {/* Documents */}
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-green-400 hover:bg-green-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300 transition-colors duration-300 shadow">
                    <DocumentIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{documents.length}</span>
                  <span className="text-sm text-black/70 font-semibold">Documents</span>
                  <span className="text-xs text-green-600 mt-1">{documents.filter(d => d.status === 'approved').length} Approved</span>
                </div>
                {/* Team Members */}
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-purple-400 hover:bg-purple-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-colors duration-300 shadow">
                    <UsersIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{teamMembers.length}</span>
                  <span className="text-sm text-black/70 font-semibold">Team Members</span>
                  <span className="text-xs text-purple-600 mt-1">Active Users</span>
                </div>
                {/* Total Tasks */}
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-yellow-100 to-yellow-200 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-colors duration-300 shadow">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{Object.values(tasksByProject).reduce((acc: number, t) => acc + (Array.isArray(t) ? t.length : 0), 0)}</span>
                  <span className="text-sm text-black/70 font-semibold">Total Tasks</span>
                  <span className="text-xs text-yellow-600 mt-1">In Progress</span>
                </div>
              </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Projects Section */}
              <section className="lg:col-span-2 bg-white rounded-2xl shadow border border-black/10 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-black/80 mb-4 sm:mb-6 flex items-center gap-2 font-plus-jakarta">
                  <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" /> Recent Projects
                </h3>
                {filteredProjects.length === 0 ? (
                  <div className="text-center text-black/50 py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BuildingOfficeIcon className="h-8 w-8 sm:h-10 sm:w-10 text-black/30" />
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-black/70 mb-1">No projects found</p>
                    <p className="text-xs sm:text-sm text-black/50">Create your first project to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProjects.map((project) => (
                      <div key={project._id} onClick={() => setSelectedProject(project)} className="cursor-pointer group relative">
                        <div className="bg-white rounded-3xl p-6 border border-gray-400 transition-all duration-500 flex flex-col h-full group-hover:bg-gray-50 group-hover:border-blue-400">
                          {/* Delete Button */}
                          <div className="absolute top-3 right-3 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
                                  deleteProject(project._id);
                                }
                              }}
                              className="p-2 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                              title="Delete Project"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex-shrink-0 inline-flex p-4 rounded-2xl bg-gray-200 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-500">
                              <BuildingOfficeIcon className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xl font-semibold text-black font-plus-jakarta leading-tight mb-1 transition-colors duration-500 truncate">{project.name}</h4>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                  project.status === "active" ? "bg-green-100 text-green-700 border border-green-200" : 
                                  project.status === "completed" ? "bg-blue-100 text-blue-700 border border-blue-200" : 
                                  project.status === "pending" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : 
                                  "bg-gray-100 text-gray-700 border border-gray-200"
                                }`}>
                                  {project.status}
                                </span>
                                {project.priority && (
                                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    project.priority === "high" ? "bg-red-100 text-red-700 border border-red-200" : 
                                    project.priority === "medium" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : 
                                    "bg-green-100 text-green-700 border border-green-200"
                                  }`}>
                                    {project.priority}
                                  </span>
                                )}
                              </div>
                              <p className="text-black/70 font-inter text-sm leading-relaxed transition-colors duration-500 truncate">{project.desc}</p>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            {/* Progress Bar */}
                            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 mb-4 hover:shadow-md transition-all duration-300">
                              <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-semibold text-black font-inter">Progress</div>
                                <div className="text-sm font-bold text-black font-plus-jakarta">{project.progress}%</div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                                <div
                                  className="bg-black h-3 rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden"
                                  style={{ width: `${project.progress}%` }}
                                >
                                  {/* Animated shine effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-black/60 font-medium">
                                {project.progress === 100 ? 'Project Complete!' : 
                                 project.progress >= 75 ? 'Almost there!' :
                                 project.progress >= 50 ? 'Halfway done!' :
                                 project.progress >= 25 ? 'Getting started!' : 'Just beginning!'}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-black/60 mb-4">
                              <div className="bg-black/5 px-2 py-1 rounded-lg text-center">
                                <span className="font-semibold text-black/80">{project.documents}</span>
                                <div>Documents</div>
                              </div>
                              <div className="bg-black/5 px-2 py-1 rounded-lg text-center">
                                <span className="font-semibold text-black/80">{project.team}</span>
                                <div>Team</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button className="flex-1 bg-black text-white rounded-full px-4 py-2 text-xs font-semibold hover:bg-gray-900 transition-colors duration-200 shadow">
                              Documents
                            </button>
                            <button className="flex-1 bg-transparent border border-black text-black rounded-full px-4 py-2 text-xs font-semibold hover:bg-black hover:text-white transition-colors duration-200 shadow">
                              Team
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Team Members Section */}
              <section className="lg:col-span-1 bg-white rounded-2xl shadow border border-black/10 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-black/80 mb-4 sm:mb-6 flex items-center gap-2 font-plus-jakarta">
                  <UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" /> Team Members
                </h3>
                <div className="space-y-2 sm:space-y-3">
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
                        <div key={idx} className="group bg-gradient-to-br from-black/5 to-black/10 backdrop-blur-sm rounded-lg border border-black/10 hover:border-black/20 hover:shadow-md transition-all duration-300 p-3 sm:p-4">
                          {/* Mobile Layout - Stacked */}
                          <div className="block sm:hidden">
                            <div className="flex items-start gap-3 mb-2">
                                                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-all duration-200 flex-shrink-0">
                              {getInitials()}
                            </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-black/80 text-sm truncate mb-1">{fullName}</p>
                                <div className="flex flex-wrap gap-1 text-xs text-black/60 mb-2">
                                  <span className="bg-black/5 px-2 py-1 rounded-full capitalize">
                                    {member.role || 'Member'}
                                  </span>
                                  {member.email && (
                                    <span className="bg-black/5 px-2 py-1 rounded-full truncate">
                                      {member.email}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`w-3 h-3 rounded-full ${
                                member.status === 'online' ? 'bg-green-500' :
                                member.status === 'busy' ? 'bg-yellow-500' :
                                'bg-gray-400'
                              }`}></span>
                              {member.role === 'admin' && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold border border-purple-200">
                                  Admin
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Desktop Layout - Horizontal */}
                          <div className="hidden sm:flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-all duration-200">
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
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold border border-purple-200">
                                  Admin
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-black/50 py-8 sm:py-12">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UsersIcon className="h-8 w-8 sm:h-10 sm:w-10 text-black/30" />
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-black/70 mb-1">No team members</p>
                      <p className="text-xs sm:text-sm text-black/50">Invite your first team member</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Document Upload Section */}
            <section className="bg-white/60 backdrop-blur-md rounded-2xl shadow border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2 font-plus-jakarta">
                <CloudArrowUpIcon className="h-6 w-6 text-black/70" /> Quick Document Upload
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/40 backdrop-blur rounded-xl p-6 border border-gray-300">
                  <h4 className="text-lg font-bold text-black mb-4 flex items-center gap-2 font-plus-jakarta">
                    <DocumentIcon className="h-5 w-5 text-black/70" /> Upload New Document
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
                      <label className="block text-sm font-medium text-black/70 mb-2 font-plus-jakarta">Select Project</label>
                      <select
                        value={selectedProjectId || ""}
                        onChange={e => setSelectedProjectId(e.target.value)}
                        className="w-full border border-black/10 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20 text-sm bg-white/80 font-inter text-black/70"
                        required
                      >
                        <option value="" disabled>Select a project</option>
                        {projects.map((proj) => (
                          <option key={proj._id} value={proj._id}>{proj.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black/70 mb-2 font-plus-jakarta">Select File</label>
                      <div
                        className={`relative border-4 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 group overflow-hidden shadow-lg ${selectedFile ? 'border-green-400 bg-gradient-to-br from-green-50/80 to-white/60' : 'border-black/20 bg-gradient-to-br from-white/60 via-white/40 to-white/80 hover:from-black/5 hover:to-white/90'}`}
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
                          <div className="flex flex-col items-center gap-3 animate-fade-in">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1], rotate: [0, 8, -8, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              className="inline-flex items-center justify-center mb-2"
                            >
                              <DocumentIcon className="h-12 w-12 text-green-500 drop-shadow-lg" />
                            </motion.div>
                            <span className="font-semibold text-black font-plus-jakarta text-lg">{selectedFile.name}</span>
                            <span className="text-sm text-black/50">{selectedFile.type || 'Unknown type'} • {(selectedFile.size / 1024).toFixed(1)} KB</span>
                            <button
                              type="button"
                              className="mt-2 text-xs text-red-600 hover:underline"
                              onClick={e => { e.stopPropagation(); setSelectedFile(null); }}
                            >Remove</button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 animate-fade-in">
                            <motion.div
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                              className="inline-flex items-center justify-center mb-2"
                            >
                              <CloudArrowUpIcon className="h-14 w-14 text-black/30 group-hover:text-black/60 transition-colors duration-200 drop-shadow" />
                            </motion.div>
                            <span className="text-lg font-semibold text-black/70 font-plus-jakarta">Drag & drop your file here</span>
                            <span className="text-sm text-black/50 font-inter">or <span className="underline cursor-pointer text-black/80">click to browse</span> from your device</span>
                            <span className="mt-2 text-xs text-black/40 font-inter">Supported: PDF, DOCX, XLSX, PNG, JPG, etc.</span>
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
                      className="w-full bg-black text-white rounded-full px-6 py-3 font-semibold font-plus-jakarta hover:bg-gray-900 transition-all duration-200 disabled:opacity-60 shadow-lg text-base"
                    >
                      {uploading ? "Uploading..." : "Upload Document"}
                    </button>
                    {uploadSuccess && <div className="text-green-600 text-sm bg-green-50/80 p-3 rounded-xl font-inter">{uploadSuccess}</div>}
                    {uploadError && <div className="text-red-600 text-sm bg-red-50/80 p-3 rounded-xl font-inter">{uploadError}</div>}
                  </form>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-400">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-black flex items-center gap-2 font-plus-jakarta">
                      <DocumentCheckIcon className="h-5 w-5 text-blue-600" /> Recent Documents
                    </h4>
                    <button
                      onClick={refreshDocuments}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-200"
                      title="Refresh documents"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {filteredDocuments.slice(0, 5).map((doc, idx) => (
                      <div key={doc._id || idx} className="group bg-white rounded-2xl border border-gray-300 transition-all duration-300 p-4 flex items-center gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 inline-flex p-3 rounded-2xl bg-gray-200 text-blue-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-all duration-300`}>
                          <DocumentIcon className="h-5 w-5" />
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-black text-base font-plus-jakarta truncate mb-1">{doc.name}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-black/60 mb-1">
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-semibold">
                              {projects.find(p => p._id === (doc.projectId?._id || doc.projectId))?.name || 'Unknown Project'}
                            </span>
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full font-semibold">
                              {doc.uploadedBy || 'Unknown User'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className={`font-semibold px-2 py-1 rounded-full border ${
                              doc.status === "approved" ? "bg-green-100 text-green-700 border-green-200" :
                              doc.status === "pending" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                              doc.status === "rejected" ? "bg-red-100 text-red-700 border-red-200" :
                              "bg-gray-100 text-gray-700 border-gray-200"
                            }`}>
                              {doc.status}
                            </span>
                            <span className="text-black/50">{new Date(doc.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {/* Delete Button */}
                        <button
                          onClick={() => deleteDocument(doc._id)}
                          disabled={deleteLoading === doc._id}
                          className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                          title="Delete document"
                        >
                          {deleteLoading === doc._id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                          ) : (
                            <TrashIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                    {filteredDocuments.length === 0 && (
                      <div className="text-center text-black/50 py-8 sm:py-12">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <DocumentIcon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-black/70 mb-1">No documents yet</p>
                        <p className="text-xs sm:text-sm text-black/50">Upload your first document to get started</p>
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-black/80 flex items-center gap-3">
                  <BuildingOfficeIcon className="h-7 w-7 text-purple-600" /> 
                  Project Management
                </h2>
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-black text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 font-inter hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black w-full sm:w-auto"
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
                {/* Total Projects */}
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300 shadow">
                    <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{projects.length}</span>
                  <span className="text-sm text-black/70 font-semibold">Total Projects</span>
                </div>
                {/* Active */}
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center shadow-sm hover:shadow-lg transition-all duration-300 hover:border-green-400 hover:bg-green-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300 transition-colors duration-300 shadow">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{projects.filter(p => p.status === 'active').length}</span>
                  <span className="text-sm text-black/70 font-semibold">Active</span>
                </div>
                {/* Completed */}
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-400 hover:bg-purple-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-colors duration-300 shadow">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{projects.filter(p => p.status === 'completed').length}</span>
                  <span className="text-sm text-black/70 font-semibold">Completed</span>
                </div>
                {/* Pending */}
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center shadow-sm hover:shadow-lg transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-yellow-100 to-yellow-200 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-colors duration-300 shadow">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{projects.filter(p => p.status === 'pending').length}</span>
                  <span className="text-sm text-black/70 font-semibold">Pending</span>
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
            <section className="bg-white rounded-3xl border border-gray-300 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center">
                    <BuildingOfficeIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-black/80 font-plus-jakarta">All Projects</h3>
                    <p className="text-black/60 font-inter text-sm sm:text-base">Manage your construction projects efficiently</p>
                  </div>
                </div>
                <div className="flex sm:hidden items-center gap-3">
                  <div className="px-4 py-2 bg-black/5 rounded-full border border-black/20">
                    <span className="text-sm font-semibold text-black/80">{filteredProjects.length} Projects</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="px-4 py-2 bg-black/5 rounded-full border border-black/20">
                    <span className="text-sm font-semibold text-black/80">{filteredProjects.length} Projects</span>
                  </div>
                </div>
              </div>
              
              {filteredProjects.length === 0 ? (
                <div className="text-center text-black/50 py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BuildingOfficeIcon className="h-8 w-8 sm:h-10 sm:w-10 text-black/30" />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-black/70 mb-1">No projects found</p>
                  <p className="text-xs sm:text-sm text-black/50">Create your first project to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProjects.map((project) => (
                    <div key={project._id} onClick={() => setSelectedProject(project)} className="cursor-pointer group relative">
                      <div className="bg-white rounded-3xl p-6 border border-gray-400 transition-all duration-500 flex flex-col h-full group-hover:bg-gray-50 group-hover:border-blue-400">
                        {/* Delete Button */}
                        <div className="absolute top-3 right-3 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
                                deleteProject(project._id);
                              }
                            }}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                            title="Delete Project"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex-shrink-0 inline-flex p-4 rounded-2xl bg-gray-200 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-500">
                            <BuildingOfficeIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xl font-semibold text-black font-plus-jakarta leading-tight mb-1 transition-colors duration-500 truncate">{project.name}</h4>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                project.status === "active" ? "bg-green-100 text-green-700 border border-green-200" : 
                                project.status === "completed" ? "bg-blue-100 text-blue-700 border border-blue-200" : 
                                project.status === "pending" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : 
                                "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}>
                                {project.status}
                              </span>
                              {project.priority && (
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                  project.priority === "high" ? "bg-red-100 text-red-700 border border-red-200" : 
                                  project.priority === "medium" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : 
                                  "bg-green-100 text-green-700 border border-green-200"
                                }`}>
                                  {project.priority}
                                </span>
                              )}
                            </div>
                            <p className="text-black/70 font-inter text-sm leading-relaxed transition-colors duration-500 truncate">{project.desc}</p>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          {/* Progress Bar */}
                          <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 mb-4 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-sm font-semibold text-black font-inter">Progress</div>
                              <div className="text-sm font-bold text-black font-plus-jakarta">{project.progress}%</div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                              <div
                                className="bg-black h-3 rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden"
                                style={{ width: `${project.progress}%` }}
                              >
                                {/* Animated shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-black/60 font-medium">
                              {project.progress === 100 ? 'Project Complete!' : 
                               project.progress >= 75 ? 'Almost there!' :
                               project.progress >= 50 ? 'Halfway done!' :
                               project.progress >= 25 ? 'Getting started!' : 'Just beginning!'}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-black/60 mb-4">
                            <div className="bg-black/5 px-2 py-1 rounded-lg text-center">
                              <span className="font-semibold text-black/80">{project.documents}</span>
                              <div>Documents</div>
                            </div>
                            <div className="bg-black/5 px-2 py-1 rounded-lg text-center">
                              <span className="font-semibold text-black/80">{project.team}</span>
                              <div>Team</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 bg-black text-white rounded-full px-4 py-2 text-xs font-semibold hover:bg-gray-900 transition-colors duration-200 shadow">
                            Documents
                          </button>
                          <button className="flex-1 bg-transparent border border-black text-black rounded-full px-4 py-2 text-xs font-semibold hover:bg-black hover:text-white transition-colors duration-200 shadow">
                            Team
                          </button>
                        </div>
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-black/80 flex items-center gap-3">
                  <DocumentIcon className="h-7 w-7 text-blue-600" /> 
                  Document Management
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={refreshDocuments}
                    className="bg-transparent border-2 border-black text-black px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 font-inter hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black w-full sm:w-auto"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    Refresh
                  </button>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="bg-black text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 font-inter hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black w-full sm:w-auto"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Upload Document
                  </button>
                </div>
              </div>
            </section>

            {/* Document Analytics Overview */}
            <section className="bg-white rounded-2xl border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                <ChartBarIcon className="h-6 w-6 text-purple-600" /> Document Analytics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300">
                    <DocumentIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{documents.length}</span>
                  <span className="text-sm text-black/70 font-semibold">Total Documents</span>
                </div>
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-green-400 hover:bg-green-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300 transition-colors duration-300">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{documents.filter(d => d.status === 'approved').length}</span>
                  <span className="text-sm text-black/70 font-semibold">Approved</span>
                </div>
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-yellow-100 to-yellow-200 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-colors duration-300">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{documents.filter(d => d.status === 'pending').length}</span>
                  <span className="text-sm text-black/70 font-semibold">Pending</span>
                </div>
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-red-400 hover:bg-red-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-red-100 to-red-200 group-hover:from-red-200 group-hover:to-red-300 transition-colors duration-300">
                    <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{documents.filter(d => d.status === 'rejected').length}</span>
                  <span className="text-sm text-black/70 font-semibold">Rejected</span>
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
            <section className="bg-white rounded-3xl border border-gray-300 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center">
                    <DocumentDuplicateIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-black/80 font-plus-jakarta">All Documents</h3>
                    <p className="text-black/60 font-inter text-sm sm:text-base">Manage your construction documents efficiently</p>
                  </div>
                </div>
                <div className="flex sm:hidden items-center gap-3">
                  <div className="px-4 py-2 bg-black/5 rounded-full border border-black/20">
                    <span className="text-sm font-semibold text-black/80">{filteredDocuments.length} Documents</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="px-4 py-2 bg-black/5 rounded-full border border-black/20">
                    <span className="text-sm font-semibold text-black/80">{filteredDocuments.length} Documents</span>
                  </div>
                </div>
              </div>
              
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 sm:py-16 lg:py-20">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <DocumentIcon className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-gray-400" />
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-black/70 mb-2 font-plus-jakarta">No documents found</h4>
                  <p className="text-black/50 font-inter text-sm sm:text-base">Upload your first construction document to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {filteredDocuments.map((doc, idx) => (
                    <div key={doc._id || idx} className="group bg-white border-2 border-gray-200 rounded-3xl p-4 sm:p-6 lg:p-8 hover:border-black/30 hover:bg-black/5 transition-all duration-300 flex flex-col h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4 sm:mb-6 gap-3">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-black/10 to-black/20 rounded-2xl flex items-center justify-center group-hover:from-black/20 group-hover:to-black/30 transition-all duration-300 flex-shrink-0">
                            <DocumentIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-black/80" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-black/80 text-base sm:text-lg lg:text-xl mb-1 sm:mb-2 font-plus-jakarta truncate">{doc.name}</h4>
                            <p className="text-xs sm:text-sm lg:text-base text-black/60 font-inter truncate">{doc.type}</p>
                          </div>
                        </div>
                        <span className={`text-xs sm:text-sm lg:text-base font-bold px-2 sm:px-3 py-1 sm:py-2 rounded-full border flex-shrink-0 ${
                          doc.status === "approved" ? "bg-green-100 text-green-700 border-green-200" : 
                          doc.status === "pending" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : 
                          doc.status === "rejected" ? "bg-red-100 text-red-700 border-red-200" : 
                          "bg-gray-100 text-gray-700 border-gray-200"
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      
                      {/* Document Info */}
                      <div className="space-y-3 mb-6">
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <div className="text-xs text-black/60 font-inter font-semibold mb-1">Project:</div>
                          <div className="font-semibold text-black/80 text-sm break-words leading-relaxed">
                            {projects.find(p => p._id === (doc.projectId?._id || doc.projectId))?.name || 'Unknown'}
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <div className="text-xs text-black/60 font-inter font-semibold mb-1">Uploaded by:</div>
                          <div className="font-semibold text-black/80 text-sm break-words leading-relaxed">{doc.uploadedBy}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <div className="text-xs text-black/60 font-inter font-semibold mb-1">Date:</div>
                          <div className="font-semibold text-black/80 text-sm break-words leading-relaxed">{doc.date}</div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 mt-auto">
                        <button className="w-full bg-black text-white px-4 py-3 rounded-full text-sm font-semibold hover:bg-gray-900 hover:scale-105 transition-all duration-300 font-inter shadow-lg hover:shadow-xl">
                          View Document
                        </button>
                        <button className="w-full bg-transparent border-2 border-black text-black px-4 py-3 rounded-full text-sm font-semibold hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 font-inter shadow-lg hover:shadow-xl">
                          Download
                        </button>
                        <button 
                          onClick={() => deleteDocument(doc._id)}
                          disabled={deleteLoading === doc._id}
                          className="w-full bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-full text-sm font-semibold hover:bg-red-100 hover:border-red-300 hover:text-red-700 hover:scale-105 transition-all duration-300 font-inter shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteLoading === doc._id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                          ) : (
                            <TrashIcon className="h-4 w-4" />
                          )}
                          {deleteLoading === doc._id ? 'Deleting...' : 'Delete'}
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-black/80 flex items-center gap-3">
                  <UsersIcon className="h-7 w-7 text-green-600" /> 
                  Team Management
                </h2>
                <button
                  onClick={() => setInviteModalOpen(true)}
                  className="px-6 py-3 rounded-full font-semibold border-2 border-black text-black bg-transparent hover:bg-black hover:text-white transition-all duration-200 flex items-center gap-2 font-inter focus:outline-none focus:ring-4 focus:ring-black/20"
                >
                  <UsersIcon className="h-5 w-5" /> Invite Team
                </button>
              </div>
            </section>

            {/* Team Analytics Overview */}
            <section className="bg-white rounded-2xl border border-black/10 p-6">
              <h3 className="text-xl font-bold text-black/80 mb-6 flex items-center gap-2">
                <ChartBarIcon className="h-6 w-6 text-green-600" /> Team Analytics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-green-400 hover:bg-green-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300 transition-colors duration-300">
                    <UsersIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{teamMembers.length}</span>
                  <span className="text-sm text-black/70 font-semibold">Total Members</span>
                </div>
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300">
                    <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{projects.length}</span>
                  <span className="text-sm text-black/70 font-semibold">Active Projects</span>
                </div>
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-purple-400 hover:bg-purple-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-colors duration-300">
                    <DocumentIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{documents.length}</span>
                  <span className="text-sm text-black/70 font-semibold">Documents</span>
                </div>
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-yellow-100 to-yellow-200 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-colors duration-300">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{Object.values(tasksByProject).reduce((acc: number, t) => acc + (Array.isArray(t) ? t.length : 0), 0)}</span>
                  <span className="text-sm text-black/70 font-semibold">Total Tasks</span>
                </div>
              </div>
            </section>

            {/* Team Members Grid */}
            <section className="bg-white rounded-3xl border border-gray-300 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center">
                    <UserGroupIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-black/80 font-plus-jakarta">All Team Members</h3>
                    <p className="text-black/60 font-inter text-sm sm:text-base">Manage your construction team efficiently</p>
                  </div>
                </div>
                <div className="flex sm:hidden items-center gap-3">
                  <div className="px-4 py-2 bg-black/5 rounded-full border border-black/20">
                    <span className="text-sm font-semibold text-black/80">{teamMembers.length} Members</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="px-4 py-2 bg-black/5 rounded-full border border-black/20">
                    <span className="text-sm font-semibold text-black/80">{teamMembers.length} Members</span>
                  </div>
                </div>
              </div>
              
              {teamMembers.length === 0 ? (
                <div className="text-center py-12 sm:py-16 lg:py-20">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <UsersIcon className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-gray-400" />
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-black/70 mb-2 font-plus-jakarta">No team members found</h4>
                  <p className="text-black/50 font-inter text-sm sm:text-base">Invite your first team member to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
                      <div key={idx} className="group bg-white border-2 border-gray-200 rounded-3xl p-4 sm:p-6 lg:p-8 hover:border-black/30 hover:bg-black/5 transition-all duration-300 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4 sm:mb-6 gap-3">
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-tr from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-sm sm:text-base lg:text-lg font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0">
                              {getInitials()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-black/80 text-base sm:text-lg lg:text-xl mb-1 sm:mb-2 font-plus-jakarta break-words leading-relaxed">{fullName}</h4>
                              <p className="text-xs sm:text-sm lg:text-base text-black/60 font-inter break-words leading-relaxed">{member.email}</p>
                            </div>
                          </div>
                        </div>
                        {/* Role Management */}
                        {isOwnerOrAdmin && !isCurrentUser && (
                          <div className="space-y-3 mb-6">
                            <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                              <div className="text-xs text-red-800 font-inter font-semibold mb-2">Manage Role:</div>
                              <div className="flex flex-col sm:flex-row gap-2">
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
                                  className="flex-1 border border-red-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
                                  disabled={roleUpdateLoading === member._id}
                                >
                                  <option value="admin">Admin</option>
                                  <option value="member">Member</option>
                                </select>
                                <button
                                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
                                  onClick={() => setRemoveMemberModal({open: true, member})}
                                  disabled={removeLoading}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            {roleError && <div className="text-red-500 text-xs p-2 bg-red-50 rounded-lg">{roleError}</div>}
                          </div>
                        )}
                        {/* Member Info */}
                        <div className="space-y-3 mb-6">
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <div className="text-xs text-black/60 font-inter font-semibold mb-1">Role:</div>
                            <div className="font-semibold text-black/80 text-sm break-words leading-relaxed">
                              {member.role || 'Member'}
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <div className="text-xs text-black/60 font-inter font-semibold mb-1">Status:</div>
                            <div className="font-semibold text-black/80 text-sm break-words leading-relaxed">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                member.status === 'online' ? 'bg-green-100 text-green-700' :
                                member.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {member.status || 'offline'}
                              </span>
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <div className="text-xs text-black/60 font-inter font-semibold mb-1">Active Projects:</div>
                            <div className="font-semibold text-black/80 text-sm break-words leading-relaxed">
                              {projects.filter(p => p.members?.some((m: any) => m._id === member._id || m.email === member.email)).length} projects
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <div className="text-xs text-black/60 font-inter font-semibold mb-1">Documents Uploaded:</div>
                            <div className="font-semibold text-black/80 text-sm break-words leading-relaxed">
                              {documents.filter(d => d.uploadedBy === fullName || d.uploadedBy === member.email).length} documents
                            </div>
                          </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 mt-auto">
                          <button className="w-full bg-black text-white px-4 py-3 rounded-full text-sm font-semibold hover:bg-gray-900 hover:scale-105 transition-all duration-300 font-inter shadow-lg hover:shadow-xl">
                            View Profile
                          </button>
                          <button className="w-full bg-transparent border-2 border-black text-black px-4 py-3 rounded-full text-sm font-semibold hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 font-inter shadow-lg hover:shadow-xl">
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
            <section className="bg-white rounded-2xl border border-black/10 p-6">
              <h2 className="text-2xl font-bold text-black/80 mb-6 flex items-center gap-3">
                <ChartBarIcon className="h-7 w-7 text-purple-600" /> 
                Construction Analytics Dashboard
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-purple-400 hover:bg-purple-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-colors duration-300">
                    <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{projects.length}</span>
                  <span className="text-sm text-black/70 font-semibold">Total Projects</span>
                  <span className="text-xs text-purple-500 mt-1">{activeProjects} Active</span>
                </div>
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300">
                    <DocumentIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{totalDocuments}</span>
                  <span className="text-sm text-black/70 font-semibold">Documents</span>
                  <span className="text-xs text-blue-500 mt-1">{approvedDocuments} Approved</span>
                </div>
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-green-400 hover:bg-green-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300 transition-colors duration-300">
                    <UsersIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{teamMembers.length}</span>
                  <span className="text-sm text-black/70 font-semibold">Team Members</span>
                  <span className="text-xs text-green-500 mt-1">Active Users</span>
                </div>
                <div className="group bg-white border-2 border-gray-300 rounded-3xl p-6 flex flex-col items-center transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-50/40">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-4 bg-gradient-to-tr from-yellow-100 to-yellow-200 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-colors duration-300">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <span className="text-3xl font-extrabold text-black mb-1 font-plus-jakarta">{totalTasks}</span>
                  <span className="text-sm text-black/70 font-semibold">Total Tasks</span>
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
            <section className="bg-white rounded-3xl border border-gray-400 p-6">
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3 font-plus-jakarta">
                <Cog6ToothIcon className="h-7 w-7 text-purple-600" /> 
                Account Settings & Preferences
              </h2>
            </section>

            {/* User Profile Section */}
            {user && (
              <section className="bg-white rounded-3xl border border-gray-400 p-6">
                <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2 font-plus-jakarta">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" /> Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Profile Card */}
                  <div className="bg-transparent rounded-xl p-6 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-black font-plus-jakarta">{user.firstName} {user.lastName}</h4>
                        <p className="text-black/70 font-medium">{user.email || user.id}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          Account Owner
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-gray-200">
                        <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-black/70">Company ID</p>
                          <p className="font-semibold text-black">{user.companyId}</p>
                        </div>
                      </div>
                      {user.businessType && (
                        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-gray-200">
                          <WrenchScrewdriverIcon className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="text-sm text-black/70">Business Type</p>
                            <p className="font-semibold text-black">{user.businessType}</p>
                          </div>
                        </div>
                      )}
                      {user.country && (
                        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-gray-200">
                          <GlobeAltIcon className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm text-black/70">Country</p>
                            <p className="font-semibold text-black">{user.country}</p>
                          </div>
                        </div>
                      )}
                      {user.constructionVolume && (
                        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-gray-200">
                          <ChartBarIcon className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-black/70">Construction Volume</p>
                            <p className="font-semibold text-black">{user.constructionVolume}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="space-y-4">
                    <div className="bg-transparent rounded-xl p-6 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200">
                      <h4 className="text-lg font-bold text-black mb-4 flex items-center gap-2 font-plus-jakarta">
                        <CheckBadgeIcon className="h-5 w-5 text-green-600" /> Account Status
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-black/70">Account Type</span>
                          <span className="font-semibold text-black">Active</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-black/70">Last Login</span>
                          <span className="font-semibold text-black">Today</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-black/70">Member Since</span>
                          <span className="font-semibold text-black">2024</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-transparent rounded-xl p-6 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200">
                      <h4 className="text-lg font-bold text-black mb-4 flex items-center gap-2 font-plus-jakarta">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-600" /> Danger Zone
                      </h4>
                      <p className="text-sm text-black/70 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <button
                        className="bg-transparent border-2 border-red-500 text-red-700 px-6 py-3 rounded-full font-semibold hover:bg-red-500 hover:text-white transition-all duration-200 w-full sm:w-auto disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={() => handleLogout(setLogoutLoading)}
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
            <section className="bg-white rounded-3xl border border-gray-400 p-6">
              <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2 font-plus-jakarta">
                <ChartPieIcon className="h-6 w-6 text-yellow-600" /> Subscription & Billing
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Current Plan */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-center gap-3 mb-4">
                    <ChartPieIcon className="h-8 w-8 text-yellow-600" />
                    <div>
                      <h4 className="text-xl font-bold text-yellow-700 font-plus-jakarta">Current Plan</h4>
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
                  <h4 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2 font-plus-jakarta">
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
                      className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 ${
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
            <section className="bg-white rounded-3xl border border-gray-400 p-6">
              <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2 font-plus-jakarta">
                <ShieldCheckIcon className="h-6 w-6 text-green-600" /> Security & Privacy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-transparent rounded-xl p-6 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <LockClosedIcon className="h-6 w-6 text-green-600" />
                    <h4 className="text-lg font-bold text-black font-plus-jakarta">Password</h4>
                  </div>
                  <p className="text-sm text-black/70 mb-4">Update your password to keep your account secure.</p>
                  <button className="bg-transparent border-2 border-green-500 text-green-700 px-6 py-3 rounded-full font-semibold hover:bg-green-500 hover:text-white transition-all duration-200 w-full sm:w-auto">
                    Change Password
                  </button>
                </div>

                <div className="bg-transparent rounded-xl p-6 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <DocumentDuplicateIcon className="h-6 w-6 text-blue-600" />
                    <h4 className="text-lg font-bold text-black font-plus-jakarta">Privacy</h4>
                  </div>
                  <p className="text-sm text-black/70 mb-4">Manage your privacy settings and data preferences.</p>
                  <button className="bg-transparent border-2 border-blue-500 text-blue-700 px-6 py-3 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition-all duration-200 w-full sm:w-auto">
                    Privacy Settings
                  </button>
                </div>

                <div className="bg-transparent rounded-xl p-6 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
                    <h4 className="text-lg font-bold text-black font-plus-jakarta">Notifications</h4>
                  </div>
                  <p className="text-sm text-black/70 mb-4">Configure your notification preferences.</p>
                  <button className="bg-transparent border-2 border-purple-500 text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-all duration-200 w-full sm:w-auto">
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
            {/* Calendar Header with Stats */}
            <section className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-transparent border-2 border-pink-500 flex items-center justify-center shadow-lg">
                    <CalendarIcon className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-black font-plus-jakarta">Calendar & Deadlines</h2>
                    <p className="text-black/60 text-sm">Manage your project timelines and task deadlines</p>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-transparent rounded-2xl px-4 py-3 border-2 border-green-500">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-transparent border-2 border-green-500 flex items-center justify-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-green-700 font-medium">Completed</p>
                        <p className="text-lg font-bold text-green-800">
                          {Object.values(tasksByProject).flat().filter((task: any) => task.status === 'completed').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-transparent rounded-2xl px-4 py-3 border-2 border-blue-500">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-transparent border-2 border-blue-500 flex items-center justify-center">
                        <ClockIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Pending</p>
                        <p className="text-lg font-bold text-blue-800">
                          {Object.values(tasksByProject).flat().filter((task: any) => task.status === 'pending').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-transparent rounded-2xl px-4 py-3 border-2 border-orange-500">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-transparent border-2 border-orange-500 flex items-center justify-center">
                        <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-orange-700 font-medium">Overdue</p>
                        <p className="text-lg font-bold text-orange-800">
                          {Object.values(tasksByProject).flat().filter((task: any) => 
                            task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
                          ).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Add Task
                  </button>
                  <button className="px-4 py-2 rounded-full border-2 border-gray-300 text-black font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2">
                    <FunnelIcon className="h-4 w-4" />
                    Filter
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
                    <ChevronLeftIcon className="h-5 w-5 text-black/60" />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-black">Today</span>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
                    <ChevronRightIcon className="h-5 w-5 text-black/60" />
                  </button>
                </div>
              </div>
            </section>

            {/* Main Calendar Section */}
            <section className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Calendar Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                  {/* View Selector */}
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <h3 className="text-sm font-semibold text-black mb-3">Calendar Views</h3>
                    <div className="space-y-2">
                      {['Month', 'Week', 'Day', 'Agenda'].map((view) => (
                        <button
                          key={view}
                          className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white hover:shadow-sm"
                        >
                          {view} View
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Filter */}
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <h3 className="text-sm font-semibold text-black mb-3">Projects</h3>
                    <div className="space-y-2">
                      {projects.map((project, index) => (
                        <label key={project._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-all duration-200 cursor-pointer">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: PROJECT_COLORS[index % PROJECT_COLORS.length] }}
                          />
                          <span className="text-sm text-black/80">{project.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
                    <h3 className="text-sm font-semibold text-purple-800 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-purple-700 hover:bg-white hover:shadow-sm transition-all duration-200">
                        📅 Schedule Meeting
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-purple-700 hover:bg-white hover:shadow-sm transition-all duration-200">
                        ⏰ Set Reminder
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-purple-700 hover:bg-white hover:shadow-sm transition-all duration-200">
                        📊 Export Calendar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Calendar */}
                <div className="xl:col-span-3">
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <CalendarView
                      tasksByProject={tasksByProject}
                      projects={projects}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Upcoming Deadlines */}
            <section className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2 font-plus-jakarta">
                <ClockIcon className="h-6 w-6 text-orange-600" />
                Upcoming Deadlines
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(tasksByProject).flatMap(([projectId, tasks]: [string, any]) => 
                  (tasks as any[])
                    .filter((task: any) => task.dueDate && new Date(task.dueDate) >= new Date())
                    .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 6)
                    .map((task: any) => {
                      const project = projects.find(p => p._id === projectId);
                      const daysUntil = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      const isOverdue = new Date(task.dueDate) < new Date();
                      
                      return (
                        <div key={task._id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-black text-sm line-clamp-2">{task.title}</h4>
                              <p className="text-xs text-black/60 mt-1">{project?.name}</p>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {task.priority}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-black/40" />
                              <span className={`text-sm font-medium ${
                                isOverdue ? 'text-red-600' : daysUntil <= 3 ? 'text-orange-600' : 'text-black/70'
                              }`}>
                                {isOverdue ? 'Overdue' : daysUntil === 0 ? 'Today' : `${daysUntil} days`}
                              </span>
                            </div>
                            <button className="px-3 py-1 rounded-full bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-all duration-200">
                              View
                            </button>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
              
              {Object.values(tasksByProject).flat().filter((task: any) => task.dueDate && new Date(task.dueDate) >= new Date()).length === 0 && (
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-black/60 mb-2">No upcoming deadlines</h4>
                  <p className="text-sm text-black/40">Tasks with due dates will appear here</p>
                </div>
              )}
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-inter">
      {/* Mobile Header - Always Visible */}
      <header className="md:hidden bg-white border-b border-black/10 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
              <BuildingOfficeIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-black font-plus-jakarta">BuildStack</span>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-transparent border-2 border-black/20 text-black hover:bg-black/5 hover:border-black/40 transition-all duration-300 backdrop-blur-sm"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile Sidebar Header */}
        <div className="bg-black px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
              <BuildingOfficeIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-plus-jakarta">BuildStack</h1>
              <p className="text-white/70 text-xs font-inter">Construction Docs</p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-1 overflow-y-auto py-3 px-3">
          {/* User Profile Section - Compact */}
          {user && (
            <div className="mb-4 p-3 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-black text-sm truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-black/60 text-xs truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items - Compact spacing */}
          <div className="space-y-1 mb-4">
            {navItems.map((item) => (
              <button
                key={item.tab}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 font-semibold group relative overflow-hidden ${
                  activeTab === item.tab 
                    ? 'bg-black text-white shadow-lg transform scale-[1.01]' 
                    : 'text-black/70 hover:bg-gray-100 hover:text-black'
                } ${tabLoading && loadingTab === item.tab ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  handleTabChange(item.tab);
                  setMobileMenuOpen(false);
                }}
                disabled={tabLoading}
              >
                {/* Icon - Modern and impactful */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                  activeTab === item.tab 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-black/60 group-hover:bg-gray-200 group-hover:text-black'
                }`}>
                  {React.cloneElement(item.icon, {
                    className: `h-4 w-4 transition-all duration-300 ${
                      activeTab === item.tab 
                        ? 'text-white' 
                        : 'text-black/60 group-hover:text-black'
                    }`
                  })}
                </div>
                
                {/* Text */}
                <span className="font-semibold text-sm">{item.name}</span>
                
                {/* Active Indicator */}
                {activeTab === item.tab && (
                  <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Quick Actions - Compact */}
          <div className="mb-3 p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <h3 className="text-xs font-semibold text-blue-800 mb-2 font-plus-jakarta">Quick Actions</h3>
            <div className="space-y-1">
              <button 
                onClick={() => {
                  setModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-blue-700 hover:bg-white hover:shadow-sm transition-all duration-200"
              >
                <PlusIcon className="h-3 w-3" />
                New Project
              </button>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-blue-700 hover:bg-white hover:shadow-sm transition-all duration-200">
                <DocumentIcon className="h-3 w-3" />
                Upload Document
              </button>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-blue-700 hover:bg-white hover:shadow-sm transition-all duration-200">
                <UsersIcon className="h-3 w-3" />
                Invite Team
              </button>
            </div>
          </div>

          {/* Stats Summary - Compact */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-800 font-plus-jakarta">{projects.length}</div>
              <div className="text-xs text-green-700 font-medium">Projects</div>
            </div>
            <div className="p-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-lg font-bold text-purple-800 font-plus-jakarta">{documents.length}</div>
              <div className="text-xs text-purple-700 font-medium">Documents</div>
            </div>
          </div>

          {/* Additional Stats for better mobile visibility */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <div className="text-lg font-bold text-orange-800 font-plus-jakarta">{teamMembers.length}</div>
              <div className="text-xs text-orange-700 font-medium">Team</div>
            </div>
            <div className="p-2 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
              <div className="text-lg font-bold text-yellow-800 font-plus-jakarta">{Object.values(tasksByProject).reduce((acc: number, t) => acc + (Array.isArray(t) ? t.length : 0), 0)}</div>
              <div className="text-xs text-yellow-700 font-medium">Tasks</div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Footer */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => {
              handleLogout(setLogoutLoading);
              setMobileMenuOpen(false);
            }}
            disabled={logoutLoading}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-200 font-semibold text-sm"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            {logoutLoading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block bg-white border-r border-black/10 w-72 flex-shrink-0 sticky top-0 z-30 h-screen flex flex-col items-stretch px-0 pt-0 shadow-sm">
        {/* Logo/Header Section */}
        <div className="w-full">
          <div className="w-full bg-black flex items-center justify-center gap-3 px-0 py-4 border-b border-black" style={{marginTop:0,marginLeft:0}}>
            <div className="w-10 h-10 flex items-center justify-center">
              <BuildingOfficeIcon className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight font-plus-jakarta">BuildStack</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4 items-stretch w-full pt-6 px-6">
          {/* Navigation Items */}
          <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-full">
            {navItems.map((item) => (
              <button
                key={item.tab}
                className={`sidebar-item sidebar-glow flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold group relative overflow-hidden font-inter w-full ${
                  activeTab === item.tab 
                    ? `sidebar-active-state sidebar-active text-black shadow-xl transform scale-[1.02] backdrop-blur-sm` 
                    : `text-black/70 hover:bg-black/5 hover:shadow-lg hover:scale-[1.01] border-2 border-transparent hover:border-black/20`
                } ${tabLoading && loadingTab === item.tab ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleTabChange(item.tab)}
                aria-current={activeTab === item.tab ? "page" : undefined}
                disabled={tabLoading}
                style={{ minHeight: 0 }}
              >
                {/* Smart Active Border Indicator */}
                {activeTab === item.tab && (
                  <>
                    {/* Left border indicator with animation */}
                    <div className="sidebar-border-active absolute left-0 top-0 bottom-0 w-1 bg-black rounded-r-full shadow-sm" />
                    {/* Top glow effect */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-black/30 to-transparent" />
                    {/* Bottom glow effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent" />
                  </>
                )}
                
                {/* Icon with enhanced styling */}
                <div className={`flex items-center justify-center transition-all duration-300 relative z-10 ${activeTab === item.tab ? 'sidebar-icon-active' : ''}`} style={{ minWidth: 32, minHeight: 32 }}>
                  {React.cloneElement(item.icon, {
                      className: `transition-all duration-300 h-5 w-5 ${
                        activeTab === item.tab 
                          ? 'text-black scale-110 drop-shadow-sm' 
                          : 'text-black/70 group-hover:text-black group-hover:scale-105 drop-shadow-sm'
                      }`
                  })}
                </div>
                
                {/* Text with animation */}
                <span className={`font-semibold font-inter text-base relative z-10 ${activeTab === item.tab ? 'sidebar-text-active' : ''}`}>{item.name}</span>
                
                {/* Yes/Check icon for SaaS impact, always same distance from right border */}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <CheckCircleIcon className="h-5 w-5 text-black opacity-80" />
                </span>
                
                {/* Enhanced Hover and Active Effects */}
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  activeTab === item.tab 
                    ? 'bg-gradient-to-r from-white/40 via-white/20 to-transparent shadow-inner' 
                    : 'group-hover:bg-gradient-to-r from-white/30 via-white/10 to-transparent'
                }`} />
                
                {/* Subtle pulse animation for active state */}
                {activeTab === item.tab && (
                  <div className="absolute inset-0 rounded-2xl bg-black/5 animate-pulse" />
                )}
              </button>
            ))}
          </div>
          
          {/* Bottom Spacing */}
          <div className="flex-1"></div>
          
          {/* User Profile Section */}
          <div className="mt-6">
            {user && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
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
          {/* Desktop Layout - Search on left, actions on right */}
          <div className="hidden md:flex items-center justify-between gap-4">
            {/* Left side - Search bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40" />
                <input
                  type="text"
                  placeholder="Search projects, documents, or anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-black/10 bg-white shadow focus:outline-none focus:border-black focus:ring-2 focus:ring-black text-base font-inter transition-all duration-200 text-black"
                  style={{ fontWeight: 500 }}
                />
              </div>
            </div>

            {/* Center - Search filters */}
            <div className="flex items-center gap-3">
              <select
                value={searchType}
                onChange={e => setSearchType(e.target.value)}
                className="rounded-full px-4 py-2 border border-black/10 bg-white shadow text-sm font-inter focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              >
                <option value="all">All</option>
                <option value="projects">Projects</option>
                <option value="documents">Documents</option>
              </select>
              {/* Advanced filters for documents */}
              {searchType === "documents" && (
                <>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="rounded-full px-4 py-2 border border-black/10 bg-white shadow text-sm font-inter focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
                    className="rounded-full px-4 py-2 border border-black/10 bg-white shadow text-sm font-inter focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 w-32"
                  />
                  <input
                    type="date"
                    value={filterDate}
                    onChange={e => setFilterDate(e.target.value)}
                    className="rounded-full px-4 py-2 border border-black/10 bg-white shadow text-sm font-inter focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 w-36"
                  />
                  <button
                    type="button"
                    className="text-xs text-gray-500 hover:underline ml-1 px-2 py-1 rounded-full"
                    onClick={() => { setFilterStatus(""); setFilterUploader(""); setFilterDate(""); }}
                  >
                    Clear
                  </button>
                </>
              )}
            </div>

            {/* Right side - New button and user profile */}
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 rounded-full font-semibold border-2 border-black text-black bg-transparent hover:bg-black hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black text-sm flex items-center gap-2"
                onClick={() => setModalOpen(true)}
              >
                <PlusIcon className="h-4 w-4" /> 
                New
              </button>
              {/* User Profile Avatar & Dropdown */}
              <div className="relative" ref={profileRef}>
                {user ? (
                  <>
                    <button
                      className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 text-white text-base font-bold shadow-lg border-4 border-white focus:outline-none focus:ring-2 focus:ring-black hover:scale-105 transition-all duration-200 flex items-center justify-center"
                      onClick={() => setProfileDropdownOpen((open) => !open)}
                      aria-label="User profile"
                    >
                      {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                    </button>
                    {/* Dropdown */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-black/10 rounded-2xl shadow-xl p-5 z-50 flex flex-col items-center animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 text-white text-3xl font-bold shadow-lg border-4 border-white flex items-center justify-center mb-2">
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
                          onClick={() => handleLogout(setLogoutLoading)}
                          disabled={logoutLoading}
                        >
                          {logoutLoading ? 'Logging out...' : 'Logout'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-bold shadow-lg border-2 border-white" />
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Layout - Stacked layout */}
          <div className="md:hidden">
            {/* Top row - Search bar */}
            <div className="relative mb-3">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40" />
              <input
                type="text"
                placeholder="Search projects, documents, or anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-black/10 bg-white shadow focus:outline-none focus:border-black focus:ring-2 focus:ring-black text-base font-inter transition-all duration-200 text-black"
                style={{ fontWeight: 500 }}
              />
            </div>
            
            {/* Bottom row - Filters and actions */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <select
                  value={searchType}
                  onChange={e => setSearchType(e.target.value)}
                  className="rounded-full px-3 py-2 border border-black/10 bg-white shadow text-sm font-inter focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                >
                  <option value="all">All</option>
                  <option value="projects">Projects</option>
                  <option value="documents">Documents</option>
                </select>
                {/* Collapsible advanced filters for documents */}
                {searchType === "documents" && (
                  <details className="relative">
                    <summary className="cursor-pointer text-sm text-black/60 px-2 py-1 select-none">Filters</summary>
                    <div className="absolute top-full left-0 mt-1 bg-white border border-black/10 rounded-lg shadow-lg p-3 z-40 min-w-48">
                      <div className="flex flex-col gap-2">
                        <select
                          value={filterStatus}
                          onChange={e => setFilterStatus(e.target.value)}
                          className="rounded-full px-3 py-2 border border-black/10 bg-white shadow text-sm font-inter focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 w-full"
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
                          className="rounded-full px-3 py-2 border border-black/10 bg-white shadow text-sm font-inter focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 w-full"
                        />
                        <input
                          type="date"
                          value={filterDate}
                          onChange={e => setFilterDate(e.target.value)}
                          className="rounded-full px-3 py-2 border border-black/10 bg-white shadow text-sm font-inter focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 w-full"
                        />
                        <button
                          type="button"
                          className="text-xs text-gray-500 hover:underline px-2 py-1 rounded-full text-left"
                          onClick={() => { setFilterStatus(""); setFilterUploader(""); setFilterDate(""); }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </details>
                )}
              </div>
              
              {/* Mobile actions */}
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-2 bg-black text-white rounded-full font-semibold shadow hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black text-sm flex items-center gap-1"
                  onClick={() => setModalOpen(true)}
                >
                  <PlusIcon className="h-4 w-4" /> 
                  New
                </button>
                {/* Mobile user profile */}
                <div className="relative" ref={profileRef}>
                  {user ? (
                    <>
                      <button
                        className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 text-white text-sm font-bold shadow-lg border-4 border-white focus:outline-none focus:ring-2 focus:ring-black flex items-center justify-center"
                        onClick={() => setProfileDropdownOpen((open) => !open)}
                        aria-label="User profile"
                      >
                        {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                      </button>
                      {/* Mobile dropdown */}
                      {profileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-black/10 rounded-2xl shadow-xl p-4 z-50 flex flex-col items-center animate-fade-in">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 text-white text-xl font-bold shadow-lg border-4 border-white flex items-center justify-center mb-2">
                            {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                          </div>
                          <div className="text-base font-semibold text-black/80 mb-1 text-center" style={{ fontFamily: 'var(--font-plus-jakarta)' }}>{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-blue-700 font-medium bg-blue-100 rounded px-2 py-0.5 mb-2 text-center" style={{ fontFamily: 'var(--font-inter)' }}>{user.email || user.id}</div>
                          <button
                            className="w-full bg-black text-white px-3 py-2 rounded-lg font-semibold shadow hover:bg-gray-900 transition-all duration-200 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-black/30 text-sm"
                            onClick={() => handleLogout(setLogoutLoading)}
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
                  className="px-6 py-3 rounded-full font-semibold border-2 border-black text-black bg-transparent hover:bg-black hover:text-white transition-all duration-200 flex items-center gap-2 font-inter focus:outline-none focus:ring-4 focus:ring-black/20"
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
                  className="flex-1 px-4 py-3 rounded-full font-semibold border-2 border-black text-black bg-transparent hover:bg-black hover:text-white transition-all duration-200 flex items-center justify-center gap-2 text-sm font-inter focus:outline-none focus:ring-4 focus:ring-black/20"
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
            console.log('🎯 Dashboard: Adding project to state:', project.name);
            // The modal already handles the API call, just add to local state
            setProjects(prev => {
              // Check if project already exists to prevent duplicates
              const projectExists = prev.some(p => p._id === project._id);
              if (projectExists) {
                console.log('⚠️ Dashboard: Project already exists in state, skipping:', project.name);
                return prev;
              }
              return [project, ...prev];
            });
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
          <div className="mt-8 bg-white/80 rounded-2xl border border-black/10 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h4 className="font-bold text-xl text-black/80 font-plus-jakarta">Task Management</h4>
              <button
                onClick={() => { setActiveProjectId(selectedProject._id); setTaskModalOpen(true); }}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold text-base shadow hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/20"
              >
                <PlusIcon className="w-5 h-5" /> Add Task
              </button>
            </div>
            <div className="overflow-x-auto pb-2">
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
      <div className="flex gap-2 mt-4">
        <button className="flex-1 bg-black text-white rounded-full px-4 py-2 text-xs font-semibold hover:bg-gray-900 transition-colors duration-200 shadow">
          Documents
        </button>
        <button className="flex-1 bg-transparent border border-black text-black rounded-full px-4 py-2 text-xs font-semibold hover:bg-black hover:text-white transition-colors duration-200 shadow">
          Team
        </button>
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

// Add this function near the top-level of DashboardPage
async function handleLogout(setLogoutLoading: (b: boolean) => void) {
  setLogoutLoading(true);
  try {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      toast.success('Logged out successfully!');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1200);
    } else {
      toast.error('Logout failed. Please try again.');
    }
  } catch (err) {
    toast.error('Network error. Please try again.');
  }
  setLogoutLoading(false);
}

