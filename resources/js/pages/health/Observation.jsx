import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import TreatmentFormShell, {
    SectionCard, FInput, FSelect, FTextarea, Pill, Attachments,
} from '../../components/TreatmentFormShell';

export default function Observation() {
    const { animalId } = useParams();
    const navigate     = useNavigate();
    const [sp]         = useSearchParams();
    const date         = sp.get('date') || new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        treatment_date: date,
        obs_type:       '',
        severity:       '',
        observed_by:    '',
        location:       '',
        followup_date:  '',
        vet_required:   'No',
        notes:          '',
        cost:           '',
        payment_date:   '',
        vendor:         '',
    });
    const [isDirty, setIsDirty] = useState(false);
    const [attachments, setAttachments] = useState([]);

    const set     = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setIsDirty(true); };
    const setPill = (key, val) =>   { setForm(f => ({ ...f, [key]: val }));            setIsDirty(true); };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/farm/health', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    animal_id: animalId,
                    type: 'observation',
                    ...form
                }),
            });

            const data = await response.json();

            if (data.success) {
                setIsDirty(false);
                alert('Observation activity saved!');
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
        <TreatmentFormShell title="Observation" isDirty={isDirty} onSubmit={handleSubmit}>

            <SectionCard title="Observation Details">
                <div className="grid grid-cols-3 gap-4">
                    <FInput  label="Treatment Date" required type="date"
                        value={form.treatment_date} onChange={set('treatment_date')} />
                    <FSelect label="Observation Type" required placeholder="Select type…"
                        options={['Behavioural Change', 'Physical Symptom', 'Feed Intake Change', 'Lameness', 'Other']}
                        value={form.obs_type} onChange={set('obs_type')} />
                    <FSelect label="Severity" required placeholder="Select severity…"
                        options={['Low', 'Medium', 'High', 'Critical']}
                        value={form.severity} onChange={set('severity')} />
                    <FSelect label="Observed By" required placeholder="Select observer…"
                        options={['Arsh Chauhan', 'Farm Vet', 'Farm Worker']}
                        value={form.observed_by} onChange={set('observed_by')} />
                    <FSelect label="Location" placeholder="Select location…"
                        options={['Barn', 'Pasture', 'Quarantine', 'Clinic']}
                        value={form.location} onChange={set('location')} />
                    <FInput  label="Follow-up Date" type="date"
                        value={form.followup_date} onChange={set('followup_date')} />
                </div>
                <div className="mt-5">
                    <Pill label="Vet Consultation Required" options={['Yes', 'No']}
                        value={form.vet_required} onChange={v => setPill('vet_required', v)} />
                </div>
            </SectionCard>

            <SectionCard title="Cost & Payment">
                <div className="grid grid-cols-3 gap-4">
                    <FInput label="Cost" type="number" placeholder="0.00" suffix="$" info
                        value={form.cost} onChange={set('cost')} />
                    <FInput label="Payment Date" type="date"
                        value={form.payment_date} onChange={set('payment_date')} />
                    <FSelect label="Vendor" placeholder="Select vendor…"
                        options={['Default Vendor', 'Vet Clinic', 'Pharma Supply', 'Agro-Vet']}
                        value={form.vendor} onChange={set('vendor')} />
                </div>
            </SectionCard>

            <SectionCard title="Observation Notes">
                <FTextarea required placeholder="Describe in detail what was observed — behaviour, symptoms, changes…"
                    value={form.notes} onChange={set('notes')} rows={5} />
            </SectionCard>

            <Attachments files={attachments} onFiles={(f) => { setAttachments(f); setIsDirty(true); }} />

        </TreatmentFormShell>
    );
}
