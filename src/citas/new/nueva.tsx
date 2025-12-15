import { useState, useEffect, useMemo } from "react";
import { useUser } from "../../lib/user-context";
import { useDoctor } from "../../lib/doctor-context";
// Importamos useLocation para leer los datos que vienen del botón Reagendar
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
import { Calendar, ArrowLeft, Loader2, CheckCircle2, User, Stethoscope, AlertCircle, RefreshCw } from "lucide-react";

import {
  fetchCitasDisponibles,
  fetchCitasPaciente,
  agendarCita,
  reagendarCita // Importamos la función de reagendar
} from "../../lib/citas-service";

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
  const [msg, setMsg] = useState<{ type: "success" | "error" | ""; text: string }>({
    type: "",
    text: ""
  });

  useEffect(() => {
    if (!user?.id) return;

    const inicializar = async () => {
      setLoadingData(true);
      try {
        const historial = await fetchCitasPaciente(user.id);
        const citaPendiente = historial.find(c => {
           const fechaCita = new Date(c.fecha + "T" + c.hora);
           const hoy = new Date();
           const estado = c.estado ? c.estado.toUpperCase() : "";
           return fechaCita >= hoy && estado !== "CANCELADA"; 
        });

        if (citaPendiente && !esReagendado) {
            setTieneCitaActiva(true);
            setMsg({ type: "error", text: "Ya tienes una cita activa. No puedes agendar otra." });
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
    if (!selectedDate || (tieneCitaActiva && !esReagendado)) return []; 
    
    const fechaFormat = selectedDate.format("YYYY-MM-DD");
    return todasLasCitas.filter(c => {
        const fechaCoincide = c.fecha === fechaFormat;
        const estadoNormalizado = c.estado ? c.estado.toLowerCase() : "";
        const estaDisponible = estadoNormalizado === "disponible"; 
        return fechaCoincide && estaDisponible;
    });
  }, [selectedDate, todasLasCitas, tieneCitaActiva, esReagendado]);

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
        const textoExito = esReagendado 
            ? "¡Cita reprogramada exitosamente!" 
            : "¡Cita agendada correctamente!";
        setMsg({ type: "success", text: `${textoExito} Redirigiendo...` });
        
        setTimeout(() => {
            navigate("/citas"); 
        }, 1500);
      } else {
        setMsg({ type: "error", text: resp.error || "No se pudo procesar la solicitud." });
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
                    Cancelar y volver
                </Button>
            </Link>
        </div>

        {esReagendado && (
            <Alert className="mb-6 border-blue-500 bg-blue-50 animate-in fade-in zoom-in">
                <RefreshCw className="h-4 w-4 text-blue-700" />
                <AlertDescription className="font-medium text-blue-900">
                    Modo Reprogramación: Selecciona una nueva fecha para cambiar tu cita actual.
                </AlertDescription>
            </Alert>
        )}

        {tieneCitaActiva && !esReagendado && (
            <Alert variant="destructive" className="mb-6 border-red-500 bg-red-50 animate-in fade-in zoom-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium text-red-900">
                    Ya tienes una cita activa. Serás redirigido en breve...
                </AlertDescription>
            </Alert>
        )}

        {!tieneCitaActiva && doctor && (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-blue-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <User size={32} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Dr. {doctor.nombre}</h2>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Stethoscope size={14} />
                        <span>{doctor.especialidad}</span>
                    </div>
                </div>
                <div className="ml-auto text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-100 hidden sm:block">
                    Tu Doctor Asignado
                </div>
            </div>
        )}

        <Card className={`shadow-lg border-t-4 ${esReagendado ? 'border-t-blue-500' : 'border-t-primary'} transition-opacity ${tieneCitaActiva && !esReagendado ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-slate-800">
              {esReagendado ? (
                  <><RefreshCw className="text-blue-500" size={28} /> Reagendar Cita</>
              ) : (
                  <><Calendar className="text-primary" size={28} /> Agendar Nueva Cita</>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col lg:flex-row gap-8 min-h-[400px]">
            
   
            <div className="flex-1 flex flex-col items-center border-r border-slate-100 pr-0 lg:pr-8">
                <h3 className="font-medium mb-4 text-slate-600 w-full text-center lg:text-left">1. Selecciona el día</h3>
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
                    />
                    </LocalizationProvider>
                </div>
            </div>

       
            <div className="flex-1">
                <h3 className="font-medium mb-4 text-slate-600">
                    2. Selecciona horario para el <span className="text-primary font-bold capitalize">{selectedDate?.format("dddd D [de] MMMM")}</span>
                </h3>

                {loadingData ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                        <Loader2 className="animate-spin" />
                        <span className="text-sm">Verificando agenda...</span>
                    </div>
                ) : (
                    <>
                        {horariosDelDia.length === 0 ? (
                            <div className="text-center p-8 bg-slate-50 rounded-lg border border-dashed border-slate-300 mt-4">
                                <p className="text-slate-500 text-sm font-medium">
                                    No hay citas disponibles.
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Intenta seleccionar otra fecha.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 animate-in fade-in zoom-in duration-300">
                            {horariosDelDia.map((cita) => (
                                <Button
                                    key={cita.id}
                                    variant={citaSeleccionada?.id === cita.id ? "contained" : "outlined"}
                                    onClick={() => setCitaSeleccionada(cita)}
                                    sx={{ borderRadius: 2 }}
                                    className="transition-all"
                                    color={esReagendado ? "primary" : "primary"} // Puedes cambiar el color si quieres diferenciar
                                >
                                {cita.hora.slice(0, 5)}
                                </Button>
                            ))}
                            </div>
                        )}
                    </>
                )}

                {msg.text && (
                    <div className="mt-6 animate-in slide-in-from-bottom-2">
                        <Alert variant={msg.type === "success" ? "default" : "destructive"} 
                               className={msg.type === "success" ? "border-green-500 bg-green-50 text-green-900" : ""}>
                            {msg.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                            <AlertDescription>{msg.text}</AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>

          </CardContent>

          <CardFooter className="flex justify-end bg-slate-50/50 p-6 border-t mt-4">
            <Button
              variant="contained"
              size="large"
              disabled={loadingAgendar || !citaSeleccionada || loadingData || (tieneCitaActiva && !esReagendado)}
              onClick={handleAgendar}
              sx={{ px: 5, py: 1.5, textTransform: 'none', fontSize: '1rem' }}
              color={esReagendado ? "warning" : "primary"} // Botón Naranja/Amarillo para Reagendar
            >
              {loadingAgendar ? "Procesando..." : esReagendado ? "Confirmar Cambio de Cita" : "Confirmar Cita"}
            </Button>
          </CardFooter>

        </Card>
      </div>
    </div>
  );
}