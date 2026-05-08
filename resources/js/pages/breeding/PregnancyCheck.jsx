import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import TreatmentFormShell, {
    SectionCard, FInput, FSelect, FTextarea, Attachments,
} from '../../components/TreatmentFormShell';

export default function BreedingPregnancyCheck() {
    const { animalId } = useParams();
    const navigate     = useNavigate();
    const [sp]         = useSearchParams();
    const date         = sp.get('date') || new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        check_date:     date,
        check_method:   '',
        preg_result:    '',
        days_pregnant:  '',
        calving_date:   '',
        checked_by:     '',
        cost:           '',
        payment_date:   '',
        vendor:         '',
        notes:          '',
    });
    const [attachments, setAttachments] = useState([]);
    const [isDirty, setIsDirty]         = useState(false);

    const set = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setIsDirty(true); };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/farm/activities/breeding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    animal_id: animalId,
                    type: 'pregnancy_check',
                    ...form
                }),
            });
            const data = await response.json();
            if (data.success) {
                setIsDirty(false);
                alert('Pregnancy Check activity saved!');
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

            <SectionCard title="Pregnancy Check Details">
                <div className="grid grid-cols-3 gap-4">
                    <FInput  label="Check Date" required type="date"
                        value={form.check_date} onChange={set('check_date')} />
                    <FSelect label="Check Method" required placeholder="Select method…"
                        options={['Ultrasound', 'Rectal Palpation', 'Blood Test', 'Milk Test']}
                        value={form.check_method} onChange={set('check_method')} />
                    <FSelect label="Result" required placeholder="Select result…"
                        options={['Pregnant', 'Open / Not Pregnant', 'Uncertain – Recheck']}
                        value={form.preg_result} onChange={set('preg_result')} />
                    <FInput  label="Days Pregnant (Est.)" type="number" placeholder="e.g. 45"
                        value={form.days_pregnant} onChange={set('days_pregnant')} suffix="days" />
                    <FInput  label="Expected Calving Date" type="date"
                        value={form.calving_date} onChange={set('calving_date')} />
                    <FSelect label="Checked By" required placeholder="Select person…"
                        options={'workers'}
                        value={form.checked_by} onChange={set('checked_by')} />
                </div>
            </SectionCard>

            <SectionCard title="Cost & Payment">
                <div className="grid grid-cols-3 gap-4">
                    <FInput label="Cost" type="number" placeholder="0.00" suffix="$" info
                        value={form.cost} onChange={set('cost')} />
                    <FInput label="Payment Date" type="date"
                        value={form.payment_date} onChange={set('payment_date')} />
                    <FSelect label="Vendor" placeholder="Select vendor…"
                        options={['Default Vendor', 'Farm Supply Co.', 'Vet Clinic', 'Online Store']}
                        value={form.vendor} onChange={set('vendor')} />
                </div>
            </SectionCard>

            <SectionCard title="Notes">
                <FTextarea placeholder="Examination notes and recommendations…"
                    value={form.notes} onChange={set('notes')} rows={4} />
            </SectionCard>

            <Attachments files={attachments} onFiles={(f) => { setAttachments(f); setIsDirty(true); }} />

        </TreatmentFormShell>
    );
}
