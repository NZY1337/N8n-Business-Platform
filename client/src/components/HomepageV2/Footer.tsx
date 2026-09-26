export default function Footer() {
    return (
        <footer className="py-20 bg-white border-t-2 border-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-[#465fff] flex items-center justify-center text-white font-black text-xl">S</div>
                            <span className="text-xl font-black tracking-tighter uppercase">Streamloop</span>
                        </div>
                        <p className="text-sm font-bold text-gray-400 leading-relaxed">
                            Automatizări AI pentru afaceri care vor să crească fără să angajeze mai mulți oameni.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-tight mb-6">Servicii</h4>
                        <ul className="space-y-3 text-sm font-bold text-gray-400">
                            <li><a href="#servicii" className="hover:text-black transition-colors">Automatizări AI</a></li>
                            <li><a href="#preturi" className="hover:text-black transition-colors">Prețuri</a></li>
                            <li><a href="#rezultate" className="hover:text-black transition-colors">Rezultate</a></li>
                            <li><a href="#cum-lucram" className="hover:text-black transition-colors">Cum Lucrăm</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-tight mb-6">Companie</h4>
                        <ul className="space-y-3 text-sm font-bold text-gray-400">
                            <li><a href="#" className="hover:text-black transition-colors">Despre Noi</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-tight mb-6">Legal</h4>
                        <ul className="space-y-3 text-sm font-bold text-gray-400">
                            <li><a href="#" className="hover:text-black transition-colors">Confidențialitate</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Termeni & Condiții</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Politica Cookie</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                    <p>© {new Date().getFullYear()} Streamloop. Toate drepturile rezervate.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-black transition-colors">Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
