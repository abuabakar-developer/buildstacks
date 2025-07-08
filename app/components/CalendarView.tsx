"use client";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { CalendarIcon } from "@heroicons/react/24/outline";
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
    return {
      style: {
        backgroundColor: color,
        borderRadius: "8px",
        color: "#fff",
        border: "none",
        padding: "4px 8px",
        fontWeight: 600,
        fontFamily: 'var(--font-inter)',
        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)",
      },
    };
  };

  // Modal for event details
  function EventModal({ event, onClose }: any) {
    const [editMode, setEditMode] = useState(false);
    const [newDueDate, setNewDueDate] = useState(event.resource.task.dueDate);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { task, project } = event.resource;

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
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h3 className="text-lg font-bold mb-2">{task.title}</h3>
          <p className="mb-1"><span className="font-semibold">Project:</span> {project?.name || "Unknown"}</p>
          <p className="mb-1"><span className="font-semibold">Status:</span> {task.status}</p>
          <p className="mb-1"><span className="font-semibold">Priority:</span> {task.priority}</p>
          {editMode ? (
            <div className="mb-2">
              <label className="block text-sm font-semibold mb-1">Due Date:</label>
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={newDueDate ? newDueDate.slice(0, 10) : ''}
                onChange={e => setNewDueDate(e.target.value)}
                disabled={saving}
              />
            </div>
          ) : (
            <p className="mb-1"><span className="font-semibold">Due:</span> {new Date(task.dueDate).toLocaleString()}</p>
          )}
          <div className="flex gap-2 mt-4">
            {editMode ? (
              <>
                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleEdit} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
                <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setEditMode(false)} disabled={saving}>Cancel</button>
              </>
            ) : (
              <>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit Deadline</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete Task"}</button>
                <button className="bg-gray-200 px-4 py-2 rounded" onClick={onClose}>Close</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Add Task Modal
  function AddTaskModal({ open, onClose, date }: any) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <form
          className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
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
                  dueDate: date,
                  priority: addTaskPriority,
                }),
              });
              if (!res.ok) throw new Error("Failed to add task");
              setAddTaskTitle("");
              setAddTaskProjectId(projects[0]?._id || "");
              setAddTaskPriority("medium");
              setAddModalOpen(false);
              onClose(); // Optionally, refetch tasks here
            } catch (err) {
              setAddTaskError("Failed to add task");
            }
            setAddTaskLoading(false);
          }}
        >
          <h3 className="text-lg font-bold mb-4">Add Task</h3>
          {addTaskError && <div className="text-red-500 mb-2">{addTaskError}</div>}
          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Title"
            value={addTaskTitle}
            onChange={e => setAddTaskTitle(e.target.value)}
            required
          />
          <select
            className="w-full border p-2 rounded mb-2"
            value={addTaskProjectId}
            onChange={e => setAddTaskProjectId(e.target.value)}
            required
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <input
            type="date"
            className="w-full border p-2 rounded mb-2"
            value={date ? date.slice(0, 10) : ''}
            disabled
          />
          <div className="flex gap-2 mb-4">
            <label className={`px-3 py-1 rounded cursor-pointer ${addTaskPriority === 'high' ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}> <input type="radio" className="hidden" value="high" checked={addTaskPriority==='high'} onChange={()=>setAddTaskPriority('high')} /> High </label>
            <label className={`px-3 py-1 rounded cursor-pointer ${addTaskPriority === 'medium' ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-black'}`}> <input type="radio" className="hidden" value="medium" checked={addTaskPriority==='medium'} onChange={()=>setAddTaskPriority('medium')} /> Medium </label>
            <label className={`px-3 py-1 rounded cursor-pointer ${addTaskPriority === 'low' ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'}`}> <input type="radio" className="hidden" value="low" checked={addTaskPriority==='low'} onChange={()=>setAddTaskPriority('low')} /> Low </label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
            <button type="submit" disabled={addTaskLoading} className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800">{addTaskLoading ? "Adding..." : "Add Task"}</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor={(event: any) => event.start}
        endAccessor={(event: any) => event.end}
        style={{ height: 600, opacity: updating ? 0.5 : 1 }}
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
      />
      {events.length === 0 && (
        <div className="text-center text-gray-400 mt-8">
          <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-pink-200" />
          <div className="font-semibold">No deadlines yet</div>
          <div className="text-sm">Tasks with due dates will appear here</div>
        </div>
      )}
      {modalOpen && (
        <EventModal event={selectedEvent} onClose={() => { setModalOpen(false); setSelectedEvent(null); }} />
      )}
      <AddTaskModal open={addModalOpen} onClose={() => setAddModalOpen(false)} date={addDate} />
    </div>
  );
} 





