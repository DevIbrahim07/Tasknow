import { useState, useEffect } from "react";
import api from "../lib/api";
import AddTask from "./AddTask";
import TaskItem from "./TaskItem";

const TaskList = ({ onRefreshStats }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/tasks");
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(query.trim().toLowerCase()),
    )
    .filter((task) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "completed") return task.completed;
      return !task.completed;
    })
    .filter((task) => {
      if (priorityFilter === "all") return true;
      return (task.priority || "medium") === priorityFilter;
    });

  return (
    <div className="mx-auto flex w-[min(1100px,92%)] flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_1.6fr]">
        <AddTask fetchTasks={fetchTasks} onRefreshStats={onRefreshStats} />
        <div className="rounded-3xl bg-white/90 p-6 shadow-[0_24px_60px_rgba(13,79,73,0.18)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Your Tasks</h3>
            <button
              className="rounded-full border border-teal-900/20 px-4 py-2 text-xs font-semibold text-teal-700"
              onClick={fetchTasks}
            >
              Refresh
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Search tasks"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-2xl border border-teal-900/15 bg-white px-4 py-2 text-sm outline-none focus:border-teal-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-teal-900/15 bg-white px-4 py-2 text-sm outline-none focus:border-teal-500"
            >
              <option value="all">All status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-2xl border border-teal-900/15 bg-white px-4 py-2 text-sm outline-none focus:border-teal-500"
            >
              <option value="all">All priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          {loading && (
            <div className="py-6 text-center text-sm font-medium text-slate-600">
              Loading tasks...
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-2xl bg-orange-100 px-4 py-3 text-sm font-medium text-orange-700">
              {error}
            </div>
          )}
          {!loading && !error && filteredTasks.length === 0 && (
            <div className="py-6 text-center text-sm text-slate-600">
              No tasks match your filters.
            </div>
          )}
          <div className="mt-4 flex flex-col gap-4">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                fetchTasks={fetchTasks}
                onRefreshStats={onRefreshStats}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
