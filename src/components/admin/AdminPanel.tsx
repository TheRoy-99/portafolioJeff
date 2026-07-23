import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Upload, Copy, Check, X, ImagePlus, ExternalLink, Clock, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../lib/supabase';
import { compressImage } from '../../lib/imageCompress';

type GalleryRow = {
    id: string;
    client_name: string;
    created_at: string;
    expires_at: string;
};

type PreviewFile = {
    file: File;
    url: string;
};

export const AdminPanel = () => {
    const navigate = useNavigate();
    const [clientName, setClientName] = useState('');
    const [previews, setPreviews] = useState<PreviewFile[]>([]);
    const [status, setStatus] = useState<'idle' | 'creating' | 'uploading' | 'done'>('idle');
    const [result, setResult] = useState<{ link: string; pin: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const [galleries, setGalleries] = useState<GalleryRow[]>([]);
    const [dragActive, setDragActive] = useState(false);

    const swalTheme = {
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#ffffff',
        customClass: { confirmButton: 'text-black' },
    };

    const loadGalleries = useCallback(async () => {
        const { data } = await supabase
            .from('galleries')
            .select('id, client_name, created_at, expires_at')
            .order('created_at', { ascending: false })
            .limit(10);
        setGalleries(data ?? []);
    }, []);

    useEffect(() => {
        loadGalleries();
    }, [loadGalleries]);

    const [compressing, setCompressing] = useState(false);

    const addFiles = async (fileList: FileList) => {
        setCompressing(true);
        const compressed = await Promise.all(Array.from(fileList).map((f) => compressImage(f)));
        const newPreviews = compressed.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setPreviews((prev) => [...prev, ...newPreviews]);
        setCompressing(false);
    };

    const removePreview = (index: number) => {
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files) await addFiles(e.dataTransfer.files);
    };

    const handleLogout = async () => {
        const confirm = await Swal.fire({
            icon: 'question',
            title: '¿Cerrar sesión?',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: 'transparent',
            ...swalTheme,
        });
        if (!confirm.isConfirmed) return;
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (previews.length === 0) {
            Swal.fire({ icon: 'warning', title: 'Agrega al menos una foto', ...swalTheme });
            return;
        }

        setStatus('creating');

        const { data, error } = await supabase.rpc('create_gallery', {
            p_client_name: clientName,
            p_days_valid: 30,
        });

        if (error || !data || data.length === 0) {
            Swal.fire({ icon: 'error', title: 'Error al crear galería', text: error?.message, ...swalTheme });
            setStatus('idle');
            return;
        }

        const { id: galleryId, pin } = data[0];
        setStatus('uploading');

        for (const { file } of previews) {
            const path = `${galleryId}/${file.name}`;
            const { error: uploadError } = await supabase.storage.from('client-galleries').upload(path, file);

            if (uploadError) {
                Swal.fire({ icon: 'error', title: `Error subiendo ${file.name}`, text: uploadError.message, ...swalTheme });
                setStatus('idle');
                return;
            }

            await supabase.from('photos').insert({ gallery_id: galleryId, storage_path: path, filename: file.name });
        }

        const link = `${window.location.origin}/galeria/${galleryId}`;
        setResult({ link, pin });
        setStatus('done');
        setClientName('');
        previews.forEach((p) => URL.revokeObjectURL(p.url));
        setPreviews([]);
        loadGalleries();

        Swal.fire({
            icon: 'success',
            title: 'Galería creada',
            text: `${previews.length} foto(s) subidas correctamente`,
            timer: 1800,
            showConfirmButton: false,
            ...swalTheme,
        });
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(`${result.link} — PIN: ${result.pin}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = async (galleryId: string, clientName: string) => {
        const confirm = await Swal.fire({
            icon: 'warning',
            title: `¿Eliminar galería de ${clientName}?`,
            text: 'Se borrarán las fotos y el acceso del cliente. No se puede deshacer.',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            ...swalTheme,
        });
        if (!confirm.isConfirmed) return;

        const { data: files } = await supabase.storage.from('client-galleries').list(galleryId);
        if (files && files.length > 0) {
            const paths = files.map((f) => `${galleryId}/${f.name}`);
            await supabase.storage.from('client-galleries').remove(paths);
        }

        const { error } = await supabase.rpc('delete_gallery', { p_gallery_id: galleryId });

        if (error) {
            Swal.fire({ icon: 'error', title: 'Error al eliminar', text: error.message, ...swalTheme });
            return;
        }

        Swal.fire({ icon: 'success', title: 'Galería eliminada', timer: 1200, showConfirmButton: false, ...swalTheme });
        loadGalleries();
    };

    const daysLeft = (expires: string) => {
        const diff = new Date(expires).getTime() - Date.now();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Topbar */}
            <div className="border-b border-white/10 px-8 md:px-16 py-6 flex justify-between items-center">
                <div>
                    <span className="text-[0.75rem] uppercase tracking-[0.3rem] text-white/40">Panel</span>
                    <h1 className="text-[1.5rem] font-semibold text-white uppercase tracking-tight -mt-1">
                        Galerías de Clientes
                    </h1>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-[0.9rem] text-white/40 hover:text-white transition-colors">
                    <LogOut className="w-4 h-4" /> Salir
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-8 md:px-16 py-14 grid lg:grid-cols-5 gap-12">
                {/* Form crear galería */}
                <div className="lg:col-span-3">
                    <h2 className="text-[0.85rem] uppercase tracking-[0.3rem] text-white/40 mb-6">Nueva galería</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="text"
                            placeholder="Nombre del cliente"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full bg-transparent border-b border-white/20 pb-3 text-[1.3rem] text-white outline-none focus:border-white transition-colors placeholder:text-white/30"
                            required
                        />

                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed p-10 text-center transition-all ${dragActive ? 'border-white bg-white/5' : 'border-white/15'}`}>
                            <ImagePlus className="w-8 h-8 text-white/40 mx-auto mb-3" />
                            <p className="text-white/50 text-[0.95rem] mb-4">
                                {compressing ? 'Optimizando fotos...' : 'Arrastra fotos aquí o'}
                            </p>
                            <label className="inline-flex items-center gap-2 border border-white/20 px-6 py-2.5 text-white/80 text-[0.9rem] uppercase tracking-wider cursor-pointer hover:bg-white hover:text-black transition-all">
                                <Upload className="w-4 h-4" /> Seleccionar
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={async (e) => e.target.files && (await addFiles(e.target.files))}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {previews.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {previews.map((p, i) => (
                                    <div key={i} className="relative group aspect-square">
                                        <img src={p.url} alt={p.file.name} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removePreview(i)}
                                            className="absolute top-1 right-1 bg-black/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Quitar">
                                            <X className="w-3.5 h-3.5 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'creating' || status === 'uploading'}
                            className="w-full bg-white text-black px-8 py-4 uppercase tracking-[0.2rem] text-[0.95rem] font-medium hover:bg-white/90 transition-all duration-300 disabled:opacity-40">
                            {status === 'creating' ? 'Creando galería...' : status === 'uploading' ? 'Subiendo fotos...' : 'Crear Galería'}
                        </button>
                    </form>

                    {status === 'done' && result && (
                        <div className="mt-8 border border-white/15 p-6">
                            <p className="text-[0.75rem] uppercase tracking-[0.2rem] text-white/40 mb-3">Listo para compartir</p>
                            <p className="text-[0.95rem] text-white/60 break-all mb-2">{result.link}</p>
                            <p className="text-[1.8rem] font-bold text-white tracking-[0.3rem] mb-5">PIN {result.pin}</p>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 border border-white/20 px-5 py-2.5 text-[0.9rem] text-white hover:bg-white hover:text-black transition-all">
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copiado' : 'Copiar link + PIN'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Lista galerías recientes */}
                <div className="lg:col-span-2">
                    <h2 className="text-[0.85rem] uppercase tracking-[0.3rem] text-white/40 mb-6">Recientes</h2>
                    <div className="space-y-3">
                        {galleries.length === 0 && (
                            <p className="text-white/30 text-[0.9rem]">Sin galerías todavía</p>
                        )}
                        {galleries.map((g) => (
                            <div key={g.id} className="border border-white/10 p-4 flex justify-between items-center gap-3 group hover:border-white/25 transition-colors">
                                <div className="min-w-0">
                                    <p className="text-white text-[1rem] font-medium truncate">{g.client_name}</p>
                                    <p className="text-white/40 text-[0.8rem] flex items-center gap-1.5 mt-1">
                                        <Clock className="w-3 h-3" /> {daysLeft(g.expires_at)} días restantes
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={`/galeria/${g.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/30 group-hover:text-white transition-colors"
                                        aria-label="Abrir galería">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => handleDelete(g.id, g.client_name)}
                                        className="text-white/30 hover:text-red-400 transition-colors"
                                        aria-label="Eliminar galería">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};