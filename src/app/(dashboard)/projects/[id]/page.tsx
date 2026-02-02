import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import ProgressLine from "@/components/projects/ProgressLine";
import { calcProgress, formatTimeRemaining, formatDateDDMMYYYY, formatTimeElapsed } from "@/lib/date";
import NotesEditor from "@/components/notes/NotesEditor";
import { finishProject } from "@/lib/actions";
import { CheckCircleIcon, ExternalLinkIcon, CalendarIcon, UsersIcon, ListTodoIcon, StickyNoteIcon } from "lucide-react";
import TaskList from "@/components/projects/TaskList";

export default async function ProjectDetailPage(props: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const params = await props.params;

    const project = await prisma.project.findUnique({
        where: { id: params.id, userId: (session?.user as any).id },
        include: {
            notes: { orderBy: { createdAt: "desc" } },
            tasks: {
                include: { comments: { orderBy: { createdAt: "asc" } } },
                orderBy: { createdAt: "desc" }
            }
        },
    });

    if (!project) notFound();

    const progress = calcProgress(project.fechaInicio, project.fechaTermino);
    const timeRemainingStr = formatTimeRemaining(project.fechaTermino);
    const timeElapsedStr = formatTimeElapsed(project.fechaInicio);
    const waNumber = project.whatsappCliente.replace(/\+/g, '').replace(/\s/g, '');

    const totalTasks = project.tasks.length;
    const completedTasksCount = project.tasks.filter((t: any) => t.status === "COMPLETED").length;
    const tasksProgress = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            <div className="xl:col-span-8 space-y-12">
                <div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50/50 rounded-full -mr-32 -mt-32 -z-0" />

                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                    {project.status}
                                </span>
                            </div>
                            <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">{project.nombreProyecto}</h1>
                            <div className="flex items-center gap-2 text-gray-400 font-bold">
                                <UsersIcon className="w-5 h-5" />
                                <span className="text-lg">{project.nombreCliente}</span>
                            </div>
                        </div>

                        {project.status === "ACTIVE" && (
                            <form action={async () => {
                                "use server";
                                await finishProject(project.id);
                            }}>
                                <button className="flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-[24px] font-bold text-sm hover:bg-green-600 transition-all hover:shadow-xl active:scale-95 shadow-lg shadow-green-500/20">
                                    <CheckCircleIcon className="w-5 h-5" />
                                    Finalizar proyecto
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-10 border-y border-gray-50 relative z-10">
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Contacto Directo</span>
                            <a
                                href={`https://wa.me/${waNumber}`}
                                target="_blank"
                                className="font-bold text-gray-900 flex items-center gap-2 hover:text-green-600 transition-colors"
                            >
                                {project.whatsappCliente}
                                <ExternalLinkIcon className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Cronología</span>
                            <div className="flex items-center gap-2 font-bold text-gray-900">
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                {formatDateDDMMYYYY(project.fechaInicio)} — {formatDateDDMMYYYY(project.fechaTermino)}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Tiempo Restante</span>
                            <div className="text-2xl font-black text-gray-900 lowercase">
                                {timeRemainingStr}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Tiempo Restante</span>
                                <span className="text-sm font-black text-black">{Math.round(progress)}% del tiempo</span>
                            </div>
                            <ProgressLine progress={progress} className="h-6 rounded-3xl" />
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[11px] font-bold text-gray-400">Entrega programada</span>
                                <span className="text-[11px] font-black text-black lowercase">{timeRemainingStr} restantes</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Tareas Completadas</span>
                                <span className="text-sm font-black text-black">{Math.round(tasksProgress)}% terminado</span>
                            </div>
                            <ProgressLine progress={tasksProgress} className="h-6 rounded-3xl bg-gray-100" colorClass="bg-green-500" />
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[11px] font-bold text-gray-400">Progreso operativo</span>
                                <span className="text-[11px] font-black text-black">{completedTasksCount} de {totalTasks} tareas</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    <section className="space-y-8 px-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ListTodoIcon className="w-6 h-6 text-black" />
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tareas por hacer</h2>
                            </div>
                            <div className="h-0.5 flex-1 bg-gray-50 mx-8" />
                        </div>
                        <TaskList
                            projectId={project.id}
                            tasks={project.tasks}
                            projectDeadline={project.fechaTermino}
                        />
                    </section>

                    <section className="space-y-8 px-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <StickyNoteIcon className="w-6 h-6 text-black" />
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Bitácora de Notas</h2>
                            </div>
                            <div className="h-0.5 flex-1 bg-gray-50 mx-8" />
                        </div>
                        <NotesEditor projectId={project.id} notes={project.notes} />
                    </section>
                </div>
            </div>

            <div className="xl:col-span-4 space-y-8">
                <div className="bg-black text-white p-10 rounded-[48px] shadow-2xl space-y-6 sticky top-28">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <span className="text-xl">💡</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">Estrategia</h3>
                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                        El {progress > 80 ? 'proyecto está a punto de concluir.' : 'tiempo sigue corriendo.'}
                        Asegúrate de documentar cada cambio en las notas para mantener un historial impecable con el cliente.
                    </p>
                    <div className="pt-4">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Iniciado hace</p>
                            <p className="text-xl font-bold">{timeElapsedStr}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
