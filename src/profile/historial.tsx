import { useState, useEffect } from "react";
import { useUser } from "../lib/user-context";
import NavbarLog from "../components/NavbarLog";
import { fetchHistorial, guardarHistorial } from "../lib/historial-service";
import { Link, useNavigate } from "react-router-dom";
import { 
    Activity, 
    Users, 
    Save, 
    ArrowLeft, 
    Loader2,
    Clock,
    Syringe,
    Droplet,
    CheckCircle2, 
    AlertCircle,
    Download, // Icono necesario
    FileText 
} from "lucide-react";

import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { Alert, AlertDescription } from "../components/ui/alert"; 
import type { HistorialMedico } from "../types/historial";

// --- CATEGORÍAS DEL MENÚ LATERAL ---
const SECCIONES = [
    { id: 'patologicos', label: 'Antecedentes', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'alergias', label: 'Alergias y Cirugías', icon: Syringe, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'hereditarios', label: 'Heredofamiliares', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'general', label: 'Datos Generales', icon: Activity, color: 'text-green-500', bg: 'bg-green-50' },
];

export default function Historial() {
    const { user } = useUser();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('patologicos');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false); 

    // 1. Estado para la URL del archivo externo
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState<HistorialMedico>({
        pacienteId: "",
        diabetes: false,
        hipertension: false,
        asma: false,
        enfermedadesCardiacas: false,
        obesidad: false,
        alergias: "",
        cirugiasPrevias: "",
        antecedentesFamiliares: "",
        tipoSangre: "",
    });

    useEffect(() => {
        if (user?.id) {
            fetchHistorial(user.id).then((data) => {
                if (data) {
                    setFormData(data);
                    // 2. Si el historial trae una URL, la guardamos en el estado
                    if (data.urlExpediente) {
                        setFileUrl(data.urlExpediente);
                    }
                } else {
                    setFormData(prev => ({ ...prev, pacienteId: user.id }));
                }
                setLoading(false);
            });
        }
    }, [user]);

    const handleChange = (field: keyof HistorialMedico, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccess(false); 
        try {
            await guardarHistorial(formData);
            setSuccess(true);
            setSaving(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error(error);
            setSaving(false);
        }
    };

    // 3. Función para abrir el enlace
    const handleDownload = () => {
        if (fileUrl) {
            window.open(fileUrl, "_blank");
        }
    };

    const ToggleItem = ({ 
        label, 
        checked, 
        onChange 
    }: { label: string, checked: boolean, onChange: (val: boolean) => void }) => (
        <div className={`
            flex items-center justify-between p-4 rounded-xl border transition-all duration-300
            ${checked ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100'}
        `}>
            <div className="flex flex-col">
                <span className={`font-medium ${checked ? 'text-blue-800' : 'text-slate-600'}`}>
                    {label}
                </span>
                <span className="text-xs text-slate-400">
                    {checked ? 'Padecimiento activo' : 'Sin antecedentes'}
                </span>
            </div>
            <Switch 
                checked={checked} 
                onChange={(e) => onChange(e.target.checked)}
                color="primary"
            />
        </div>
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="min-h-screen bg-slate-50/50">
            <NavbarLog />
            
            <main className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Link to="/profile" className="text-slate-400 hover:text-blue-600 transition-colors">
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 className="text-2xl font-bold text-slate-800">Historial Médico</h1>
                        </div>
                        <p className="text-slate-500 ml-7">
                            ¡Nos alegra que priorices cuidar de tu salud! Tu información es confidencial.
                        </p>
                    </div>
                    
                    {/* 4. Grupo de Botones (Descargar y Guardar) */}
                    <div className="flex items-center gap-3">
                        {/* Botón Descargar (Solo se muestra si hay URL) */}
                        {fileUrl && (
                            <Button 
                                variant="outlined" 
                                onClick={handleDownload}
                                startIcon={<Download size={18} />}
                                sx={{ 
                                    textTransform: 'none', 
                                    borderRadius: 3, 
                                    borderColor: '#93c5fd', 
                                    color: '#2563eb',
                                    backgroundColor: 'white',
                                    '&:hover': { backgroundColor: '#eff6ff', borderColor: '#3b82f6' }
                                }}
                            >
                                Descargar Historial
                            </Button>
                        )}

                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={handleSave}
                            disabled={saving}
                            startIcon={saving ? <Loader2 className="animate-spin"/> : <Save />}
                            sx={{ textTransform: 'none', borderRadius: 3, px: 4 }}
                        >
                            {saving ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </div>

                {/* Mensaje de éxito */}
                {success && (
                    <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-300">
                        <Alert className="border-green-500 bg-green-50 text-green-900 shadow-sm">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <AlertDescription className="font-medium text-base ml-2">
                                ¡Historial actualizado correctamente!
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    
                    {/* Sidebar */}
                    <Card className="md:col-span-1 p-3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible sticky top-24 border-none shadow-lg shadow-slate-200/50">
                        {SECCIONES.map((seccion) => {
                            const Icon = seccion.icon;
                            const isActive = activeTab === seccion.id;
                            
                            return (
                                <button
                                    key={seccion.id}
                                    onClick={() => setActiveTab(seccion.id)}
                                    className={`
                                        flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left min-w-[150px] md:min-w-0
                                        ${isActive 
                                            ? 'bg-white shadow-md text-slate-800 ring-1 ring-slate-200' 
                                            : 'hover:bg-slate-50 text-slate-500 hover:text-slate-700'}
                                    `}
                                >
                                    <div className={`
                                        p-2 rounded-lg transition-colors
                                        ${isActive ? `${seccion.bg} ${seccion.color}` : 'bg-slate-100 text-slate-400'}
                                    `}>
                                        <Icon size={20} />
                                    </div>
                                    <span className="font-medium text-sm">{seccion.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 hidden md:block"></div>
                                    )}
                                </button>
                            );
                        })}
                    </Card>

                    {/* Contenido */}
                    <div className="md:col-span-3 space-y-6">
                        <Card className="p-6 border-none shadow-lg shadow-slate-200/50 min-h-[400px]">
                            
                            {/* SECCIÓN 1: ANTECEDENTES */}
                            {activeTab === 'patologicos' && (
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Antecedentes Patológicos</h2>
                                            <p className="text-sm text-slate-500">Activa las casillas si padeces alguna de estas condiciones.</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        <ToggleItem label="Diabetes Mellitus" checked={formData.diabetes} onChange={(val) => handleChange('diabetes', val)} />
                                        <ToggleItem label="Hipertensión Arterial" checked={formData.hipertension} onChange={(val) => handleChange('hipertension', val)} />
                                        <ToggleItem label="Asma / Problemas Respiratorios" checked={formData.asma} onChange={(val) => handleChange('asma', val)} />
                                        <ToggleItem label="Enfermedades Cardíacas" checked={formData.enfermedadesCardiacas} onChange={(val) => handleChange('enfermedadesCardiacas', val)} />
                                        <ToggleItem label="Obesidad / Sobrepeso" checked={formData.obesidad} onChange={(val) => handleChange('obesidad', val)} />
                                    </div>
                                </div>
                            )}

                            {/* SECCIÓN 2: ALERGIAS */}
                            {activeTab === 'alergias' && (
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                                        <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                            <Syringe size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Alergias e Intervenciones</h2>
                                            <p className="text-sm text-slate-500">Describe si tienes reacciones a medicamentos o cirugías previas.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <Label className="mb-2 block text-slate-700">Alergias (Medicamentos, Alimentos, Látex)</Label>
                                            <textarea 
                                                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all min-h-[100px] text-sm"
                                                placeholder="Ej. Alérgico a la Penicilina y al Ibuprofeno..."
                                                value={formData.alergias}
                                                onChange={(e) => handleChange('alergias', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-slate-700">Cirugías Previas / Hospitalizaciones</Label>
                                            <textarea 
                                                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all min-h-[100px] text-sm"
                                                placeholder="Ej. Apendicectomía (2015), Fractura de brazo derecho (2018)..."
                                                value={formData.cirugiasPrevias}
                                                onChange={(e) => handleChange('cirugiasPrevias', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECCIÓN 3: HEREDOFAMILIARES */}
                            {activeTab === 'hereditarios' && (
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                                        <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                            <Users size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Antecedentes Heredofamiliares</h2>
                                            <p className="text-sm text-slate-500">Enfermedades importantes en familiares directos.</p>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-2 block text-slate-700">Descripción de antecedentes</Label>
                                        <textarea 
                                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all min-h-[150px] text-sm"
                                            placeholder="Ej. Padre con Diabetes Tipo 2, Madre con Hipertensión..."
                                            value={formData.antecedentesFamiliares}
                                            onChange={(e) => handleChange('antecedentesFamiliares', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* SECCIÓN 4: DATOS GENERALES */}
                            {activeTab === 'general' && (
                                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                                        <div className="bg-green-50 p-2 rounded-lg text-green-600">
                                            <Droplet size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Datos Generales</h2>
                                            <p className="text-sm text-slate-500">Información básica para emergencias.</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label className="mb-2 block text-slate-700">Tipo de Sangre</Label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((tipo) => (
                                                    <button
                                                        key={tipo}
                                                        onClick={() => handleChange('tipoSangre', tipo)}
                                                        className={`
                                                            p-2 rounded-lg text-sm font-bold border transition-all
                                                            ${formData.tipoSangre === tipo 
                                                                ? 'bg-green-500 text-white border-green-600 shadow-md' 
                                                                : 'bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:bg-green-50'}
                                                        `}
                                                    >
                                                        {tipo}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                                            <Activity className="text-slate-400 shrink-0 mt-1" size={20} />
                                            <div>
                                                <h4 className="font-semibold text-slate-700 text-sm">Información Vital</h4>
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                    Mantener tu tipo de sangre actualizado es crucial para emergencias.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </Card>
                    </div>
                </div>

            </main>
        </div>
    );
}