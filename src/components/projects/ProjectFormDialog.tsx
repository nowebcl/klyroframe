"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PlusIcon, XIcon } from "lucide-react";
import { createProject } from "@/lib/actions";
import { toast } from "sonner";
import { formatInTimeZone } from 'date-fns-tz';

export function ProjectFormDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [tipoProyecto, setTipoProyecto] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const nowInChile = formatInTimeZone(new Date(), 'America/Santiago', "yyyy-MM-dd'T'HH:mm");


    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const res = await createProject({
            nombreProyecto: data.nombreProyecto,
            nombreCliente: data.nombreCliente,
            whatsappCliente: data.whatsappCliente,
            tipoProyecto: data.tipoProyecto,
            descripcionMedida: data.descripcionMedida,
            fechaInicio: data.fechaInicio,
            fechaTermino: data.fechaTermino,
        });

        setLoading(false);
        if (!res?.error) {
            toast.success("Proyecto creado exitosamente");
            setIsOpen(false);
            setTipoProyecto("");
        } else {
            toast.error("Error al crear el proyecto: " + res.error);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-all shadow-sm active:scale-95 scale-90 md:scale-100 origin-right"
            >
                <PlusIcon className="w-4 h-4" />
                Nuevo proyecto
            </button>

            {isOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 md:p-6 overflow-hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity cursor-pointer"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-[520px] bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-gray-100 flex flex-col animate-in fade-in zoom-in-95 duration-300 ease-out overflow-hidden max-h-[90vh]">
                        <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-white shrink-0">
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">Nuevo Proyecto</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Línea de tiempo y cliente</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-black p-2 transition-all rounded-full hover:bg-gray-50 flex items-center justify-center"
                            >
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar bg-white flex-1 min-h-0">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">Nombre del Proyecto</label>
                                <input
                                    required
                                    name="nombreProyecto"
                                    autoFocus
                                    placeholder="Ej: Rediseño Klyro 2024"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 text-sm font-bold transition-all placeholder:text-gray-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">Nombre del Cliente / Empresa</label>
                                <input required name="nombreCliente" placeholder="Ej: Juan Pérez o Empresa SpA" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 text-sm font-bold transition-all placeholder:text-gray-300" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">Tipo de Proyecto</label>
                                <div className="relative">
                                    <select
                                        name="tipoProyecto"
                                        required
                                        onChange={(e) => setTipoProyecto(e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 text-sm font-bold transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Seleccionar tipo...</option>
                                        <option value="fastpage">Fastpage</option>
                                        <option value="mini_ecommerce">Mini Ecommerce</option>
                                        <option value="ecommerce_full">Ecommerce Full</option>
                                        <option value="seo_basico">SEO Basico</option>
                                        <option value="web_corporativa">Web corporativa pre diseñada</option>
                                        <option value="landing_focus">Landing focus</option>
                                        <option value="a_medida">Proyecto a medida (detallar)</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            {tipoProyecto === "a_medida" && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">Descripción del requerimiento</label>
                                    <textarea
                                        name="descripcionMedida"
                                        required
                                        rows={3}
                                        placeholder="Detalla aquí lo que el cliente necesita para este proyecto a medida..."
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 text-sm font-bold transition-all placeholder:text-gray-300 resize-none"
                                    ></textarea>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">F. Inicio</label>
                                    <input required name="fechaInicio" type="datetime-local" defaultValue={nowInChile} className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs focus:outline-none focus:ring-4 focus:ring-black/5" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">F. Entrega</label>
                                    <input required name="fechaTermino" type="datetime-local" defaultValue={nowInChile} className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs focus:outline-none focus:ring-4 focus:ring-black/5" />
                                </div>
                            </div>


                            <input type="hidden" name="whatsappCliente" value="+56" />

                            <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 py-4 text-xs font-black text-gray-400 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all active:scale-95 border border-transparent hover:border-gray-200"
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-4 text-xs font-black text-white bg-black rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10"
                                >
                                    {loading ? "..." : "Crear Ahora"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
