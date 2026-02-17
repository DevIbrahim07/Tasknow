import { useState } from "react";
import api from "../lib/api";

const AddTask = ({ fetchTasks, onRefreshStats }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/api/tasks", {
        title,
        priority,
        dueDate: dueDate || null,
        notes,
      });
      setTitle("");
      setPriority("medium");
      setDueDate("");
      setNotes("");
      await fetchTasks();
      if (onRefreshStats) onRefreshStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white/90 p-6 shadow-[0_24px_60px_rgba(13,79,73,0.18)] backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Create a task</h3>
        <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
          New
        </span>
      </div>
      <form onSubmit={handleAdd} className="flex flex-col gap-4">
        <label className="text-sm font-medium text-slate-600">
          Title
          <input
            type="text"
            placeholder="Draft the next move"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-teal-900/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-600">
            Priority
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-teal-900/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-600">
            Due date
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-teal-900/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
            />
          </label>
        </div>
        <label className="text-sm font-medium text-slate-600">
          Notes
          <textarea
            rows="3"
            placeholder="Optional details"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-teal-900/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500"
          />
        </label>
        {error && (
          <div className="rounded-2xl bg-orange-100 px-4 py-3 text-sm font-medium text-orange-700">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="rounded-full bg-linear-to-r from-teal-700 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(13,148,136,0.35)] transition hover:-translate-y-0.5"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add task"}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
