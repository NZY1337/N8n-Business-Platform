import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        description: 'O automatizare, mentenanță inclusă',
        price: { monthly: 450, yearly: 375 },
        features: [
            '1 automatizare activă',
            'Integrare cu o aplicație (Gmail, Sheets, etc.)',
            'Monitorizare & suport prin email',
            'Ajustări minore incluse'
        ]
    },
    {
        name: 'Growth',
        description: 'Pentru afaceri care vor să scaleze',
        price: { monthly: 950, yearly: 750 },
        popular: true,
        features: [
            'Până la 3 automatizări active',
            'Integrări nelimitate',
            'Dashboard cu date live',
            'Suport prioritar',
            'Ajustări incluse lunar'
        ]
    },
    {
        name: 'Scale',
        description: 'Automatizare completă a proceselor',
        price: { monthly: 1900, yearly: 1500 },
        features: [
            'Tot ce include Growth',
            'Automatizări nelimitate',
            'Agenți AI custom (Claude/GPT)',
            'Revizuire lunară a proceselor',
            'Acces prioritar la funcții noi'
        ]
    }
];

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(true);

    return (
        <section id="preturi" className="py-32 relative bg-white border-t-2 border-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[2px] w-12 bg-[#465fff]" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Prețuri</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-12">
                        Alege planul <br />
                        <span className="text-gray-400">potrivit pentru tine</span>
                    </h2>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsYearly(false)}
                            className={`text-sm font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${!isYearly ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                        >
                            Lunar
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={`text-sm font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${isYearly ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                        >
                            Anual <span className="text-white bg-[#465fff] px-2 py-0.5 ml-2">-20%</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`relative p-10 border-2 border-black shadow-[4px_4px_0px_0px_#000000] transition-all ${plan.popular ? 'bg-[#465fff]' : 'bg-white'
                                }`}
                        >
                            <h3 className={`text-3xl font-black tracking-tight mb-2 ${plan.popular ? 'text-white' : 'text-black'}`}>{plan.name}</h3>
                            <p className={`text-sm font-bold mb-8 h-10 ${plan.popular ? 'text-white/70' : 'text-black/60'}`}>{plan.description}</p>

                            <div className="mb-10">
                                <span className={`text-6xl font-black ${plan.popular ? 'text-white' : 'text-black'}`}>{isYearly ? plan.price.yearly : plan.price.monthly}</span>
                                <span className={`text-xl font-bold uppercase ${plan.popular ? 'text-white' : 'text-black'}`}> lei/lună</span>
                            </div>

                            <button className={`w-full py-5 font-black uppercase tracking-tight text-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] mb-10 transition-all ${plan.popular ? 'bg-white text-[#465fff] hover:bg-gray-50' : 'bg-black text-white hover:bg-[#465fff] hover:border-[#465fff]'
                                }`}>
                                Cere Ofertă
                            </button>

                            <ul className="space-y-5">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className={`flex items-start gap-4 text-sm font-bold uppercase tracking-tight ${plan.popular ? 'text-white' : 'text-black'}`}>
                                        <Check className="w-5 h-5 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
