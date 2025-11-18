import instaPic from '../assets/insta-pic.jpg';
import aboutPic from '../assets/about-pic.jpg';
import port1 from '../assets/port-1.jpg';
import port3 from '../assets/port-3.jpg';
import port5 from '../assets/port-5.jpg';
import port7 from '../assets/port-7.jpg';

export const Footer = () => {
    const instaPics = [
        { src: port1, alt: 'Instagram - Trabajo 1' },
        { src: port3, alt: 'Instagram - Trabajo 2' },
        { src: port5, alt: 'Instagram - Trabajo 3' },
        { src: port7, alt: 'Instagram - Trabajo 4' }
    ];

    return (
        <footer 
            className="bg-fixed bg-cover bg-center min-h-[65vh] py-28"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${instaPic})`
            }}>
            <div className="max-w-6xl mx-auto px-8 md:px-16">
                <div className="text-center mb-20">
                    <h2 className="text-[4rem] md:text-[4.5rem] font-semibold mb-6 uppercase tracking-[0.3rem] text-white relative inline-block pb-8">
                        INSTAGRAM
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[70px] h-[3px] bg-white"></span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
                    {instaPics.map((image, i) => (
                        <div key={i} className="h-[250px] overflow-hidden cursor-pointer transition-all duration-300 hover:scale-90">
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                <div className="text-center pt-12 border-t border-white/20">
                    <h3 className="text-3xl font-medium mb-8 tracking-wider text-white">Jefrey Muñoz Rodríguez</h3>
                    
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden mx-auto my-20">
                        <img
                            src={aboutPic}
                            alt="Jefrey Muñoz Rodríguez"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <ul className="flex justify-center gap-8 text-white text-[1.5rem]">
                        <li><a href="#about" className="hover:opacity-70 transition-opacity duration-300">Acerca de mí</a></li>
                        <li><a href="#work" className="hover:opacity-70 transition-opacity duration-300">Experiencia</a></li>
                        <li><a href="#portfolio" className="hover:opacity-70 transition-opacity duration-300">Portafolio</a></li>
                        <li><a href="#contact" className="hover:opacity-70 transition-opacity duration-300">Contáctame</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};
