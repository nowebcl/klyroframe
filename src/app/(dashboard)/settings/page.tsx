export default function SettingsPage() {
    return (
        <div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm flex flex-col items-center justify-center py-40">
            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mb-8">
                <span className="text-3xl text-gray-300">⚙️</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter text-center">Ajustes</h1>
            <p className="text-gray-400 font-semibold text-lg max-w-sm text-center leading-relaxed">
                Esta sección llegará en la versión 2.0. Por ahora, disfruta de la simplicidad de Klyroframe.
            </p>
        </div>
    );
}
