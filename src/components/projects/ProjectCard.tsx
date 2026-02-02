"use client";

import Link from "next/link";
import { MessageCircleIcon, CalendarIcon, ClockIcon } from "lucide-react";
import ProgressLine from "./ProgressLine";
import { formatDateDDMMYYYY, formatTimeRemaining, calcProgress, isOverdue } from "@/lib/date";

interface ProjectCardProps {
    project: {
        id: string;
        nombreProyecto: string;
        nombreCliente: string;
        whatsappCliente: string;
        tipoProyecto?: string | null;
        fechaInicio: Date | string;
        fechaTermino: Date | string;
        status: string;
        deliveredAt?: Date | string | null;
    };
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const progress = calcProgress(project.fechaInicio, project.fechaTermino);
    const timeRemainingStr = formatTimeRemaining(project.fechaTermino);
    const overdue = isOverdue(project.fechaTermino) && project.status === "ACTIVE";

    const waNumber = project.whatsappCliente.replace(/\+/g, '').replace(/\s/g, '');

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{project.nombreProyecto}</h3>
                    <div className="flex flex-col gap-1.5">
                        <p className="text-sm text-gray-500 font-medium">{project.nombreCliente}</p>
                        {project.tipoProyecto && (
                            <span className="inline-block w-fit text-[9px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 px-2 py-0.5 rounded-md bg-gray-50/50">
                                {project.tipoProyecto.replace(/_/g, " ")}
                            </span>
                        )}
                    </div>
                </div>
                <div>
                    {overdue ? (
                        <span className="bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border border-red-100">
                            Vencido
                        </span>
                    ) : (
                        <span className="bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border border-green-100">
                            {project.status === "FINISHED" ? "Finalizado" : "Activo"}
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <a
                        href={`https://wa.me/${waNumber}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <MessageCircleIcon className="w-4 h-4" />
                        <span>Hablar por WhatsApp</span>
                    </a>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inicio</span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {formatDateDDMMYYYY(project.fechaInicio)}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entrega</span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold">
                            <ClockIcon className="w-3.5 h-3.5" />
                            {formatDateDDMMYYYY(project.fechaTermino)}
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Progreso
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                            {overdue ? "Vencido" : timeRemainingStr + " restantes"}
                        </span>
                    </div>
                    <ProgressLine progress={progress} />
                </div>

                <div className="pt-2">
                    <Link
                        href={`/projects/${project.id}`}
                        className="block w-full text-center py-2.5 bg-white border border-gray-200 text-sm font-bold text-gray-900 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Ver detalles
                    </Link>
                </div>
            </div>
        </div>
    );
}
