import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TreatmentFormShell, {
    SectionCard, FInput, FSelect, FTextarea, Pill, Attachments,
} from '../../components/TreatmentFormShell';

export default function PregnancyCheck() {
    const { animalId } = useParams();
    const [sp]         = useSearchParams();
    const date         = sp.get('date') || new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        treatment_date: date,
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
    const [isDirty, setIsDirty] = useState(false);
    const [attachments, setAttachments] = useState([]);

    const set = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setIsDirty(true); };

    const handleSubmit = () => {
        console.log('Pregnancy Check submit:', { animalId, ...form });
        setIsDirty(false);
        alert('Pregnancy Check activity saved!');
    };

    return (
        <TreatmentFormShell title="Pregnancy Check" isDirty={isDirty} onSubmit={handleSubmit}>

            <SectionCard title="Examination Details">
                <div className="grid grid-cols-3 gap-4">
                    <FInput  label="Treatment Date" required type="date"
                        value={form.treatment_date} onChange={set('treatment_date')} />
                    <FSelect label="Check Method" required placeholder="Select method…"
                        options={['Ultrasound', 'Rectal Palpation', 'Blood Test', 'Milk Test']}
                        value={form.check_method} onChange={set('check_method')} />
                    <FSelect label="Result" required placeholder="Select result…"
                        options={['Pregnant', 'Open / Not Pregnant', 'Uncertain – Recheck']}
                        value={form.preg_result} onChange={set('preg_result')} />
                    <FInput  label="Days Pregnant (Est.)" type="number" placeholder="e.g. 45"
                        suffix="days" value={form.days_pregnant} onChange={set('days_pregnant')} />
                    <FInput  label="Expected Calving Date" type="date"
                        value={form.calving_date} onChange={set('calving_date')} />
                    <FSelect label="Checked By" required placeholder="Select person…"
                        options={['Arsh Chauhan', 'Farm Vet', 'Farm Worker']}
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
                <FTextarea placeholder="Examination notes and observations…"
                    value={form.notes} onChange={set('notes')} rows={4} />
            </SectionCard>

            <Attachments files={attachments} onFiles={(f) => { setAttachments(f); setIsDirty(true); }} />

        </TreatmentFormShell>
    );
}
