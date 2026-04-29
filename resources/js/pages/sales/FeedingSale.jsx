import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TreatmentFormShell, {
    SectionCard, FInput, FSelect, FTextarea, Attachments,
} from '../../components/TreatmentFormShell';

export default function FeedingSale() {
    const { animalId } = useParams();
    const [sp]         = useSearchParams();
    const date         = sp.get('date') || new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        sale_date:      date,
        buyer_name:     '',
        buyer_contact:  '',
        sale_type:      '',
        quantity:       '',
        unit:           '',
        price_per_unit: '',
        total_amount:   '',
        payment_method: '',
        payment_date:   '',
        invoice_number: '',
        notes:          '',
    });
    const [attachments, setAttachments] = useState([]);
    const [isDirty, setIsDirty]         = useState(false);

    const set = (key) => (e) => {
        setForm(f => {
            const updated = { ...f, [key]: e.target.value };
            const qty   = parseFloat(key === 'quantity'       ? e.target.value : updated.quantity)       || 0;
            const price = parseFloat(key === 'price_per_unit' ? e.target.value : updated.price_per_unit) || 0;
            if (qty && price) updated.total_amount = (qty * price).toFixed(2);
            return updated;
        });
        setIsDirty(true);
    };

    const handleSubmit = () => {
        console.log('Feeding Sale submit:', { animalId, ...form });
        setIsDirty(false);
        alert('Feeding Sale saved!');
    };

    return (
        <TreatmentFormShell title="Sales & Records" isDirty={isDirty} onSubmit={handleSubmit}>

            <SectionCard title="Sale Details">
                <div className="grid grid-cols-3 gap-4">
                    <FInput  label="Sale Date" required type="date"
                        value={form.sale_date} onChange={set('sale_date')} />
                    <FSelect label="Sale Type" required placeholder="Select type…"
                        options={['Milk', 'Meat', 'Live Animal', 'Manure', 'Other Feed Product']}
                        value={form.sale_type} onChange={set('sale_type')} />
                    <FInput  label="Buyer Name" required placeholder="e.g. Local Dairy Co."
                        value={form.buyer_name} onChange={set('buyer_name')} />
                    <FInput  label="Buyer Contact" placeholder="Phone or email"
                        value={form.buyer_contact} onChange={set('buyer_contact')} />
                    <FInput  label="Quantity" required type="number" placeholder="e.g. 500"
                        value={form.quantity} onChange={set('quantity')} />
                    <FSelect label="Unit" required placeholder="Select unit…"
                        options={['kg', 'litre', 'head', 'ton', 'unit']}
                        value={form.unit} onChange={set('unit')} />
                    <FInput  label="Price Per Unit" required type="number" placeholder="0.00" suffix="$"
                        value={form.price_per_unit} onChange={set('price_per_unit')} />
                    <FInput  label="Total Amount" type="number" suffix="$" placeholder="Auto-calculated"
                        value={form.total_amount} onChange={set('total_amount')} />
                    <FInput  label="Invoice Number" placeholder="e.g. INV-2024-001"
                        value={form.invoice_number} onChange={set('invoice_number')} />
                </div>
            </SectionCard>

            <SectionCard title="Payment">
                <div className="grid grid-cols-3 gap-4">
                    <FSelect label="Payment Method" placeholder="Select method…"
                        options={['Cash', 'Bank Transfer', 'Cheque', 'Online Payment', 'Credit']}
                        value={form.payment_method} onChange={set('payment_method')} />
                    <FInput  label="Payment Date" type="date"
                        value={form.payment_date} onChange={set('payment_date')} />
                </div>
            </SectionCard>

            <SectionCard title="Notes">
                <FTextarea placeholder="Additional notes about this sale…"
                    value={form.notes} onChange={set('notes')} rows={4} />
            </SectionCard>

            <Attachments files={attachments} onFiles={(f) => { setAttachments(f); setIsDirty(true); }} />

        </TreatmentFormShell>
    );
}
