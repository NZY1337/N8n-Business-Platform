const Results = () => {
    const cases = [
        { name: "Cabinet Contabilitate", before: "6 ore/săpt.", after: "45 min/săpt.", time: "3 Săptămâni", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop" },
        { name: "Agenție Imobiliară", before: "24h răspuns", after: "5 min răspuns", time: "2 Săptămâni", img: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=800&auto=format&fit=crop" },
    ];

    return (
        <section id="rezultate" className="py-20 md:py-24 overflow-hidden bg-black">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-12 border-l-8 border-[#465fff] pl-6 leading-tight">Rezultate<br />Fără Filtru</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {cases.map((c, i) => (
                        <div key={i} className="group relative border-4 border-black bg-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                            <div className="h-64 sm:h-80 md:h-96 relative overflow-hidden">
                                <img src={c.img} alt={c.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                <div className="absolute top-4 left-4 bg-[#465fff] text-white px-3 py-1 font-black uppercase text-[10px]">După Implementare</div>
                            </div>
                            <div className="p-6 md:p-8 border-t-4 border-black">
                                <div className="flex justify-between items-end mb-4">
                                    <h3 className="text-2xl md:text-3xl font-bold">{c.name}</h3>
                                    <span className="bg-[#465fff] text-white px-3 md:px-4 py-1 font-black text-xs md:text-sm border-2 border-black">{c.time}</span>
                                </div>
                                <div className="flex gap-4 md:gap-8">
                                    <div><p className="text-[10px] font-bold uppercase text-zinc-500 tracking-tighter">Înainte</p><p className="text-lg md:text-xl font-black">{c.before}</p></div>
                                    <div className="w-px h-8 md:h-10 bg-zinc-200"></div>
                                    <div><p className="text-[10px] font-bold uppercase text-zinc-500 tracking-tighter">Acum</p><p className="text-lg md:text-xl font-black text-green-600">{c.after}</p></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Results;
