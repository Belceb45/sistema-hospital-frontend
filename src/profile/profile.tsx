import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "../components/ui/card";

import {
    User,
    Phone,
    Calendar,
    MapPin,
    AlertCircle,
    CheckCircle2,
    UserCircle,
    FileText,
    CreditCard,
    Save,
    X,
    ShieldCheck,
    Stethoscope,
    Shield,
    ClipboardList,
    ChevronRight,
    Download, // Icono para descargar
    ExternalLink
} from "lucide-react"

import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Button from "@mui/material/Button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useUser } from "../lib/user-context";
import NavbarLog from "../components/NavbarLog";
import { updateUser } from "../lib/user-service";
import { fetchHistorial } from "../lib/historial-service"; // Importamos el servicio

// Componente auxiliar para mostrar datos en modo lectura
const ProfileItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | undefined }) => (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
        <div className="bg-primary/10 p-2.5 rounded-full text-primary mt-1">
            <Icon size={18} />
        </div>
        <div>
            <p className="text-sm text-muted-foreground font-medium mb-0.5">{label}</p>
            <p className="text-base font-semibold text-foreground">{value || "No especificado"}</p>
        </div>
    </div>
);

function Profile() {

    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    // Estado para guardar la URL del expediente (Google Drive)
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    // Datos del formulario
    const [formData, setFormData] = useState({
        nombreCompleto: "",
        direccion: "",
        telefono: "",
        telefono2: "",
        telefono3: "",
        fechaNacimiento: "",
    })

    useEffect(() => {
        if (user) {
            setFormData({
                nombreCompleto: user.nombreCompleto ?? "",
                direccion: user.direccion ?? "",
                telefono: user.telefono ?? "",
                telefono2: user.telefono2 ?? "",
                telefono3: user.telefono3 ?? "",
                fechaNacimiento: user.fechaNacimiento ?? "",
            });

            // --- NUEVO: Verificar si tiene archivo adjunto ---
            fetchHistorial(user.id).then(data => {
                if (data && data.urlExpediente) {
                    setFileUrl(data.urlExpediente);
                }
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            const payload = {
                telefono: formData.telefono,
                telefono2: formData.telefono2,
                telefono3: formData.telefono3,
                direccion: formData.direccion,
                fechaNacimiento: formData.fechaNacimiento,
            };

            const result = await updateUser(user.id, payload);

            if (result?.error) {
                setError(result.error);
                return;
            }
            
            setUser(result);
            setSuccess(true);
            setIsEditing(false);
            
            setTimeout(() => setSuccess(false), 3000);

        } catch (err) {
            setError("Error al actualizar el perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                nombreCompleto: user.nombreCompleto ?? "",
                direccion: user.direccion ?? "",
                telefono: user.telefono ?? "",
                telefono2: user.telefono2 ?? "",
                telefono3: user.telefono3 ?? "",
                fechaNacimiento: user.fechaNacimiento ?? "",
            });
        }
        setIsEditing(false);
        setError("");
    };

    // Función para abrir el enlace de Google Drive
    const handleDownload = () => {
        if (fileUrl) {
            window.open(fileUrl, "_blank");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            <NavbarLog />

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                
                <div className="relative mb-8 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Stethoscope size={150} />
                    </div>
                    
                    <div className="relative p-8 flex flex-col md:flex-row items-center gap-6">
                        <div className="bg-white/20 backdrop-blur-md p-1 rounded-full border-2 border-white/30">
                            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-inner">
                                <UserCircle size={64} />
                            </div>
                        </div>
                        
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-bold mb-1">{user?.nombreCompleto}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                {/* Badge Expediente */}
                                <div className="flex items-center gap-1.5 bg-blue-700/40 px-3 py-1 rounded-full text-sm border border-blue-400/30 backdrop-blur-sm">
                                    <CreditCard size={14} className="text-blue-100" />
                                    <span className="font-medium text-blue-50">Exp: {user?.numExpediente || "Sin asignar"}</span>
                                </div>

                                {/* Badge Afiliado */}
                                {user?.afiliado ? (
                                    <div className="flex items-center gap-1.5 bg-green-500/30 px-3 py-1 rounded-full text-sm border border-green-400/40 backdrop-blur-sm">
                                        <CheckCircle2 size={14} className="text-green-200" />
                                        <span className="font-semibold text-green-50">Paciente Afiliado</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-sm border border-white/20 backdrop-blur-sm">
                                        <Shield size={14} className="text-blue-100" />
                                        <span className="font-medium text-blue-50">Consulta Particular</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isEditing && (
                            <Button 
                                variant="contained" 
                                onClick={() => setIsEditing(true)}
                                sx={{ 
                                    backgroundColor: 'white', 
                                    color: '#2563eb',
                                    fontWeight: 'bold',
                                    '&:hover': { backgroundColor: '#f8fafc' },
                                    textTransform: 'none',
                                    borderRadius: '9999px',
                                    px: 4
                                }}
                                startIcon={<User size={18} />}
                            >
                                Editar Perfil
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-2 space-y-6">
                        
                        {success && (
                            <Alert className="border-green-500 bg-green-50 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800 font-medium">
                                    Información actualizada correctamente.
                                </AlertDescription>
                            </Alert>
                        )}

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Card className="shadow-md border-t-4 border-t-primary">
                            <CardHeader className="border-b bg-slate-50/50 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <User className="text-primary h-5 w-5" />
                                            Información Personal
                                        </CardTitle>
                                        <CardDescription>
                                            {isEditing ? "Modifica tus datos de contacto y ubicación." : "Tus datos de contacto registrados."}
                                        </CardDescription>
                                    </div>
                                    {isEditing && (
                                        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                            Modo Edición
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            
                            <CardContent className="pt-6">
                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-slate-600">Teléfono Principal *</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="phone"
                                                        name="telefono"
                                                        type="tel"
                                                        className="pl-9"
                                                        value={formData.telefono}
                                                        onChange={handleChange}
                                                        disabled={loading}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="dateOfBirth" className="text-slate-600">Fecha de Nacimiento *</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="dateOfBirth"
                                                        name="fechaNacimiento"
                                                        type="date"
                                                        className="pl-9"
                                                        value={formData.fechaNacimiento}
                                                        onChange={handleChange}
                                                        disabled={loading}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="text-slate-600">Dirección Completa *</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="address"
                                                    name="direccion"
                                                    type="text"
                                                    className="pl-9"
                                                    value={formData.direccion}
                                                    onChange={handleChange}
                                                    disabled={loading}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                            <h4 className="text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2">
                                                <AlertCircle size={16}/> Contactos de Emergencia
                                            </h4>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="emergencyContact">Contacto 1 *</Label>
                                                    <Input
                                                        id="emergencyContact"
                                                        name="telefono2"
                                                        type="tel"
                                                        placeholder="Teléfono auxiliar"
                                                        value={formData.telefono2}
                                                        onChange={handleChange}
                                                        disabled={loading}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="emergencyContact2">Contacto 2 *</Label>
                                                    <Input
                                                        id="emergencyContact2"
                                                        name="telefono3"
                                                        type="tel"
                                                        placeholder="Teléfono familiar"
                                                        value={formData.telefono3}
                                                        onChange={handleChange}
                                                        disabled={loading}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 justify-end pt-2 border-t mt-4">
                                            <Button 
                                                variant="text" 
                                                onClick={handleCancel} 
                                                disabled={loading}
                                                startIcon={<X size={18} />}
                                                sx={{ textTransform: 'none', color: 'gray' }}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                variant="contained" 
                                                disabled={loading}
                                                startIcon={loading ? <Loader2 className="animate-spin"/> : <Save size={18} />}
                                                sx={{ textTransform: 'none', px: 4 }}
                                            >
                                                {loading ? "Guardando..." : "Guardar Cambios"}
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in">
                                        <ProfileItem 
                                            icon={Phone} 
                                            label="Teléfono Móvil" 
                                            value={user?.telefono} 
                                        />
                                        <ProfileItem 
                                            icon={Calendar} 
                                            label="Fecha de Nacimiento" 
                                            value={user?.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString("es-ES", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }) : undefined} 
                                        />
                                        <div className="md:col-span-2">
                                            <ProfileItem 
                                                icon={MapPin} 
                                                label="Dirección de Residencia" 
                                                value={user?.direccion} 
                                            />
                                        </div>
                                        <ProfileItem 
                                            icon={ShieldCheck} 
                                            label="Emergencia (Contacto 1)" 
                                            value={user?.telefono2} 
                                        />
                                        <ProfileItem 
                                            icon={ShieldCheck} 
                                            label="Emergencia (Contacto 2)" 
                                            value={user?.telefono3} 
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        
                        {/* --- TARJETA: HISTORIAL MÉDICO (Con Botón de Descarga) --- */}
                        <Card className="bg-white border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow group cursor-pointer overflow-hidden relative">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between relative z-10">
                                    <div>
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-1">
                                            <ClipboardList className="text-blue-600 h-5 w-5" />
                                            Historial Médico
                                        </h3>
                                        <p className="text-sm text-slate-500 max-w-[200px]">
                                            Gestiona tus antecedentes y descarga tu expediente.
                                        </p>
                                    </div>
                                    <div className="bg-blue-50 p-2 rounded-full group-hover:bg-blue-100 transition-colors">
                                        <ChevronRight className="text-blue-600 h-5 w-5" />
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex gap-2">
                                    {/* Botón para Ir al Historial */}
                                    <Link to="/historial" className="flex-1">
                                        <Button 
                                            variant="outlined" 
                                            fullWidth 
                                            sx={{ 
                                                textTransform: 'none', 
                                                borderColor: '#93c5fd', // blue-300
                                                color: '#2563eb',       // blue-600
                                                '&:hover': { borderColor: '#3b82f6', backgroundColor: '#eff6ff' }
                                            }}
                                        >
                                            Ver / Editar
                                        </Button>
                                    </Link>

                                    {/* Botón de Descarga (Google Drive) */}
                                    <Button 
                                        variant="contained"
                                        onClick={handleDownload}
                                        disabled={!fileUrl} // Se deshabilita si no hay link
                                        title={fileUrl ? "Descargar expediente externo" : "Expediente no disponible aún"}
                                        sx={{ 
                                            minWidth: '50px', 
                                            backgroundColor: '#eff6ff', 
                                            color: '#2563eb',           
                                            boxShadow: 'none',
                                            '&:hover': { backgroundColor: '#dbeafe', boxShadow: 'none' },
                                            '&:disabled': { backgroundColor: '#f1f5f9', color: '#cbd5e1' }
                                        }}
                                    >
                                        <Download size={20} />
                                    </Button>
                                </div>
                            </CardContent>
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-blue-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        </Card>
                        {/* ----------------------------------------------------- */}

                        <Card className="bg-slate-50 border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-700">
                                    <FileText className="h-4 w-4" />
                                    Datos Fiscales y Médicos
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Estos datos son gestionados por administración.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">CURP</span>
                                    <div className="font-mono text-sm bg-white p-2 border rounded text-slate-700 flex items-center justify-between">
                                        {user?.curp}
                                        <ShieldCheck className="h-3 w-3 text-green-500" />
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">RFC</span>
                                    <div className="font-mono text-sm bg-white p-2 border rounded text-slate-700">
                                        {user?.rfc || "No registrado"}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nº Expediente</span>
                                    <div className="font-mono text-sm bg-white p-2 border rounded text-slate-700">
                                        {user?.numExpediente}
                                    </div>
                                </div>

                                <div className="pt-4 mt-2 border-t flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Estado</span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                                        Activo
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Alert className="bg-blue-50 border-blue-200">
                            <ShieldCheck className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-xs text-blue-800 leading-relaxed">
                                Tu información está encriptada y protegida bajo la NOM-024-SSA3-2012 sobre intercambio de información en salud.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </main>
        </div>
    )
}

function Loader2({className}: {className?: string}) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
}

export default Profile