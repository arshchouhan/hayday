import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TreatmentFormShell, {
    SectionCard, FInput, FSelect, FTextarea, Pill, Attachments,
} from '../../components/TreatmentFormShell';

export default function Observation() {
    const { animalId } = useParams();
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
    });
    const [isDirty, setIsDirty] = useState(false);
    const [attachments, setAttachments] = useState([]);

    const set     = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setIsDirty(true); };
    const setPill = (key, val) =>   { setForm(f => ({ ...f, [key]: val }));            setIsDirty(true); };

    const handleSubmit = () => {
        console.log('Observation submit:', { animalId, ...form });
        setIsDirty(false);
        alert('Observation activity saved!');
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

            <SectionCard title="Observation Notes">
                <FTextarea required placeholder="Describe in detail what was observed — behaviour, symptoms, changes…"
                    value={form.notes} onChange={set('notes')} rows={5} />
            </SectionCard>

            <Attachments files={attachments} onFiles={(f) => { setAttachments(f); setIsDirty(true); }} />

        </TreatmentFormShell>
    );
}
