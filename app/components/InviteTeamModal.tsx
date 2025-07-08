"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InviteTeamModalProps {
  open: boolean;
  onClose: () => void;
  project: any;
}

const InviteTeamModal: React.FC<InviteTeamModalProps> = ({ open, onClose, project }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [realMembers, setRealMembers] = useState<any[]>([]);

  // Fetch real team members when modal opens or project changes
  useEffect(() => {
    if (open && project?._id) {
      fetch(`/api/projects/${project._id}`)
        .then(res => res.json())
        .then(data => {
          setRealMembers(data.members || []);
        });
    }
  }, [open, project]);

  if (!open || !project) return null;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch(`/api/projects/${project._id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "member" }),
      });
      if (res.ok) {
        setSuccess("Invitation sent!");
        setEmail("");
        // Refetch real members after invite
        const updated = await fetch(`/api/projects/${project._id}`);
        const updatedData = await updated.json();
        setRealMembers(updatedData.members || []);
      } else {
        const data = await res.json();
        setError(data.message || data.error || "Failed to send invite.");
      }
    } catch {
      setError("Failed to send invite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative"
        >
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl">×</button>
          <h2 className="text-xl font-bold mb-2 text-black/80">Invite Team Members</h2>
          <p className="text-black/50 mb-4 text-sm">Invite people to collaborate on <span className="font-semibold text-black">{project.name}</span></p>
          <form onSubmit={handleInvite} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="Enter email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border border-black/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/20 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white rounded-lg px-4 py-2 font-semibold hover:bg-gray-900 transition-all duration-200 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Invite"}
            </button>
            {success && <div className="text-green-600 text-sm">{success}</div>}
            {error && <div className="text-red-600 text-sm">{error}</div>}
          </form>
          <div className="mt-6">
            <h3 className="font-semibold text-black/70 mb-2 text-sm">Current Team Members</h3>
            <div className="flex flex-wrap gap-2">
              {realMembers && realMembers.length > 0 ? (
                realMembers.map((m: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-xs text-black/70">
                    <span className="font-bold">{(m.firstName ? m.firstName[0] : m.email[0]).toUpperCase()}</span> {m.firstName ? `${m.firstName} ${m.lastName}` : m.email}
                  </div>
                ))
              ) : (
                <span className="text-gray-400 text-xs">No team members yet.</span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InviteTeamModal; 