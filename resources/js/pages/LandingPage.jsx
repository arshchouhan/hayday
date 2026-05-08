// Landing Page - Latest Update: 2026-05-09
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Activity, MapPin, ShieldCheck, Cloud, Zap, ClipboardList, Plus, ChevronDown, TrendingUp, GitBranch, Package } from 'lucide-react';
import HeroImage from '../assets/Hero-Support-1.webp';
import TrackingMap from '../assets/first.png';
import MovementChart from '../assets/second.png';
import CostChart from '../assets/third.png';
import PedigreeChart from '../assets/fourth.png';
import InventoryChart from '../assets/fifth.png';
import DashboardImage from '../assets/dashb.png';

const BorderTraceStyles = () => (
    <style dangerouslySetInnerHTML={{ __html: `
        @keyframes borderTrace {
            0% { clip-path: inset(0 100% 100% 0); }
            25% { clip-path: inset(0 0 100% 0); }
            50% { clip-path: inset(0 0 0 0); }
            75% { clip-path: inset(100% 0 0 0); }
            100% { clip-path: inset(100% 100% 0 0); }
        }
        .border-trace::before {
            content: '';
            position: absolute;
            inset: -2px;
            border: 2px solid #0A4736;
            border-radius: inherit;
            animation: borderTrace 4s linear infinite;
            pointer-events: none;
            opacity: 0.4;
        }
    `}} />
);

export default function LandingPage() {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = React.useState(null);

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#FFFFEB] px-6 text-center overflow-hidden font-sans scroll-smooth">
            <BorderTraceStyles />

            {/* Floating Navbar */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 bg-[#FEFFE8]/90 backdrop-blur-xl border border-[#E0E1CF] rounded-full p-1.5 flex items-center shadow-[0_16px_40px_-8px_rgba(10,71,54,0.15)] z-50">
                <div 
                    onClick={() => {
                        navigate('/');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="pl-5 pr-4 font-black text-[#1a1a2e] text-[15px] tracking-tight cursor-pointer hover:opacity-70 transition-opacity"
                >
                    HayDay
                </div>
                <div className="flex items-center gap-8 px-4 text-[13px] font-bold text-gray-400">
                    <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="relative group py-2 hover:text-[#0A4736] transition-all duration-300">
                        Features
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0A4736] transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="relative group py-2 hover:text-[#0A4736] transition-all duration-300">
                        FAQ
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0A4736] transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="relative group py-2 hover:text-[#0A4736] transition-all duration-300">
                        Contact
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0A4736] transition-all duration-300 group-hover:w-full"></span>
                    </a>
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
            <div id="features" className="w-full border-t border-[#0A4736]/5 mt-20">
                <div className="max-w-6xl mx-auto px-6 py-32">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24">
                        
                        {/* Large Feature Item */}
                        <div className="md:col-span-6 md:pr-16 flex flex-col justify-start">
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
                            
                            <div className="mt-8 relative flex justify-center">
                                {/* Polaroid Style Frame */}
                                <div className="relative border-trace bg-white p-4 pb-16 shadow-2xl shadow-[#0A4736]/10 -rotate-2 transform transition-all hover:rotate-0 hover:scale-105 duration-500 max-w-[90%]">
                                    {/* Tape Top Left */}
                                    <div className="absolute -top-6 -left-8 w-24 h-8 bg-[#0A4736]/10 backdrop-blur-sm border border-[#0A4736]/5 rotate-[-35deg] shadow-sm"></div>
                                    {/* Tape Top Right */}
                                    <div className="absolute -top-4 -right-10 w-24 h-8 bg-[#0A4736]/10 backdrop-blur-sm border border-[#0A4736]/5 rotate-[25deg] shadow-sm"></div>
                                    
                                    <img 
                                        src={TrackingMap} 
                                        alt="Live Tracking Map" 
                                        className="w-full h-auto"
                                    />
                                    <div className="absolute bottom-4 left-6">
                                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Live. Feed. 01</span>
                                    </div>
                                </div>
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
                                <div className="mt-8 relative flex justify-center">
                                    {/* Polaroid Style Frame */}
                                    <div className="relative border-trace bg-white p-3 pb-12 shadow-2xl shadow-[#0A4736]/10 rotate-1 transform transition-all hover:rotate-0 hover:scale-105 duration-500 w-full">
                                        {/* Tape Top Right */}
                                        <div className="absolute -top-4 -right-10 w-24 h-8 bg-[#0A4736]/10 backdrop-blur-sm border border-[#0A4736]/5 rotate-[25deg] shadow-sm"></div>
                                        
                                        <img 
                                            src={MovementChart} 
                                            alt="Movement History Chart" 
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pedigree Row */}
                        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 mt-24 pt-24 border-t border-[#0A4736]/10 gap-y-16 items-center">
                            <div className="md:col-span-8 md:pr-16">
                                <div className="relative flex justify-center">
                                    {/* Polaroid Style Frame */}
                                    <div className="relative border-trace bg-white p-4 pb-16 shadow-2xl shadow-[#0A4736]/10 -rotate-1 transform transition-all hover:rotate-0 hover:scale-105 duration-500 w-full">
                                        {/* Tape Top Left */}
                                        <div className="absolute -top-6 -left-8 w-24 h-8 bg-[#0A4736]/10 backdrop-blur-sm border border-[#0A4736]/5 rotate-[-15deg] shadow-sm"></div>
                                        
                                        <img 
                                            src={PedigreeChart} 
                                            alt="Pedigree Tree Chart" 
                                            className="w-full h-auto"
                                        />
                                        <div className="absolute bottom-4 left-6">
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Ancestry. View. 04</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-4 md:pl-8">
                                <div className="flex items-center gap-2 mb-4 opacity-40">
                                    <span className="text-[10px] font-bold tracking-widest uppercase">02 • Pedigree</span>
                                </div>
                                <h3 className="text-2xl font-black text-[#1a1a2e] mb-3">Advanced Pedigree Management.</h3>
                                <p className="text-gray-500 font-medium text-lg max-w-md leading-relaxed">
                                    Map lineages and trace breeding history with ease. Maintain detailed records of sires, dams, and multi-generational ancestry.
                                </p>
                                <div className="mt-6 flex gap-4">
                                    <GitBranch size={20} className="text-[#0A4736]" />
                                    <Activity size={20} className="text-[#0A4736]" />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row Items */}
                        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 mt-24 pt-24 border-t border-[#0A4736]/10 gap-y-16">
                            {/* Wide Item */}
                            <div className="md:col-span-6 md:pr-16 md:border-r border-[#0A4736]/10">
                                <div className="flex items-center gap-2 mb-4 opacity-40">
                                    <span className="text-[10px] font-bold tracking-widest uppercase">03 • Finance</span>
                                </div>
                                <h3 className="text-2xl font-black text-[#1a1a2e] mb-3">Financial Performance Tracking.</h3>
                                <p className="text-gray-500 font-medium text-lg mb-8 leading-relaxed">
                                    Track expenses and gain clear insights into your farm's profitability with automated cost breakdowns.
                                </p>
                                <div className="flex gap-8 mb-10">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp size={20} className="text-[#0A4736]" />
                                        <span className="text-sm font-bold text-[#1a1a2e]">Cost Analytics</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Activity size={20} className="text-[#0A4736]" />
                                        <span className="text-sm font-bold text-[#1a1a2e]">Profit Margin</span>
                                    </div>
                                </div>
                                <div className="relative flex justify-start">
                                    {/* Polaroid Style Frame */}
                                    <div className="relative border-trace bg-white p-3 pb-12 shadow-2xl shadow-[#0A4736]/10 rotate-1 transform transition-all hover:rotate-0 hover:scale-105 duration-500 w-full max-w-[90%]">
                                        {/* Tape Top Right */}
                                        <div className="absolute -top-4 -right-10 w-24 h-8 bg-[#0A4736]/10 backdrop-blur-sm border border-[#0A4736]/5 rotate-[25deg] shadow-sm"></div>
                                        
                                        <img 
                                            src={CostChart} 
                                            alt="Financial Cost Chart" 
                                            className="w-full h-auto"
                                        />
                                        <div className="absolute bottom-4 left-6">
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Finance. Log. 03</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Inventory Management */}
                             <div className="md:col-span-6 md:pl-16">
                                 <div className="flex items-center gap-2 mb-4 opacity-40">
                                     <span className="text-[10px] font-bold tracking-widest uppercase">04 • Supplies</span>
                                 </div>
                                 <h4 className="text-2xl font-black text-[#1a1a2e] mb-3">Inventory Management.</h4>
                                 <p className="text-gray-500 font-medium text-lg mb-8 leading-relaxed">
                                     Keep track of your farm's vital supplies. From feed stocks to medical inventory, manage resources efficiently.
                                 </p>
                                 <div className="flex gap-8 mb-10">
                                     <div className="flex items-center gap-3">
                                         <TrendingUp size={20} className="text-[#0A4736]" />
                                         <span className="text-sm font-bold text-[#1a1a2e]">Analytics</span>
                                     </div>
                                     <div className="flex items-center gap-3">
                                         <Package size={20} className="text-[#0A4736]" />
                                         <span className="text-sm font-bold text-[#1a1a2e]">Stock Control</span>
                                     </div>
                                 </div>
                                 <div className="relative flex justify-start">
                                     {/* Polaroid Style Frame */}
                                     <div className="relative border-trace bg-white p-3 pb-12 shadow-2xl shadow-[#0A4736]/10 -rotate-1 transform transition-all hover:rotate-0 hover:scale-105 duration-500 w-full max-w-[90%]">
                                         {/* Tape Top Left */}
                                         <div className="absolute -top-6 -left-8 w-24 h-8 bg-[#0A4736]/10 backdrop-blur-sm border border-[#0A4736]/5 rotate-[-15deg] shadow-sm"></div>
                                         
                                         <img 
                                             src={InventoryChart} 
                                             alt="Inventory Management Chart" 
                                             className="w-full h-auto"
                                         />
                                         <div className="absolute bottom-4 left-6">
                                             <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Supplies. Log. 05</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Comparison Section */}
            <div id="pricing" className="w-full border-t border-[#0A4736]/5 bg-[#FEFFE8]/20">
                <div className="max-w-6xl mx-auto px-6 py-32 text-center">
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

                    <div className="mb-24 relative group">
                        <div className="absolute -inset-4 bg-[#0A4736]/5 rounded-[2.5rem] blur-2xl group-hover:bg-[#0A4736]/10 transition-all duration-700"></div>
                        <img 
                            src={DashboardImage} 
                            alt="HayDay Dashboard Overview" 
                            className="relative w-full h-auto rounded-[2rem] border border-[#0A4736]/10 shadow-2xl shadow-[#0A4736]/5"
                        />
                    </div>

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
                                    { cap: 'Real-time Animal Tracking', hay: 'full', pap: 'none', spr: 'partial' },
                                    { cap: 'Detailed Vitality & Health Logs', hay: 'full', pap: 'partial', spr: 'partial' },
                                    { cap: 'Advanced Pedigree Management', hay: 'full', pap: 'none', spr: 'none' },
                                    { cap: 'Effective Cost Management', hay: 'full', pap: 'none', spr: 'none' },
                                    { cap: 'Smart Inventory Control', hay: 'full', pap: 'none', spr: 'partial' },
                                    { cap: 'Offline-first Field Access', hay: 'full', pap: 'full', spr: 'none' },
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
                            <p className="text-sm text-gray-500 font-medium">You can also reach us directly at <a href="mailto:arshchouhan004@gmail.com" className="text-[#0A4736] underline underline-offset-4 decoration-[#0A4736]/30">arshchouhan004@gmail.com</a></p>
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
                                <li><a href="mailto:arshchouhan004@gmail.com" className="hover:text-[#0A4736] transition-colors">arshchouhan004@gmail.com</a></li>
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