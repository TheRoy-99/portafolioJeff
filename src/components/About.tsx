import { ChevronDown } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import aboutPic from '../assets/about-pic.jpg';

export const About = () => {
    const [ref, isVisible] = useScrollAnimation();

    return (
        <section id="about" ref={ref} className="py-28 bg-white">
            <div className="max-w-6xl mx-auto px-8 md:px-16">
                <div className={`grid md:grid-cols-2 gap-20 items-start transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="w-full h-[520px] overflow-hidden">
                        <img
                            src={aboutPic}
                            alt="Jefrey Muñoz Rodríguez - Filmmaker y Editor"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div>
                        <div className="mb-16">
                            <h2 className="text-[4rem] md:text-[4.5rem] font-semibold mb-6 uppercase tracking-[0.3rem] text-[#332e29] relative pb-8">
                                ACERCA DE MÍ
                                <span className="absolute left-0 bottom-0 w-[70px] h-[3px] bg-[#332e29]"></span>
                            </h2>
                        </div>

                        <p className="text-[#332e29] text-[1.7rem] leading-[1.9] mb-8 opacity-90 font-light">
                            Soy un joven apasionado y trabajador, con una profunda pasión por el cine y los medios audiovisuales. Me considero una persona creativa, siempre en búsqueda de nuevas formas de expresión artística y narrativa. Tengo un fuerte compromiso con mi trabajo y una gran determinación para alcanzar mis metas.
                        </p>
                        <p className="text-[#332e29] text-[1.7rem] leading-[1.9] mb-12 opacity-90 font-light">
                            Estoy emocionado por las oportunidades que el mundo del cine ofrece y tengo la firme convicción de que puedo hacer una contribución significativa en esta industria. Mi objetivo es seguir aprendiendo y creciendo profesionalmente, buscando siempre nuevos desafíos.
                        </p>

                        <a
                            href="#work"
                            className="inline-block text-[5rem] text-[#332e29] hover:opacity-70 transition-all duration-300 hover:translate-y-2 transform"
                            aria-label="Ver experiencia">
                            <ChevronDown strokeWidth={1.5} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
