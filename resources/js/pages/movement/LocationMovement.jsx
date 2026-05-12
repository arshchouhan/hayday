import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import TreatmentFormShell, {
    SectionCard, FInput, FSelect, FTextarea, Pill, Attachments,
} from '../../components/TreatmentFormShell';

export default function LocationMovement() {
    const { animalId } = useParams();
    const navigate     = useNavigate();
    const [sp]         = useSearchParams();
    const date         = sp.get('date') || new Date().toISOString().split('T')[0];

    const [animal, setAnimal] = useState(null);
    const [locationOptions, setLocationOptions] = useState([]);
    const [fetchingSource, setFetchingSource] = useState(true);

    const [form, setForm] = useState({
        activity_date:    date,
        from_location:    '',
        to_location:      '',
        transport_method: '',
        reason:           '',
        moved_by:         '',
        distance:         '',
        duration:         '',
        return_expected:  'No',
        return_date:      '',
        cost:             '',
        payment_date:     '',
        vendor:           '',
        notes:            '',
    });
    const [attachments, setAttachments] = useState([]);
    const [isDirty, setIsDirty]         = useState(false);

    const currentLocationId = form.from_location || animal?.location_id || animal?.location?.id || '';

    useEffect(() => {
        let active = true;

        const loadAnimal = async () => {
            try {
                const response = await fetch(`/api/farm/animals/${animalId}`);
                const data = await response.json();
                if (!active) return;

                setAnimal(data);
                const sourceId = String(data?.location_id || data?.location?.id || data?.location?._id || '');

                if (sourceId && sourceId !== '') {
                    setForm((current) => ({
                        ...current,
                        from_location: sourceId,
                    }));
                    setFetchingSource(false);
                    return;
                }

                const historyResponse = await fetch(`/api/farm/animals/${animalId}/movement-history?period=3m`);
                const historyData = await historyResponse.json();
                if (!active) return;

                const fallbackLocationId = String(historyData?.current_location?.id || historyData?.current_location?._id || '');
                if (fallbackLocationId && fallbackLocationId !== '') {
                    setForm((current) => ({
                        ...current,
                        from_location: fallbackLocationId,
                    }));
                }
                setFetchingSource(false);
            } catch (error) {
                console.error('Failed to load animal:', error);
                setFetchingSource(false);
            }
        };

        void loadAnimal();

        return () => {
            active = false;
        };
    }, [animalId]);

    useEffect(() => {
        let active = true;

        const loadLocations = async () => {
            try {
                const response = await fetch('/api/farm/locations');
                const data = await response.json();
                if (!active) return;

                const list = Array.isArray(data) ? data : data?.data ?? [];
                setLocationOptions(
                    list
                        .filter((location) => location?.id || location?._id)
                        .map((location) => ({
                            value: String(location.id || location._id),
                            label: location.name || `Location ${location.id || location._id}`,
                        }))
                );
            } catch (error) {
                console.error('Failed to load locations:', error);
            }
        };

        void loadLocations();

        return () => {
            active = false;
        };
    }, []);

    const set     = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setIsDirty(true); };
    const setPill = (key, val) =>   { setForm(f => ({ ...f, [key]: val }));            setIsDirty(true); };

    const handleSubmit = async () => {
        if (!form.from_location) {
            alert('This animal does not have a current location yet. Set the current location first.');
            return;
        }
        if (!form.to_location) {
            alert('Please select a destination location.');
            return;
        }
        if (form.from_location === form.to_location) {
            alert('Destination location must be different from the current source location.');
            return;
        }

        try {
            const response = await fetch('/api/farm/activities/movement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    animal_id: animalId,
                    type: 'location',
                    ...form
                }),
            });
            const data = await response.json();
            if (data.success) {
                setIsDirty(false);
                alert('Location Movement activity saved!');
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
        <TreatmentFormShell title="Movement & Localization" isDirty={isDirty} onSubmit={handleSubmit}>

            <SectionCard title="Location Movement Details">
                <div className="grid grid-cols-3 gap-4">
                    <FInput  label="Activity Date" required type="date"
                        value={form.activity_date} onChange={set('activity_date')} />
                    <FSelect 
                        label="From Location" 
                        required 
                        placeholder={fetchingSource ? "Fetching current location..." : "Select source location…"}
                        options={locationOptions}
                        value={form.from_location} 
                        onChange={set('from_location')} 
                    />
                    <FSelect label="To Location" required placeholder="Select destination…"
                        options={locationOptions.filter((location) => location.value !== currentLocationId)}
                        value={form.to_location} onChange={set('to_location')} />
                    <FSelect label="Transport Method" placeholder="Select method…"
                        options={['On Foot', 'Farm Vehicle', 'Livestock Trailer', 'Third-Party Transport']}
                        value={form.transport_method} onChange={set('transport_method')} />
                    <FSelect label="Reason for Movement" required placeholder="Select reason…"
                        options={['Grazing Rotation', 'Veterinary Visit', 'Sale / Transfer', 'Show / Exhibition', 'Quarantine', 'Other']}
                        value={form.reason} onChange={set('reason')} />
                    <FSelect label="Moved By" required placeholder="Select person…"
                        options={'workers'}
                        value={form.moved_by} onChange={set('moved_by')} />
                    <FInput  label="Distance" type="number" placeholder="e.g. 12"
                        value={form.distance} onChange={set('distance')} suffix="km" />
                    <FInput  label="Duration" placeholder="e.g. 2 hrs"
                        value={form.duration} onChange={set('duration')} />
                    <FInput  label="Expected Return Date" type="date"
                        value={form.return_date} onChange={set('return_date')} />
                </div>
                <div className="mt-5">
                    <Pill label="Return Expected" options={['Yes', 'No']}
                        value={form.return_expected} onChange={v => setPill('return_expected', v)} />
                </div>
            </SectionCard>

            <SectionCard title="Cost & Payment">
                <div className="grid grid-cols-3 gap-4">
                    <FInput label="Cost" type="number" placeholder="0.00" suffix="₹"
                        value={form.cost} onChange={set('cost')} />
                    <FInput label="Payment Date" type="date"
                        value={form.payment_date} onChange={set('payment_date')} />
                    <FSelect label="Vendor" placeholder="Select vendor…"
                        options={['Default Vendor', 'Transport Co.', 'Logistics Ltd', 'Internal Transfer']}
                        value={form.vendor} onChange={set('vendor')} />
                </div>
            </SectionCard>

            <SectionCard title="Notes">
                <FTextarea placeholder="Additional details about this location movement…"
                    value={form.notes} onChange={set('notes')} rows={4} />
            </SectionCard>

            <Attachments files={attachments} onFiles={(f) => { setAttachments(f); setIsDirty(true); }} />

        </TreatmentFormShell>
    );
}
