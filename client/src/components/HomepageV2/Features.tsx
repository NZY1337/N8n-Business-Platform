import { motion } from 'framer-motion';
import { Brain, Workflow, LineChart, Target, Bell, Zap } from 'lucide-react';

const features = [
    {
        icon: <Brain className="w-8 h-8" />,
        title: 'Agenți AI Personalizați',
        description: 'Automatizări construite cu Claude/GPT care înțeleg contextul afacerii tale, nu doar reguli fixe.'
    },
    {
        icon: <Workflow className="w-8 h-8" />,
        title: 'Integrare n8n',
        description: 'Conectăm toate aplicațiile tale — Gmail, Sheets, CRM, facturare — într-un singur flux automat.'
    },
    {
        icon: <LineChart className="w-8 h-8" />,
        title: 'Dashboard Live',
        description: 'Vezi exact ce a făcut fiecare automatizare, câte task-uri a procesat și unde a economisit timp.'
    },
    {
        icon: <Target className="w-8 h-8" />,
        title: 'Mentenanță & Facturare',
        description: 'Abonament lunar clar, fără costuri ascunse. Monitorizăm și optimizăm continuu automatizările tale.'
    },
    {
        icon: <Bell className="w-8 h-8" />,
        title: 'Notificări Instant',
        description: 'Primești alerte pe email sau Slack de fiecare dată când ceva necesită atenția ta.'
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: 'Ajustări Rapide',
        description: 'Afacerea se schimbă? Actualizăm automatizarea în câteva zile, nu luni.'
    }
];

export default function Features() {
    return (
        <section id="servicii" className="py-32 relative bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[2px] w-12 bg-[#465fff]" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Servicii</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Tot ce ai nevoie <br />
                        <span className="text-gray-400">pentru a automatiza</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="p-10 border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all bg-white group"
                        >
                            <div className="mb-8 text-[#465fff] group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight mb-4">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
