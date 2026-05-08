import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import TreatmentFormShell, {
    SectionCard, FInput, FSelect, FTextarea, Pill, Attachments,
} from '../../components/TreatmentFormShell';

export default function Calving() {
    const { animalId } = useParams();
    const navigate     = useNavigate();
    const [sp]         = useSearchParams();
    const date         = sp.get('date') || new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        calving_date:     date,
        calving_ease:     '',
        calf_gender:      '',
        calf_ear_tag:     '',
        calf_birth_weight:'',
        calf_health:      '',
        dam_health:       '',
        assisted_by:      '',
        location:         '',
        stillborn:        'No',
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
                    type: 'calving',
                    ...form
                }),
            });
            const data = await response.json();
            if (data.success) {
                setIsDirty(false);
                alert('Calving activity saved!');
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

            <SectionCard title="Calving Details">
                <div className="grid grid-cols-3 gap-4">
                    <FInput  label="Calving Date" required type="date"
                        value={form.calving_date} onChange={set('calving_date')} />
                    <FSelect label="Calving Ease" required placeholder="Select ease…"
                        options={['Easy (Unassisted)', 'Assisted – Mild', 'Assisted – Difficult', 'Caesarean']}
                        value={form.calving_ease} onChange={set('calving_ease')} />
                    <FSelect label="Calf Gender" required placeholder="Select gender…"
                        options={['Male', 'Female']}
                        value={form.calf_gender} onChange={set('calf_gender')} />
                    <FInput  label="Calf Ear Tag" placeholder="e.g. C-2024-001"
                        value={form.calf_ear_tag} onChange={set('calf_ear_tag')} />
                    <FInput  label="Calf Birth Weight" type="number" placeholder="e.g. 38"
                        value={form.calf_birth_weight} onChange={set('calf_birth_weight')} suffix="kg" />
                    <FSelect label="Calf Health Status" required placeholder="Select status…"
                        options={['Healthy', 'Weak – Needs Attention', 'Stillborn']}
                        value={form.calf_health} onChange={set('calf_health')} />
                    <FSelect label="Dam Health Post-Calving" placeholder="Select status…"
                        options={['Normal', 'Retained Placenta', 'Prolapse', 'Other Complication']}
                        value={form.dam_health} onChange={set('dam_health')} />
                    <FSelect label="Assisted By" required placeholder="Select person…"
                        options={'workers'}
                        value={form.assisted_by} onChange={set('assisted_by')} />
                    <FSelect label="Location" placeholder="Select location…"
                        options={['Calving Pen', 'Barn', 'Pasture', 'Clinic']}
                        value={form.location} onChange={set('location')} />
                </div>
                <div className="mt-5">
                    <Pill label="Stillborn" options={['Yes', 'No']}
                        value={form.stillborn} onChange={v => setPill('stillborn', v)} />
                </div>
            </SectionCard>

            <SectionCard title="Notes">
                <FTextarea placeholder="Describe the calving event, any complications, or follow-up actions…"
                    value={form.notes} onChange={set('notes')} rows={4} />
            </SectionCard>

            <Attachments files={attachments} onFiles={(f) => { setAttachments(f); setIsDirty(true); }} />

        </TreatmentFormShell>
    );
}
