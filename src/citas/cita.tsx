import { useEffect, useState, useCallback } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useUser } from "../lib/user-context"
import NavbarLog from "../components/NavbarLog" 
import { fetchCitasPaciente, cancelarCita, fetchDoctorAsignado } from "../lib/citas-service"
import { updateDoctor } from "../lib/user-service" 
import type { Cita } from "../types/cita"

import Button from "@mui/material/Button"
import { Card, CardContent } from "../components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"
import { Calendar, Clock, MapPin, Plus, X, ArrowLeft, Loader2, Stethoscope, Edit, UserCog, RefreshCw } from "lucide-react"
import { useDoctor } from "../lib/doctor-context"

export type AppointmentStatus = "scheduled" | "completed" | "cancelled"

export interface AppointmentUI {
  id: string
  doctor: string 
  especialidad: string
  fecha: string 
  hora: string
  location: string
  status: AppointmentStatus
  doctorId: string 
}

export default function Citas() {
  const { user, loading: userLoading } = useUser()
  const navigate = useNavigate()
  const { setDoctor } = useDoctor(); 
  
  const [appointments, setAppointments] = useState<AppointmentUI[]>([])
  const [loadingData, setLoadingData] = useState(true)
  
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [changeDoctorDialogOpen, setChangeDoctorDialogOpen] = useState(false)
  
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false) 

  const [doctorsCache, setDoctorsCache] = useState<Record<string, { nombre: string, especialidad: string }>>({});

  const cargarCitas = useCallback(async () => {
    if (!user?.id) return;
    setLoadingData(true);
    try {
      const data = await fetchCitasPaciente(user.id);
      
      const doctorIds = Array.from(new Set(data.map(c => c.doctor)));
      
      const nuevosDoctores: Record<string, { nombre: string, especialidad: string }> = { ...doctorsCache };
      
      await Promise.all(doctorIds.map(async (docId) => {
          if (!nuevosDoctores[docId] && docId) {
              try {
                  const docInfo = await fetchDoctorAsignado(docId);
                  nuevosDoctores[docId] = { 
                      nombre: docInfo.nombre, 
                      especialidad: docInfo.especialidad 
                  };
              } catch (e) {
                  nuevosDoctores[docId] = { nombre: "Desconocido", especialidad: "General" };
              }
          }
      }));
      
      setDoctorsCache(nuevosDoctores);

      const citasUI: AppointmentUI[] = data.map(cita => {
        let statusUI: AppointmentStatus = "scheduled";
        const estadoBackend = cita.estado ? cita.estado.toLowerCase() : "";
        
        if (estadoBackend === "cancelada") {
            statusUI = "cancelled";
        } else {
            const fechaCita = new Date(`${cita.fecha}T${cita.hora}`);
            const hoy = new Date();
            if (fechaCita < hoy) {
                statusUI = "completed";
            }
        }

        const docInfo = nuevosDoctores[cita.doctor] || { nombre: "Cargando...", especialidad: "..." };

        return {
          id: cita.id,
          doctorId: cita.doctor,
          doctor: docInfo.nombre, 
          especialidad: docInfo.especialidad, 
          location: "Consultorio 1", 
          fecha: `${cita.fecha}T${cita.hora}`,
          hora: cita.hora,
          status: statusUI
        };
      });
      
      const soloProgramadas = citasUI.filter(c => c.status === "scheduled");
      soloProgramadas.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      
      setAppointments(soloProgramadas);

    } catch (error) {
      console.error("Error cargando citas:", error);
    } finally {
      setLoadingData(false);
    }
  }, [user, doctorsCache]); 

  useEffect(() => {
    if (!userLoading && user) {
      cargarCitas();
    }
  }, [user, userLoading]);

  const handleCancelClick = (id: string) => {
    setSelectedAppointment(id)
    setCancelDialogOpen(true)
  }

  const handleReagendarClick = (appointment: AppointmentUI) => {
    const fechaCita = new Date(appointment.fecha); 
    const ahora = new Date();

  
    const diferenciaMs = fechaCita.getTime() - ahora.getTime();
    
  
    const horasRestantes = diferenciaMs / (1000 * 60 * 60);

  
    if (horasRestantes < 2) {
      
        alert("\n\nSolo se permiten cambios con al menos 2 horas de anticipación a la cita.");
        return;
    }

    navigate("/citas/nueva", { state: { idCitaParaReagendar: appointment.id } });
  }

  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;
    setProcessing(true);
    try {
      const resultado = await cancelarCita(selectedAppointment);
      if (resultado.success) {
        await cargarCitas(); 
        setCancelDialogOpen(false);
        setSelectedAppointment(null);
      } else {
        alert("Error: " + resultado.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  }

  const handleChangeDoctorClick = () => {
    setChangeDoctorDialogOpen(true);
  }

  const handleConfirmChangeDoctor = async () => {
    if(!user?.id) return;
    setProcessing(true);
    
    try {
        if (appointments.length > 0) {
           await cancelarCita(appointments[0].id);
        }

        const updatedUserResponse = await updateDoctor(user.id); 
        
        const newDoctorId = updatedUserResponse.doctorId || updatedUserResponse.doctor?.id;
        if (newDoctorId) {
            const fullDoctorData = await fetchDoctorAsignado(newDoctorId);
            setDoctor(fullDoctorData);
        }

        navigate("/citas/nueva");

    } catch (error) {
        console.error("Error cambiando doctor:", error);
        alert("Hubo un error al intentar cambiar de doctor.");
    } finally {
        setProcessing(false);
        setChangeDoctorDialogOpen(false);
    }
  }

  const AppointmentCard = ({ appointment }: { appointment: AppointmentUI }) => {
    
    
    const esReagendable = () => {
        const fechaCita = new Date(appointment.fecha);
        const ahora = new Date();
        const diffHoras = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);
        return diffHoras >= 2;
    };
    
    return (
        <Card className="hover:shadow-md transition-shadow mb-4 border-l-4 border-l-primary animate-in fade-in zoom-in duration-300 bg-white">
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-lg px-4 py-3 min-w-[90px] h-fit border border-blue-100">
                <span className="text-3xl font-bold">{new Date(appointment.fecha).getDate()}</span>
                <span className="text-xs font-bold uppercase tracking-wide">
                {new Date(appointment.fecha).toLocaleDateString("es-ES", { month: "short" })}
                </span>
                <span className="text-xs text-blue-400">{new Date(appointment.fecha).getFullYear()}</span>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                        <Stethoscope size={18} className="text-primary"/>
                        Dr. {appointment.doctor}
                    </h3>
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full mt-1 font-medium border 
                        ${appointment.especialidad === 'Medicina General' 
                            ? 'bg-slate-100 text-slate-600 border-slate-200' 
                            : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                    {appointment.especialidad}
                    </span>
                </div>
                
                <div className="px-3 py-1 rounded-full text-xs font-bold text-center w-fit bg-green-100 text-green-700 border border-green-200">
                    Programada
                </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 mt-4">
                <p className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>Hora: <strong className="text-slate-800">{appointment.hora.substring(0, 5)} hrs</strong></span>
                </p>
                <p className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{appointment.location}</span>
                </p>
                </div>

                <div className="mt-5 flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button 
                        variant="contained" 
                        size="small" 
                  
                        onClick={() => handleReagendarClick(appointment)}
                        startIcon={<Edit className="h-4 w-4" />}
                   
                        disabled={!esReagendable()} 
                        sx={{ textTransform: 'none', boxShadow: 'none' }}
                        title={!esReagendable() ? "Solo se puede reagendar con 2 horas de anticipación" : ""}
                    >
                    Reagendar
                    </Button>

                    <Button 
                        variant="outlined" 
                        color="error" 
                        size="small" 
                        onClick={() => handleCancelClick(appointment.id)}
                        startIcon={<X className="h-4 w-4" />}
                        sx={{ textTransform: 'none' }}
                    >
                    Cancelar
                    </Button>
                </div>
            </div>
            </div>
        </CardContent>
        </Card>
    )
  }

  if (userLoading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">Cargando agenda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <NavbarLog />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="mb-8">
            <Button 
                startIcon={<ArrowLeft />} 
                onClick={() => navigate("/board")}
                className="mb-6"
                sx={{ textTransform: 'none', color: '#64748b' }}
            >
                Volver al tablero
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mis Citas</h1>
                    <p className="text-slate-500 mt-1">Gestiona tus consultas programadas.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                        variant="outlined" 
                        color="warning" 
                        onClick={handleChangeDoctorClick}
                        startIcon={<UserCog />}
                        sx={{ textTransform: 'none' }}
                    >
                        Cambiar Doctor
                    </Button>

                    <Link to="/citas/nueva">
                        <Button variant="contained" startIcon={<Plus />} sx={{ textTransform: 'none' }}>
                            Agendar Nueva Cita
                        </Button>
                    </Link>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            {appointments.length > 0 ? (
                appointments.map((apt) => <AppointmentCard key={apt.id} appointment={apt} />)
            ) : (
                <EmptyState message="No tienes citas programadas actualmente." />
            )}
        </div>

      </main>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar cita?</AlertDialogTitle>
            <div className="text-sm text-muted-foreground">
                Esta acción liberará el horario inmediatamente. ¿Estás seguro?
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>No, mantener</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-red-600 text-white hover:bg-red-700" disabled={processing}>
              {processing ? "Cancelando..." : "Sí, cancelar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={changeDoctorDialogOpen} onOpenChange={setChangeDoctorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-orange-500"/> 
                ¿Cambiar de Doctor Asignado?
            </AlertDialogTitle>
            
            <div className="text-sm text-muted-foreground space-y-3">
               <p>
                Al confirmar, se te asignará un nuevo médico especialista disponible aleatoriamente.
               </p>
               {appointments.length > 0 && (
                   <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md text-sm font-medium flex items-start gap-2">
                       <span className="text-lg">⚠</span>
                       <span>
                         Advertencia: Tienes una cita programada. Al cambiar de doctor, 
                         esta cita <strong>se cancelará automáticamente</strong> y deberás agendar una nueva.
                       </span>
                   </div>
               )}
            </div>

          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
                onClick={handleConfirmChangeDoctor} 
                className="bg-orange-600 text-white hover:bg-orange-700" 
                disabled={processing}
            >
              {processing ? "Procesando..." : "Sí, cambiar doctor"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}

function EmptyState({message}: {message: string}) {
    return (
        <Card className="border-dashed border-2 bg-slate-50/50 shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <Calendar className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Todo despejado</h3>
                <p className="text-slate-500 max-w-xs mx-auto mb-6">{message}</p>
                <Link to="/citas/nueva">
                    <Button variant="contained" sx={{ textTransform: 'none', borderRadius: 2 }}>
                        Agendar ahora
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}