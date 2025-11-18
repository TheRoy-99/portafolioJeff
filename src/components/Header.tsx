import { Mail, Instagram } from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';
import headerBanner from '../assets/header-banner.jpg';

export const Header = () => {
    const words = ['FOTÓGRAFO', 'FILMMAKER', 'EDITOR'];
    const typewriterText = useTypewriter(words, 100, 2000);

    return (
        <header 
            className="relative h-screen flex items-end justify-start bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${headerBanner})`
            }}>
            <div className="max-w-6xl mx-auto px-8 md:px-16 w-full pb-24">
                <h1 className="text-[5.5rem] md:text-[8rem] font-semibold text-white mb-4 uppercase leading-none tracking-tight">
                    HOLA, SOY<br />
                    <span className="inline-block min-h-[1.2em]">
                        {typewriterText}<span className="animate-pulse">|</span>
                    </span>
                </h1>
                <h3 className="text-[1.4rem] md:text-[1.6rem] text-white font-light tracking-[0.5em] uppercase mt-8 mb-0">
                    JEFREY MUÑOZ RODRÍGUEZ
                </h3>

                <div className="flex gap-6 mt-16">
                    <a 
                        href="mailto:rodriduezjeff@gmail.com"
                        className="w-12 h-12 bg-white flex items-center justify-center hover:opacity-80 transition-all duration-300"
                        aria-label="Enviar correo electrónico">
                        <Mail className="w-5 h-5 text-gray-900" />
                    </a>
                    <a 
                        href="https://instagram.com/tu_usuario" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white flex items-center justify-center hover:opacity-80 transition-all duration-300"
                        aria-label="Visitar perfil de Instagram">
                        <Instagram className="w-5 h-5 text-gray-900" />
                    </a>
                </div>
            </div>
        </header>
    );
};
