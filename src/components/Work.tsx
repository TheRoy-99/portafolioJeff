import { ChevronDown } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import workPic from '../assets/work-pic.jpg';
import wildlifeIcon from '../assets/wildlife-icon.png';
import portraitIcon from '../assets/portrait-icon.png';
import landscapeIcon from '../assets/landscape-icon.png';
import familyIcon from '../assets/family-icon.png';

export const Work = () => {
    const [ref, isVisible] = useScrollAnimation();

    const services = [
        { icon: wildlifeIcon, title: 'Naturaleza' },
        { icon: portraitIcon, title: 'Retratos' },
        { icon: landscapeIcon, title: 'Paisajes' },
        { icon: familyIcon, title: 'Eventos' }
    ];

    return (
        <section 
            id="work" 
            ref={ref} 
            className="min-h-screen flex items-center py-28 bg-fixed bg-cover bg-center bg-no-repeat text-white"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${workPic})`
            }}>
            <div className="max-w-6xl mx-auto px-8 md:px-16 w-full">
                <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="mb-16">
                        <h2 className="text-[4rem] md:text-[4.5rem] font-semibold mb-6 uppercase tracking-[0.3rem] relative pb-8">
                            EXPERIENCIA
                            <span className="absolute left-0 bottom-0 w-[70px] h-[3px] bg-white"></span>
                        </h2>
                    </div>

                    <div className="mb-20">
                        <ul className="space-y-8 text-[1.7rem] leading-[1.9] opacity-90 font-light max-w-3xl">
                            <li className="flex items-start gap-4">
                                <span className="mt-2 text-[2rem]">•</span>
                                <div>
                                    <h3 className="font-medium text-[2rem] mb-2">Videoclip Musical "Quiéreme"</h3>
                                    <p>Participé como asistente de dirección, coordinando actividades en el set y apoyando en la planificación de la filmación, asegurando la ejecución efectiva de la visión creativa del proyecto.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="mt-2 text-[2rem]">•</span>
                                <div>
                                    <h3 className="font-medium text-[2rem] mb-2">Serie Documental "Encuadre 2"</h3>
                                    <p>Participé en tres capítulos desempeñando roles clave como director de fotografía, director de arte y productor. Estas experiencias me permitieron contribuir significativamente a la estética visual y gestión del proyecto, fortaleciendo mi habilidad para contar historias a través de la imagen.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center mb-16">
                        {services.map((service, i) => (
                            <div key={i} className="flex flex-col items-center transform hover:scale-110 transition-all duration-300">
                                <img 
                                    src={service.icon} 
                                    alt={service.title}
                                    className="w-[60px] h-[60px] mb-8 object-contain" 
                                />
                                <h4 className="text-[1.8rem] font-normal">{service.title}</h4>
                            </div>
                        ))}
                    </div>

                    <a 
                        href="#portfolio" 
                        className="inline-block text-[5rem] hover:opacity-70 transition-all duration-300 hover:translate-y-2 transform"
                        aria-label="Ver portafolio">
                        <ChevronDown strokeWidth={1.5} />
                    </a>
                </div>
            </div>
        </section>
    );
};
