import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Button from "@mui/material/Button";
import ErrorModal from "../modal/errorModal";
import { registerUser } from "../lib/user-service";
import { validarCurp, validarRFC } from "../lib/validaciones";
import { useUser } from "../lib/user-context";

import {
  Activity,
  User,
  CreditCard,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Shield,
  Loader2,
  ArrowRight,
  CheckCircle2,
  ShieldAlert // Icono para resaltar la sección legal
} from "lucide-react";

export default function Register() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombreCompleto: "",
    curp: "",
    telefono: "",
    telefono2: "",
    telefono3: "",
    rfc: "",
    direccion: "",
    fechaNacimiento: "",
    afiliado: false,
    aceptarAviso: false // NUEVO: Consentimiento obligatorio Ley 2025
  });

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<{ abierto: boolean; mensaje: string }>({
    abierto: false,
    mensaje: "",
  });

  const mostrarError = (mensaje: string) => setErrorModal({ abierto: true, mensaje });
  const cerrarError = () => setErrorModal({ abierto: false, mensaje: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let finalValue: string | boolean = value;

    if (type === "checkbox") {
        finalValue = checked;
    } else if (name === "curp" || name === "rfc") {
        finalValue = value.toUpperCase();
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // VALIDACIÓN LEGAL: Consentimiento para datos sensibles
    if (!formData.aceptarAviso) {
      mostrarError("Debe aceptar el Aviso de Privacidad para proceder con el manejo de sus datos de salud.");
      return;
    }

    if (!validarCurp(formData.curp)) {
      mostrarError("El formato del CURP no es válido.");
      return;
    }
    if (!validarRFC(formData.rfc)) {
      mostrarError("El formato del RFC no es válido.");
      return;
    }

    setLoading(true);

    try {
      // Se envía 'aceptarAviso' al backend para la bitácora de auditoría legal
      const success = await registerUser(formData);
      if (success) { 
        setUser(success);
        navigate("/historial");
      } else {
        mostrarError("El CURP o número de expediente ya está registrado.");
      }
    } catch (err) {
      mostrarError("Error de conexión. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="w-full max-w-2xl">
        
        <div className="flex items-center justify-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-2">
          <Activity className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Portal de Pacientes</h1>
        </div>

        <Card className="border shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="space-y-1 text-center pb-6 border-b bg-slate-50/50">
            <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
            <CardDescription>
              Tus datos están protegidos bajo la normativa vigente de salud.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* --- DATOS PERSONALES --- */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input id="nombreCompleto" name="nombreCompleto" className="pl-9"
                            placeholder="Ej. Juan Pérez" value={formData.nombreCompleto} onChange={handleChange} required disabled={loading} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fechaNacimiento">Fecha Nacimiento *</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input id="fechaNacimiento" name="fechaNacimiento" type="date" className="pl-9"
                            value={formData.fechaNacimiento} onChange={handleChange} required disabled={loading} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="curp">CURP *</Label>
                    <div className="relative">
                        <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input id="curp" name="curp" className="pl-9 uppercase" maxLength={18}
                            placeholder="18 caracteres" value={formData.curp} onChange={handleChange} required disabled={loading} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="rfc">RFC *</Label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input id="rfc" name="rfc" className="pl-9 uppercase"
                            value={formData.rfc} onChange={handleChange} required disabled={loading} />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input id="telefono" name="telefono" type="tel" className="pl-9"
                            placeholder="10 dígitos" value={formData.telefono} onChange={handleChange} required disabled={loading} />
                    </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección Completa *</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input id="direccion" name="direccion" className="pl-9"
                        placeholder="Calle, número, colonia..." value={formData.direccion} onChange={handleChange} required disabled={loading} />
                </div>
              </div>

              {/* --- CONTACTOS EMERGENCIA --- */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <Shield className="h-3 w-3" /> Contactos de Emergencia
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="telefono2" className="text-xs">Contacto 1 *</Label>
                        <Input id="telefono2" name="telefono2" type="tel" placeholder="Teléfono"
                            value={formData.telefono2} onChange={handleChange} required disabled={loading} className="bg-white"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="telefono3" className="text-xs">Contacto 2 *</Label>
                        <Input id="telefono3" name="telefono3" type="tel" placeholder="Teléfono"
                            value={formData.telefono3} onChange={handleChange} required disabled={loading} className="bg-white"/>
                    </div>
                </div>
              </div>

              {/* --- SECCIÓN AFILIADO --- */}
              <div className="flex items-center space-x-3 p-4 border border-blue-100 bg-blue-50/50 rounded-lg">
                <input
                    type="checkbox"
                    id="afiliado"
                    name="afiliado"
                    checked={Boolean(formData.afiliado)}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer accent-blue-600"
                />
                <Label htmlFor="afiliado" className="text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-2">
                   <CheckCircle2 size={16} className="text-blue-600"/>
                   Soy paciente afiliado / cuento con seguro
                </Label>
              </div>

              {/* --- NUEVO: CONSENTIMIENTO AVISO DE PRIVACIDAD (LEY 2025) --- */}
              <div className="p-4 bg-amber-50/50 border-2 border-amber-100 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="aceptarAviso"
                        name="aceptarAviso"
                        required
                        checked={formData.aceptarAviso}
                        onChange={handleChange}
                        disabled={loading}
                        className="mt-1 h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <div className="space-y-1">
                        <Label htmlFor="aceptarAviso" className="text-sm font-bold text-slate-800 cursor-pointer flex items-center gap-2">
                           <ShieldAlert size={16} className="text-amber-600"/> Consentimiento de Datos Sensibles
                        </Label>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Acepto que mis datos de salud sean tratados para la integración de mi expediente clínico conforme a la 
                            <b> NOM-004-SSA3-2012</b> y la <b>Ley Federal de Protección de Datos (Ref. 2025)</b>. He leído el 
                            <Link to="/avisoprivacidad" target="_blank" className="text-primary font-semibold hover:underline mx-1">
                                Aviso de Privacidad Integral
                            </Link>.
                        </p>
                    </div>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="contained" 
                className="w-full h-11" 
                disabled={loading || !formData.aceptarAviso} 
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              >
                {loading ? (
                    <span className="flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4"/> Creando cuenta...</span>
                ) : (
                    <span className="flex items-center gap-2">Registrarme <ArrowRight className="h-4 w-4"/></span>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t py-4 bg-slate-50/50">
            <p className="text-sm text-slate-500">
              ¿Ya tienes cuenta? <Link to="/login" className="text-primary font-semibold hover:underline">Inicia sesión</Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-slate-400 hover:text-primary transition-colors">← Volver al inicio</Link>
        </div>
      </div>

      <ErrorModal abierto={errorModal.abierto} mensaje={errorModal.mensaje} cerrarModal={cerrarError} />
    </div>
  );
}