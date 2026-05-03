import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout, { FloatingInput } from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(formData);
            navigate('/farm');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Sign in to continue">
            <form onSubmit={handleLogin} className="space-y-1">
                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-[13px] font-bold text-red-600 border border-red-100">
                        {error}
                    </div>
                )}
                
                <FloatingInput
                    label="Email"
                    required
                    placeholder="Enter email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <FloatingInput
                    label="Password"
                    required
                    isPassword
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <div className="flex justify-start mb-8">
                    <button type="button" className="text-[13px] font-bold text-[#059669] hover:underline">
                        Forgot Password?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-[#1a1a2e] py-4 text-[15px] font-black text-white transition hover:bg-black shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>

            <div className="mt-8">
                <button 
                    type="button"
                    onClick={() => window.location.href = '/auth/google'}
                    className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 py-3.5 text-[14px] font-bold text-[#1a1a2e] transition hover:bg-gray-50 active:scale-[0.98]"
                >
                    <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    <span>Sign in with Google</span>
                </button>
            </div>

            <div className="relative my-10 text-center">
                <hr className="border-gray-100" />
                <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-white px-4 text-[11px] font-bold text-gray-300">OR</span>
            </div>

            <Link
                to="/signup"
                className="block text-center w-full rounded-full border border-gray-200 py-3.5 text-[14px] font-bold text-[#1a1a2e] transition hover:bg-gray-50 active:scale-[0.98]"
            >
                Create New Account
            </Link>
        </AuthLayout>
    );
}
