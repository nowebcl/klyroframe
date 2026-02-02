"use client";

import { usePathname } from "next/navigation";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";

import { MenuIcon } from "lucide-react";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
    const pathname = usePathname();

    let title = "Proyectos";
    if (pathname === "/finished") title = "Finalizados";
    if (pathname === "/settings") title = "Ajustes";
    if (pathname.startsWith("/projects/")) title = "Detalles";

    return (
        <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-gray-400 hover:text-black lg:hidden"
                >
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h2 className="text-base md:text-lg font-black text-gray-900 tracking-tight uppercase">{title}</h2>
            </div>
            {pathname === "/" && (
                <ProjectFormDialog />
            )}
        </header>
    );
}
