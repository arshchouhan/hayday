import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import TreatmentFormShell, {
    SectionCard, FInput, FSelect, FTextarea, Pill, Attachments,
} from '../../components/TreatmentFormShell';

export default function WeightManagement() {
    const { animalId } = useParams();
    const navigate     = useNavigate();
    const [sp]         = useSearchParams();
    const date         = sp.get('date') || new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        weigh_date:      date,
        current_weight:  '',
        previous_weight: '',
        weight_gain:     '',
        target_weight:   '',
        weigh_method:    '',
        body_condition:  '',
        recorded_by:     '',
        next_weigh_date: '',
        notes:           '',
    });
    const [attachments, setAttachments] = useState([]);
    const [isDirty, setIsDirty]         = useState(false);

    const set = (key) => (e) => {
        setForm(f => {
            const updated = { ...f, [key]: e.target.value };
            const curr = parseFloat(key === 'current_weight'  ? e.target.value : updated.current_weight)  || 0;
            const prev = parseFloat(key === 'previous_weight' ? e.target.value : updated.previous_weight) || 0;
            if (curr && prev) updated.weight_gain = (curr - prev).toFixed(1);
            return updated;
        });
        setIsDirty(true);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/farm/activities/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    animal_id: animalId,
                    type: 'weight',
                    ...form
                }),
            });
            const data = await response.json();
            if (data.success) {
                setIsDirty(false);
                alert('Weight Management activity saved!');
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
        <TreatmentFormShell title="Sales & Records" isDirty={isDirty} onSubmit={handleSubmit}>

            <SectionCard title="Weight Details">
                <div className="grid grid-cols-3 gap-4">
                    <FInput  label="Weigh Date" required type="date"
                        value={form.weigh_date} onChange={set('weigh_date')} />
                    <FInput  label="Current Weight" required type="number" placeholder="e.g. 420"
                        value={form.current_weight} onChange={set('current_weight')} suffix="kg" />
                    <FInput  label="Previous Weight" type="number" placeholder="e.g. 400"
                        value={form.previous_weight} onChange={set('previous_weight')} suffix="kg" />
                    <FInput  label="Weight Gain / Loss" type="number" placeholder="Auto-calculated"
                        value={form.weight_gain} onChange={set('weight_gain')} suffix="kg" />
                    <FInput  label="Target Weight" type="number" placeholder="e.g. 500"
                        value={form.target_weight} onChange={set('target_weight')} suffix="kg" />
                    <FSelect label="Weigh Method" placeholder="Select method…"
                        options={['Weigh Scale', 'Weigh Band / Tape', 'EID Tag Reader', 'Visual Estimate']}
                        value={form.weigh_method} onChange={set('weigh_method')} />
                    <FSelect label="Body Condition Score" placeholder="Select score…"
                        options={['1 – Emaciated', '2 – Thin', '3 – Moderate', '4 – Good', '5 – Obese']}
                        value={form.body_condition} onChange={set('body_condition')} />
                    <FSelect label="Recorded By" required placeholder="Select person…"
                        options={['Arsh Chauhan', 'Farm Vet', 'Farm Worker']}
                        value={form.recorded_by} onChange={set('recorded_by')} />
                    <FInput  label="Next Weigh Date" type="date"
                        value={form.next_weigh_date} onChange={set('next_weigh_date')} />
                </div>
            </SectionCard>

            <SectionCard title="Notes">
                <FTextarea placeholder="Feed plan, health observations, or weight management notes…"
                    value={form.notes} onChange={set('notes')} rows={4} />
            </SectionCard>

            <Attachments files={attachments} onFiles={(f) => { setAttachments(f); setIsDirty(true); }} />

        </TreatmentFormShell>
    );
}
