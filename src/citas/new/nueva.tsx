import { useState, useEffect, useMemo } from "react";
import { useUser } from "../../lib/user-context";
import { useDoctor } from "../../lib/doctor-context";
import { useNavigate, Link, useLocation } from "react-router-dom"; 
import NavbarLog from "../../components/NavbarLog"; 
import Button from "@mui/material/Button";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es"; 

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { 
    Calendar, 
    ArrowLeft, 
    Loader2, 
    CheckCircle2, 
    User, 
    Stethoscope, 
    AlertCircle, 
    RefreshCw,
    Wallet,
    FileHeart 
} from "lucide-react";

import {
  fetchCitasDisponibles,
  fetchCitasPaciente,
  agendarCita,
  reagendarCita 
} from "../../lib/citas-service";

//
import { fetchHistorial } from "../../lib/historial-service";

import type { Cita } from "../../types/cita";

dayjs.locale("es");

export default function Nueva() {
  const { user } = useUser();
  const { doctor } = useDoctor();
  const navigate = useNavigate();
  const location = useLocation();

  const idCitaParaReagendar = location.state?.idCitaParaReagendar;
  const esReagendado = !!idCitaParaReagendar;

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [todasLasCitas, setTodasLasCitas] = useState<Cita[]>([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);

  const [loadingData, setLoadingData] = useState(true);
  const [loadingAgendar, setLoadingAgendar] = useState(false);
  const [tieneCitaActiva, setTieneCitaActiva] = useState(false);
  

  const [faltaHistorial, setFaltaHistorial] = useState(false);

  const [msg, setMsg] = useState<{ type: "success" | "error" | "warning" | ""; text: string }>({
    type: "",
    text: ""
  });

  const costoConsulta = useMemo(() => {
    if (user?.afiliado) return 0;
    if (doctor?.especialidad) {
        const especialidad = doctor.especialidad.toLowerCase();
        if (especialidad !== "medicina general" && especialidad !== "general") {
            return 1500;
        }
    }
    return 500;
  }, [user, doctor]);

  useEffect(() => {
    if (!user?.id) return;

    const inicializar = async () => {
      setLoadingData(true);
      try {
 
        const historialMedico = await fetchHistorial(user.id);
        
        if (!historialMedico) {
            setFaltaHistorial(true);
            setMsg({ 
                type: "warning", 
                text: "Requisito: Debes completar tu Historial Médico antes de agendar una cita." 
            });
            
            
            setTimeout(() => {
                navigate("/historial");
            }, 3000);
            
            return; 
        }
        // ----------------------------------------------

        const historial = await fetchCitasPaciente(user.id);
        const citaPendiente = historial.find(c => {
           const fechaCita = new Date(c.fecha + "T" + c.hora);
           const hoy = new Date();
           const estado = c.estado ? c.estado.toUpperCase() : "";
           return fechaCita >= hoy && estado !== "CANCELADA"; 
        });

        if (citaPendiente && !esReagendado) {
            setTieneCitaActiva(true);
            setMsg({ type: "error", text: "Ya tienes una cita activa." });
            setTimeout(() => navigate("/citas"), 2000);
            return; 
        }

        const data = await fetchCitasDisponibles(user.id);
        setTodasLasCitas(data);

      } catch (error) {
        console.error(error);
        setMsg({ type: "error", text: "Error de conexión." });
      } finally {
        setLoadingData(false);
      }
    };

    inicializar();
  }, [user?.id, navigate, esReagendado]);

  const horariosDelDia = useMemo(() => {
    // faltaHistorial a las condiciones de bloqueo
    if (!selectedDate || (tieneCitaActiva && !esReagendado) || faltaHistorial) return []; 
    const fechaFormat = selectedDate.format("YYYY-MM-DD");
    return todasLasCitas.filter(c => {
        const fechaCoincide = c.fecha === fechaFormat;
        const estadoNormalizado = c.estado ? c.estado.toLowerCase() : "";
        const estaDisponible = estadoNormalizado === "disponible"; 
        return fechaCoincide && estaDisponible;
    });
  }, [selectedDate, todasLasCitas, tieneCitaActiva, esReagendado, faltaHistorial]);

  const handleAgendar = async () => {
    if (!citaSeleccionada || !user?.id) return;
    setLoadingAgendar(true);
    setMsg({ type: "", text: "" });

    try {
      let resp;
      if (esReagendado) {
        resp = await reagendarCita(idCitaParaReagendar, citaSeleccionada.id, user.id);
      } else {
        resp = await agendarCita(citaSeleccionada.id, user.id);
      }

      if (resp.success) {
        setMsg({ type: "success", text: esReagendado ? "¡Reprogramada!" : "¡Agendada!" });
        setTimeout(() => navigate("/citas"), 1500);
      } else {
        setMsg({ type: "error", text: resp.error || "Error al procesar." });
      }
    } catch (error) {
      setMsg({ type: "error", text: "Error de conexión." });
    } finally {
      setLoadingAgendar(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <NavbarLog />

      <div className="container mx-auto px-4 mt-8 max-w-4xl">
        
        <div className="mb-4">
            <Link to="/citas"> 
                <Button startIcon={<ArrowLeft size={16}/>} sx={{textTransform: 'none', color: 'gray'}}>
                    Volver
                </Button>
            </Link>
        </div>

        {esReagendado && (
            <Alert className="mb-6 border-blue-500 bg-blue-50 animate-in fade-in zoom-in">
                <RefreshCw className="h-4 w-4 text-blue-700" />
                <AlertDescription className="font-medium text-blue-900">
                    Reprogramando cita.
                </AlertDescription>
            </Alert>
        )}

        {/* --- AVISO DE BLOQUEO POR HISTORIAL --- */}
        {faltaHistorial && (
            <Alert className="mb-6 border-orange-500 bg-orange-50 animate-in fade-in zoom-in">
                <FileHeart className="h-5 w-5 text-orange-600" />
                <AlertDescription className="font-medium text-orange-900 ml-2">
                    <span className="font-bold">Acción Requerida:</span> {msg.text}
                    <br/>
                    <span className="text-sm font-normal">Te estamos redirigiendo al formulario...</span>
                </AlertDescription>
            </Alert>
        )}
        {/* -------------------------------------- */}

        {tieneCitaActiva && !esReagendado && (
            <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Ya tienes una cita activa.</AlertDescription>
            </Alert>
        )}

        {!tieneCitaActiva && !faltaHistorial && doctor && (
            <div className="mb-6 bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="bg-blue-50 p-2.5 rounded-full text-blue-600">
                    <User size={24} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-slate-800">Dr. {doctor.nombre}</h2>
                    <p className="text-xs text-slate-500 capitalize">{doctor.especialidad}</p>
                </div>
            </div>
        )}

        <Card className={`shadow-lg border-none ${(tieneCitaActiva && !esReagendado) || faltaHistorial ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
              {esReagendado ? (
                  <><RefreshCw className="text-blue-500" size={20} /> Reagendar</>
              ) : (
                  <><Calendar className="text-blue-600" size={20} /> Nueva Cita</>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col lg:flex-row gap-8 min-h-[350px]">
            {/* Calendario */}
            <div className="flex-1 border-r border-slate-100 pr-0 lg:pr-8">
                <p className="text-sm font-medium mb-2 text-slate-500 text-center">Fecha</p>
                <div className="border rounded-xl p-2 bg-white shadow-sm">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                    <DateCalendar
                        value={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            setCitaSeleccionada(null);
                            setMsg({ type: "", text: "" });
                        }}
                        disablePast
                        views={['day']}
                        sx={{ transform: 'scale(0.95)' }} 
                    />
                    </LocalizationProvider>
                </div>
            </div>

            {/* Horarios */}
            <div className="flex-1">
                <p className="text-sm font-medium mb-2 text-slate-500 text-center lg:text-left">
                    Horarios disponibles
                </p>

                {loadingData ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                        <Loader2 className="animate-spin h-5 w-5" />
                    </div>
                ) : (
                    <>
                        {horariosDelDia.length === 0 ? (
                            <div className="text-center p-6 bg-slate-50 rounded-lg border border-dashed border-slate-200 mt-2">
                                <p className="text-xs text-slate-400">Sin disponibilidad.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 animate-in fade-in zoom-in duration-300">
                            {horariosDelDia.map((cita) => (
                                <Button
                                    key={cita.id}
                                    variant={citaSeleccionada?.id === cita.id ? "contained" : "outlined"}
                                    onClick={() => setCitaSeleccionada(cita)}
                                    size="small"
                                    sx={{ 
                                        borderRadius: 2, 
                                        textTransform: 'none',
                                        borderColor: '#e2e8f0',
                                        color: citaSeleccionada?.id === cita.id ? '#fff' : '#64748b'
                                    }}
                                >
                                {cita.hora.slice(0, 5)}
                                </Button>
                            ))}
                            </div>
                        )}
                    </>
                )}
                {/* Mensaje de error/exito genérico */}
                {msg.text && msg.type !== "warning" && (
                    <div className="mt-4 text-center">
                        <span className={`text-sm font-medium ${msg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                            {msg.text}
                        </span>
                    </div>
                )}
            </div>
          </CardContent>
          
          {/* Footer */}
          <CardFooter className="flex items-center justify-between bg-white p-4 border-t border-slate-100">
            
            <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100/50">
                <div className="p-1.5 bg-blue-100 rounded-full text-blue-600">
                    <Wallet size={16} />
                </div>
                
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                        Total a pagar
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-lg font-bold ${costoConsulta === 0 ? 'text-blue-600' : 'text-blue-900'}`}>
                            {costoConsulta === 0 ? "Gratis" : `$${costoConsulta}`}
                        </span>
                        {user?.afiliado && (
                            <span className="ml-2 text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                                Afiliado
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <Button
              variant="contained"
              disabled={loadingAgendar || !citaSeleccionada || loadingData || (tieneCitaActiva && !esReagendado) || faltaHistorial}
              onClick={handleAgendar}
              sx={{ 
                  textTransform: 'none', 
                  borderRadius: 2,
                  px: 4,
                  boxShadow: 'none',
                  fontWeight: 600
              }}
              color={esReagendado ? "warning" : "primary"} 
            >
              {loadingAgendar ? "..." : "Confirmar"}
            </Button>
          </CardFooter>

        </Card>
      </div>
    </div>
  );
}