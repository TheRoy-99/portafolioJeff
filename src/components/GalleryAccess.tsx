import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Lock, X, Camera, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Photo = {
    id: string;
    filename: string;
    url: string;
};

const GrainOverlay = () => (
    <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.04] z-0" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
);

const BackgroundOrbs = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-[100px]" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-white/5 to-transparent blur-[100px]" />
        <div className="absolute -bottom-40 left-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-orange-500/8 to-transparent blur-[100px]" />
    </div>
);

const CameraVector = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-[0.06]" fill="none" stroke="white" strokeWidth="0.5">
        <circle cx="100" cy="100" r="35" />
        <circle cx="100" cy="100" r="24" />
        <circle cx="100" cy="100" r="12" />
        <rect x="40" y="70" width="120" height="80" rx="4" />
        <rect x="75" y="55" width="25" height="18" rx="2" />
        <line x1="10" y1="100" x2="40" y2="100" />
        <line x1="160" y1="100" x2="190" y2="100" />
    </svg>
);

export const GalleryAccess = () => {
    const { galleryId } = useParams<{ galleryId: string }>();
    const [pin, setPin] = useState('');
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'unlocked' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [selected, setSelected] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        const { data, error } = await supabase.functions.invoke('validate-pin', {
            body: { galleryId, pin }
        });

        if (error || data?.error) {
            setErrorMsg(data?.error || 'Error al validar PIN');
            setStatus('error');
            return;
        }

        if (!data?.photos || data.photos.length === 0) {
            setErrorMsg('Galería sin fotos disponibles todavía');
            setStatus('error');
            return;
        }

        setPhotos(data.photos);
        setStatus('unlocked');
    };

    const handleDownload = async (photo: Photo) => {
        setDownloadingId(photo.id);
        const res = await fetch(photo.url);
        const blob = await res.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = photo.filename;
        link.click();
        URL.revokeObjectURL(link.href);
        setDownloadingId(null);

        await supabase.from('download_logs').insert({
            gallery_id: galleryId,
            photo_id: photo.id
        });
    };

    if (status !== 'unlocked') {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-black px-6 overflow-hidden">
                <GrainOverlay />
                <BackgroundOrbs />

                {/* vector decorativo esquina */}
                <div className="absolute -top-10 -right-10 w-64 h-64 hidden md:block">
                    <CameraVector />
                </div>
                <div className="absolute -bottom-16 -left-16 w-56 h-56 hidden md:block rotate-45">
                    <CameraVector />
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-[380px] text-center">
                    <div className="relative w-16 h-16 mx-auto mb-7">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/20 to-transparent blur-md" />
                        <div className="relative w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center backdrop-blur-sm">
                            <Lock className="w-6 h-6 text-white/80" />
                        </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.3rem] text-amber-500/70 mb-3">
                        <Sparkles className="w-3 h-3" /> Acceso exclusivo
                    </span>
                    <h1 className="text-[1.8rem] font-semibold uppercase tracking-[0.1rem] mb-2 text-white">
                        Galería Privada
                    </h1>
                    <p className="text-[0.95rem] text-white/40 mb-10">Ingresa tu PIN para ver tus fotos</p>

                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="• • • • • •"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        maxLength={6}
                        className="block w-full mb-6 bg-white/[0.03] border border-white/10 rounded-sm px-4 py-4 text-[1.6rem] text-white text-center tracking-[0.6em] outline-none focus:border-amber-500/50 focus:bg-white/[0.05] transition-all placeholder:text-white/15"
                        required
                        autoFocus
                    />

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-white text-black px-8 py-4 uppercase tracking-[0.2rem] text-[0.95rem] font-medium hover:bg-white/90 transition-all duration-300 disabled:opacity-40 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
                        {status === 'loading' ? 'Verificando...' : 'Acceder'}
                    </button>

                    {status === 'error' && (
                        <p className="mt-5 text-red-400 text-[0.9rem]">{errorMsg}</p>
                    )}
                </form>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            <GrainOverlay />
            <BackgroundOrbs />

            <div className="relative z-10 border-b border-white/10 px-6 md:px-16 lg:px-24 py-12 md:py-20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-amber-500/80" />
                    </div>
                    <span className="text-[0.85rem] uppercase tracking-[0.3rem] text-white/40">
                        Jefrey Muñoz Rodríguez
                    </span>
                </div>
                <h1 className="text-[3rem] md:text-[4.5rem] font-semibold uppercase tracking-tight text-white leading-none">
                    Tu Galería
                </h1>
                <p className="text-[1.05rem] text-white/40 mt-4">
                    {photos.length} foto{photos.length !== 1 ? 's' : ''} disponible{photos.length !== 1 ? 's' : ''} · Links válidos por 30 días
                </p>
            </div>

            <div className="relative z-10 px-4 md:px-16 lg:px-24 py-10 md:py-16 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {photos.map((photo) => (
                        <div key={photo.id} className="relative bg-white/[0.03] border border-white/5 group">
                            <button
                                onClick={() => setSelected(photo.url)}
                                className="w-full aspect-square overflow-hidden block">
                                <img src={photo.url} alt={photo.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </button>
                            <button
                                onClick={() => handleDownload(photo)}
                                disabled={downloadingId === photo.id}
                                className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm p-2.5 md:p-2 border border-white/10 hover:bg-amber-500 hover:border-amber-500 hover:text-black transition-colors disabled:opacity-50"
                                aria-label={`Descargar ${photo.filename}`}>
                                <Download className="w-4 h-4 text-white group-hover:text-inherit" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {selected && (
                <div
                    className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-8"
                    onClick={() => setSelected(null)}>
                    <button
                        className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
                        onClick={() => setSelected(null)}
                        aria-label="Cerrar">
                        <X className="w-7 h-7" />
                    </button>
                    <img src={selected} alt="Vista ampliada" className="max-w-full max-h-full object-contain" />
                </div>
            )}
        </div>
    );
};