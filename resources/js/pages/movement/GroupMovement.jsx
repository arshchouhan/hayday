import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TreatmentFormShell, {
    SectionCard, FInput, FSelect, FTextarea, Pill, Attachments,
} from '../../components/TreatmentFormShell';

export default function GroupMovement() {
    const { animalId } = useParams();
    const [sp]         = useSearchParams();
    const date         = sp.get('date') || new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        activity_date:  date,
        from_group:     '',
        to_group:       '',
        reason:         '',
        moved_by:       '',
        effective_date: '',
        notes:          '',
    });
    const [attachments, setAttachments] = useState([]);
    const [isDirty, setIsDirty]         = useState(false);

    const set = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setIsDirty(true); };

    const handleSubmit = () => {
        console.log('Group Movement submit:', { animalId, ...form });
        setIsDirty(false);
        alert('Group Movement saved!');
    };

    return (
        <TreatmentFormShell title="Movement & Localization" isDirty={isDirty} onSubmit={handleSubmit}>

            <SectionCard title="Group Movement Details">
                <div className="grid grid-cols-3 gap-4">
                    <FInput  label="Activity Date" required type="date"
                        value={form.activity_date} onChange={set('activity_date')} />
                    <FSelect label="From Group" required placeholder="Select source group…"
                        options={['Herd A', 'Herd B', 'Dry Cows', 'Milking Herd', 'Quarantine', 'Young Stock']}
                        value={form.from_group} onChange={set('from_group')} />
                    <FSelect label="To Group" required placeholder="Select destination group…"
                        options={['Herd A', 'Herd B', 'Dry Cows', 'Milking Herd', 'Quarantine', 'Young Stock']}
                        value={form.to_group} onChange={set('to_group')} />
                    <FSelect label="Reason for Movement" required placeholder="Select reason…"
                        options={['Routine Rotation', 'Health Separation', 'Breeding Group', 'Dry-off', 'Weaning', 'Other']}
                        value={form.reason} onChange={set('reason')} />
                    <FSelect label="Moved By" required placeholder="Select person…"
                        options={['Arsh Chauhan', 'Farm Vet', 'Farm Worker']}
                        value={form.moved_by} onChange={set('moved_by')} />
                    <FInput  label="Effective Date" type="date"
                        value={form.effective_date} onChange={set('effective_date')} />
                </div>
            </SectionCard>

            <SectionCard title="Notes">
                <FTextarea placeholder="Additional notes about this group movement…"
                    value={form.notes} onChange={set('notes')} rows={4} />
            </SectionCard>

            <Attachments files={attachments} onFiles={(f) => { setAttachments(f); setIsDirty(true); }} />

        </TreatmentFormShell>
    );
}
