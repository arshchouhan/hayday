import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link to="/" className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-200">
                    YourLiveStock
                </Link>

                <nav className="flex items-center gap-2 text-sm text-slate-300">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `rounded-full px-4 py-2 transition ${isActive ? 'bg-white text-slate-950' : 'hover:bg-white/10 hover:text-white'}`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `rounded-full px-4 py-2 transition ${isActive ? 'bg-white text-slate-950' : 'hover:bg-white/10 hover:text-white'}`
                        }
                    >
                        Dashboard
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}