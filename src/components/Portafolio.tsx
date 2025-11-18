import { ChevronDown } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import port1 from '../assets/port-1.jpg';
import port2 from '../assets/port-2.jpg';
import port3 from '../assets/port-3.jpg';
import port4 from '../assets/port-4.jpg';
import port5 from '../assets/port-5.jpg';
import port6 from '../assets/port-6.jpg';
import port7 from '../assets/port-7.jpg';

export const Portafolio = () => {
    const [ref, isVisible] = useScrollAnimation();

    const images = [
        { src: port1, alt: 'Proyecto de fotografía artística 1' },
        { src: port2, alt: 'Proyecto de fotografía artística 2' },
        { src: port3, alt: 'Proyecto de fotografía artística 3' },
        { src: port4, alt: 'Proyecto de fotografía artística 4' },
        { src: port5, alt: 'Proyecto de fotografía artística 5' },
        { src: port6, alt: 'Proyecto de fotografía artística 6' },
        { src: port7, alt: 'Proyecto de fotografía artística 7' }
    ];

    return (
        <section id="portfolio" ref={ref} className="min-h-screen py-28 bg-white">
            <div className="max-w-6xl mx-auto px-8 md:px-16">
                <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="mb-20">
                        <h2 className="text-[4rem] md:text-[4.5rem] font-semibold mb-6 uppercase tracking-[0.3rem] text-[#332e29] relative pb-8">
                            PORTAFOLIO
                            <span className="absolute left-0 bottom-0 w-[70px] h-[3px] bg-[#332e29]"></span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                        {images.map((image, i) => (
                            <div 
                                key={i} 
                                className={`h-[300px] overflow-hidden cursor-pointer transition-all duration-300 hover:scale-90 
                                    ${i === 1 ? 'lg:col-span-2' : ''} 
                                    ${i === 5 ? 'lg:col-span-2' : ''}`}>
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    <a 
                        href="#contact" 
                        className="inline-block text-[5rem] text-[#332e29] hover:opacity-70 transition-all duration-300 hover:translate-y-2 transform"
                        aria-label="Ir a contacto">
                        <ChevronDown strokeWidth={1.5} />
                    </a>
                </div>
            </div>
        </section>
    );
};
