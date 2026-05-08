import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import TreatmentFormShell, {
    SectionCard, FInput, FSelect, FTextarea, Pill, Attachments,
} from '../../components/TreatmentFormShell';

export default function DeadAnimalRecord() {
    const { animalId } = useParams();
    const navigate     = useNavigate();
    const [sp]         = useSearchParams();
    const date         = sp.get('date') || new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        record_date:       date,
        cause_of_death:    '',
        death_category:    '',
        found_by:          '',
        location:          '',
        post_mortem_done:  'No',
        post_mortem_by:    '',
        disposal_method:   '',
        disposal_date:     '',
        insurance_claimed: 'No',
        estimated_value:   '',
        notes:             '',
    });
    const [attachments, setAttachments] = useState([]);
    const [isDirty, setIsDirty]         = useState(false);

    const set     = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setIsDirty(true); };
    const setPill = (key, val) =>   { setForm(f => ({ ...f, [key]: val }));            setIsDirty(true); };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/farm/activities/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    animal_id: animalId,
                    type: 'dead',
                    ...form
                }),
            });
            const data = await response.json();
            if (data.success) {
                setIsDirty(false);
                alert('Dead Animal record saved!');
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

            <SectionCard title="Death Details">
                <div className="grid grid-cols-3 gap-4">
                    <FInput  label="Record Date" required type="date"
                        value={form.record_date} onChange={set('record_date')} />
                    <FSelect label="Cause of Death" required placeholder="Select cause…"
                        options={['Disease', 'Injury / Accident', 'Dystocia', 'Starvation', 'Unknown', 'Other']}
                        value={form.cause_of_death} onChange={set('cause_of_death')} />
                    <FSelect label="Death Category" required placeholder="Select category…"
                        options={['Natural', 'Accidental', 'Emergency Slaughter', 'Euthanasia']}
                        value={form.death_category} onChange={set('death_category')} />
                    <FSelect label="Found / Reported By" required placeholder="Select person…"
                        options={'workers'}
                        value={form.found_by} onChange={set('found_by')} />
                    <FSelect label="Location" placeholder="Select location…"
                        options={['Barn', 'Pasture', 'Quarantine', 'Calving Pen', 'Other']}
                        value={form.location} onChange={set('location')} />
                    <FInput  label="Estimated Value" type="number" placeholder="0.00" suffix="$"
                        value={form.estimated_value} onChange={set('estimated_value')} />
                </div>
                <div className="mt-5 flex flex-wrap gap-8">
                    <Pill label="Post-Mortem Conducted" options={['Yes', 'No']}
                        value={form.post_mortem_done} onChange={v => setPill('post_mortem_done', v)} />
                    <Pill label="Insurance Claimed" options={['Yes', 'No']}
                        value={form.insurance_claimed} onChange={v => setPill('insurance_claimed', v)} />
                </div>
            </SectionCard>

            <SectionCard title="Post-Mortem & Disposal">
                <div className="grid grid-cols-3 gap-4">
                    <FSelect label="Post-Mortem By" placeholder="Select person…"
                        options={'workers'}
                        value={form.post_mortem_by} onChange={set('post_mortem_by')} />
                    <FSelect label="Disposal Method" placeholder="Select method…"
                        options={['Burial on Farm', 'Rendering Plant', 'Incineration', 'Composting', 'Knackery']}
                        value={form.disposal_method} onChange={set('disposal_method')} />
                    <FInput  label="Disposal Date" type="date"
                        value={form.disposal_date} onChange={set('disposal_date')} />
                </div>
            </SectionCard>

            <SectionCard title="Notes">
                <FTextarea placeholder="Additional notes about the death event…"
                    value={form.notes} onChange={set('notes')} rows={4} />
            </SectionCard>

            <Attachments files={attachments} onFiles={(f) => { setAttachments(f); setIsDirty(true); }} />

        </TreatmentFormShell>
    );
}
