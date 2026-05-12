import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import TreatmentFormShell, {
    SectionCard, FInput, FSelect, FTextarea, Pill, Attachments,
} from '../../components/TreatmentFormShell';

export default function RecordHeat() {
    const { animalId } = useParams();
    const navigate     = useNavigate();
    const [sp]         = useSearchParams();
    const date         = sp.get('date') || new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        treatment_date:   date,
        heat_intensity:   '',
        detection_method: '',
        expected_return:  '',
        observed_by:      '',
        location:         '',
        standing_heat:    'No',
        cost:             '',
        payment_date:     '',
        vendor:           '',
        notes:            '',
    });
    const [attachments, setAttachments] = useState([]);
    const [isDirty, setIsDirty] = useState(false);
    const { showToast } = useNotifications();

    const set    = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setIsDirty(true); };
    const setPill = (key, val) =>  { setForm(f => ({ ...f, [key]: val }));            setIsDirty(true); };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/farm/health', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    animal_id: animalId,
                    type: 'heat',
                    ...form
                }),
            });

            const data = await response.json();

            if (data.success) {
                setIsDirty(false);
                showToast('Activity saved', data.message || 'Record Heat activity saved!');
                navigate('/farm/details/' + animalId);
            } else {
                showToast('Error', data.message || 'Failed to save record');
            }
        } catch (error) {
            console.error('Submit error:', error);
            showToast('Error', 'An error occurred while saving the record.');
        }
    };

    return (
        <TreatmentFormShell title="Record Heat" isDirty={isDirty} onSubmit={handleSubmit}>

            <SectionCard title="Heat Details">
                <div className="grid grid-cols-3 gap-4">
                    <FInput  label="Treatment Date" required type="date"
                        value={form.treatment_date} onChange={set('treatment_date')} />
                    <FSelect label="Heat Intensity" required placeholder="Select intensity…"
                        options={['Mild', 'Moderate', 'Strong']}
                        value={form.heat_intensity} onChange={set('heat_intensity')} />
                    <FSelect label="Detection Method" placeholder="Select method…"
                        options={['Visual Observation', 'Tail Paint', 'Activity Monitor', 'Teaser Bull']}
                        value={form.detection_method} onChange={set('detection_method')} />
                    <FInput  label="Expected Return Date" type="date"
                        value={form.expected_return} onChange={set('expected_return')} />
                    <FSelect label="Observed By" required placeholder="Select observer…"
                        options={'workers'}
                        value={form.observed_by} onChange={set('observed_by')} />
                    <FSelect label="Location" placeholder="Select location…"
                        options={['Barn', 'Pasture', 'Quarantine', 'Clinic']}
                        value={form.location} onChange={set('location')} />
                </div>
                <div className="mt-5">
                    <Pill label="Standing Heat Confirmed" options={['Yes', 'No']}
                        value={form.standing_heat} onChange={v => setPill('standing_heat', v)} />
                </div>
            </SectionCard>

            <SectionCard title="Cost & Payment">
                <div className="grid grid-cols-3 gap-4">
                    <FInput label="Cost" type="number" placeholder="0.00" suffix="₹"
                        value={form.cost} onChange={set('cost')} />
                    <FInput label="Payment Date" type="date"
                        value={form.payment_date} onChange={set('payment_date')} />
                    <FSelect label="Vendor" placeholder="Select vendor…"
                        options={['Default Vendor', 'Farm Supply Co.', 'Vet Clinic', 'AI Centre']}
                        value={form.vendor} onChange={set('vendor')} />
                </div>
            </SectionCard>

            <SectionCard title="Notes">
                <FTextarea placeholder="Additional observations about the heat cycle…"
                    value={form.notes} onChange={set('notes')} rows={4} />
            </SectionCard>

            <Attachments files={attachments} onFiles={(f) => { setAttachments(f); setIsDirty(true); }} />

        </TreatmentFormShell>
    );
}
