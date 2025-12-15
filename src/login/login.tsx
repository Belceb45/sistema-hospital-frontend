import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import {
  Activity,
  CreditCard,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Info
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Button from "@mui/material/Button";
import ErrorModal from "../modal/errorModal"
import { loginUser } from "../lib/user-service";
import { useUser } from "../lib/user-context";
import { fetchDoctorAsignado } from "../lib/citas-service";
import { useDoctor } from "../lib/doctor-context";

export default function Login() {

  const { setUser } = useUser();
  const { setDoctor } = useDoctor(); 
  const navigate = useNavigate();

  const [errorModal, setErrorModal] = useState<{ abierto: boolean; mensaje: string }>({
    abierto: false,
    mensaje: "",
  })

  const mostrarError = (mensaje: string) => {
    setErrorModal({ abierto: true, mensaje });
  }
  const cerrarError = () => {
    setErrorModal({ abierto: false, mensaje: "" });
  }

  const [identifier, setIdentifier] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const success = await loginUser(identifier)

      if (success.error) {
        mostrarError(success.error)
      } else {
        console.log("Login exitoso:", success);
        setUser(success);

        // Obtener Doctor Asignado
        if (success.doctorId) {
          try {
            const doctorData = await fetchDoctorAsignado(success.doctorId);
            setDoctor(doctorData);
          } catch (error) {
            console.error("Error obteniendo datos del doctor (no bloqueante):", error);
          }
        }

        // Pequeño delay
        navigate("/board", { replace: true });
      }
    } catch (err) {
      mostrarError("Ha ocurrido un error de conexión. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-50">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        
        <div className="flex flex-col items-center justify-center gap-3 mb-8">
          <div className="bg-white p-3 rounded-2xl shadow-md animate-bounce-slow">
            <Activity className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Portal de Pacientes
          </h1>
          <p className="text-slate-500 text-sm">Bienvenido de nuevo</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-slate-200">
          <CardHeader className="space-y-1 pb-6 text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Usa tus credenciales médicas para acceder
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2 text-left">
                <Label htmlFor="identifier" className="text-slate-600 font-medium">
                    CURP o Número de Expediente
                </Label>
                <div className="relative group">
                    <div className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-primary transition-colors">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <Input
                        id="identifier"
                        type="text"
                        placeholder="Ej. PERJ850515..."
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-10 h-11 uppercase font-medium tracking-wide border-slate-200 focus-visible:ring-primary transition-all"
                    />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="contained"
                className="w-full h-11 text-base shadow-lg hover:shadow-primary/25 transition-all"
                disabled={loading}
                sx={{ 
                    textTransform: 'none', 
                    fontSize: '1rem',
                    borderRadius: '8px'
                }}
              >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Verificando...
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        Ingresar <ArrowRight className="h-5 w-5" />
                    </div>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-3 items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-blue-700">Credenciales de prueba:</p>
                    <p>CURP: <code className="bg-white px-1 py-0.5 rounded border">PERJ850515HDFXXX01</code></p>
                    <p>Expediente: <code className="bg-white px-1 py-0.5 rounded border">EXP-2024-001</code></p>
                </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 bg-slate-50/50 border-t border-slate-100 py-6">
             <div className="flex items-center gap-2 text-sm text-slate-600">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Acceso seguro encriptado</span>
             </div>
             
             <div className="text-sm text-center">
                <span className="text-slate-500">¿Nuevo paciente? </span>
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Crear cuenta aquí
                </Link>
             </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 delay-300">
          <Link to="/" className="text-sm text-slate-400 hover:text-primary transition-colors inline-flex items-center gap-1">
            ← Volver a la página principal
          </Link>
        </div>
      </div>
      
      <ErrorModal
        abierto={errorModal.abierto}
        mensaje={errorModal.mensaje}
        cerrarModal={cerrarError}
      />
    </div>
  )
}