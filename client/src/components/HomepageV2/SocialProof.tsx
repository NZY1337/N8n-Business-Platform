import { motion } from 'framer-motion';

export default function SocialProof() {
    const industries = ['Contabilitate', 'Imobiliare', 'Clinici Medicale', 'E-commerce', 'Servicii Profesionale'];

    return (
        <section className="py-16 border-y-2 border-black bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-center text-[10px] font-black text-black/40 mb-10 uppercase tracking-[0.4em]">
                    Construim automatizări pentru afaceri din
                </p>

                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-80">
                    {industries.map((label, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="text-xl md:text-2xl font-bold tracking-tight uppercase"
                        >
                            {label}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
