"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderIcon, CheckCircleIcon, SettingsIcon, LogOutIcon, XIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const menuItems = [
    { name: "Proyectos", href: "/", icon: FolderIcon },
    { name: "Finalizados", href: "/finished", icon: CheckCircleIcon },
    { name: "Ajustes", href: "/settings", icon: SettingsIcon },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
            <div className="p-8 flex items-center justify-between">
                <Link href="/" className="block">
                    <Image
                        src="/logo.jpg"
                        alt="Klyroframe Logo"
                        width={180}
                        height={60}
                        className="h-auto w-full max-w-[160px]"
                        priority
                    />
                </Link>
                {onClose && (
                    <button onClick={onClose} className="lg:hidden p-2 -mr-2 text-gray-400 hover:text-black">
                        <XIcon className="w-5 h-5" />
                    </button>
                )}
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-gray-50 text-gray-900"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 w-full transition-colors rounded-lg hover:bg-red-50"
                >
                    <LogOutIcon className="w-5 h-5" />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}
