import { motion } from 'framer-motion';

const testimonials = [
    {
        quote: "Automatizarea de procesare facturi ne-a eliberat aproape o zi întreagă pe săptămână. Nu mai stăm cu ochii pe emailuri.",
        author: "Cabinet contabilitate, Cluj",
        role: "Client din 2026",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop"
    },
    {
        quote: "Lead-urile de pe site ajung acum clasificate și cu răspuns automat în câteva minute, nu a doua zi. Se simte în conversii.",
        author: "Agenție imobiliară, București",
        role: "Client din 2026",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop"
    },
    {
        quote: "Nu am nicio cunoștință tehnică, dar dashboard-ul e simplu — văd exact câte task-uri a procesat automatizarea în fiecare lună.",
        author: "Cabinet medical, Timișoara",
        role: "Client din 2026",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop"
    }
];

export default function Testimonials() {
    return (
        <section id="testimoniale" className="py-32 relative bg-gray-50 border-t-2 border-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[2px] w-12 bg-[#465fff]" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Testimoniale</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Afaceri reale. <br />
                        <span className="text-gray-400">Ore recâștigate.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="p-10 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000000]"
                        >
                            <p className="text-xl font-bold italic mb-10 leading-relaxed">
                                "{testimonial.quote}"
                            </p>
                            <div className="flex items-center gap-5">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.author}
                                    className="w-16 h-16 border-2 border-black grayscale"
                                    referrerPolicy="no-referrer"
                                />
                                <div>
                                    <div className="font-bold text-lg">{testimonial.author}</div>
                                    <div className="text-xs font-bold uppercase text-gray-400 tracking-widest">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
