// Landing Page - Latest Update: 2026-05-09
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Activity, MapPin, ShieldCheck, Cloud, Zap, ClipboardList, Plus, ChevronDown } from 'lucide-react';
import HeroImage from '../assets/Hero-Support-1.webp';

export default function LandingPage() {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = React.useState(null);

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#FFFFEB] px-6 text-center overflow-hidden font-sans">

            {/* Floating Navbar */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 bg-[#FEFFE8]/90 backdrop-blur-xl border border-[#E0E1CF] rounded-full p-1.5 flex items-center shadow-[0_16px_40px_-8px_rgba(10,71,54,0.15)] z-50">
                <div className="pl-5 pr-4 font-black text-[#1a1a2e] text-[15px] tracking-tight cursor-pointer">
                    HayDay
                </div>
                <div className="flex items-center gap-6 px-2 text-[13px] font-semibold text-gray-500">
                    <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
                    <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
                    <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
                </div>
                <div className="w-[1px] h-5 bg-gray-200/80 mx-2"></div>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-[#0A4736] text-white px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-[#073628] transition-all shadow-md active:scale-95"
                >
                    <LogIn size={14} strokeWidth={3} />
                    Log In
                </button>
            </nav>

            {/* Hero Section */}
            <div className="max-w-6xl w-full mt-48 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center text-left px-4">
                {/* Main Headline (Left Partition) */}
                <div className="md:col-span-7">
                    <h1 className="text-[48px] sm:text-[56px] font-black text-[#1a1a2e] leading-[1.1] tracking-tight mb-8">
                        Track Every Animal in Real Time <br />
                        <span className="text-[#0A4736] italic pr-2 font-serif tracking-normal">With Livestock Management Software</span>
                    </h1>
                </div>

                {/* Hero Image (Right Partition) */}
                <div className="md:col-span-5">
                    <img 
                        src={HeroImage} 
                        alt="Livestock Management Dashboard" 
                        className="w-full h-auto object-contain"
                    />
                </div>
            </div>

            {/* Features Section */}
            <div className="w-full border-t border-[#0A4736]/5 mt-20">
                <div className="max-w-6xl mx-auto px-6 py-32">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24">
                        
                        {/* Large Feature Item */}
                        <div className="md:col-span-6 md:pr-16 flex flex-col justify-between min-h-[400px]">
                            <div>
                                <div className="inline-flex items-center gap-2 mb-8">
                                    <Zap size={14} className="text-[#0A4736]" />
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#0A4736]">Real-time Tracking</span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6 text-[#1a1a2e]">
                                    Live. <br />
                                    <span className="text-[#0A4736]">Accurate.</span>
                                </h2>
                                <p className="text-gray-500 font-medium leading-relaxed max-w-sm text-lg">
                                    Monitor every animal's location and health status as it happens. No more manual logs or guesswork.
                                </p>
                            </div>
                            
                            <div className="mt-12">
                                <div className="flex items-center justify-between mb-4 max-w-xs">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Latest Update</span>
                                    <div className="w-2 h-2 rounded-full bg-[#0A4736] animate-pulse"></div>
                                </div>
                                <p className="text-sm font-semibold italic text-[#0A4736]">"Cattle #204 moved to North Pasture"</p>
                            </div>
                        </div>

                        {/* Right Side Items Container */}
                        <div className="md:col-span-6 flex flex-col gap-y-24 md:pl-16 md:border-l border-[#0A4736]/10">
                            {/* Medium Item 1 */}
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-4 opacity-40">
                                    <span className="text-[10px] font-bold tracking-widest uppercase">01 • Health</span>
                                </div>
                                <h3 className="text-2xl font-black text-[#1a1a2e] mb-3">Detailed Vitality Logs.</h3>
                                <p className="text-gray-500 font-medium text-lg max-w-md leading-relaxed">
                                    From vaccinations to weight tracking, maintain a comprehensive medical history for every animal in your herd.
                                </p>
                                <div className="flex gap-2 mt-6">
                                    {['Vax', 'Weight', 'Med', 'Check'].map((tag) => (
                                        <span key={tag} className="text-[#0A4736] text-[10px] font-bold uppercase tracking-widest">
                                            • {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Medium Item 2 */}
                            <div className="flex flex-col justify-center pt-24 border-t border-[#0A4736]/10">
                                <div className="flex items-center gap-2 mb-4 opacity-40">
                                    <span className="text-[10px] font-bold tracking-widest uppercase">02 • Mapping</span>
                                </div>
                                <h3 className="text-2xl font-black text-[#1a1a2e] mb-3">Smart Location History.</h3>
                                <p className="text-gray-500 font-medium text-lg max-w-md leading-relaxed">
                                    Visualize movement patterns over time with interactive maps and historical playback of animal paths.
                                </p>
                                <div className="mt-6 flex items-center gap-4">
                                    <MapPin size={20} className="text-[#0A4736]" />
                                    <div className="flex-1 h-1 bg-[#0A4736]/10 rounded-full overflow-hidden max-w-xs">
                                        <div className="w-[70%] h-full bg-[#0A4736]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row Items */}
                        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 mt-24 pt-24 border-t border-[#0A4736]/10 gap-y-16">
                            {/* Wide Item */}
                            <div className="md:col-span-6 md:pr-16 md:border-r border-[#0A4736]/10">
                                <div className="flex items-center gap-2 mb-4 opacity-40">
                                    <span className="text-[10px] font-bold tracking-widest uppercase">03 • Species</span>
                                </div>
                                <h3 className="text-2xl font-black text-[#1a1a2e] mb-3">Multi-Species Support.</h3>
                                <p className="text-gray-500 font-medium text-lg mb-8 leading-relaxed">
                                    Tailored management workflows for cattle, sheep, goats, and more.
                                </p>
                                <div className="flex gap-8">
                                    <div className="flex items-center gap-3">
                                        <Activity size={20} className="text-[#0A4736]" />
                                        <span className="text-sm font-bold text-[#1a1a2e]">Analytics</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ClipboardList size={20} className="text-[#0A4736]" />
                                        <span className="text-sm font-bold text-[#1a1a2e]">Reports</span>
                                    </div>
                                </div>
                            </div>

                            {/* Small Item 1 */}
                            <div className="md:col-span-3 md:px-12 md:border-r border-[#0A4736]/10">
                                <div className="w-10 h-10 bg-[#0A4736]/5 rounded-xl flex items-center justify-center mb-6">
                                    <ShieldCheck size={24} className="text-[#0A4736]" />
                                </div>
                                <h4 className="font-black text-[#1a1a2e] mb-2">Stays Private.</h4>
                                <p className="text-sm text-gray-500 font-medium">Your farm data is encrypted and secure.</p>
                            </div>

                            {/* Small Item 2 */}
                            <div className="md:col-span-3 md:pl-12">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">Sync</span>
                                    <Cloud size={20} className="text-[#0A4736]" />
                                </div>
                                <h4 className="font-black text-[#1a1a2e] mb-2">Cloud Sync.</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">Access your data anywhere, any time.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Comparison Section */}
            <div className="w-full border-t border-[#0A4736]/5 bg-[#FEFFE8]/20">
                <div className="max-w-4xl mx-auto px-6 py-32 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 opacity-40">
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Why HayDay</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-[#1a1a2e] mb-6 leading-tight">
                        Built for the way you <br />
                        <span className="text-[#0A4736] italic font-serif tracking-normal">actually</span> ranch.
                    </h2>
                    <p className="text-gray-500 font-medium text-lg mb-20 max-w-xl mx-auto leading-relaxed">
                        A clear, honest comparison vs. the alternatives — so you can decide for yourself.
                    </p>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#0A4736]/10">
                                    <th className="py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Capability</th>
                                    <th className="py-6 text-[13px] font-black text-[#0A4736] text-center">HayDay</th>
                                    <th className="py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Paper Logs</th>
                                    <th className="py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Spreadsheets</th>
                                </tr>
                            </thead>
                            <tbody className="text-[13px] font-semibold text-[#1a1a2e]">
                                {[
                                    { cap: 'Real-time multi-species tracking', hay: 'full', pap: 'none', spr: 'partial' },
                                    { cap: 'Automated movement history', hay: 'full', pap: 'none', spr: 'none' },
                                    { cap: 'Health & vitality analytics', hay: 'full', pap: 'partial', spr: 'partial' },
                                    { cap: 'Secure cloud synchronization', hay: 'full', pap: 'none', spr: 'none' },
                                    { cap: 'Multi-user collaboration', hay: 'full', pap: 'none', spr: 'partial' },
                                    { cap: 'Offline-first data entry', hay: 'full', pap: 'full', spr: 'none' },
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-b border-[#0A4736]/5 group">
                                        <td className="py-8 text-gray-600 group-hover:text-[#1a1a2e] transition-colors">{row.cap}</td>
                                        <td className="py-8 text-center">
                                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#DCE9E3] text-[#0A4736]">
                                                <Zap size={12} fill="currentColor" />
                                            </div>
                                        </td>
                                        <td className="py-8 text-center opacity-40">
                                            {row.pap === 'full' ? (
                                                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600">
                                                    <Zap size={12} fill="currentColor" />
                                                </div>
                                            ) : row.pap === 'partial' ? (
                                                <span className="text-[9px] font-bold uppercase tracking-tighter bg-gray-100 px-2 py-0.5 rounded">Partial</span>
                                            ) : (
                                                <span className="text-gray-300">✕</span>
                                            )}
                                        </td>
                                        <td className="py-8 text-center opacity-40">
                                            {row.spr === 'full' ? (
                                                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600">
                                                    <Zap size={12} fill="currentColor" />
                                                </div>
                                            ) : row.spr === 'partial' ? (
                                                <span className="text-[9px] font-bold uppercase tracking-tighter bg-gray-100 px-2 py-0.5 rounded">Partial</span>
                                            ) : (
                                                <span className="text-gray-300">✕</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div id="faq" className="w-full border-t border-[#0A4736]/5">
                <div className="max-w-3xl mx-auto px-6 py-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-black text-[#1a1a2e] mb-4">Common questions.</h2>
                        <p className="text-gray-500 font-medium">If you don't see your question, <a href="#contact" className="text-[#0A4736] underline underline-offset-4 decoration-[#0A4736]/30">get in touch</a>.</p>
                    </div>

                    <div className="flex flex-col border-t border-[#0A4736]/10">
                        {[
                            { q: 'Is HayDay really free?', a: 'Yes! We offer a powerful free tier that includes essential features for individual ranchers and small farms. For larger enterprises requiring advanced analytics and multi-user support, we have premium plans available.' },
                            { q: 'What species are supported?', a: 'Currently, HayDay supports Cattle, Sheep, Goats, and Pigs. We are actively working on adding specialized workflows for Poultry and Equine management in the coming months.' },
                            { q: 'Is my farm data secure?', a: 'Security is our top priority. All your data is encrypted both in transit and at rest. We never share your data with third parties, and it remains exclusively yours.' },
                            { q: 'Does it work without an internet connection?', a: 'Absolutely. We built HayDay with an "offline-first" approach. You can log movements, health checks, and new births in the field, and the app will automatically sync with the cloud once you return to a connection.' },
                            { q: 'Can I collaborate with my team?', a: 'Yes, our premium tiers allow you to invite team members to your ranch with specific roles and permissions, ensuring everyone is on the same page.' },
                            { q: 'How do I export my data?', a: 'You can export all your animal records, movement history, and health logs as CSV or PDF files at any time through the Settings menu.' }
                        ].map((faq, idx) => (
                            <div key={idx} className="border-b border-[#0A4736]/10">
                                <button 
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full py-8 flex items-center justify-between text-left group"
                                >
                                    <span className="text-lg font-bold text-[#1a1a2e] group-hover:text-[#0A4736] transition-colors">{faq.q}</span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openFaq === idx ? 'bg-[#0A4736] text-white rotate-45' : 'bg-[#DCE9E3] text-[#0A4736]'}`}>
                                        <Plus size={18} />
                                    </div>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-96 pb-8' : 'max-h-0'}`}>
                                    <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div id="contact" className="w-full border-t border-[#0A4736]/5">
                <div className="max-w-3xl mx-auto px-6 py-32">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 mb-4 opacity-40">
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Get in touch</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-[#1a1a2e] mb-6">Contact us</h2>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl">
                            Have a question, feedback, or just want to say hi? Fill out the form below and we'll get back to you.
                        </p>
                    </div>

                    <form className="space-y-8">
                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#1a1a2e]">Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Your name" 
                                    className="w-full bg-[#F5F5E6] border border-[#E0E1CF] rounded-xl px-5 py-4 text-[15px] outline-none focus:border-[#0A4736] focus:ring-1 focus:ring-[#0A4736] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#1a1a2e]">Email</label>
                                <input 
                                    type="email" 
                                    placeholder="you@example.com" 
                                    className="w-full bg-[#F5F5E6] border border-[#E0E1CF] rounded-xl px-5 py-4 text-[15px] outline-none focus:border-[#0A4736] focus:ring-1 focus:ring-[#0A4736] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#1a1a2e]">Message</label>
                                <textarea 
                                    placeholder="How can we help?" 
                                    rows={5}
                                    className="w-full bg-[#F5F5E6] border border-[#E0E1CF] rounded-xl px-5 py-4 text-[15px] outline-none focus:border-[#0A4736] focus:ring-1 focus:ring-[#0A4736] transition-all resize-none"
                                ></textarea>
                            </div>
                        </div>
                        <button className="bg-[#0A4736] text-white px-8 py-4 rounded-xl text-[15px] font-bold shadow-lg shadow-[#0A4736]/20 hover:bg-[#073628] transition-all active:scale-95">
                            Send message
                        </button>
                    </form>

                    <div className="mt-20 p-8 bg-[#F4F4E0] border border-[#E0E1CF] rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <h4 className="font-bold text-[#1a1a2e] mb-1">Prefer email?</h4>
                            <p className="text-sm text-gray-500 font-medium">You can also reach us directly at <a href="mailto:support@hayday.me" className="text-[#0A4736] underline underline-offset-4 decoration-[#0A4736]/30">support@hayday.me</a></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="w-full border-t border-[#0A4736]/5 bg-[#FEFFE8]/50">
                <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                        <div className="md:col-span-4 space-y-6">
                            <div className="text-xl font-black text-[#1a1a2e] tracking-tight">HayDay</div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs">
                                Native livestock management powered by cloud infrastructure. Built for the modern rancher who demands accuracy and simplicity.
                            </p>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Product</h5>
                            <ul className="space-y-4 text-[13px] font-semibold text-gray-600">
                                <li><a href="#features" className="hover:text-[#0A4736] transition-colors">Features</a></li>
                                <li><a href="#faq" className="hover:text-[#0A4736] transition-colors">FAQ</a></li>
                                <li><a href="#how-it-works" className="hover:text-[#0A4736] transition-colors">How it works</a></li>
                            </ul>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Tools</h5>
                            <ul className="space-y-4 text-[13px] font-semibold text-gray-600">
                                <li><a href="#" className="hover:text-[#0A4736] transition-colors">Movement History</a></li>
                                <li><a href="#" className="hover:text-[#0A4736] transition-colors">Vitality Analytics</a></li>
                            </ul>
                        </div>
                        <div className="md:col-span-4 space-y-6">
                            <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Company</h5>
                            <ul className="space-y-4 text-[13px] font-semibold text-gray-600">
                                <li><a href="#contact" className="hover:text-[#0A4736] transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-[#0A4736] transition-colors">Privacy Policy</a></li>
                                <li><a href="mailto:contact@hayday.me" className="hover:text-[#0A4736] transition-colors">contact@hayday.me</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-12 border-t border-[#0A4736]/5 gap-6">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            © 2026 HayDay. All rights reserved.
                        </p>
                        <div className="text-[11px] font-bold text-gray-400 tracking-widest lowercase">
                            hayday.me
                        </div>
                    </div>
                </div>
            </footer>

            {/* Subtle Background Gradient Glows */}

            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F5F5DC] rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FAFAD2] rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>
        </div>
    );
}