import { useEffect, useState } from "react";
import { useUser } from "../lib/user-context";
import NavbarLog from "../components/NavbarLog";
import { fetchResultadosPaciente } from "../lib/resultados-service";
import { 
    FileText, 
    Activity, 
    Calendar, 
    User, 
    CheckCircle2, 
    Clock, 
    Loader2, 
    Download, 
    AlertCircle 
} from "lucide-react";
import type { ResultadoLab } from "../types/resultados";
// Definimos la interfaz aquí o impórtala de tus types


export default function Resultados() {
    const { user } = useUser();
    const [resultados, setResultados] = useState<ResultadoLab[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"all" | "completed" | "pending">("all");

    useEffect(() => {
        if (user?.id) {
            fetchResultadosPaciente(user.id)
                .then(data => {
                    // Mapeamos los datos para enriquecer la UI
                    // Si tiene urlArchivo -> Completado, si no -> En proceso/Pendiente
                    const datosEnriquecidos = data.map((item: any) => ({
                        ...item,
                        status: item.urlArchivo ? "completed" : "pending"
                    }));
                    setResultados(datosEnriquecidos);
                })
                .finally(() => setLoading(false));
        }
    }, [user]);

    // Filtros
    const completedResults = resultados.filter(r => r.status === "completed");
    const pendingResults = resultados.filter(r => r.status !== "completed");
    
    // Decidir qué mostrar según el tab
    const displayedResults = activeTab === "all" 
        ? resultados 
        : activeTab === "completed" 
            ? completedResults 
            : pendingResults;

    // --- SUBCOMPONENTE DE TARJETA ---
    const ResultCard = ({ result }: { result: ResultadoLab }) => {
        const isCompleted = result.status === "completed";
        
        // Configuración visual según estado
        const config = isCompleted ? {
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-green-100",
            label: "Completado",
            borderColor: "border-green-200"
        } : {
            icon: Clock,
            color: "text-amber-600",
            bgColor: "bg-amber-100",
            label: "Pendiente",
            borderColor: "border-amber-200"
        };

        const StatusIcon = config.icon;

        return (
            <div className={`bg-white rounded-xl border hover:shadow-lg transition-all duration-300 overflow-hidden group ${config.borderColor}`}>
                <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            {/* Icono de Estado */}
                            <div className={`p-3 rounded-xl ${config.bgColor} group-hover:scale-105 transition-transform`}>
                                <StatusIcon className={`h-6 w-6 ${config.color}`} />
                            </div>
                            
                            {/* Información Principal */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                                    {result.tipoEstudio}
                                </h3>
                                
                                <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-2">
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(result.fechaRealizacion).toLocaleDateString("es-ES", {
                                            year: "numeric", month: "long", day: "numeric"
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                        <User className="h-3.5 w-3.5" />
                                        Dr. {result.doctorSolicitante}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Badge de Estado */}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.color}`}>
                            {config.label}
                        </span>
                    </div>

                    {/* Sección de Descripción / Resultado */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                {isCompleted ? "Interpretación / Resultado" : "Estado actual"}
                            </p>
                            <p className="text-sm text-slate-700 font-medium">
                                {result.descripcion || "Sin descripción disponible."}
                            </p>
                        </div>
                    </div>

                    {/* Botón de Acción (Descargar) */}
                    {isCompleted && result.urlArchivo && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => window.open(result.urlArchivo, '_blank')}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95"
                            >
                                <Download size={16} />
                                Ver Documento PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // --- UI PRINCIPAL ---
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <NavbarLog />
            
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Resultados de Laboratorio
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Consulta tus resultados médicos, análisis clínicos e historial.
                    </p>
                </div>

                {/* Summary Cards (Contadores) */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Completados</p>
                            <p className="text-2xl font-bold text-slate-800">{completedResults.length}</p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-amber-100 rounded-full">
                            <Clock className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Pendientes</p>
                            <p className="text-2xl font-bold text-slate-800">{pendingResults.length}</p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Estudios</p>
                            <p className="text-2xl font-bold text-slate-800">{resultados.length}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs de Navegación */}
                <div className="bg-slate-100 p-1 rounded-xl inline-flex mb-6 w-full md:w-auto">
                    {(['all', 'completed', 'pending'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                activeTab === tab 
                                    ? "bg-white text-blue-600 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            }`}
                        >
                            {tab === 'all' && `Todos (${resultados.length})`}
                            {tab === 'completed' && `Completados (${completedResults.length})`}
                            {tab === 'pending' && `Pendientes (${pendingResults.length})`}
                        </button>
                    ))}
                </div>

                {/* Lista de Resultados */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                        <p className="text-slate-400">Obteniendo tu expediente...</p>
                    </div>
                ) : displayedResults.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
                        <FileText className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No se encontraron resultados</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            No hay estudios en esta categoría. Cuando tu médico cargue nuevos resultados, aparecerán aquí automáticamente.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {displayedResults.map((result) => (
                            <ResultCard key={result.id} result={result} />
                        ))}
                    </div>
                )}

                {/* Nota Informativa Footer */}
                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900 text-sm mb-1">Información Importante</h4>
                        <p className="text-sm text-blue-700/80 leading-relaxed">
                            Los resultados mostrados son exclusivamente informativos. 
                            La interpretación clínica debe ser realizada por tu médico tratante. 
                            Si tienes dudas sobre valores fuera de rango, por favor agenda una cita de seguimiento.
                        </p>
                    </div>
                </div>

            </main>
        </div>
    );
}