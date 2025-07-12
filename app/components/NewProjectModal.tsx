"use client";

import { useState, useEffect, FormEvent } from "react";

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (project: any) => void;
}

export default function NewProjectModal({ open, onClose, onCreate }: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyLoading, setCompanyLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCompanyLoading(true);
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => {
          if (data.user && data.user.company) {
            setCompanyId(data.user.company);
          } else if (data.user && data.user.companyId) {
            setCompanyId(data.user.companyId);
          }
          setCompanyLoading(false);
        })
        .catch(() => setCompanyLoading(false));
    }
  }, [open]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      console.log('🚀 NewProjectModal: Creating project:', { name, desc, companyId });
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, desc, companyId }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const project = await res.json();
      console.log('✅ NewProjectModal: Project created successfully:', project.name);
      onCreate(project);
      setName("");
      setDesc("");
      onClose();
    } catch (err: any) {
      console.error('❌ NewProjectModal: Error creating project:', err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 relative animate-fadeInUp"
        style={{ minWidth: 320 }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Create New Project</h2>
        <div className="mb-2 text-xs text-gray-500">
          Company ID: {companyLoading ? (
            <span className="inline-flex items-center gap-1 text-black/60">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 inline-block"></span>
              Loading...
            </span>
          ) : (companyId || 'Not set')}
        </div>
        <input
          className="w-full mb-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Project Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          className="w-full mb-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          rows={3}
          required
        />
        {(!companyId && open) && (
          <div className="text-red-500 mb-2 text-sm">Error: Company ID not found. Please make sure you are logged in and have a company assigned.</div>
        )}
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-black dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !companyId || !name.trim() || !desc.trim()}
            className="px-4 py-2 bg-black text-white rounded-full font-semibold shadow hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
        <style jsx>{`
          .animate-fadeInUp {
            animation: fadeInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </form>
    </div>
  );
} 