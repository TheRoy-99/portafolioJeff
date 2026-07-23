import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../lib/supabase';
import headerBanner from '../../assets/header-banner.jpg';

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const swalTheme = {
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#ffffff',
        customClass: { confirmButton: 'text-black' },
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Acceso denegado',
                text: 'Correo o contraseña incorrectos',
                ...swalTheme,
            });
            return;
        }

        await Swal.fire({
            icon: 'success',
            title: 'Bienvenido de vuelta',
            timer: 1200,
            showConfirmButton: false,
            ...swalTheme,
        });

        navigate('/admin');
    };

    return (
        <div className="min-h-screen flex bg-black">
            {/* Panel izquierdo - imagen */}
            <div
                className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
                style={{ backgroundImage: `url(${headerBanner})` }}>
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 flex flex-col justify-end p-16">
                    <span className="text-[0.85rem] uppercase tracking-[0.4rem] text-white/50 mb-4">
                        Portal Fotógrafo
                    </span>
                    <h2 className="text-[3rem] font-semibold text-white uppercase leading-[1.1] tracking-tight">
                        Gestiona tus<br />galerías privadas
                    </h2>
                </div>
            </div>

            {/* Panel derecho - form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 md:px-20">
                <div className="w-full max-w-[400px]">
                    <div className="mb-14">
                        <span className="text-[0.8rem] uppercase tracking-[0.35rem] text-white/40">
                            Jefrey Muñoz Rodríguez
                        </span>
                        <h1 className="text-[2.4rem] font-semibold text-white uppercase tracking-tight mt-3">
                            Iniciar sesión
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="group">
                            <label className="block text-[0.75rem] uppercase tracking-[0.2rem] text-white/40 mb-3 group-focus-within:text-white transition-colors">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-white/20 pb-3 text-[1.15rem] text-white outline-none focus:border-white transition-colors"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[0.75rem] uppercase tracking-[0.2rem] text-white/40 mb-3 group-focus-within:text-white transition-colors">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border-b border-white/20 pb-3 text-[1.15rem] text-white outline-none focus:border-white transition-colors"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full flex items-center justify-between bg-white text-black px-8 py-5 uppercase tracking-[0.2rem] text-[0.95rem] font-medium hover:bg-white/90 transition-all duration-300 disabled:opacity-40 mt-14">
                            {loading ? 'Verificando...' : 'Entrar'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};