import { Camera, Sparkles } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-transparent text-stone-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-20 mb-8 rounded-[2rem] border border-white/10 bg-stone-950/80 px-5 py-4 shadow-2xl shadow-orange-950/20 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 p-3 text-stone-950">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-orange-200/60">
                  Fake Social Lab
                </p>
                <h1 className="text-2xl font-semibold tracking-tight">FakeInsta</h1>
              </div>
            </Link>

            <nav className="flex items-center gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm transition ${
                    isActive ? "bg-white text-stone-950" : "text-stone-200 hover:bg-white/10"
                  }`
                }
              >
                Feed
              </NavLink>
              <NavLink
                to="/new"
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                    isActive
                      ? "bg-orange-400 text-stone-950"
                      : "bg-white/5 text-stone-100 hover:bg-white/10"
                  }`
                }
              >
                <Camera className="size-4" />
                Nova publicação
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
