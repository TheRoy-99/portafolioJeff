import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import port1 from '../assets/port-1.jpg';
import port2 from '../assets/port-2.jpg';
import port3 from '../assets/port-3.jpg';
import port4 from '../assets/port-4.jpg';
import port5 from '../assets/port-5.jpg';
import port6 from '../assets/port-6.jpg';
import port7 from '../assets/port-7.jpg';

type Category = 'Todos' | 'Naturaleza' | 'Retratos' | 'Paisajes' | 'Eventos';

export const Portafolio = () => {
    const [ref, isVisible] = useScrollAnimation();
    const [filter, setFilter] = useState<Category>('Todos');
    const [selected, setSelected] = useState<string | null>(null);

    // Ajusta categorías según cada foto real
    const images = [
        { src: port1, alt: 'Ciervo en la naturaleza', category: 'Naturaleza' as Category },
        { src: port2, alt: 'Excursionista en la montaña', category: 'Paisajes' as Category },
        { src: port3, alt: 'Costa rocosa al atardecer', category: 'Paisajes' as Category },
        { src: port4, alt: 'Montañas y lago', category: 'Paisajes' as Category },
        { src: port5, alt: 'Retrato en bosque otoñal', category: 'Retratos' as Category },
        { src: port6, alt: 'Ciudad al atardecer', category: 'Eventos' as Category },
        { src: port7, alt: 'Personas en la playa', category: 'Eventos' as Category }
    ];

    const categories: Category[] = ['Todos', 'Naturaleza', 'Retratos', 'Paisajes', 'Eventos'];
    const filtered = filter === 'Todos' ? images : images.filter((img) => img.category === filter);

    return (
        <section id="portfolio" ref={ref} className="min-h-screen py-28 bg-white">
            <div className="max-w-6xl mx-auto px-8 md:px-16">
                <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="mb-12">
                        <h2 className="text-[4rem] md:text-[4.5rem] font-semibold mb-6 uppercase tracking-[0.3rem] text-[#332e29] relative pb-8">
                            PORTAFOLIO
                            <span className="absolute left-0 bottom-0 w-[70px] h-[3px] bg-[#332e29]"></span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-6 mb-12 text-[1.2rem]">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`uppercase tracking-wider pb-1 border-b-2 transition-all ${filter === cat ? 'border-[#332e29] text-[#332e29]' : 'border-transparent text-gray-400 hover:text-[#332e29]'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                        {filtered.map((image, i) => (
                            <button
                                key={i}
                                onClick={() => setSelected(image.src)}
                                className="h-[300px] overflow-hidden cursor-pointer transition-all duration-300 hover:opacity-80"
                                aria-label={`Ampliar: ${image.alt}`}>
                                <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    <a href="#contact" className="inline-block text-[5rem] text-[#332e29] hover:opacity-70 transition-all duration-300 hover:translate-y-2 transform" aria-label="Ir a contacto">
                        <ChevronDown strokeWidth={1.5} />
                    </a>
                </div>
            </div>

            {selected && (
                <div
                    className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-8"
                    onClick={() => setSelected(null)}>
                    <button
                        className="absolute top-8 right-8 text-white"
                        onClick={() => setSelected(null)}
                        aria-label="Cerrar">
                        <X className="w-8 h-8" />
                    </button>
                    <img src={selected} alt="Vista ampliada" className="max-w-full max-h-full object-contain" />
                </div>
            )}
        </section>
    );
};