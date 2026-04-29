import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TreatmentFormShell, {
    SectionCard, FInput, FSelect, FTextarea, Attachments,
} from '../../components/TreatmentFormShell';

export default function BreedingSoundnessExam() {
    const { animalId } = useParams();
    const [sp]         = useSearchParams();
    const date         = sp.get('date') || new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        treatment_date: date,
        examiner:       '',
        bse_result:     '',
        morphology:     '',
        motility:       '',
        physical_exam:  '',
        cost:           '',
        payment_date:   '',
        vendor:         '',
        notes:          '',
    });
    const [isDirty, setIsDirty] = useState(false);
    const [attachments, setAttachments] = useState([]);

    const set = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setIsDirty(true); };

    const handleSubmit = () => {
        console.log('BSE submit:', { animalId, ...form });
        setIsDirty(false);
        alert('Breeding Soundness Exam activity saved!');
    };

    return (
        <TreatmentFormShell title="Breeding Soundness Exam" isDirty={isDirty} onSubmit={handleSubmit}>

            <SectionCard title="Examination Details">
                <div className="grid grid-cols-3 gap-4">
                    <FInput  label="Treatment Date" required type="date"
                        value={form.treatment_date} onChange={set('treatment_date')} />
                    <FSelect label="Examiner" required placeholder="Select examiner…"
                        options={['Arsh Chauhan', 'Farm Vet', 'External Specialist']}
                        value={form.examiner} onChange={set('examiner')} />
                    <FSelect label="Overall Result" required placeholder="Select result…"
                        options={['Satisfactory', 'Unsatisfactory', 'Deferred – Recheck in 60 days']}
                        value={form.bse_result} onChange={set('bse_result')} />
                    <FInput  label="Morphology Score" type="number" placeholder="e.g. 70"
                        suffix="%" value={form.morphology} onChange={set('morphology')} />
                    <FInput  label="Motility Score" type="number" placeholder="e.g. 65"
                        suffix="%" value={form.motility} onChange={set('motility')} />
                    <FSelect label="Physical Exam Finding" placeholder="Select finding…"
                        options={['Normal', 'Minor Abnormality', 'Major Abnormality']}
                        value={form.physical_exam} onChange={set('physical_exam')} />
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

            <SectionCard title="Examiner Notes">
                <FTextarea placeholder="Findings, recommendations, and follow-up plan…"
                    value={form.notes} onChange={set('notes')} rows={4} />
            </SectionCard>

            <Attachments files={attachments} onFiles={(f) => { setAttachments(f); setIsDirty(true); }} />

        </TreatmentFormShell>
    );
}
