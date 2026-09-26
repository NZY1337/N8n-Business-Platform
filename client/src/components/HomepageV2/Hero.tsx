import { motion } from 'framer-motion';
import { Play, Zap } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
            {/* Background Large Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-gray-100 pointer-events-none select-none uppercase">AUTOMATE</div>

            {/* Background Accent Square */}
            <div className="absolute top-[15%] right-[35%] w-32 h-32 bg-[#465fff]/20 -z-10" />

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <div className="h-[2px] w-12 bg-[#465fff]" />
                            <span className="text-xs font-black uppercase tracking-[0.3em]">Automatizări AI pentru afaceri</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[0.95]"
                        >
                            <h2 className="text-4xl sm:text-3xl md:text-7xl font-extrabold text-black leading-[1] mb-8">
                                Nu doar <br className="hidden sm:block" />
                                automatizare. <br className="hidden sm:block" />
                                <span className="bg-[#465fff] text-white px-4 py-2 inline-block mt-2 sm:mt-0">
                                    Timp câștigat.
                                </span>
                            </h2>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-gray-500 text-lg md:text-xl mb-12 max-w-lg leading-relaxed"
                        >
                            Construim automatizări AI care preiau muncile repetitive din afacerea ta — facturi, lead-uri, rapoarte — ca tu să te ocupi de ce contează cu adevărat.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap items-center gap-6"
                        >
                            <button className="bg-[#465fff] text-white px-10 py-5 font-black uppercase tracking-tight text-lg shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                                Audit Gratuit
                            </button>
                            <button className="flex items-center gap-3 px-10 py-5 border-2 border-black font-black uppercase tracking-tight text-lg hover:bg-[#465fff] hover:border-[#465fff] hover:text-white transition-all group">
                                <Play className="w-5 h-5 fill-current" />
                                Vezi un Demo
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Image Content */}
                    <motion.div
                        initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
                        animate={{ opacity: 1, rotate: -2, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative"
                    >
                        <div className="relative z-10 bg-black p-2 shadow-[8px_8px_0px_0px_#000000] transform -rotate-2">
                            <div className="relative aspect-square overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                                    alt="Automatizare AI"
                                    className="w-full h-full object-cover grayscale contrast-125"
                                    referrerPolicy="no-referrer"
                                />

                                {/* Status Bar Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-[#7592ff] tracking-widest mb-1">Automatizare Activă</p>
                                        <p className="text-xl font-black text-white uppercase">Ore Economisite: 12/săpt</p>
                                    </div>
                                    <Zap className="w-8 h-8 text-[#7592ff] fill-[#7592ff]" />
                                </div>
                            </div>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#465fff]/20 -z-10 rounded-full blur-3xl" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
