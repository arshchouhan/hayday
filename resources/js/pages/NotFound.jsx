import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">404</p>
            <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Page not found</h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300">
                    The route you requested does not exist in the React application.
                </p>
            </div>
            <Link
                to="/"
                className="inline-flex items-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
                Go home
            </Link>
        </section>
    );
}