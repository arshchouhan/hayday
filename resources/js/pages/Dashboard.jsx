import Navbar from '../components/Navbar';

export default function Dashboard() {
    return (
        <>
            <Navbar />
            <main className="w-full px-3 py-6 sm:px-4">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
            </main>
        </>
    );
}