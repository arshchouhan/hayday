import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import TreatmentFormShell, {
    SectionCard, FInput, FSelect, FTextarea, Pill, Attachments,
} from '../../components/TreatmentFormShell';

export default function Breeding() {
    const { animalId } = useParams();
    const navigate     = useNavigate();
    const [sp]         = useSearchParams();
    const date         = sp.get('date') || new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        activity_date:    date,
        bull_id:          '',
        breeding_method:  '',
        semen_batch:      '',
        technician:       '',
        location:         '',
        expected_calving: '',
        conception_check: 'Pending',
        cost:             '',
        payment_date:     '',
        vendor:           '',
        notes:            '',
    });
    const [attachments, setAttachments] = useState([]);
    const [isDirty, setIsDirty]         = useState(false);

    const set     = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setIsDirty(true); };
    const setPill = (key, val) =>   { setForm(f => ({ ...f, [key]: val }));            setIsDirty(true); };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/farm/activities/breeding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    animal_id: animalId,
                    type: 'breeding',
                    ...form
                }),
            });
            const data = await response.json();
            if (data.success) {
                setIsDirty(false);
                alert('Breeding activity saved!');
                navigate('/farm/details/' + animalId);
            } else {
                alert('Error: ' + (data.message || 'Failed to save record'));
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('An error occurred while saving the record.');
        }
    };

    return (
        <TreatmentFormShell title="Breeding and Reproduction" isDirty={isDirty} onSubmit={handleSubmit}>

            <SectionCard title="Breeding Details">
                <div className="grid grid-cols-3 gap-4">
                    <FInput  label="Activity Date" required type="date"
                        value={form.activity_date} onChange={set('activity_date')} />
                    <FSelect label="Breeding Method" required placeholder="Select method…"
                        options={['Natural Service', 'Artificial Insemination (AI)', 'Embryo Transfer']}
                        value={form.breeding_method} onChange={set('breeding_method')} />
                    <FInput  label="Bull / Sire ID" placeholder="e.g. BULL-042"
                        value={form.bull_id} onChange={set('bull_id')} />
                    <FInput  label="Semen Batch / Straw ID" placeholder="e.g. SB-2024-001"
                        value={form.semen_batch} onChange={set('semen_batch')} />
                    <FSelect label="Technician" required placeholder="Select technician…"
                        options={'workers'}
                        value={form.technician} onChange={set('technician')} />
                    <FSelect label="Location" placeholder="Select location…"
                        options={['Barn', 'Pasture', 'Breeding Pen', 'Clinic']}
                        value={form.location} onChange={set('location')} />
                    <FInput  label="Expected Calving Date" type="date"
                        value={form.expected_calving} onChange={set('expected_calving')} />
                </div>
                <div className="mt-5">
                    <Pill label="Conception Check Status"
                        options={['Pending', 'Confirmed', 'Failed']}
                        value={form.conception_check}
                        onChange={v => setPill('conception_check', v)} />
                </div>
            </SectionCard>

            <SectionCard title="Cost & Payment">
                <div className="grid grid-cols-3 gap-4">
                    <FInput label="Cost" type="number" placeholder="0.00" suffix="$" info
                        value={form.cost} onChange={set('cost')} />
                    <FInput label="Payment Date" type="date"
                        value={form.payment_date} onChange={set('payment_date')} />
                    <FSelect label="Vendor" placeholder="Select vendor…"
                        options={['Default Vendor', 'Farm Supply Co.', 'Vet Clinic', 'AI Centre']}
                        value={form.vendor} onChange={set('vendor')} />
                </div>
            </SectionCard>

            <SectionCard title="Notes">
                <FTextarea placeholder="Additional notes about this breeding event…"
                    value={form.notes} onChange={set('notes')} rows={4} />
            </SectionCard>

            <Attachments files={attachments} onFiles={(f) => { setAttachments(f); setIsDirty(true); }} />

        </TreatmentFormShell>
    );
}
