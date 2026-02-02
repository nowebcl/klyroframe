"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Image from "next/image";

export default function LoginPage() {
    const { status } = useSession();
    const router = useRouter();
    const [email, setEmail] = useState("admin@klyroframe.local");
    const [password, setPassword] = useState("changeme123");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Credenciales inválidas");
                setLoading(false);
            } else {
                router.push("/");
            }
        } catch (err) {
            setError("Ocurrió un error inesperado");
            setLoading(false);
        }
    };

    if (status === "loading") return null;

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-[420px] space-y-10">
                <div className="flex flex-col items-center space-y-4">
                    <Image
                        src="/logo.png"
                        alt="Klyroframe Logo"
                        width={80}
                        height={80}
                        className="h-20 w-20 object-contain rounded-2xl"
                        priority
                    />
                    <div className="text-center">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">KLYROFRAME</h1>
                        <p className="text-gray-400 font-semibold tracking-widest uppercase text-[10px]">Project Management Studio</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] space-y-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-2xl border border-red-100 flex items-center justify-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Acceso Correo</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 text-sm font-semibold transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-black/5 text-sm font-semibold transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-black text-white rounded-[20px] font-bold text-sm hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-[0.97] disabled:opacity-50"
                    >
                        {loading ? "Autenticando..." : "Ingresar"}
                    </button>
                </form>

                <div className="text-center">
                    <a
                        href="https://www.noweb.cl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em] hover:text-black transition-colors"
                    >
                        Desarrollado por noweb labs • 2025
                    </a>
                </div>
            </div>
        </div>
    );
}
