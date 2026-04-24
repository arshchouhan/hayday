import illustration from '../assets/no-enterprises.svg';

export default function ManageCattleDashboard({ selectedAnimal }) {
    const getContent = () => {
        switch (selectedAnimal) {
            case 'Register Animal':
                return {
                    title: 'Register New Animal',
                    description: 'Start the registration process by filling out the animal details, health records, and pedigree information.'
                };
            case 'Scheduler':
                return {
                    title: 'Farm Scheduler',
                    description: 'Manage upcoming tasks, vaccinations, breeding dates, and feeding schedules for your livestock.'
                };
            case 'Groups':
                return {
                    title: 'Livestock Groups',
                    description: 'Organize your animals into pastures, groups, or pens for easier management and tracking.'
                };
            case 'Animal Details':
                return {
                    title: 'Animal Details & History',
                    description: 'View comprehensive information about a specific animal, including its pedigree, health history, and growth charts.'
                };
            default:
                return {
                    title: 'Now manage the lifecycle',
                    description: 'Select an animal category from the sidebar to view listings and details.'
                };
        }
    };

    const content = getContent();

    return (
        <section className="h-full min-h-0 w-full rounded-md bg-[#E9EEF6]">
            <div className="flex h-full flex-col items-center justify-center text-center bg-[#F8FAFD] rounded-md border border-[#D7E3EF] p-8">
                <div className="mb-6 w-full max-w-md">
                    <img src={illustration} alt="Manage Lifecycle" className="mx-auto w-full opacity-80" />
                </div>
                <h2 className="text-2xl font-bold text-slate-700">{content.title}</h2>
                <p className="mt-2 text-sm text-slate-400">
                    {content.description}
                </p>
            </div>
        </section>
    );
}
