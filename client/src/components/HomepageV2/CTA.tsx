import { motion } from 'framer-motion';

export default function CTA() {
    return (
        <section className="py-32 relative px-6 bg-black text-white">
            <div className="max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-10 leading-tight">
                        Ești gata să <br />
                        <span className="text-[#7592ff]">automatizezi ce te consumă?</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto font-medium">
                        Alătură-te afacerilor care au recâștigat ore întregi din săptămână cu automatizări AI. Primul audit e gratuit.
                    </p>
                    <button className="bg-[#465fff] text-white px-12 py-6 font-black uppercase tracking-tight text-2xl shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transition-all">
                        Programează Audit Gratuit
                    </button>
                    <p className="mt-8 text-xs font-bold uppercase tracking-widest text-white/30">Fără obligații. Răspuns în 24h.</p>
                </motion.div>
            </div>
        </section>
    );
}
