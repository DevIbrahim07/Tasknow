import { useEffect, useState } from "react";
import api from "../lib/api";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString();
};

const TaskItem = ({ task, fetchTasks, onRefreshStats }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "",
  );
  const [notes, setNotes] = useState(task.notes || "");
  useEffect(() => {
    setTitle(task.title || "");
    setPriority(task.priority || "medium");
    setDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "",
    );
    setNotes(task.notes || "");
  }, [task]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleComplete = async () => {
    try {
      await api.put(`/api/tasks/${task._id}`, { completed: !task.completed });
      await fetchTasks();
      if (onRefreshStats) onRefreshStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const saveEdits = async () => {
    setLoading(true);
    setError("");
    try {
      await api.put(`/api/tasks/${task._id}`, {
        title,
        priority,
        dueDate: dueDate || null,
        notes,
      });
      setIsEditing(false);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    try {
      await api.delete(`/api/tasks/${task._id}`);
      await fetchTasks();
      if (onRefreshStats) onRefreshStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <div
      className={`rounded-2xl border border-teal-900/10 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 ${
        task.completed ? "opacity-70" : ""
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <button
            className="mt-1 grid h-9 w-9 place-items-center rounded-xl border border-teal-900/20 bg-amber-100 text-sm font-bold text-teal-700"
            onClick={toggleComplete}
          >
            {task.completed ? "✓" : ""}
          </button>
          <div className="flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-teal-900/15 bg-white px-4 py-2 text-sm outline-none focus:border-teal-500"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-2xl border border-teal-900/15 bg-white px-4 py-2 text-sm outline-none focus:border-teal-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-2xl border border-teal-900/15 bg-white px-4 py-2 text-sm outline-none focus:border-teal-500"
                  />
                </div>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-2xl border border-teal-900/15 bg-white px-4 py-2 text-sm outline-none focus:border-teal-500"
                />
                {error && (
                  <div className="rounded-2xl bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
                    {error}
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  <button
                    className="rounded-full bg-linear-to-r from-teal-700 to-teal-500 px-5 py-2 text-xs font-semibold text-white shadow-[0_16px_32px_rgba(13,148,136,0.35)] transition hover:-translate-y-0.5"
                    type="button"
                    onClick={saveEdits}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="rounded-full border border-teal-900/20 px-5 py-2 text-xs font-semibold text-teal-700"
                    type="button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`text-base font-semibold text-slate-900 ${
                    task.completed ? "line-through" : ""
                  }`}
                >
                  {task.title}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span
                    className={`rounded-full px-3 py-1 font-semibold capitalize ${
                      task.priority === "high"
                        ? "bg-orange-100 text-orange-700"
                        : task.priority === "low"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {task.priority || "medium"}
                  </span>
                  {task.dueDate && <span>Due {formatDate(task.dueDate)}</span>}
                </div>
                {task.notes && (
                  <p className="mt-2 text-sm text-slate-600">{task.notes}</p>
                )}
              </>
            )}
          </div>
        </div>
        {!isEditing && (
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-full border border-teal-900/20 px-4 py-2 text-xs font-semibold text-teal-700"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="rounded-full border border-orange-400/30 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-700"
              onClick={() => setShowConfirm(true)}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(15,79,73,0.2)]">
            <h4 className="text-lg font-semibold text-slate-900">
              Delete this task?
            </h4>
            <p className="mt-2 text-sm text-slate-600">
              This action cannot be undone.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="rounded-full border border-teal-900/20 px-5 py-2 text-xs font-semibold text-teal-700"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-orange-500 px-5 py-2 text-xs font-semibold text-white shadow-[0_16px_32px_rgba(249,115,22,0.35)]"
                onClick={async () => {
                  setShowConfirm(false);
                  await deleteTask();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
