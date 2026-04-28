import React, { useState } from 'react';

const AnimalSection = () => {
    const [formData, setFormData] = useState({
        treatmentDate: '28 Apr, 2026',
        treatmentName: '',
        medication: '',
        medicineContainer: '',
        diagnosis: '',
        dosage: '',
        route: '',
        location: '',
        relatedToUdder: 'No',
        administeredBy: 'Arsh Chauhan',
        cost: '',
        paymentDate: '',
        vendor: 'Default Vendor',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.treatmentName) {
            alert('Treatment Name is required.');
            return;
        }

        try {
            const response = await fetch('/api/treatments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Treatment saved successfully!');
                setFormData({
                    treatmentDate: '28 Apr, 2026',
                    treatmentName: '',
                    medication: '',
                    medicineContainer: '',
                    diagnosis: '',
                    dosage: '',
                    route: '',
                    location: '',
                    relatedToUdder: 'No',
                    administeredBy: 'Arsh Chauhan',
                    cost: '',
                    paymentDate: '',
                    vendor: 'Default Vendor',
                });
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while saving the treatment.');
        }
    };

    return (
        <div className="relative flex h-full flex-col bg-[#E9EEF6] overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#D6E2EE] bg-white/90 px-8 py-4 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#1a1a2e] hover:bg-white transition-colors"
                    >
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <h1 className="text-[20px] font-bold text-[#1a1a2e]">New treatment</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="rounded-full border border-[#D6E2EE] bg-white px-6 py-2 text-[14px] font-bold text-[#1a1a2e] hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="rounded-full bg-[#1a1a2e] px-6 py-2 text-[14px] font-bold text-white hover:bg-[#233746] transition-all shadow-[0_8px_20px_-4px_rgba(0,0,0,0.2)] active:scale-95"
                    >
                        Perform Activity
                    </button>
                </div>
            </div>

            <div className="p-8">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow-sm border border-[#D6E2EE]">
                    <div className="text-[14px] text-red-500">f3f7e0f</div>
                    <span className="text-[14px] font-bold text-[#1a1a2e]">Animal Tag</span>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-3">
                    <div className="relative">
                        <label className="absolute -top-3 left-3 z-10 bg-[#E9EEF6] px-1 text-[13px] font-bold text-[#1a1a2e]">Treatment Date <span className="text-red-500">*</span></label>
                        <div className="flex h-[48px] w-full items-center justify-between rounded-lg border border-[#80888F] bg-[#E9EEF6] px-4 shadow-sm">
                            <span className="text-[15px] font-medium text-[#1a1a2e]">28 Apr, 2026</span>
                            <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></svg>
                        </div>
                    </div>

                    <div className="relative">
                        <label className="absolute -top-3 left-3 z-10 bg-[#E9EEF6] px-1 text-[13px] font-bold text-[#1a1a2e]">Treatment Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="treatmentName"
                            value={formData.treatmentName}
                            onChange={handleInputChange}
                            placeholder="Treatment Name"
                            className="h-[48px] w-full rounded-lg border border-red-500 bg-[#E9EEF6] px-4 text-[15px] font-medium text-[#1a1a2e] outline-none placeholder:text-gray-400 shadow-sm ring-1 ring-red-500"
                        />
                        <p className="mt-1 text-[12px] font-bold text-red-500">Required</p>
                    </div>

                    <div className="relative">
                        <label className="absolute -top-3 left-3 z-10 bg-[#E9EEF6] px-1 text-[13px] font-bold text-[#1a1a2e]">Medication</label>
                        <input
                            type="text"
                            name="medication"
                            value={formData.medication}
                            onChange={handleInputChange}
                            placeholder="Medication"
                            className="h-[48px] w-full rounded-lg border border-[#80888F] bg-[#E9EEF6] px-4 text-[15px] font-medium text-[#1a1a2e] outline-none placeholder:text-gray-400 shadow-sm"
                        />
                    </div>

                    {/* Add more form fields as needed */}
                </div>
            </div>
        </div>
    );
};

export default AnimalSection;