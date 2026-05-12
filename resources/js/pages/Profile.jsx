import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Field({ label, value, onChange, name, placeholder, type = 'text', readOnly = false }) {
    return (
        <label className="flex flex-col gap-2">
            <span className="text-[12px] font-black uppercase tracking-[0.25em] text-gray-500">{label}</span>
            <input
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                readOnly={readOnly}
                className={`w-full rounded-2xl border px-4 py-3 text-[14px] font-semibold outline-none transition ${
                    readOnly
                        ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-500'
                        : 'border-[#D6E2EE] bg-white text-[#1a1a2e] focus:border-[#1a1a2e]'
                }`}
            />
        </label>
    );
}

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const fileInputRef = useRef(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        ranch_name: '',
    });

    useEffect(() => {
        if (!user) return;

        setPreviewUrl(user.profile_image || '');
        setSelectedFile(null);
        setRemoveImage(false);

        setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            ranch_name: user.ranch_name || '',
        });
    }, [user]);

    const initials = useMemo(() => {
        if (!form.name) return 'U';
        return form.name.charAt(0).toUpperCase();
    }, [form.name]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setMessage('');
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
        setMessage('');
        setError('');

        if (file) {
            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }

            setPreviewUrl(URL.createObjectURL(file));
            setRemoveImage(false);
        }
    };

    const triggerFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        if (previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl('');
        setSelectedFile(null);
        setRemoveImage(true);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        try {
            await updateProfile({
                name: form.name,
                phone: form.phone || null,
                ranch_name: form.ranch_name,
                profile_image_file: selectedFile,
                profile_image_remove: removeImage,
            });
            setMessage('Profile updated successfully.');
        } catch (err) {
            const firstError = err?.response?.data?.errors;
            if (firstError) {
                const firstKey = Object.keys(firstError)[0];
                setError(firstError[firstKey]?.[0] || 'Could not update profile.');
            } else {
                setError(err?.response?.data?.message || 'Could not update profile.');
            }
        } finally {
            setSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div className="h-full overflow-auto bg-[#F8FAFD] p-6 sm:p-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="rounded-[32px] border border-[#D6E2EE] bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-[12px] font-black uppercase tracking-[0.35em] text-[#6B7A90]">Profile</p>
                            <h1 className="mt-2 text-[34px] font-black tracking-tight text-[#1a1a2e]">Your account details</h1>
                            <p className="mt-2 max-w-2xl text-[14px] font-medium leading-relaxed text-gray-500">
                                View and edit the details associated with your farm account.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 rounded-[28px] bg-[#E9EEF6] px-5 py-4">
                            <button
                                type="button"
                                onClick={triggerFilePicker}
                                className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[#1a1a2e] text-white shadow-md ring-2 ring-transparent transition hover:ring-[#1a1a2e]/20"
                                aria-label="Change profile image"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                {previewUrl ? (
                                    <img src={previewUrl} alt={form.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-[18px] font-black">{initials}</span>
                                )}
                                <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-[10px] font-black uppercase tracking-[0.25em] text-white opacity-0 transition group-hover:opacity-100">
                                    Change
                                </span>
                            </button>
                            <div>
                                <p className="text-[14px] font-black text-[#1a1a2e]">{form.name || 'Unnamed user'}</p>
                                <p className="text-[12px] font-semibold text-gray-500">{form.email}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={triggerFilePicker}
                                        className="rounded-full bg-[#1a1a2e] px-4 py-1.5 text-[11px] font-black text-white hover:bg-[#233746] transition-colors"
                                    >
                                        Update image
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="rounded-full border border-red-200 bg-white px-4 py-1.5 text-[11px] font-black text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Remove image
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-[#F8FAFD] p-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">Login type</p>
                            <p className="mt-2 text-[15px] font-black text-[#1a1a2e]">{user.google_id ? 'Google' : 'Email'}</p>
                        </div>
                        <div className="rounded-2xl bg-[#F8FAFD] p-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">Phone</p>
                            <p className="mt-2 text-[15px] font-black text-[#1a1a2e]">{form.phone || 'Not set'}</p>
                        </div>
                        <div className="rounded-2xl bg-[#F8FAFD] p-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">Ranch</p>
                            <p className="mt-2 text-[15px] font-black text-[#1a1a2e]">{form.ranch_name || 'My Farm'}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="rounded-[32px] border border-[#D6E2EE] bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-center justify-between gap-4 border-b border-[#D6E2EE] pb-4">
                        <div>
                            <h2 className="text-[20px] font-black text-[#1a1a2e]">Edit profile</h2>
                            <p className="text-[13px] font-medium text-gray-500">Update your display information and avatar.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-full bg-[#1a1a2e] px-6 py-2.5 text-[13px] font-black text-white hover:bg-[#233746] disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                        >
                            {saving ? 'Saving...' : 'Save changes'}
                        </button>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field label="Full name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
                        <Field label="Email" name="email" value={form.email} onChange={handleChange} placeholder="Email" readOnly />
                        <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
                        <Field label="Ranch name" name="ranch_name" value={form.ranch_name} onChange={handleChange} placeholder="Ranch name" />
                        <div className="md:col-span-2 rounded-2xl border border-dashed border-[#D6E2EE] bg-[#F8FAFD] p-4">
                            <p className="text-[12px] font-black uppercase tracking-[0.25em] text-gray-500">Profile image</p>
                            <p className="mt-2 text-[13px] font-medium text-gray-600">
                                Click the avatar above to open the file explorer, or use the buttons to update or remove the image.
                            </p>
                            {removeImage && (
                                <p className="mt-2 text-[12px] font-bold text-red-600">Image removal will be saved when you click Save changes.</p>
                            )}
                        </div>
                    </div>

                    {message && (
                        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-semibold text-emerald-700">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
