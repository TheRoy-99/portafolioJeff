import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Phone } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import contactPic from '../assets/contact-pic.jpg';

export const Contact = () => {
    const [ref, isVisible] = useScrollAnimation();
    const [formData, setFormData] = useState({ name: '', email: '', honeypot: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.honeypot) return; // bot trap, no enviar

        setStatus('sending');
        try {
            await emailjs.send(
                'TU_SERVICE_ID',
                'TU_TEMPLATE_ID',
                { from_name: formData.name, from_email: formData.email },
                'TU_PUBLIC_KEY'
            );
            setStatus('sent');
            setFormData({ name: '', email: '', honeypot: '' });
        } catch {
            setStatus('error');
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
                                    name="honeypot"
                                    value={formData.honeypot}
                                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                                    className="hidden"
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="block w-full mb-6 border-2 border-black/30 p-4 text-[1.5rem] outline-none focus:border-black transition-colors"
                                    required
                                    minLength={2}
                                    maxLength={100}
                                />
                                <input
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="block w-full mb-6 border-2 border-black/30 p-4 text-[1.5rem] outline-none focus:border-black transition-colors"
                                    required
                                    maxLength={150}
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="bg-[#332e29] text-white px-12 py-6 uppercase tracking-[0.2rem] text-[1.6rem] hover:bg-black transition-all duration-300 font-normal disabled:opacity-50">
                                    {status === 'sending' ? 'ENVIANDO...' : 'ENVIAR'}
                                </button>
                                {status === 'sent' && <p className="mt-4 text-green-700 text-[1.2rem]">¡Mensaje enviado! Te responderé pronto.</p>}
                                {status === 'error' && <p className="mt-4 text-red-700 text-[1.2rem]">Error al enviar. Intenta de nuevo o escríbeme directo.</p>}
                            </form>
                        </div>

                        <div className="h-full min-h-[400px] md:min-h-0">
                            <img src={contactPic} alt="Contacto - Jefrey Muñoz Rodríguez" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};