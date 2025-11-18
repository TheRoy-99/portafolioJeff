import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import contactPic from '../assets/contact-pic.jpg';

export const Contact = () => {
    const [ref, isVisible] = useScrollAnimation();
    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.email) {
            alert(`¡Gracias ${formData.name}! Me pondré en contacto contigo a través de ${formData.email}`);
            setFormData({ name: '', email: '' });
        }
    };

    return (
        <section id="contact" ref={ref} className="py-28 bg-[#f8f8f8]">
            <div className="max-w-6xl mx-auto px-8 md:px-16">
                <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <div className="mb-20">
                                <h2 className="text-[4rem] md:text-[4.5rem] font-semibold mb-6 uppercase tracking-[0.3rem] text-[#332e29] relative pb-8">
                                    CONTÁCTAME
                                    <span className="absolute left-0 bottom-0 w-[70px] h-[3px] bg-[#332e29]"></span>
                                </h2>
                            </div>

                            <div className="space-y-4 mb-12">
                                <p className="flex items-center gap-4 text-[1.5rem] text-[#332e29]">
                                    <Phone className="w-5 h-5" />
                                    +57 320 409 (0821)
                                </p>
                                <p className="flex items-center gap-4 text-[1.5rem] text-[#332e29]">
                                    <Mail className="w-5 h-5" />
                                    rodriduezjeff@gmail.com
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-12 max-w-[500px]">
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="block w-full mb-6 border-2 border-black/30 p-4 text-[1.5rem] outline-none focus:border-black transition-colors"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="block w-full mb-6 border-2 border-black/30 p-4 text-[1.5rem] outline-none focus:border-black transition-colors"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-[#332e29] text-white px-12 py-6 uppercase tracking-[0.2rem] text-[1.6rem] hover:bg-black transition-all duration-300 font-normal">
                                    ENVIAR
                                </button>
                            </form>
                        </div>

                        <div className="h-full min-h-[400px] md:min-h-0">
                            <img 
                                src={contactPic}
                                alt="Contacto - Jefrey Muñoz Rodríguez"
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
