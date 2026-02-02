import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProjectCard from "@/components/projects/ProjectCard";
import { SearchIcon } from "lucide-react";

export default async function HomePage(props: { searchParams: Promise<{ q?: string }> }) {
    const session = await getServerSession(authOptions);
    const searchParams = await props.searchParams;
    const query = searchParams.q || "";

    const projects = await prisma.project.findMany({
        where: {
            userId: (session?.user as any).id,
            status: "ACTIVE",
            OR: [
                { nombreProyecto: { contains: query } },
                { nombreCliente: { contains: query } },
            ],
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative w-full max-w-md group">
                    <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                    <form>
                        <input
                            name="q"
                            defaultValue={query}
                            placeholder="Buscar proyecto o cliente..."
                            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 text-sm font-semibold shadow-sm transition-all"
                        />
                    </form>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[48px] border border-gray-50 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-8 animate-bounce">
                        <span className="text-3xl">🚀</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Comienza tu viaje</h3>
                    <p className="text-gray-400 font-semibold max-w-xs text-center leading-relaxed">
                        Aún no tienes proyectos activos. Crea el primero y observa cómo fluye tu trabajo.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
