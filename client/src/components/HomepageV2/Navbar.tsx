import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Link } from 'react-router';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { session } = useAppContext();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#465fff] flex items-center justify-center text-white font-black text-xl">S</div>
                    <span className="text-xl font-black tracking-tighter uppercase">Streamloop</span>
                </div>

                <div className="hidden md:flex items-center gap-10 text-[13px] font-bold tracking-widest uppercase">
                    <a href="#servicii" className="hover:text-gray-500 transition-colors">Servicii</a>
                    <a href="#cum-lucram" className="hover:text-gray-500 transition-colors">Cum Lucrăm</a>
                    <a href="#rezultate" className="hover:text-gray-500 transition-colors">Rezultate</a>
                    <a href="#industrii" className="hover:text-gray-500 transition-colors">Industrii</a>
                    <a href="#preturi" className="hover:text-gray-500 transition-colors">Prețuri</a>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {session ? (
                        <Link to="/dashboard">
                            <button className="bg-black text-white px-8 py-3 font-bold uppercase tracking-tighter text-sm hover:bg-[#465fff] hover:border-[#465fff] transition-all transform border-2 border-black">
                                Dashboard
                            </button>
                        </Link>
                    ) : (
                        <Link to="/signup">
                            <button className="bg-black text-white px-8 py-3 font-bold uppercase tracking-tighter text-sm hover:bg-[#465fff] hover:border-[#465fff] transition-all transform border-2 border-black">
                                Cere o Ofertă
                            </button>
                        </Link>
                    )}
                </div>

                <button
                    className="md:hidden text-black"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-6 shadow-xl"
                >
                    <a href="#servicii" className="text-sm font-bold tracking-widest uppercase" onClick={() => setMobileMenuOpen(false)}>Servicii</a>
                    <a href="#cum-lucram" className="text-sm font-bold tracking-widest uppercase" onClick={() => setMobileMenuOpen(false)}>Cum Lucrăm</a>
                    <a href="#rezultate" className="text-sm font-bold tracking-widest uppercase" onClick={() => setMobileMenuOpen(false)}>Rezultate</a>
                    <a href="#industrii" className="text-sm font-bold tracking-widest uppercase" onClick={() => setMobileMenuOpen(false)}>Industrii</a>
                    <a href="#preturi" className="text-sm font-bold tracking-widest uppercase" onClick={() => setMobileMenuOpen(false)}>Prețuri</a>
                    <Link to="/signup">
                        <button className="w-full bg-black text-white px-8 py-4 font-bold text-sm tracking-widest uppercase">Cere o Ofertă</button>
                    </Link>
                </motion.div>
            )}
        </nav>
    );
}
