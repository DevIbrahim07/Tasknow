import { useEffect, useState } from "react";
import TaskList from "../components/TaskList.jsx";
import api from "../lib/api";

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  const loadStats = async () => {
    try {
      const res = await api.get("/api/tasks/stats");
      setStats(res.data);
    } catch (error) {
      setStats({ total: 0, completed: 0, pending: 0 });
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="mx-auto flex w-[min(1100px,92%)] flex-col gap-8">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-teal-500/20 via-amber-100/60 to-orange-100/40 p-8">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Your focus hub
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Capture tasks, set priority, and keep momentum. tasknow keeps
            everything calm and clear.
          </p>
        </div>
        <div className="absolute right-6 top-6 h-40 w-40 rounded-full bg-teal-400/40 blur-2xl" />
        <div className="absolute bottom-4 right-12 h-24 w-24 animate-[float_8s_ease-in-out_infinite] rounded-full bg-orange-200/60" />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: stats.total },
          { label: "Completed", value: stats.completed },
          { label: "Pending", value: stats.pending },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-white/90 p-5 shadow-[0_16px_40px_rgba(13,79,73,0.12)]"
          >
            <span className="text-xs font-semibold text-slate-500">
              {item.label}
            </span>
            <div className="mt-2 text-2xl font-semibold text-teal-700">
              {item.value}
            </div>
          </div>
        ))}
      </section>

      <TaskList onRefreshStats={loadStats} />
    </div>
  );
};

export default Dashboard;
