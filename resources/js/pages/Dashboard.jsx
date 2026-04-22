import Navbar from '../components/Navbar';
import SuboptionsSidebar from '../components/SuboptionsSidebar';
import { useLocation } from 'react-router-dom';

const sectionConfig = {
    dashboard: {
        title: 'Dashboard',
        suboptions: [
            { key: 'overview', label: 'Overview', to: '/dashboard' },
            { key: 'metrics', label: 'Metrics', to: '/dashboard/metrics' },
            { key: 'activity', label: 'Activity', to: '/dashboard/activity' },
        ],
    },
    people: {
        title: 'People',
        suboptions: [
            { key: 'employees', label: 'Employees', to: '/dashboard/people' },
            { key: 'teams', label: 'Teams', to: '/dashboard/people/teams' },
            { key: 'attendance', label: 'Attendance', to: '/dashboard/people/attendance' },
        ],
    },
    hiring: {
        title: 'Hiring',
        suboptions: [
            { key: 'open-roles', label: 'Open roles', to: '/dashboard/hiring' },
            { key: 'pipeline', label: 'Pipeline', to: '/dashboard/hiring/pipeline' },
            { key: 'interviews', label: 'Interviews', to: '/dashboard/hiring/interviews' },
        ],
    },
    devices: {
        title: 'Devices',
        suboptions: [
            { key: 'inventory', label: 'Inventory', to: '/dashboard/devices' },
            { key: 'assigned', label: 'Assigned', to: '/dashboard/devices/assigned' },
            { key: 'maintenance', label: 'Maintenance', to: '/dashboard/devices/maintenance' },
        ],
    },
    calendar: {
        title: 'Calendar',
        suboptions: [
            { key: 'month-view', label: 'Month view', to: '/dashboard/calendar' },
            { key: 'events', label: 'Events', to: '/dashboard/calendar/events' },
            { key: 'reminders', label: 'Reminders', to: '/dashboard/calendar/reminders' },
        ],
    },
};

function getActiveSection(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] !== 'dashboard') {
        return 'dashboard';
    }
    return sectionConfig[segments[1]] ? segments[1] : 'dashboard';
}

export default function Dashboard() {
    const { pathname } = useLocation();
    const activeKey = getActiveSection(pathname);
    const activeSection = sectionConfig[activeKey];

    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <Navbar />
            <main className="w-full flex-1 overflow-hidden px-3 pb-3 sm:px-4 sm:pb-4">
                <div className="flex h-full min-h-0 flex-col gap-3 md:flex-row md:items-start">
                    <div className="overflow-auto md:h-full md:w-44 md:shrink-0 lg:w-48">
                        <SuboptionsSidebar section={activeSection.title} suboptions={activeSection.suboptions} />
                    </div>
                    <section className="h-full min-h-0 w-full min-w-0 overflow-auto rounded-tl-md border-l border-t border-gray-200 bg-white p-4">
                        <h1 className="text-2xl font-semibold">{activeSection.title}</h1>
                        <p className="mt-2 text-sm text-gray-600">Select any top navigation item to view its suboptions on the left.</p>
                    </section>
                </div>
            </main>
        </div>
    );
}