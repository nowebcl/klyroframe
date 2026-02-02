import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProjectCard from "@/components/projects/ProjectCard";
import { formatDateDDMMYYYY } from "@/lib/date";

export default async function FinishedPage() {
    const session = await getServerSession(authOptions);

    const projects = await prisma.project.findMany({
        where: {
            userId: (session?.user as any).id,
            status: "FINISHED",
        },
        orderBy: { deliveredAt: "desc" },
    });

    return (
        <div className="space-y-12">
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-green-500 rounded-full" />
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Archivo de Éxitos</h1>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[48px] border border-gray-50 shadow-sm">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Historial vacío</h3>
                    <p className="text-gray-400 font-semibold max-w-xs text-center">
                        Cuando finalices un proyecto, aparecerá aquí con todos sus detalles.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project.id} className="relative">
                            <ProjectCard project={project} />
                            <div className="absolute -top-3 left-6 bg-green-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-white uppercase tracking-widest">
                                Finalizado el: {formatDateDDMMYYYY(project.deliveredAt!)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
