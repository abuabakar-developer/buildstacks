"use client";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { CalendarIcon, XMarkIcon, PencilIcon, TrashIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, BuildingOfficeIcon, PlusIcon } from "@heroicons/react/24/outline";
import React, { useState, useMemo, useEffect } from "react";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format, parse, startOfWeek, getDay, locales,
});

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

const DnDCalendar = withDragAndDrop(Calendar);

type Project = {
  _id: string;
  name: string;
  // Add other properties if needed
};

type CalendarViewProps = {
  tasksByProject: any; // Replace 'any' with the actual type if you know it
  projects: Project[];
};

export default function CalendarView({ tasksByProject, projects }: CalendarViewProps) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [eventData, setEventData] = useState({});
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addDate, setAddDate] = useState<string | null>(null);
  const [addTaskLoading, setAddTaskLoading] = useState(false);
  const [addTaskError, setAddTaskError] = useState("");
  const [addTaskTitle, setAddTaskTitle] = useState("");
  const [addTaskProjectId, setAddTaskProjectId] = useState(projects[0]?._id || "");
  const [addTaskPriority, setAddTaskPriority] = useState("medium");
  const [addTaskDescription, setAddTaskDescription] = useState("");

  // Map projectId to color
  const projectColorMap = React.useMemo(() => {
    const map: { [key: string]: string } = {};
    projects.forEach((p: Project, idx: number) => {
      map[p._id] = PROJECT_COLORS[idx % PROJECT_COLORS.length];
    });
    return map;
  }, [projects]);

  // Flatten all tasks and map to calendar events
  const events = useMemo(() => {
    const evts: any[] = [];
    Object.entries(tasksByProject).forEach(([projectId, tasks]: [string, any]) => {
      const project = projects.find(p => p._id === projectId);
      (tasks as any[]).forEach((task: any) => {
        if (task.dueDate) {
          evts.push({
            id: task._id,
            title: `${task.title} (${project?.name || "Project"})`,
            start: new Date(task.dueDate),
            end: new Date(task.dueDate),
            allDay: true,
            resource: { task, projectId, project },
          });
        }
      });
    });
    return evts;
  }, [tasksByProject, projects]);

  // Real-time updates placeholder (Pusher)
  useEffect(() => {
    // TODO: Add Pusher subscription for real-time updates
    // Example: subscribe to 'tasks' channel and refetch tasks on update
  }, []);

  // Drag-and-drop handler
  const onEventDrop = async ({ event, start, end }: any) => {
    setUpdating(true);
    try {
      await fetch(`/api/projects/${event.resource.projectId}/tasks/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dueDate: start }),
      });
      // Optionally: refetch tasks or optimistically update UI
    } catch (e) {
      alert("Failed to update deadline");
    }
    setUpdating(false);
  };

  // Event click handler (open modal)
  const onSelectEvent = (event: any) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  // Custom event style for color-coding
  const eventPropGetter = (event: any) => {
    const color = projectColorMap[event.resource.projectId] || "#6366F1";
    const isOverdue = new Date(event.start) < new Date() && event.resource.task.status !== 'completed';
    
    return {
      style: {
        backgroundColor: isOverdue ? '#EF4444' : color,
        borderRadius: "12px",
        color: "#fff",
        border: "none",
        padding: "6px 12px",
        fontWeight: 600,
        fontFamily: 'var(--font-inter)',
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",
        fontSize: '12px',
        textAlign: 'center' as const,
        minHeight: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    };
  };

  // Enhanced Event Modal
  function EventModal({ event, onClose }: any) {
    const [editMode, setEditMode] = useState(false);
    const [newDueDate, setNewDueDate] = useState(event.resource.task.dueDate);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { task, project } = event.resource;
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

    // Edit handler
    const handleEdit = async () => {
      setSaving(true);
      try {
        await fetch(`/api/projects/${event.resource.projectId}/tasks/${task._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dueDate: newDueDate }),
        });
        setEditMode(false);
        onClose(); // Optionally, refetch tasks here
      } catch (e) {
        alert("Failed to update deadline");
      }
      setSaving(false);
    };

    // Delete handler
    const handleDelete = async () => {
      if (!confirm("Are you sure you want to delete this task?")) return;
      setDeleting(true);
      try {
        await fetch(`/api/projects/${event.resource.projectId}/tasks/${task._id}`, {
          method: "DELETE",
        });
        onClose(); // Optionally, refetch tasks here
      } catch (e) {
        alert("Failed to delete task");
      }
      setDeleting(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black font-plus-jakarta">{task.title}</h3>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              <XMarkIcon className="h-5 w-5 text-black/60" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${
              isOverdue ? 'bg-red-100 text-red-700' :
              task.status === 'completed' ? 'bg-green-100 text-green-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {isOverdue ? (
                <ExclamationTriangleIcon className="h-4 w-4" />
              ) : task.status === 'completed' ? (
                <CheckCircleIcon className="h-4 w-4" />
              ) : (
                <ClockIcon className="h-4 w-4" />
              )}
              {isOverdue ? 'Overdue' : task.status === 'completed' ? 'Completed' : task.status}
            </div>
          </div>

          {/* Task Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <BuildingOfficeIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-black/60">Project</p>
                <p className="font-semibold text-black">{project?.name || "Unknown"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                task.priority === 'high' ? 'bg-red-500' :
                task.priority === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}>
                <ExclamationTriangleIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-black/60">Priority</p>
                <p className="font-semibold text-black capitalize">{task.priority}</p>
              </div>
            </div>

            {editMode ? (
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <label className="block text-sm font-semibold text-blue-700 mb-2">Due Date:</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newDueDate ? newDueDate.slice(0, 10) : ''}
                  onChange={e => setNewDueDate(e.target.value)}
                  disabled={saving}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <CalendarIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-black/60">Due Date</p>
                  <p className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-black'}`}>
                    {new Date(task.dueDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {editMode ? (
              <>
                <button 
                  className="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60" 
                  onClick={handleEdit} 
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  className="px-4 py-3 rounded-xl border-2 border-gray-300 text-black font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200" 
                  onClick={() => setEditMode(false)} 
                  disabled={saving}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2" 
                  onClick={() => setEditMode(true)}
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
                <button 
                  className="px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60" 
                  onClick={handleDelete} 
                  disabled={deleting}
                >
                  <TrashIcon className="h-4 w-4" />
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Add Task Modal
  function AddTaskModal({ open, onClose, date }: any) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black font-plus-jakarta">Add New Task</h3>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              <XMarkIcon className="h-5 w-5 text-black/60" />
            </button>
          </div>

          <form
            onSubmit={async e => {
              e.preventDefault();
              setAddTaskLoading(true);
              setAddTaskError("");
              try {
                const res = await fetch(`/api/projects/${addTaskProjectId}/tasks`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: addTaskTitle,
                    description: addTaskDescription,
                    dueDate: date,
                    priority: addTaskPriority,
                  }),
                });
                if (!res.ok) throw new Error("Failed to add task");
                setAddTaskTitle("");
                setAddTaskDescription("");
                setAddTaskProjectId(projects[0]?._id || "");
                setAddTaskPriority("medium");
                setAddModalOpen(false);
                onClose(); // Optionally, refetch tasks here
              } catch (err) {
                setAddTaskError("Failed to add task");
              }
              setAddTaskLoading(false);
            }}
            className="space-y-6"
          >
            {addTaskError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {addTaskError}
              </div>
            )}

            {/* Task Title */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Task Title</label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter task title"
                value={addTaskTitle}
                onChange={e => setAddTaskTitle(e.target.value)}
                required
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Description (Optional)</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Enter task description"
                value={addTaskDescription}
                onChange={e => setAddTaskDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Project Selection */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Project</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={addTaskProjectId}
                onChange={e => setAddTaskProjectId(e.target.value)}
                required
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Due Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={date ? date.slice(0, 10) : ''}
                disabled
              />
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-semibold text-black mb-3">Priority</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700 border-green-300' },
                  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
                  { value: 'high', label: 'High', color: 'bg-red-100 text-red-700 border-red-300' }
                ].map((priority) => (
                  <label 
                    key={priority.value}
                    className={`px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center font-semibold ${
                      addTaskPriority === priority.value 
                        ? priority.color 
                        : 'bg-gray-50 text-black/60 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <input 
                      type="radio" 
                      className="hidden" 
                      value={priority.value} 
                      checked={addTaskPriority === priority.value} 
                      onChange={() => setAddTaskPriority(priority.value)} 
                    />
                    {priority.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-black font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={addTaskLoading} 
                className="flex-1 px-4 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {addTaskLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    Add Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor={(event: any) => event.start}
        endAccessor={(event: any) => event.end}
        style={{ height: 700, opacity: updating ? 0.5 : 1 }}
        onSelectEvent={onSelectEvent}
        onEventDrop={onEventDrop}
        popup
        views={["month", "week", "day", "agenda"]}
        className="rbc-calendar"
        eventPropGetter={eventPropGetter}
        draggableAccessor={() => true}
        selectable
        onSelectSlot={slotInfo => {
          const date = slotInfo.start.toISOString();
          setAddDate(date);
          setAddModalOpen(true);
        }}
        defaultView="month"
        toolbar={true}
        step={60}
        timeslots={1}
        min={new Date(0, 0, 0, 8, 0, 0)}
        max={new Date(0, 0, 0, 20, 0, 0)}
      />
      
      {events.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
            <CalendarIcon className="h-10 w-10 text-pink-500" />
          </div>
          <h4 className="text-xl font-bold text-black mb-2 font-plus-jakarta">No deadlines yet</h4>
          <p className="text-black/60 mb-6">Tasks with due dates will appear here</p>
          <button 
            onClick={() => {
              setAddDate(new Date().toISOString());
              setAddModalOpen(true);
            }}
            className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <PlusIcon className="h-4 w-4" />
            Add Your First Task
          </button>
        </div>
      )}
      
      {modalOpen && (
        <EventModal event={selectedEvent} onClose={() => { setModalOpen(false); setSelectedEvent(null); }} />
      )}
      <AddTaskModal open={addModalOpen} onClose={() => setAddModalOpen(false)} date={addDate} />
    </div>
  );
} 





