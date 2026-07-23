import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Lock, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Photo = {
    id: string;
    filename: string;
    url: string;
};

export const GalleryAccess = () => {
    const { galleryId } = useParams<{ galleryId: string }>();
    const [pin, setPin] = useState('');
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'unlocked' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [selected, setSelected] = useState<string | null>(null);

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
        const res = await fetch(photo.url);
        const blob = await res.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = photo.filename;
        link.click();
        URL.revokeObjectURL(link.href);

        // registra descarga (best-effort, no bloquea al usuario si falla)
        await supabase.from('download_logs').insert({
            gallery_id: galleryId,
            photo_id: photo.id
        });
    };

    if (status !== 'unlocked') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] px-8">
                <form onSubmit={handleSubmit} className="w-full max-w-[400px] text-center">
                    <Lock className="w-10 h-10 mx-auto mb-6 text-[#332e29]" />
                    <h1 className="text-[2rem] font-semibold uppercase tracking-wider mb-2 text-[#332e29]">
                        Galería Privada
                    </h1>
                    <p className="text-[1.1rem] text-gray-500 mb-8">Ingresa tu PIN para ver las fotos</p>

                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        maxLength={6}
                        className="block w-full mb-6 border-2 border-black/30 p-4 text-[1.5rem] text-center tracking-[0.5em] outline-none focus:border-black transition-colors"
                        required
                    />

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-[#332e29] text-white px-8 py-4 uppercase tracking-[0.2rem] text-[1.2rem] hover:bg-black transition-all duration-300 disabled:opacity-50">
                        {status === 'loading' ? 'Verificando...' : 'Acceder'}
                    </button>

                    {status === 'error' && (
                        <p className="mt-4 text-red-700 text-[1rem]">{errorMsg}</p>
                    )}
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-20 px-8 md:px-16">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-[3rem] font-semibold uppercase tracking-wider mb-4 text-[#332e29]">
                    Tu Galería
                </h1>
                <p className="text-[1.1rem] text-gray-500 mb-12">
                    {photos.length} foto{photos.length !== 1 ? 's' : ''} disponible{photos.length !== 1 ? 's' : ''}. Los links expiran en 5 minutos.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                        <div key={photo.id} className="relative group">
                            <button
                                onClick={() => setSelected(photo.url)}
                                className="w-full h-[280px] overflow-hidden block">
                                <img src={photo.url} alt={photo.filename} className="w-full h-full object-cover" />
                            </button>
                            <button
                                onClick={() => handleDownload(photo)}
                                className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Descargar ${photo.filename}`}>
                                <Download className="w-5 h-5 text-[#332e29]" />
                            </button>
                        </div>
                    ))}
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
        </div>
    );
};