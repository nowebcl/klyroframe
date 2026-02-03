"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Edit2Icon, XIcon } from "lucide-react";
import { updateProject } from "@/lib/actions";
import { toast } from "sonner";

interface EditProjectDialogProps {
    project: {
        id: string;
        nombreProyecto: string;
        nombreCliente: string;
        whatsappCliente: string;
        tipoProyecto?: string | null;
        descripcionMedida?: string | null;
        fechaInicio: Date | string;
        fechaTermino: Date | string;
    };
    children?: React.ReactNode;
}

export function EditProjectDialog({ project, children }: EditProjectDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tipoProyecto, setTipoProyecto] = useState(project.tipoProyecto || "");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatForInput = (date: Date | string) => {
        const d = new Date(date);
        const z = d.getTimezoneOffset() * 60 * 1000;
        const localDate = new Date(d.getTime() - z);
        return localDate.toISOString().slice(0, 16);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const res = await updateProject(project.id, {
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
            toast.success("Proyecto actualizado exitosamente");
            setIsOpen(false);
        } else {
            toast.error("Error al actualizar el proyecto: " + res.error);
        }
    };

    return (
        <>
            {children ? (
                <div onClick={() => setIsOpen(true)}>
                    {children}
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all active:scale-95"
                    title="Editar proyecto"
                >
                    <Edit2Icon className="w-5 h-5" />
                </button>
            )}

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
                                <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">Editar Proyecto</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ajustar detalles o fechas de entrega</p>
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
                                    defaultValue={project.nombreProyecto}
                                    placeholder="Ej: Rediseño Klyro 2024"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 text-sm font-bold transition-all placeholder:text-gray-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">Nombre del Cliente / Empresa</label>
                                <input
                                    required
                                    name="nombreCliente"
                                    defaultValue={project.nombreCliente}
                                    placeholder="Ej: Juan Pérez o Empresa SpA"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 text-sm font-bold transition-all placeholder:text-gray-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">Tipo de Proyecto</label>
                                <div className="relative">
                                    <select
                                        name="tipoProyecto"
                                        required
                                        defaultValue={project.tipoProyecto || ""}
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
                                        defaultValue={project.descripcionMedida || ""}
                                        placeholder="Detalla aquí lo que el cliente necesita para este proyecto a medida..."
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 text-sm font-bold transition-all placeholder:text-gray-300 resize-none"
                                    ></textarea>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">F. Inicio</label>
                                    <input
                                        required
                                        name="fechaInicio"
                                        type="datetime-local"
                                        defaultValue={formatForInput(project.fechaInicio)}
                                        className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs focus:outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">F. Entrega</label>
                                    <input
                                        required
                                        name="fechaTermino"
                                        type="datetime-local"
                                        defaultValue={formatForInput(project.fechaTermino)}
                                        className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs focus:outline-none focus:ring-4 focus:ring-black/5"
                                    />
                                </div>
                            </div>

                            <input type="hidden" name="whatsappCliente" defaultValue={project.whatsappCliente} />

                            <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 py-4 text-xs font-black text-gray-400 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all active:scale-95 border border-transparent hover:border-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-4 text-xs font-black text-white bg-black rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10"
                                >
                                    {loading ? "..." : "Guardar Cambios"}
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
