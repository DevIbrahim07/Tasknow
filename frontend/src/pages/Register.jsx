import { useState } from "react";
import api from "../lib/api";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mx-auto flex min-h-[70vh] w-[min(1100px,92%)] items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-[0_24px_60px_rgba(13,79,73,0.18)]">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Start organizing life with tasknow.
          </p>
        </div>
        <form onSubmit={handleRegister} className="mt-6 flex flex-col gap-4">
          <label className="text-sm font-medium text-slate-600">
            Name
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-teal-900/15 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500"
            />
          </label>
          <label className="text-sm font-medium text-slate-600">
            Email
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-teal-900/15 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500"
            />
          </label>
          <label className="text-sm font-medium text-slate-600">
            Password
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-teal-900/15 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500"
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
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-teal-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
