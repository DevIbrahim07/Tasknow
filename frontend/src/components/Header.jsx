import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, token, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-20 border-b border-teal-900/10 bg-amber-50/70 backdrop-blur">
      <div className="mx-auto flex w-[min(1100px,92%)] flex-col gap-3 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 font-semibold lowercase"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-linear-to-br from-teal-600 to-teal-400 font-mono text-sm tracking-wider text-white shadow-[0_16px_40px_rgba(13,148,136,0.35)]">
              TN
            </span>
            <span className="text-lg">tasknow</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 md:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition hover:text-teal-700 ${
                  isActive ? "text-teal-700" : ""
                }`
              }
            >
              Dashboard
            </NavLink>
            {!token && (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `transition hover:text-teal-700 ${
                      isActive ? "text-teal-700" : ""
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `transition hover:text-teal-700 ${
                      isActive ? "text-teal-700" : ""
                    }`
                  }
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {token && (
              <>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-teal-700">
                  {user?.name || "User"}
                </span>
                <button
                  className="rounded-full border border-teal-900/20 px-4 py-2 text-xs font-semibold text-teal-700 transition hover:-translate-y-0.5 hover:shadow-lg"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
        <nav className="flex flex-wrap gap-3 text-xs font-medium text-slate-600 md:hidden">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-full px-3 py-1 transition ${
                isActive ? "bg-teal-100 text-teal-700" : "bg-white/70"
              }`
            }
          >
            Dashboard
          </NavLink>
          {!token && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 transition ${
                    isActive ? "bg-teal-100 text-teal-700" : "bg-white/70"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 transition ${
                    isActive ? "bg-teal-100 text-teal-700" : "bg-white/70"
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
